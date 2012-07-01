// Developed by OpenConfigurator Core Team
// 
// Distributed under the MIT license
// ===========================================================
// Copyright (c) 2012 - Radu Mitache
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, 
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
