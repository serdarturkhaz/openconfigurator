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
        bool ExecuteCustomRule(string RuleSyntax, ISolverContext context, ref List<BLL.BusinessObjects.FeatureSelection> featureSelections);
    }
    public abstract class ParserStatement
    {
        //Fields
        protected string _syntaxString = "";
        protected List<ParserStatement> innerStatements = new List<ParserStatement>();
        protected ISolverContext _context;
        protected List<BLL.BusinessObjects.FeatureSelection> featureSelections;

        //Methods
        public virtual void AddInnerStatement(ParserStatement statement)
        {
            innerStatements.Add(statement);
        }
        public abstract object Eval();

        //Factory constructor
        public static ParserStatement CreateInstance(Type statementType, string syntaxString, ISolverContext context, ref List<BLL.BusinessObjects.FeatureSelection> featureSelections)
        {
            ParserStatement instance = (ParserStatement)Activator.CreateInstance(statementType, null);
            instance._syntaxString = syntaxString;
            instance._context = context;
            instance.featureSelections = featureSelections;
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
