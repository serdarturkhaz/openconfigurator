using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.Z3;
using BLL.Services;
using System.Collections;
using System.Collections.Specialized;

namespace BLL.SolverEngines
{

    public class Z3Context : ISolverContext
    {
        //Fields
        Config _config;
        Context _context;
        Dictionary<string, Dictionary<string, Z3Variable>> _variables = new Dictionary<string, Dictionary<string, Z3Variable>>();
        Dictionary<string, List<Z3Constraint>> _constraints = new Dictionary<string, List<Z3Constraint>>();
        Dictionary<string, Dictionary<string, Z3ValueAssumption>> _assumptions = new Dictionary<string, Dictionary<string, Z3ValueAssumption>>();

        //Constructor
        public Z3Context()
        {
            //Initialize Config and Context
            _config = new Config();
            _config.SetParamValue("MODEL", "true"); // corresponds to /m switch 
            _context = new Context(_config);
        }

        //Private methods
        private void RecreateContext()
        {
            //Go back to the initial point
            _context.Pop();
            CreateInitialRestorePoint();

            //Recreate assumptions
            foreach (string category in _assumptions.Keys)
            {
                List<Z3ValueAssumption> assumptions = _assumptions[category].Values.ToList();
                for (int i = 0; i < assumptions.Count; i++)
                {
                    Z3ValueAssumption assumption = assumptions[i];
                    ReassertValueAssumption(ref assumption);
                }
            }

        }
        private void ReassertValueAssumption(ref Z3ValueAssumption assumption)
        {
            assumption.EqualsTerm = _context.MkEq(assumption.VariableTerm, assumption.ValueTerm);
            _context.AssertCnstr(assumption.EqualsTerm);
        }
        private Term GetValueTerm(VariableDataTypes dataType, object value)
        {
            //Create a term for the new value in Z3
            Term newValue = null;
            switch (dataType)
            {
                case VariableDataTypes.Boolean:
                    bool boolValue = (bool)value;
                    switch (boolValue)
                    {
                        case true:
                            newValue = _context.MkTrue();
                            break;
                        case false:
                            newValue = _context.MkFalse();
                            break;
                    }
                    break;

                case VariableDataTypes.Integer:
                    int intValue = (int)value;
                    newValue = _context.MkIntNumeral(intValue);
                    break;
            }

            return newValue;
        }
        private Z3ValueAssumption AssertValueAssumption(Term variableTerm, VariableDataTypes dataType, object value)
        {
            //Assertion
            Term newValue = GetValueTerm(dataType, value);
            Term statement = _context.MkEq(variableTerm, newValue);
            _context.AssertCnstr(statement);

            //
            Z3ValueAssumption assumption = new Z3ValueAssumption(variableTerm, newValue, statement);
            return assumption;
        }

        //Public methods
        public ISolverSolution GetSolution()
        {
            //
            Model model = null;
            LBool result = _context.CheckAndGetModel(out model);


            //Return the Solution
            if (model != null)
            {
                ISolverSolution solution = new Z3Solution(model, _variables);
                return solution;
            }
            else
            {
                return null;
            }
        }
        public bool CheckSolutionExists(string variableID, string categoryName, VariableDataTypes dataType, object valueToTest)
        {
            //Add a new assumption to test for the "valueToTest" value
            bool returnVal = false;
            AddValueAssumption(variableID, categoryName, dataType, valueToTest);

            //If the context is still satisfiable
            if (this.GetSolution() != null)
            {
                returnVal = true;
            }

            //Clean up and return the value
            this.RemoveValueAssumption(variableID, categoryName);
            return returnVal;
        }
        public void CreateInitialRestorePoint()
        {
            _context.Push();
        }

        public void AddVariable(string name, string identifier, string categoryName, VariableDataTypes dataType)
        {
            //Create the variable in the Z3 context
            Sort termType = null;
            switch (dataType)
            {
                case VariableDataTypes.Boolean:
                    termType = _context.MkBoolSort();
                    break;
                case VariableDataTypes.Integer:
                    termType = _context.MkIntSort();
                    break;
            }
            Term term = _context.MkConst(categoryName + "_" + name, termType);

            //Keep track of the variable added
            Z3Variable z3Var = new Z3Variable(name, identifier, dataType, term);
            if (_variables.ContainsKey(categoryName))
            {
                _variables[categoryName].Add(identifier, z3Var);
            }
            else
            {
                _variables[categoryName] = new Dictionary<string, Z3Variable>();
                _variables[categoryName].Add(identifier, z3Var);
            }

        }
        public void AddConstraint(string categoryName, params ISolverStatement[] statements)
        {
            //Assert the statements into the Z3 context
            foreach (ISolverStatement statement in statements)
            {
                _context.AssertCnstr(((Z3Statement)statement).Term);
            }

            //Keep track of the constraint added
            Z3Constraint z3Constraint = new Z3Constraint(statements);
            if (_constraints.ContainsKey(categoryName))
            {
                _constraints[categoryName].Add(z3Constraint);
            }
            else
            {
                _constraints[categoryName] = new List<Z3Constraint>();
                _constraints[categoryName].Add(z3Constraint);
            }
        }
        public void AddValueAssumption(string variableID, string categoryName, VariableDataTypes dataType, object value)
        {
            //Get the variable 
            Z3Variable varWrapper = _variables[categoryName][variableID];
            Term variableTerm = varWrapper.Term;

            //Check if an assumption already exists for the variable
            if (_assumptions.ContainsKey(categoryName) && _assumptions[categoryName].ContainsKey(variableID))
            {
                throw new Exception("An assumption already exists for the given variable!");
            }
            //Check if the dataType is correct
            if (varWrapper.DataType != dataType)
            {
                throw new Exception("Variable is of a different data type than " + dataType.ToString() + "!");
            }

            //Assertion
            Z3ValueAssumption assumption = AssertValueAssumption(variableTerm, dataType, value);

            //Keep track of the assumption added
            if (_assumptions.ContainsKey(categoryName))
            {
                _assumptions[categoryName].Add(variableID, assumption);
            }
            else
            {
                _assumptions[categoryName] = new Dictionary<string, Z3ValueAssumption>();
                _assumptions[categoryName].Add(variableID, assumption);
            }


        }
        public void RemoveValueAssumption(string variableID, string categoryName)
        {
            //Get the assumption and variable
            bool varRemoved = false;
            if (_assumptions[categoryName] != null && _assumptions[categoryName].ContainsKey(variableID)) //If the category exists AND the assumption exists
            {
                _assumptions[categoryName].Remove(variableID);
                varRemoved = true;
            }


            //Reset the context 
            if (varRemoved)
            {
                RecreateContext();
            }
        }

        public ISolverStatement CreateStatement(StatementTypes type, string categoryName, params string[] variableIDs)
        {
            //Get the Terms corresponding to the varIDs
            List<Term> terms = new List<Term>();
            for (int i = 0; i < variableIDs.Length; i++)
            {
                string variableID = variableIDs[i];
                Term variable = _variables[categoryName][variableID].Term;
                terms.Add(variable);
            }

            //Create a new Statement
            ISolverStatement statement = null;
            switch (type)
            {
                case StatementTypes.And:
                    statement = new Z3Statement(_context.MkAnd(terms.ToArray()));
                    break;
                case StatementTypes.Or:
                    statement = new Z3Statement(_context.MkOr(terms.ToArray()));
                    break;
                case StatementTypes.NotAndCombinations:
                    List<Term> negatedAnds = new List<Term>();
                    for (int i = 0; i < terms.Count; i++)
                    {
                        for (int j = i + 1; j < terms.Count; j++)
                        {
                            negatedAnds.Add(_context.MkNot(_context.MkAnd(terms[i], terms[j])));
                        }
                    }
                    if (negatedAnds.Count > 1)
                        statement = new Z3Statement(_context.MkAnd(negatedAnds.ToArray()));
                    else
                        statement = new Z3Statement(negatedAnds[0]);
                    break;
                case StatementTypes.Implies:
                    statement = new Z3Statement(_context.MkImplies(terms[0], terms[1]));
                    break;
                case StatementTypes.Excludes:
                    statement = new Z3Statement(_context.MkNot(_context.MkAnd(terms[0], terms[1])));
                    break;
                case StatementTypes.Equivalence:
                    Z3Statement substatement1 = new Z3Statement(_context.MkImplies(terms[0], terms[1]));
                    Z3Statement substatement2 = new Z3Statement(_context.MkImplies(terms[1], terms[0]));
                    statement = new Z3Statement(_context.MkAnd(substatement1.Term, substatement2.Term));
                    break;

            }

            return statement;
        }
        public ISolverStatement CreateStatement(StatementTypes type, params ISolverStatement[] innerStatements)
        {
            //Get the Terms corresponding to the innerStatements
            List<Term> terms = new List<Term>();
            foreach (ISolverStatement innerStatement in innerStatements)
            {
                terms.Add(((Z3Statement)innerStatement).Term);
            }

            //Create a new statement
            ISolverStatement statement = null;
            switch (type)
            {

                //AND
                case StatementTypes.And:
                    statement = new Z3Statement(_context.MkAnd(terms.ToArray()));
                    break;
                //OR
                case StatementTypes.Or:
                    statement = new Z3Statement(_context.MkOr(terms.ToArray()));
                    break;
                //All possible combinations of Not OR
                case StatementTypes.NotAndCombinations:
                    List<Term> negatedAnds = new List<Term>();
                    for (int i = 0; i < terms.Count; i++)
                    {
                        for (int j = i + 1; j < terms.Count; j++)
                        {
                            negatedAnds.Add(_context.MkNot(_context.MkAnd(terms[i], terms[j])));
                        }
                    }
                    if (negatedAnds.Count > 1)
                        statement = new Z3Statement(_context.MkAnd(negatedAnds.ToArray()));
                    else
                        statement = new Z3Statement(negatedAnds[0]);
                    break;
                //NOT
                case StatementTypes.Not:
                    statement = new Z3Statement(_context.MkNot(terms[0]));
                    break;
                //Implication
                case StatementTypes.Implies:
                    statement = new Z3Statement(_context.MkImplies(terms[0], terms[1]));
                    break;
                //Exclusion
                case StatementTypes.Excludes:
                    statement = new Z3Statement(_context.MkNot(_context.MkAnd(terms[0], terms[1])));
                    break;
                //Equivalence
                case StatementTypes.Equivalence:
                    Z3Statement substatement1 = new Z3Statement(_context.MkImplies(terms[0], terms[1]));
                    Z3Statement substatement2 = new Z3Statement(_context.MkImplies(terms[1], terms[0]));
                    statement = new Z3Statement(_context.MkAnd(substatement1.Term, substatement2.Term));
                    break;
            }

            return statement;
        }
        public ISolverStatement CreateStatement(StatementTypes type, string categoryName, string varID, ISolverStatement rightStatement)
        {
            //Get the terms 
            Term varTerm = _variables[categoryName][varID].Term;
            Term rightStatementTerm = ((Z3Statement)rightStatement).Term;

            //Create a new Statement
            ISolverStatement statement = null;
            switch (type)
            {
                case StatementTypes.And:
                    statement = new Z3Statement(_context.MkAnd(varTerm, rightStatementTerm));
                    break;
                case StatementTypes.Or:
                    statement = new Z3Statement(_context.MkOr(varTerm, rightStatementTerm));
                    break;

                case StatementTypes.Implies:
                    statement = new Z3Statement(_context.MkImplies(varTerm, rightStatementTerm));
                    break;
                case StatementTypes.Excludes:
                    statement = new Z3Statement(_context.MkNot(_context.MkAnd(varTerm, rightStatementTerm)));
                    break;
                case StatementTypes.Equivalence:
                    Z3Statement substatement1 = new Z3Statement(_context.MkImplies(varTerm, rightStatementTerm));
                    Z3Statement substatement2 = new Z3Statement(_context.MkImplies(rightStatementTerm, varTerm));
                    statement = new Z3Statement(_context.MkAnd(substatement1.Term, substatement2.Term));
                    break;

            }

            return statement;
        }


    }
    public class Z3Solution : ISolverSolution
    {
        //Fields
        Model _model;
        Dictionary<string, Dictionary<string, Z3Variable>> _variables = new Dictionary<string, Dictionary<string, Z3Variable>>();
        Dictionary<string, Dictionary<string, object>> _variableValues = new Dictionary<string, Dictionary<string, object>>();


        //Constructor
        public Z3Solution(Model model, Dictionary<string, Dictionary<string, Z3Variable>> variables)
        {
            _model = model;
            _variables = variables;
        }

        //Private methods
        private bool? ConvertToBool(Term value)
        {
            //Return val
            bool? returnValue = null;

            //Get the variable and cast its value to boolean?
            switch (value.ToString())
            {
                case "true":
                    returnValue = true;
                    break;
                case "false":
                    returnValue = false;
                    break;

            }

            return returnValue;
        }

        //Public methods
        public object GetVariableValue(string variableID, string categoryName)
        {
            //Get the variable and cast its value to boolean?
            Z3Variable variable = _variables[categoryName][variableID];
            Term value = _model.Eval(variable.Term);

            //
            bool? returnVal = ConvertToBool(value);
            return returnVal;
        }
    }
    public class Z3Statement : ISolverStatement
    {
        //Fields
        Term _term;

        //Properties
        public Term Term
        {
            get { return _term; }
            set { _term = value; }
        }

        //Constructor
        public Z3Statement(Term term)
        {
            _term = term;
        }
    }


    //Helper classes
    public class Z3Variable
    {
        //Fields
        private string _name, _identifier;
        private VariableDataTypes _dataType;
        private Term _term;

        //Properties
        public Term Term
        {
            get { return _term; }
            set { _term = value; }
        }
        public VariableDataTypes DataType
        {
            get { return _dataType; }
            set { _dataType = value; }
        }

        //Constructor
        public Z3Variable(string name, string identifier, VariableDataTypes dataType, Term term)
        {
            _name = name;
            _identifier = identifier;
            _dataType = dataType;
            _term = term;
        }
    }
    public class Z3Constraint
    {
        //Fields
        private ISolverStatement[] _statements;

        //Constructor
        public Z3Constraint(params ISolverStatement[] statements)
        {
            _statements = statements;
        }
    }
    public class Z3ValueAssumption
    {
        //Fields
        Term _variableTerm, _valueTerm, _equalsTerm;

        //Properties
        public Term VariableTerm
        {
            get { return _variableTerm; }
            set { _variableTerm = value; }
        }
        public Term ValueTerm
        {
            get { return _valueTerm; }
            set { _valueTerm = value; }
        }
        public Term EqualsTerm
        {
            get { return _equalsTerm; }
            set { _equalsTerm = value; }
        }

        //Constructor
        public Z3ValueAssumption(Term variableTerm, Term valueTerm, Term equalsTerm)
        {
            _variableTerm = variableTerm;
            _valueTerm = valueTerm;
            _equalsTerm = equalsTerm;
        }
    }

}
