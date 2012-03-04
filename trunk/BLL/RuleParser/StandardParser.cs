using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using BLL.SolverEngines;
using System.Reflection;

namespace BLL.RuleParser
{
    public class StandardParser : IParser
    {
        //Syntax support
        public static class SyntaxSupport
        {
            //Methods
            public static List<Type> GetCategoriesByParsePriority()
            {
                return new List<Type>()
                {
                    typeof(Manipulation),
                    typeof(Primitives),
                    typeof(Selectors)
                };

            }

            //Categories
            public static class Manipulation
            {
                //Methods
                public static List<Type> GetStatementTypes()
                {
                    return new List<Type>()
                    {
                        typeof(Assignment)
                    };

                }

                //StatementTypes
                public class Assignment : ParserStatement
                {
                    //
                    public static string IdentifyRegex = "^.*=.*$", SplitRegex = "=";
                    public override object Eval()
                    {
                        //Leftside must be reference, Rightside must be value
                        ObjectReference leftSide = (ObjectReference)base.innerStatements[0].Eval();
                        object rightSide = base.innerStatements[1].Eval();
                        leftSide.SetValue(rightSide);
                        return true;
                    }
                }
            }
            public static class Primitives
            {
                //Methods
                public static List<Type> GetStatementTypes()
                {
                    return new List<Type>()
                    {
                        typeof(Boolean) ,
                        typeof(String) ,
                        typeof(Integer)
                    };

                }

                //StatementTypes
                public class Boolean : ParserStatement
                {
                    //
                    public static string IdentifyRegex = "^(true|false){1}$", SplitRegex = null;
                    public override object Eval()
                    {
                        return (object)System.Boolean.Parse(base._syntaxString);
                    }
                }
                public class String : ParserStatement
                {
                    //
                    public static string IdentifyRegex = "^\"[A-z]+\"$", SplitRegex = null;
                    public override object Eval()
                    {
                        return base._syntaxString.Replace("\"", "");
                    }
                }
                public class Integer : ParserStatement
                {
                    //
                    public static string IdentifyRegex = "^[0-9]+$", SplitRegex = null;
                    public override object Eval()
                    {
                        return (object)System.Int32.Parse(base._syntaxString);
                    }
                }
            }
            public static class Selectors
            {
                //Methods
                public static List<Type> GetStatementTypes()
                {
                    return new List<Type>()
                    {
                        typeof(CompositeSelector),
                        typeof(GetFeatureByName),
                        typeof(GetFeatureRelativeToParent)
                    };
                }

                //StatementTypes
                public class CompositeSelector : ParserStatement
                {
                    //Fields
                    public static string IdentifyRegex = @"^#[A-z,0-9]*(\.{1}[A-z,0-9]+){0,1}$", SplitRegex = null; //example : "#FeatureName.AttributeName"
                    public override object Eval()
                    {
                        //Get the Feature
                        object targetAttributeVal = (object) featureSelections[0].AttributeValues[0];
                        ObjectReference returnRef = new ObjectReference(ref targetAttributeVal, "Value");
                        return returnRef;
                    }
                }
                public class GetFeatureByName : ParserStatement
                {
                    //Fields
                    public static string IdentifyRegex = "^#[A-z,0-9]*$", SplitRegex = null; //example : "#FeatureName"
                    public override object Eval()
                    {
                        throw new NotImplementedException();
                    }
                }
                public class GetFeatureRelativeToParent : ParserStatement
                {
                    //Fields
                    public static string IdentifyRegex = "^>root|descendants$", SplitRegex = null; //example : "#FeatureName>descendants"
                    public override object Eval()
                    {
                        throw new NotImplementedException();
                    }
                }
            }
        }
        

        //Private Methods
        private ParserStatement ParseString(string str, ISolverContext context, ref List<BLL.BusinessObjects.FeatureSelection> featureSelections)
        {
            //Identify the string and creating a corresponding ParserStatement
            Type StatementType = IdentifyString(str);
            ParserStatement instance = (ParserStatement)ExecuteStaticMethod(StatementType, "CreateInstance", (object)StatementType, (object)str, context, featureSelections);

            //Parse inner statements and add them to the parent
            string splitRegex = (string)GetStaticField(StatementType, "SplitRegex");
            if (splitRegex != null)
            {
                string[] subStrings = Regex.Split(str, splitRegex);
                foreach (string subString in subStrings)
                {
                    ParserStatement innerStatement = ParseString(subString, context, ref featureSelections);
                    instance.AddInnerStatement(innerStatement);
                }
            }

            return instance;
        }
        private Type IdentifyString(string str)
        {
            //Loop through all Categories in SyntaxSupport - according to their parsing priority
            foreach (Type CategoryType in SyntaxSupport.GetCategoriesByParsePriority())
            {
                //Get statement types for the current Category
                List<Type> statementTypes = (List<Type>)ExecuteStaticMethod(CategoryType, "GetStatementTypes");

                //Loop through all statement types in the Category
                foreach (Type StatementType in statementTypes)
                {
                    //Verify
                    string regexExpression = (string)GetStaticField(StatementType, "IdentifyRegex");
                    if (Regex.IsMatch(str, regexExpression, RegexOptions.None))
                    {
                        return StatementType;
                    }
                }
            }

            return null;
        }
        private static object ExecuteStaticMethod(Type baseClass, string methodName)
        {
            return ExecuteStaticMethod(baseClass, methodName, null);
        }
        private static object ExecuteStaticMethod(Type baseClass, string methodName, params object[] parameters)
        {
            MethodInfo method = baseClass.GetMethod(methodName, BindingFlags.Static | BindingFlags.Public | BindingFlags.FlattenHierarchy);
            return method.Invoke(null, parameters);
        }
        private static object GetStaticField(Type baseClass, string fieldName)
        {
            FieldInfo field = baseClass.GetField(fieldName);
            return field.GetValue(null);
        }

        //Public Methods
        public bool ExecuteSyntax(string RuleSyntax, ISolverContext context, ref List<BLL.BusinessObjects.FeatureSelection> featureSelections)
        {
            ParserStatement rootStatement = ParseString(RuleSyntax, context, ref featureSelections);
            rootStatement.Eval();

            return false;
        }
    }
}
