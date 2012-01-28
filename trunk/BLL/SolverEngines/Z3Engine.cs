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
        //Fields
        ISolverContext _context;

        //Constructors
        public Z3Engine()
        {
        }
        public Z3Engine(ISolverContext context)
        {
            _context = context;
        }

        //Properties
        public ISolverContext Context
        {
            get
            {
                return _context;
            }
        }

        //Methods
        #region ISolverEngine Members
        public ISolverSolution GetSolution()
        {
            return ((Z3Context)_context).GetSolution();
        }
        public ISolverContext InitNewContext()
        {
            _context = new Z3Context();
            return _context;
        }
        #endregion
    }
    public class Z3Context : ISolverContext
    {
        //Fields
        Config _config;
        Context _context;
        Dictionary<string, Term> _variables = new Dictionary<string, Term>();
        List<List<Term>> _constraints = new List<List<Term>>();
        Dictionary<string, Term> _valueAssumptions = new Dictionary<string, Term>();

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
        public void AssumeBoolVarValue(string varID, bool value)
        {
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

            //
            Term statement = _context.MkEq(variable, newValue);
            _context.AssertCnstr(statement);

            //
            _valueAssumptions.Add(varID, statement);
        }
        public void AddConstraint(ConstraintTypes type, params string[] varIDs)
        {
            //Get the Terms corresponding to the varIDs
            List<Term> terms = new List<Term>();
            foreach (string varID in varIDs)
            {
                Term variable = _variables[varID];
                terms.Add(variable);
            }

            //Create a new Constraint
            List<Term> statements = new List<Term>();
            switch (type)
            {
                case ConstraintTypes.And:
                    statements.Add(_context.MkAnd(terms[0], terms[1]));
                    break;
                case ConstraintTypes.Implies:
                    statements.Add(_context.MkImplies(terms[0], terms[1]));
                    break;

                case ConstraintTypes.MutualImplication:
                    statements.Add(_context.MkImplies(terms[0], terms[1]));
                    statements.Add(_context.MkImplies(terms[1], terms[0]));
                    break;
            }

            //Assert statements
            foreach (Term statement in statements)
            {
                _context.AssertCnstr(statement);

            }

            //Keep track of the constraint added
            _constraints.Add(statements);
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
}
