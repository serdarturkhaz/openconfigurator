using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using BLL.SolverEngines;

namespace BLL.RuleParser
{
    public class StandardParser : IParser
    {
        //Syntax declarations-------------------------------------------------------------------------------------------------------------------------

        //Feature Selectors
        string RefByName = "";  // Absolute reference by Name - example : "#FeatureName"
        string RefByPos = ""; //Relative reference by position - example : "FeatureReference.GetAncestors" 

        //Attribute Selectors
        string AttributeByName = ""; // (Reference).[AttributeName]

        //Assignment
        string Assignment = ""; // (Reference) = value

        //Comparison
        string ComparisonOperators = ""; //

        //Functions
        string Functions = ""; //

        //REGEX precedence


        //
        string AssignmentRegex = "=";

        //-------------------------------------------------------------------------------------------------------------------------------------------

        //Constructor
        public StandardParser()
        {

        }

        //Methods
        #region IParser Members

        public bool VerifySyntax(string RuleSyntax, ISolverContext context)
        {
            throw new NotImplementedException();
        }

        public bool ExecuteCustomRule(string RuleSyntax, ISolverContext context)
        {
            throw new NotImplementedException();
        }

        #endregion
    }

    public class Assignment : IParserStatement
    {

    }
}
