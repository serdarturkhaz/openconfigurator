using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BLL.SolverEngines
{
    public interface ISolverEngine
    {
        ISolverSolution GetSolution();
        ISolverContext InitNewContext();
    }
    public interface ISolverContext
    {
        void AddBoolVariable(string varID, string varName);
        void AddConstraint(ConstraintTypes type, params string[] varIDs);
        void AssumeBoolVarValue(string varID, bool value);
    }
    public interface ISolverSolution
    {
        bool? GetVariableValue(string varID);
        Dictionary<string,bool?> GetAllVariableValues();
    }

    //Enums
    public enum VariableTypes
    {
        Boolean,
        Integer
    }
    public enum ConstraintTypes
    {
        And,
        Implies,
        MutualImplication,
        Or
    }
}
