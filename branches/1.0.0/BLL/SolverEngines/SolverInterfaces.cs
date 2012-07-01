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
        void AddOrModifyValueAssumption(string variableID, string categoryName, VariableDataTypes dataType, object value);

        ISolverStatement MakeEquals(ISolverStatement leftStatement, ISolverStatement rightStatement);
        ISolverStatement MakeAdd(ISolverStatement[] innerStatements);
        ISolverStatement MakeAnd(string categoryName, params string[] variableIDs);
        ISolverStatement MakeAnd(ISolverStatement leftStatement, ISolverStatement rightStatement);
        ISolverStatement MakeOr(string categoryName, params string[] variableIDs);
        ISolverStatement MakeOr(ISolverStatement leftStatement, ISolverStatement rightStatement);
        ISolverStatement MakeNot(ISolverStatement innerStatement);
        ISolverStatement MakeImplies(ISolverStatement leftStatement, ISolverStatement rightStatement);
        ISolverStatement MakeImplies(string categoryName, string leftVarID, string rightVarID);
        ISolverStatement MakeImplies(string categoryName, string leftVarID, ISolverStatement rightStatement);
        ISolverStatement MakeGreaterOrEqual(ISolverStatement leftStatement, ISolverStatement rightStatement);
        ISolverStatement MakeLowerOrEqual(ISolverStatement leftStatement, ISolverStatement rightStatement);
        ISolverStatement MakeNotAndCombinations(string categoryName, params string[] variableIDs);
        ISolverStatement MakeEquivalence(ISolverStatement leftStatement, ISolverStatement rightStatement);
        ISolverStatement MakeEquivalence(string categoryName, string leftVarID, string rightVarID);
        ISolverStatement MakeEquivalence(string categoryName, string leftVarID, ISolverStatement rightStatement);
        ISolverStatement MakeExcludes(ISolverStatement leftStatement, ISolverStatement rightStatement);
        ISolverStatement MakeExcludes(string categoryName, string leftVarID, string rightVarID);

        ISolverStatement MakeBoolToInt(string variableID, string categoryName);
        ISolverStatement MakeNumeral(int val);

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
    public interface ISolverFunction
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
        Equivalence,
        FunctionCall,
        GreaterOrEqual,
        LesserOrEqual
    }
    public enum VariableDataTypes
    {
        Integer,
        Boolean
    }


}
