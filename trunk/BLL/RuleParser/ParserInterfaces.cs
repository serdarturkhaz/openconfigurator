using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using BLL.SolverEngines;
using System.Text.RegularExpressions;

namespace BLL.RuleParser
{
    public interface IParser
    {
        bool VerifySyntax(string RuleSyntax, ISolverContext context);
        bool ExecuteCustomRule(string RuleSyntax, ISolverContext context);
    }


    public abstract class ParserStatement
    {
        //Fields
        protected string _syntaxString="";
        protected List<ParserStatement> innerStatements = new List<ParserStatement>();


        //Methods
        public virtual void AddInnerStatement(ParserStatement statement)
        {
            innerStatements.Add(statement);
        }
        public abstract object Eval();

        //Factory constructor
        public static ParserStatement CreateInstance(Type statementType, string syntaxString)
        {
            ParserStatement instance = (ParserStatement)Activator.CreateInstance(statementType, null);
            instance._syntaxString = syntaxString;
            return instance;
        }
    }

    public enum StatementEvalTypes
    {
        Feature,
        Attribute,
        PrimitiveValue
    }

}
