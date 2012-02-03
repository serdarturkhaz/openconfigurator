using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.Z3;
using BLL.Services;
using System.Collections;

namespace BLL.SolverEngines
{
    public class Z3Engine : ISolverEngine
    {
        //Constructors
        public Z3Engine()
        {
        }

        //Methods
        #region ISolverEngine Members
        public ISolverSolution GetSolution(ISolverContext context)
        {
            return ((Z3Context)context).GetSolution();
        }
        public bool CheckSolutionExists(ISolverContext context, string varID, bool valueToTest)
        {
            //Add a new assumption to test for the "valueToTest" value
            bool returnVal = false;
            context.AssumeBoolVarValue(varID, valueToTest, AssumptionTypes.Solver);

            //If the context is still satisfiable
            if (((Z3Context)context).GetSolution() != null)
            {
                returnVal = true;
            }

            //Clean up and return the value
            context.RemoveLastAssumption(varID);
            return returnVal;
        }
        public ISolverContext CreateBlankContext()
        {
            return new Z3Context();
        }
        #endregion
    }
    public class Z3Context : ISolverContext
    {
        //Fields
        Config _config;
        Context _context;
        Dictionary<string, Term> _variables = new Dictionary<string, Term>();
        List<ISolverStatement[]> _constraints = new List<ISolverStatement[]>();
        Dictionary<string, Term> _userValueAssumptions = new Dictionary<string, Term>();
        Dictionary<string, Term> _solverValueAssumptions = new Dictionary<string, Term>();

        //Constructor
        internal Z3Context()
        {
            //Initialize Config and Context
            _config = new Config();
            _config.SetParamValue("MODEL", "true"); // corresponds to /m switch 
            _context = new Context(_config);
        }

        //Methods
        internal ISolverSolution GetSolution()
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
        #region ISolverContext Members
        public void AddBoolVariable(string varID, string varName)
        {
            Term variable = _context.MkConst(varName, _context.MkBoolSort());
            _variables[varID] = variable;
        }
        public void AddConstraint(params ISolverStatement[] statements)
        {
            foreach (ISolverStatement statement in statements)
            {
                _context.AssertCnstr(((Z3Statement)statement).Term);
            }

            //Keep track of the constraint added
            _constraints.Add(statements);
        }
        public ISolverStatement CreateStatement(StatementTypes type, params string[] varIDs)
        {
            //Get the Terms corresponding to the varIDs
            List<Term> terms = new List<Term>();
            foreach (string varID in varIDs)
            {
                Term variable = _variables[varID];
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
                case StatementTypes.Xor:
                    List<Term> xorTerms = new List<Term>();
                    for (int i = 0; i < terms.Count - 1; i++)
                    {
                        xorTerms.Add(_context.MkXor(terms[i], terms[i + 1]));
                    }
                    statement = new Z3Statement(_context.MkAnd(xorTerms.ToArray()));
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

                case StatementTypes.And:
                    statement = new Z3Statement(_context.MkAnd(terms.ToArray()));
                    break;
                case StatementTypes.Or:
                    statement = new Z3Statement(_context.MkOr(terms.ToArray()));
                    break;
                case StatementTypes.Xor:
                    List<Term> xorTerms = new List<Term>();
                    for (int i = 0; i < terms.Count - 1; i++)
                    {
                        xorTerms.Add(_context.MkXor(terms[i], terms[i + 1]));
                    }
                    statement = new Z3Statement(_context.MkAnd(xorTerms.ToArray()));
                    break;
                case StatementTypes.Not:
                    statement = new Z3Statement(_context.MkNot(terms[0]));
                    break;
                case StatementTypes.Implies:
                    statement = new Z3Statement(_context.MkImplies(terms[0], terms[1]));
                    break;
                case StatementTypes.Excludes:
                    statement = new Z3Statement(_context.MkNot(_context.MkAnd(terms[0], terms[1])));
                    break;
                case StatementTypes.Equivalence:
                    statement = new Z3Statement(_context.MkEq(terms[0], terms[1]));
                    break;
            }

            return statement;
        }
        public ISolverStatement CreateStatement(StatementTypes type, string varID, ISolverStatement rightStatement)
        {
            //Get the terms 
            Term varTerm = _variables[varID];
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
                case StatementTypes.Xor:
                    statement = new Z3Statement(_context.MkXor(varTerm, rightStatementTerm));
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
        public void AssumeBoolVarValue(string varID, bool value, AssumptionTypes madeBy)
        {
            //Create a backtracking point
            _context.Push();

            //Get the variable and a representation of the desired Bool value
            Term variable = _variables[varID];
            Term newValue = null;
            switch (value)
            {
                case true:
                    newValue = _context.MkTrue();
                    break;
                case false:
                    newValue = _context.MkFalse();
                    break;
            }

            //Assert
            Term statement = _context.MkEq(variable, newValue);
            _context.AssertCnstr(statement);

            //Add to the corresponding list
            switch (madeBy)
            {
                case AssumptionTypes.User:
                    _userValueAssumptions.Add(varID, statement);
                    break;
                case AssumptionTypes.Solver:
                    _solverValueAssumptions.Add(varID, statement);
                    break;
            }

        }
        public void ResetBoolVarValue(string varID)
        {
            //Get the assumption and variable
            Term variable = _variables[varID];
            Term assumption = null;
            if (_userValueAssumptions.ContainsKey(varID))
            {
                assumption = _userValueAssumptions[varID];
            }
            else if (_solverValueAssumptions.ContainsKey(varID))
            {
                assumption = _solverValueAssumptions[varID];
            }

            //Reset it
            if (assumption != null)
            {
                _context.UpdateTerm(assumption, new Term[] { variable, variable });
            }
        }
        public void RemoveLastAssumption(string varID)
        {
            if (_userValueAssumptions.ContainsKey(varID))
            {
                _userValueAssumptions.Remove(varID);
            }
            else if (_solverValueAssumptions.ContainsKey(varID))
            {
                _solverValueAssumptions.Remove(varID);
            }
            _context.Pop();
        }
        #endregion
    }
    public class Z3Solution : ISolverSolution
    {
        //Fields
        Model _model;
        Dictionary<string, Term> _variables;
        Dictionary<string, bool?> _variableValues;

        //Constructor
        public Z3Solution(Model model, Dictionary<string, Term> variables)
        {
            _model = model;
            _variables = variables;
        }

        //Methods
        private bool? GetBool(Term value)
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

        #region ISolverSolution Members
        public bool? GetVariableValue(string varID)
        {
            //Get the variable and cast its value to boolean?
            Term variable = _variables[varID];
            Term value = _model.Eval(variable);

            //
            bool? returnVal = GetBool(value);
            return returnVal;
        }
        public Dictionary<string, bool?> GetAllVariableValues()
        {
            _variableValues = new Dictionary<string, bool?>();
            foreach (KeyValuePair<string, Term> entry in _variables)
            {
                _variableValues[(string)entry.Key] = GetBool(_model.Eval((Term)entry.Value));
            }
            return _variableValues;
        }
        #endregion
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
}
