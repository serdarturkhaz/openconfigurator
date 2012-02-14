using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using BLL.SolverEngines;

namespace BLL.RuleParser
{
    public interface IParser
    {
        bool VerifySyntax(string RuleSyntax, ISolverContext context);
        bool ExecuteCustomRule(string RuleSyntax, ISolverContext context);
    }

    public interface IParserStatement
    {

    }

    //Enums
    public enum ParserStatementTypes
    {
        Assignment,
        Selector,
        Comparison,
        Helper
    }

}
