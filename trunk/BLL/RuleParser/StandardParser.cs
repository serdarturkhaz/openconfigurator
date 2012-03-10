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
                    public override IEvalResult Eval()
                    {
                        //Evaluate left side
                        IEvalResult leftSide = base.innerStatements[0].Eval();
                        FieldReference leftSideRef = null;
                        if (leftSide.GetType() == typeof(FieldReference))
                        {
                            leftSideRef = (FieldReference)leftSide;
                        }
                        else
                        {
                            throw new SyntaxIncorrectException();
                        }


                        //Evaluate right side and perform assignment
                        IEvalResult rightSide = base.innerStatements[1].Eval();
                        if (rightSide.GetType() == typeof(FieldReference))
                        {
                            FieldReference rightSideRef = (FieldReference)rightSide;
                            leftSideRef.SetValue(rightSideRef.GetValue());
                        }
                        else if (rightSide.GetType() == typeof(ValueResult))
                        {
                            ValueResult rightSideValue = (ValueResult)rightSide;
                            leftSideRef.SetValue(rightSideValue.GetValue());
                        }
                        else
                        {
                            throw new SyntaxIncorrectException();
                        }

                        //Return outcome
                        return new OutcomeResult(true);
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
                    public override IEvalResult Eval()
                    {
                        bool val = System.Boolean.Parse(base._syntaxString);
                        return (IEvalResult)new ValueResult(val);
                    }
                }
                public class String : ParserStatement
                {
                    //
                    public static string IdentifyRegex = "^\"[A-z]+\"$", SplitRegex = null;
                    public override IEvalResult Eval()
                    {
                        object str = base._syntaxString.Replace("\"", "");
                        return (IEvalResult)new ValueResult(str);
                    }
                }
                public class Integer : ParserStatement
                {
                    //
                    public static string IdentifyRegex = "^[0-9]+$", SplitRegex = null;
                    public override IEvalResult Eval()
                    {
                        int val = System.Int32.Parse(base._syntaxString);
                        return (IEvalResult)new ValueResult(val);
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

                    public override IEvalResult Eval()
                    {
                        //Loop through inner statements
                        IEvalResult[] evalResults = new IEvalResult[base.innerStatements.Count];
                        IEvalResult finalEvalResult = null;
                        for (int i = 0; i < base.innerStatements.Count; i++)
                        {
                            //First inner statement
                            if (i == 0)
                            {
                                //Evaluate
                                ParserStatement statement = base.innerStatements[i];
                                IEvalResult evalResult = base.innerStatements[i].Eval();
                                evalResults[i] = evalResult;
                            }
                            //Following inner statements
                            else if (i >= 1)
                            {
                                //Evaluate using the previous statement's result as a parameter
                                ParserStatement statement = base.innerStatements[i];
                                IEvalResult evalResult = base.innerStatements[i].Eval(new IEvalResult[] { evalResults[i - 1] });
                                finalEvalResult = evalResult;
                            }
                        }

                        ////Get the Feature
                        //ObjectReference featureRef = (ObjectReference)base.innerStatements[0].Eval();
                        //BusinessObjects.Feature feature = (BusinessObjects.Feature)featureRef.GetTargetObject();

                        ////Get the Attribute
                        //ObjectReference attributeRef = (ObjectReference)base.innerStatements[1].Eval(new object [] { (object)feature });
                        //BusinessObjects.Attribute attribute = (BusinessObjects.Attribute)attributeRef.GetTargetObject();

                        ////Get the AttributeValue
                        //BusinessObjects.AttributeValue attributeValue = _configSession.Configuration.GetAttributeValueByAttributeID(attribute.ID);

                        return finalEvalResult;
                    }
                }
                public class AbsoluteFeatureSelector : ParserStatement
                {
                    //Fields
                    public static string IdentifyRegex = "^#[A-z,0-9]*$", SplitRegex = null; //example : "#FeatureName"
                    public override IEvalResult Eval()
                    {
                        //Get the Feature and FeatureSelection
                        string featureName = _syntaxString.Replace("#", "").Replace("_", " ");
                        BusinessObjects.Feature feature = _configSession.Model.GetFeatureByName(featureName);
                        if (feature == null)
                            throw new ElementNotFoundException();
                        //BusinessObjects.FeatureSelection featureSelection = _configSession.Configuration.GetFeatureSelectionByFeatureID(feature.ID);

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

                    public override IEvalResult Eval(IEvalResult[] parameters)
                    {
                        //return base.Eval(parameters);
                        return null;
                    }
                }
                public class AbsoluteAttributeSelector : ParserStatement
                {
                    //Fields
                    public static string IdentifyRegex = "^[A-z,0-9]*$", SplitRegex = null; //example : "FeatureName"
                    public override IEvalResult Eval(IEvalResult[] parameters)
                    {
                        //Get the Feature parameter and its FeatureSelection
                        BusinessObjects.Feature featureRef = null;
                        try
                        {
                            ObjectReference objRef = (ObjectReference)parameters[0];
                            featureRef = (BusinessObjects.Feature)objRef.GetReference();
                        }
                        catch (Exception ex)
                        {
                            throw new SyntaxIncorrectException();
                        }

                        //Get the Attribute 
                        string attributeName = _syntaxString.Replace("_", " ");
                        BusinessObjects.Attribute attribute = _configSession.Model.GetAttributeByName(featureRef, attributeName);
                        if (attribute == null)
                            throw new ElementNotFoundException();

                        //Get the AttributeValue
                        BusinessObjects.AttributeValue attributeValue = _configSession.Configuration.GetAttributeValueByAttributeID(attribute.ID);

                        //Return a reference pointing to the AttributeValue
                        object target = (object)attributeValue;
                        FieldReference returnRef = new FieldReference(ref target, "Value");
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
