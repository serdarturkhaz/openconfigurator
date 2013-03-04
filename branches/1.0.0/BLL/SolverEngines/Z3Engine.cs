// Developed by OpenConfigurator Core Team
// 
// Distributed under the MIT license
// ===========================================================
// Copyright (c) 2012 - Radu Mitache, Alexander Mantzoukas
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), 
// to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, 
// publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR 
// OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR 
// OTHER DEALINGS IN THE SOFTWARE.
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.Z3;
using BLL.Services;
using System.Collections;
using System.Collections.Specialized;
using BLL.BusinessObjects;

namespace BLL.SolverEngines
{
    public class Z3Context
    {
        //Fields
        private Config _config; //Z3 mathematical settings
        private Context _context; //Z3 mathematical context
        private Dictionary<string, Z3Variable> _variables = new Dictionary<string, Z3Variable>();
        private Dictionary<string, Z3Constraint> _constraints = new Dictionary<string, Z3Constraint>();
        private Dictionary<string, Z3ValueAssumption> _valueAssumptions = new Dictionary<string, Z3ValueAssumption>();
        private Dictionary<string, Z3ImpliedValueAssumption> _impliedValueAssumptions = new Dictionary<string, Z3ImpliedValueAssumption>();
        private Dictionary<string, Z3Function> _functions = new Dictionary<string, Z3Function>();

        //Private methods
        private Z3Solution GetSolution()
        {
            //Return the Solution
            Microsoft.Z3.Model model = null;
            LBool result = _context.CheckAndGetModel(out model);
            if (model != null)
            {
                Z3Solution solution = new Z3Solution(model, _variables);
                return solution;
            }
            else
            {
                return null;
            }
        }
        private void RecreateContext()
        {
            //Go back to the initial point
            _context.Pop();
            CreateInitialRestorePoint();

            //Recreate assumptions
            foreach (Z3ValueAssumption valueAssumption in _valueAssumptions.Values)
            {
                AssertValueAssumption(valueAssumption);
            }
            foreach (Z3ImpliedValueAssumption impliedValueAssumption in _impliedValueAssumptions.Values)
            {
                AssertImpliedValueAssumption(impliedValueAssumption);
            }
        }
        private Term CreateValueTerm(VariableDataTypes dataType, object value)
        {
            //Create a term for the new value in Z3
            Term newValue = null;
            switch (dataType)
            {
                //Bool
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

                //Int
                case VariableDataTypes.Integer:
                    int intValue = (int)value;
                    newValue = _context.MkIntNumeral(intValue);
                    break;
            }

            return newValue;
        }
        private List<Term> FindVariableTerms(string[] variableIDs)
        {
            //Return the Term for each of the given variables
            List<Term> terms = new List<Term>();
            for (int i = 0; i < variableIDs.Length; i++)
            {
                string variableID = variableIDs[i];
                Term variable = _variables[variableID].Term;
                terms.Add(variable);
            }

            return terms;
        }
        private Z3ValueAssumption CreateValueAssumption(Term variableTerm, VariableDataTypes dataType, object value)
        {
            //Terms
            Term newValue = CreateValueTerm(dataType, value);
            Term equals = _context.MkEq(variableTerm, newValue);

            //Assert and create reference object
            Z3ValueAssumption assumption = new Z3ValueAssumption(variableTerm, newValue);
            return assumption;
        }
        private void AssertValueAssumption(Z3ValueAssumption assumption)
        {
            Term equals = _context.MkEq(assumption.VariableTerm, assumption.ValueTerm);
            _context.AssertCnstr(equals);
        }

        private void AssertImpliedValueAssumption(Z3ImpliedValueAssumption assumption)
        {
            Term implies = _context.MkImplies(assumption.ImplierTerm, assumption.ImpliedTerm);
            _context.AssertCnstr(implies);
        }
        private Z3ImpliedValueAssumption CreateImpliedValueAssumption(Term variableTerm, Term impliedTerm)
        {
            //Assert and create reference object
            Z3ImpliedValueAssumption assumption = new Z3ImpliedValueAssumption(variableTerm, impliedTerm);
            return assumption;
        }
        
        //Constructor
        public Z3Context()
        {
            //Initialize Config and Context
            _config = new Config();
            _config.SetParamValue("MODEL", "true"); // corresponds to /m switch 
            _config.SetParamValue("MACRO_FINDER", "true");
            _context = new Context(_config);

            //Setup custom conversion method BoolToInt (boolean -> integer)----------------------------------------------------------------
            FuncDecl boolToInt = _context.MkFuncDecl("BoolToInt", _context.MkBoolSort(), _context.MkIntSort());
            Term i = _context.MkConst("i", _context.MkBoolSort());
            Term fDef = _context.MkIte(_context.MkEq(i, _context.MkTrue()), _context.MkIntNumeral(1), _context.MkIntNumeral(0)); // x == true => 1, x == false => 0
            Term fStatement = _context.MkForall(0, new Term[] { i }, null, _context.MkEq(_context.MkApp(boolToInt, i), fDef));
            _context.AssertCnstr(fStatement);

            //
            _functions.Add("BoolToInt", new Z3Function(boolToInt));
            //-----------------------------------------------------------------------------------------------------------------------------
        }

        //Public methods
        public bool IsValid()
        {
            //Check whether the mathematical formulation has a solution
            if (this.GetSolution() != null)
            {
                //Has solution
                return true;
            }
            else
            {
                //Invalid
                return false;
            }
        }
        public void CreateInitialRestorePoint()
        {
            _context.Push();
        }
        public void AddVariable(string variableID, VariableDataTypes dataType)
        {
            //Exception handling
            if (_variables.ContainsKey(variableID))
                throw new Exception("A variable already exists with the given id!");

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
            Term term = _context.MkConst(variableID, termType);

            //Keep track of the variable added
            Z3Variable variable = new Z3Variable(variableID, dataType, term);
            _variables.Add(variableID, variable);
        }
        public void AddConstraint(string constraintID, params ISolverStatement[] statements)
        {
            //Assert the statements into the Z3 mathematical context
            List<Term> terms = new List<Term>();
            foreach (ISolverStatement statement in statements)
            {
                if (statement != null)
                {
                    Term term = ((Z3Statement)statement).Term;
                    terms.Add(term);
                    _context.AssertCnstr(term);
                }
            }

            //Keep track of the constraint added
            Z3Constraint z3Constraint = new Z3Constraint(terms.ToArray());
            _constraints.Add(constraintID, z3Constraint);
        }
        public void AddValueAssumption(string variableID, VariableDataTypes dataType, object value)
        {
            //Variables
            Z3Variable variable = _variables[variableID];
            Term variableTerm = variable.Term;

            //Exception handling
            if (_valueAssumptions.ContainsKey(variableID))
                throw new Exception("An assumption already exists for the given variable!");
            if (variable.DataType != dataType)
                throw new Exception("Variable is of a different data type than " + dataType.ToString() + "!");

            //Create, register and assert the assumption 
            Z3ValueAssumption assumption = CreateValueAssumption(variableTerm, dataType, value);
            AssertValueAssumption(assumption);
            _valueAssumptions.Add(variableID, assumption);
        }
        public void AddOrModifyValueAssumption(string variableID, VariableDataTypes dataType, object value)
        {
            //Variables
            Z3Variable variable = _variables[variableID];
            Term variableTerm = variable.Term;

            //Exceptions
            if (variable.DataType != dataType)
                throw new Exception("Variable is of a different data type than " + dataType.ToString() + "!");

            //Remove assumption, if it already exists
            if (_valueAssumptions.ContainsKey(variableID))
            {
                RemoveValueAssumption(variableID);
            }

            //Add the new assumption
            AddValueAssumption(variableID, dataType, value);
        }
        public void RemoveValueAssumption(string variableID)
        {
            //Get the assumption and variable
            if (_valueAssumptions.ContainsKey(variableID))
            {
                _valueAssumptions.Remove(variableID);
                RecreateContext();
            }
        }

        public void RemoveImpliedValueAssumption(string variableID)
        {
            //Get the assumption and variable
            if (_impliedValueAssumptions.ContainsKey(variableID))
            {
                _impliedValueAssumptions.Remove(variableID);
                RecreateContext();
            }
        }
        /*public void AddImpliedValueAssumption(string implierVarID, string impliedVarID, VariableDataTypes dataType, object value)
        {
            //Variables
            Z3Variable implierVar = _variables[featureCategoryName][featureVariableID];
            Term variableTerm = implierVar.Term;
            Z3Variable attributeVar = _variables[attributeCategoryName][attributeVariableID];
            Term attributeVariableTerm = attributeVar.Term;

            //Check if an assumption already exists for the variable
            if (_assumptions.ContainsKey(featureCategoryName) && _assumptions[featureCategoryName].ContainsKey(featureVariableID))
            {
                throw new Exception("An assumption already exists for the given feature variable!");
            }

            if (_assumptions.ContainsKey(featureCategoryName) && _assumptions[featureCategoryName].ContainsKey(featureVariableID))
            {
                throw new Exception("An assumption already exists for the given attribute variable!");
            }

            //Check if the dataType is correct
            if (attributeVar.DataType != dataType)
            {
                throw new Exception("Variable is of a different data type than " + dataType.ToString() + "!");
            }

            //Create the assertion
            Z3ImpliedValueAssumption assumption = CreateImpliedValueAssumption(variableTerm, attributeVariableTerm, dataType, value);

            //Keep track of the assumption added
            if (!_assumptions.ContainsKey(impliesAssumptionCategory))
            {
                _assumptions.Add(impliesAssumptionCategory, new Dictionary<string, Dictionary<string, Z3ValueAssumption>>());
            }

            if (_assumptions[impliesAssumptionCategory].ContainsKey(attributeCategoryName))
            {
                _assumptions[impliesAssumptionCategory][attributeCategoryName].Add(attributeVariableID, assumption);
            }
            else
            {
                _assumptions[impliesAssumptionCategory][attributeCategoryName] = new Dictionary<string, Z3ValueAssumption>();
                _assumptions[impliesAssumptionCategory][attributeCategoryName].Add(attributeVariableID, assumption);
            }
        }*/

        //Statements
        private ISolverStatement MakeAnd(List<Term> terms)
        {
            return new Z3Statement(_context.MkAnd(terms.ToArray())); ;
        }
        private ISolverStatement MakeOr(List<Term> terms)
        {
            return new Z3Statement(_context.MkOr(terms.ToArray())); ;
        }
        private ISolverStatement MakeNegatedAndCombinations(List<Term> terms)
        {
            //Variables
            List<Term> negatedAnds = new List<Term>();
            ISolverStatement finalStatement = null;

            //
            for (int i = 0; i < terms.Count; i++)
            {
                for (int j = i + 1; j < terms.Count; j++)
                {
                    negatedAnds.Add(_context.MkNot(_context.MkAnd(terms[i], terms[j])));
                }
            }
            if (negatedAnds.Count > 1)
                finalStatement = new Z3Statement(_context.MkAnd(negatedAnds.ToArray()));
            else
                finalStatement = new Z3Statement(negatedAnds[0]);

            //
            return finalStatement;
        }
        public ISolverStatement MakeEquals(ISolverStatement leftStatement, ISolverStatement rightStatement)
        {
            //Variables
            ISolverStatement finalStatement = null;
            Term leftTerm = ((Z3Statement)leftStatement).Term;
            Term rightTerm = ((Z3Statement)rightStatement).Term;

            //
            finalStatement = new Z3Statement(_context.MkEq(leftTerm, rightTerm));
            return finalStatement;
        }
        public ISolverStatement MakeAdd(ISolverStatement[] innerStatements)
        {
            //Variables
            ISolverStatement finalStatement = null;
            List<Term> terms = new List<Term>();
            foreach (ISolverStatement innerStatement in innerStatements)
            {
                terms.Add(((Z3Statement)innerStatement).Term);
            }

            //
            finalStatement = new Z3Statement(_context.MkAdd(terms.ToArray()));
            return finalStatement;
        }
        public ISolverStatement MakeAnd(params string[] variableIDs)
        {
            //Variables
            ISolverStatement finalStatement = null;
            List<Term> variableTerms = FindVariableTerms(variableIDs);

            //
            finalStatement = MakeAnd(variableTerms);
            return finalStatement;
        }
        public ISolverStatement MakeAnd(ISolverStatement leftStatement, ISolverStatement rightStatement)
        {
            //Variables
            ISolverStatement finalStatement = null;
            List<Term> terms = new List<Term>();
            terms.Add(((Z3Statement)leftStatement).Term);
            terms.Add(((Z3Statement)rightStatement).Term);

            //
            finalStatement = MakeAnd(terms);
            return finalStatement;
        }
        public ISolverStatement MakeOr(params string[] variableIDs)
        {
            //Variables
            ISolverStatement finalStatement = null;
            List<Term> variableTerms = FindVariableTerms(variableIDs);

            //
            finalStatement = MakeOr(variableTerms);
            return finalStatement;
        }
        public ISolverStatement MakeOr(ISolverStatement leftStatement, ISolverStatement rightStatement)
        {
            //Variables
            ISolverStatement finalStatement = null;
            List<Term> terms = new List<Term>();
            terms.Add(((Z3Statement)leftStatement).Term);
            terms.Add(((Z3Statement)rightStatement).Term);

            //
            finalStatement = MakeOr(terms);
            return finalStatement;
        }
        public ISolverStatement MakeNegation(ISolverStatement innerStatement)
        {
            //Variables
            ISolverStatement finalStatement = null;
            Term term = ((Z3Statement)innerStatement).Term;

            //
            finalStatement = new Z3Statement(_context.MkNot(term));
            return finalStatement;
        }
        public ISolverStatement MakeImplies(string leftVarID, string rightVarID)
        {
            //Variables
            ISolverStatement finalStatement = null;
            Term leftTerm = _variables[leftVarID].Term;
            Term rightTerm = _variables[rightVarID].Term;

            //
            finalStatement = new Z3Statement(_context.MkImplies(leftTerm, rightTerm));
            return finalStatement;
        }
        public ISolverStatement MakeImplies(ISolverStatement leftStatement, ISolverStatement rightStatement)
        {
            //Variables
            ISolverStatement finalStatement = null;
            Term leftTerm = ((Z3Statement)leftStatement).Term;
            Term rightTerm = ((Z3Statement)rightStatement).Term;

            //
            finalStatement = new Z3Statement(_context.MkImplies(leftTerm, rightTerm));
            return finalStatement;
        }
        public ISolverStatement MakeImplies(string leftVarID, ISolverStatement rightStatement)
        {
            //Variables
            ISolverStatement finalStatement = null;
            Term leftTerm = _variables[leftVarID].Term;
            Term rightTerm = ((Z3Statement)rightStatement).Term;

            //
            finalStatement = new Z3Statement(_context.MkImplies(leftTerm, rightTerm));
            return finalStatement;
        }
        public ISolverStatement MakeGreaterOrEqual(ISolverStatement leftStatement, ISolverStatement rightStatement)
        {
            //Variables
            ISolverStatement finalStatement = null;
            Term leftTerm = ((Z3Statement)leftStatement).Term;
            Term rightTerm = ((Z3Statement)rightStatement).Term;

            //
            finalStatement = new Z3Statement(_context.MkGe(leftTerm, rightTerm));
            return finalStatement;
        }
        public ISolverStatement MakeLowerOrEqual(ISolverStatement leftStatement, ISolverStatement rightStatement)
        {
            //Variables
            ISolverStatement finalStatement = null;
            Term leftTerm = ((Z3Statement)leftStatement).Term;
            Term rightTerm = ((Z3Statement)rightStatement).Term;

            //
            finalStatement = new Z3Statement(_context.MkLe(leftTerm, rightTerm));
            return finalStatement;
        }
        public ISolverStatement MakeNegatedAndCombinations(params string[] variableIDs)
        {
            //Variables
            ISolverStatement finalStatement = null;
            List<Term> variableTerms = FindVariableTerms(variableIDs);

            //
            finalStatement = MakeNegatedAndCombinations(variableTerms);
            return finalStatement;
        }
        public ISolverStatement MakeEquivalence(ISolverStatement leftStatement, ISolverStatement rightStatement)
        {
            //Variables
            ISolverStatement finalStatement = null;
            Term leftTerm = ((Z3Statement)leftStatement).Term;
            Term rightTerm = ((Z3Statement)rightStatement).Term;

            //
            Z3Statement substatement1 = new Z3Statement(_context.MkImplies(leftTerm, rightTerm));
            Z3Statement substatement2 = new Z3Statement(_context.MkImplies(rightTerm, leftTerm));
            finalStatement = new Z3Statement(_context.MkAnd(substatement1.Term, substatement2.Term));
            return finalStatement;
        }
        public ISolverStatement MakeEquivalence(string leftVarID, string rightVarID)
        {
            //Variables
            ISolverStatement finalStatement = null;
            Term leftTerm = _variables[leftVarID].Term;
            Term rightTerm = _variables[rightVarID].Term;

            //
            Z3Statement substatement1 = new Z3Statement(_context.MkImplies(leftTerm, rightTerm));
            Z3Statement substatement2 = new Z3Statement(_context.MkImplies(rightTerm, leftTerm));
            finalStatement = new Z3Statement(_context.MkAnd(substatement1.Term, substatement2.Term));
            return finalStatement;
        }
        public ISolverStatement MakeEquivalence(string leftVarID, ISolverStatement rightStatement)
        {
            //Variables
            ISolverStatement finalStatement = null;
            Term leftTerm = _variables[leftVarID].Term;
            Term rightTerm = ((Z3Statement)rightStatement).Term;

            //
            Z3Statement substatement1 = new Z3Statement(_context.MkImplies(leftTerm, rightTerm));
            Z3Statement substatement2 = new Z3Statement(_context.MkImplies(rightTerm, leftTerm));
            finalStatement = new Z3Statement(_context.MkAnd(substatement1.Term, substatement2.Term));
            return finalStatement;
        }
        public ISolverStatement MakeExcludes(ISolverStatement leftStatement, ISolverStatement rightStatement)
        {
            //Variables
            ISolverStatement finalStatement = null;
            Term leftTerm = ((Z3Statement)leftStatement).Term;
            Term rightTerm = ((Z3Statement)rightStatement).Term;

            //
            finalStatement = new Z3Statement(_context.MkNot(_context.MkAnd(leftTerm, rightTerm)));
            return finalStatement;
        }
        public ISolverStatement MakeExcludes(string leftVarID, string rightVarID)
        {
            //Variables
            ISolverStatement finalStatement = null;
            Term leftTerm = _variables[leftVarID].Term;
            Term rightTerm = _variables[rightVarID].Term;

            //
            finalStatement = new Z3Statement(_context.MkNot(_context.MkAnd(leftTerm, rightTerm)));
            return finalStatement;
        }
        public ISolverStatement MakeNumeral(int val)
        {
            Term numeral = _context.MkNumeral(val, _context.MkIntSort());
            return new Z3Statement(numeral);
        }
        public ISolverStatement MakeBoolToInt(string variableID)
        {
            //Get the variable 
            Term variableTerm = _variables[variableID].Term;

            //Get the BoolToInt function
            Z3Function function = _functions["BoolToInt"];
            FuncDecl functionDecl = function.Function;

            //Create the functionCall
            Term funcCall = _context.MkApp(functionDecl, variableTerm);

            //
            return new Z3Statement(funcCall);
        } 
    }
    public class Z3Solution
    {
        //Fields
        Microsoft.Z3.Model _model;
        Dictionary<string, Z3Variable> _variables = new Dictionary<string, Z3Variable>();
        Dictionary<string, object> _variableValues = new Dictionary<string, object>();

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

        //Constructor
        public Z3Solution(Microsoft.Z3.Model model, Dictionary<string, Z3Variable> variables)
        {
            _model = model;
            _variables = variables;
        }

        //Public methods
        public object GetVariableValue(string variableID)
        {
            //Get the variable and cast its value to boolean?
            Z3Variable variable = _variables[variableID];
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
        private string _identifier;
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
        public Z3Variable(string identifier, VariableDataTypes dataType, Term term)
        {
            _identifier = identifier;
            _dataType = dataType;
            _term = term;
        }
    }
    public class Z3Constraint
    {
        //Fields
        private Term[] _statements;

        //Constructor
        public Z3Constraint(params Term[] statements)
        {
            _statements = statements;
        }
    }
    public class Z3ValueAssumption 
    {
        //Fields
        Term _variableTerm, _valueTerm;

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

        //Constructor
        public Z3ValueAssumption(Term variableTerm, Term valueTerm)
        {
            _variableTerm = variableTerm;
            _valueTerm = valueTerm;
        }


    }
    public class Z3ImpliedValueAssumption
    {
        //Fields
        Term _implierTerm, _impliedTerm;

        //Properties
        public Term ImplierTerm
        {
            get { return _implierTerm; }
            set { _implierTerm = value; }
        }
        public Term ImpliedTerm
        {
            get { return _impliedTerm; }
            set { _impliedTerm = value; }
        }

        //Constructor
        public Z3ImpliedValueAssumption(Term implierTerm, Term impliedTerm)
        {
            _impliedTerm = impliedTerm;
            _implierTerm = implierTerm;
        }
    }
    public class Z3Function
    {
        //Fields
        FuncDecl _function;

        //Properties
        public FuncDecl Function
        {
            get { return _function; }
            set { _function = value; }
        }

        //Constructor
        public Z3Function(FuncDecl function)
        {
            _function = function;
        }
    }

}
