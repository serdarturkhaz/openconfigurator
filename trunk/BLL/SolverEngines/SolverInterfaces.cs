using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BLL.SolverEngines
{
    
    public interface ISolverContext
    {
        void CreateInitialRestorePoint();

        void AddVariable(string name, string identifier, string categoryName, VariableDataTypes dataType);
        void AddConstraint(string categoryName, params ISolverStatement[] statements);
        void AddValueAssumption(string variableID, string categoryName, VariableDataTypes dataType, object value);
        void RemoveValueAssumption(string varID, string categoryName);

        ISolverStatement CreateStatement(StatementTypes type, string categoryName, params string[] variableIDs);
        ISolverStatement CreateStatement(StatementTypes type, params ISolverStatement[] innerStatement);
        ISolverStatement CreateStatement(StatementTypes type, string categoryName, string varID, ISolverStatement rightStatement);

        ISolverSolution GetSolution();
        bool CheckSolutionExists(string variableID, string categoryName, VariableDataTypes dataType, object valueToTest);
    }
    public interface ISolverSolution
    {
        object GetVariableValue(string variableID, string categoryName);
    }
    public interface ISolverStatement
    {
       
    }


    //Enums
    public enum StatementTypes
    {
        And,
        Or,
        Not,
        NotAndCombinations,
        Implies,
        Excludes,
        Equivalence
    }
    public enum AssumptionTypes
    {
        User,
        Solver
    }
    public enum VariableDataTypes
    {
        Integer,
        Boolean
    }

    
}
