using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using BLL.SolverEngines;
using System.Reflection;
using BLL.Services;

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
                        typeof(AbsoluteFeatureSelector),
                        typeof(RelativeFeatureSelector),
                        typeof(AbsoluteAttributeSelector)
                    };
                }

                //StatementTypes
                public class CompositeSelector : ParserStatement
                {
                    //Fields
                    public static string IdentifyRegex = @"^[^\.]+(\.[^\.]{2,}){1,}[^\.]*$", SplitRegex = @"\."; //example : "#FeatureName.>Descendants.AttributeName"
                    
                    public override object Eval()
                    {
                        //Get the Feature
                        ObjectReference featureRef = (ObjectReference)base.innerStatements[0].Eval();
                        BusinessObjects.Feature feature = (BusinessObjects.Feature)featureRef.GetTargetObject();

                        //Get the Attribute
                        ObjectReference attributeRef = (ObjectReference)base.innerStatements[1].Eval(new object [] { (object)feature });
                        BusinessObjects.Attribute attribute = (BusinessObjects.Attribute)attributeRef.GetTargetObject();

                        //Get the AttributeValue
                        BusinessObjects.AttributeValue attributeValue = _configSession.Configuration.GetAttributeValueByAttributeID(attribute.ID);

                        //Return a reference pointing to the AttributeValue
                        object targetAttributeVal = (object)attributeValue;
                        ObjectReference returnRef = new ObjectReference(ref targetAttributeVal, "Value");
                        return returnRef;
                    }
                }
                public class AbsoluteFeatureSelector : ParserStatement
                {
                    //Fields
                    public static string IdentifyRegex = "^#[A-z,0-9]*$", SplitRegex = null; //example : "#FeatureName"
                    public override object Eval()
                    {
                        //Get the Feature and FeatureSelection
                        string featureName = _syntaxString.Replace("#", "").Replace("_", " ");
                        BusinessObjects.Feature feature = _configSession.Model.GetFeatureByName(featureName);
                        if (feature == null)
                            throw new ElementNotFoundException();

                        //Return a reference pointing to the Feature
                        object target = (object)feature;
                        ObjectReference returnRef = new ObjectReference(ref target);
                        return returnRef;
                    }
                }
                public class RelativeFeatureSelector : ParserStatement
                {
                    //Fields
                    public static string IdentifyRegex = "^>root|descendants$", SplitRegex = null; //example : ">descendants"
                    
                    public override object Eval(object[] parameters)
                    {
                        return base.Eval(parameters);
                    }
                }
                public class AbsoluteAttributeSelector : ParserStatement
                {
                    //Fields
                    public static string IdentifyRegex = "^[A-z,0-9]*$", SplitRegex = null; //example : "FeatureName"
                    public override object Eval(object[] parameters)
                    {
                        //Get the Feature parameter and its FeatureSelection
                        BusinessObjects.Feature referenceFeature = (BusinessObjects.Feature)parameters[0];

                        //Get the Attribute and AttributeValue
                        string attributeName = _syntaxString.Replace("_", " ");
                        BusinessObjects.Attribute attribute = _configSession.Model.GetAttributeByName(referenceFeature, attributeName);
                        if (attribute == null)
                            throw new ElementNotFoundException();

                        //Return a reference pointing to the Attribute
                        object target = (object)attribute;
                        ObjectReference returnRef = new ObjectReference(ref target);
                        return returnRef;
                    }
                }
            }
        }


        //Private Methods
        private ParserStatement ParseString(ref ConfiguratorSession configSession, string str)
        {
            //Identify the string and creating a corresponding ParserStatement
            Type StatementType = IdentifyString(str);
            ParserStatement instance = (ParserStatement)ExecuteStaticMethod(StatementType, "CreateInstance", (object)StatementType, configSession, (object)str);

            //Parse inner statements and add them to the parent
            string splitRegex = (string)GetStaticField(StatementType, "SplitRegex");
            if (splitRegex != null)
            {
                string[] subStrings = Regex.Split(str, splitRegex);
                foreach (string subString in subStrings)
                {
                    ParserStatement innerStatement = ParseString(ref configSession, subString);
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
        public bool ExecuteSyntax(ref ConfiguratorSession configSession, string RuleSyntax)
        {
            try
            {
                ParserStatement rootStatement = ParseString(ref configSession, RuleSyntax);
                rootStatement.Eval();
            }
            catch (ElementNotFoundException ex)
            {

            }

            return true;
        }
    }

    
}
