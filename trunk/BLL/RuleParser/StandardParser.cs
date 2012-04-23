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
                    typeof(Functions),
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
                    public override IEvalResult[] Eval()
                    {
                        //Evaluate left side
                        IEvalResult[] leftSide = base.innerStatements[0].Eval();
                        FieldReference leftSideRef = null;
                        if (leftSide.Length == 1 && leftSide[0].GetType() == typeof(FieldReference))
                        {
                            leftSideRef = (FieldReference)leftSide[0];
                        }
                        else
                        {
                            throw new SyntaxIncorrectException();
                        }


                        //Evaluate right side and perform assignment
                        IEvalResult[] rightSide = base.innerStatements[1].Eval();
                        if (rightSide.Length == 1 && rightSide[0].GetType() == typeof(FieldReference))
                        {
                            FieldReference rightSideRef = (FieldReference)rightSide[0];
                            leftSideRef.SetValue(rightSideRef.GetValue());
                        }
                        else if (rightSide.Length == 1 && rightSide[0].GetType() == typeof(ValueResult))
                        {
                            ValueResult rightSideValue = (ValueResult)rightSide[0];
                            leftSideRef.SetValue(rightSideValue.GetValue());
                        }
                        else
                        {
                            throw new SyntaxIncorrectException();
                        }

                        //Return outcome
                        return new IEvalResult[] { new OutcomeResult(true) };
                    }
                }
            }
            public static class Functions
            {
                //Methods
                public static List<Type> GetStatementTypes()
                {
                    return new List<Type>()
                    {
                        typeof(SumOf)
                    };
                }

                //StatementTypes
                public class SumOf : ParserStatement
                {
                    //
                    public static string IdentifyRegex = @"^sumOf\(.*\)$", SplitRegex = @"sumOf\(|\)";
                    public override IEvalResult[] Eval()
                    {
                        IEvalResult[] innerEvalResult = innerStatements[0].Eval();
                        int sum = 0;
                        foreach (IEvalResult evalResult in innerEvalResult)
                        {
                            try
                            {
                                FieldReference objRef = (FieldReference)evalResult;
                                BusinessObjects.AttributeValue attrVal = (BusinessObjects.AttributeValue)objRef.GetReference();
                                sum += Int32.Parse(attrVal.Value);
                            }
                            catch (Exception ex)
                            {
                                throw new SyntaxIncorrectException();
                            }
                        }
                        return new IEvalResult[] { (IEvalResult)new ValueResult(sum) };
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
                    public override IEvalResult[] Eval()
                    {
                        bool val = System.Boolean.Parse(base._syntaxString);
                        return new IEvalResult[] { (IEvalResult)new ValueResult(val) };
                    }
                }
                public class String : ParserStatement
                {
                    //
                    public static string IdentifyRegex = "^\"[A-z]+\"$", SplitRegex = null;
                    public override IEvalResult[] Eval()
                    {
                        object str = base._syntaxString.Replace("\"", "");
                        return new IEvalResult[] { (IEvalResult)new ValueResult(str) };
                    }
                }
                public class Integer : ParserStatement
                {
                    //
                    public static string IdentifyRegex = "^[0-9]+$", SplitRegex = null;
                    public override IEvalResult[] Eval()
                    {
                        int val = System.Int32.Parse(base._syntaxString);
                        return new IEvalResult[] { (IEvalResult)new ValueResult(val) };
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

                    public override IEvalResult[] Eval()
                    {
                        //Loop through inner statements
                        List<IEvalResult[]> evalResults = new List<IEvalResult[]>();
                        IEvalResult[] finalEvalResult = null;
                        for (int i = 0; i < base.innerStatements.Count; i++)
                        {
                            //First inner statement
                            if (i == 0)
                            {
                                //Evaluate
                                ParserStatement statement = base.innerStatements[i];
                                IEvalResult[] evalResult = base.innerStatements[i].Eval();
                                evalResults.Add(evalResult);
                            }
                            //Following inner statements
                            else if (i >= 1)
                            {
                                //Evaluate using the previous statement's result as a parameter
                                ParserStatement statement = base.innerStatements[i];
                                IEvalResult[] evalResult = base.innerStatements[i].Eval(evalResults[i - 1]);
                                evalResults.Add(evalResult);

                                //
                                finalEvalResult = evalResult;
                            }
                        }

                        return finalEvalResult;
                    }
                }
                public class AbsoluteFeatureSelector : ParserStatement
                {
                    //Fields
                    public static string IdentifyRegex = "^(#[A-z,0-9]*|>root)$", SplitRegex = null; //example : "#FeatureName"
                    public override IEvalResult[] Eval()
                    {
                        //Root selector
                        if (_syntaxString.Contains("root"))
                        {
                            BLL.BusinessObjects.Feature root = _configSession.Model.GetRootFeature();

                            //Return a reference pointing to the Feature
                            object target = (object)root;
                            ObjectReference returnRef = new ObjectReference(ref target);
                            return new IEvalResult[] { returnRef };
                        }
                        else
                        //ID selector
                        {
                            //Get the Feature and FeatureSelection
                            string featureName = _syntaxString.Replace("#", "").Replace("_", " ");
                            BusinessObjects.Feature feature = _configSession.Model.GetFeatureByName(featureName);
                            if (feature == null)
                                throw new ElementNotFoundException();

                            //Return a reference pointing to the Feature
                            object target = (object)feature;
                            ObjectReference returnRef = new ObjectReference(ref target);
                            return new IEvalResult[] { returnRef };
                        }
                    }
                }
                public class RelativeFeatureSelector : ParserStatement
                {
                    //Fields
                    public static string IdentifyRegex = "^>children|>descendants$", SplitRegex = null; //example : ">descendants"

                    public override IEvalResult[] Eval(IEvalResult[] parameters)
                    {
                        //Evaluate parameters
                        List<BLL.BusinessObjects.Feature> featureReferences = new List<BusinessObjects.Feature>();
                        foreach (IEvalResult parameter in parameters)
                        {
                            try
                            {
                                ObjectReference objRef = (ObjectReference)parameter;
                                featureReferences.Add((BusinessObjects.Feature)objRef.GetReference());
                            }
                            catch (Exception ex)
                            {
                                throw new SyntaxIncorrectException();
                            }
                        }

                        //Children selector****************************************************************************************************
                        if (_syntaxString.Contains("children"))
                        {
                            //Get the child Features
                            List<BLL.BusinessObjects.Feature> childFeatures = new List<BusinessObjects.Feature>();
                            foreach (BLL.BusinessObjects.Feature featureRef in featureReferences)
                            {
                                childFeatures.AddRange(_configSession.Model.GetChildFeatures(featureRef));
                            }

                            //Return a list of references pointing to the each of the childFeatures 
                            List<IEvalResult> returnRef = new List<IEvalResult>(); ;
                            foreach (BLL.BusinessObjects.Feature childFeature in childFeatures)
                            {
                                //Only childFeatures which are selected in the configuration
                                BLL.BusinessObjects.FeatureSelection featureSelection = _configSession.Configuration.GetFeatureSelectionByFeatureID(childFeature.ID);
                                if (featureSelection.SelectionState == BusinessObjects.FeatureSelectionStates.Selected)
                                {
                                    //
                                    object target = (object)childFeature;
                                    ObjectReference objRef = new ObjectReference(ref target);
                                    returnRef.Add(objRef);
                                }
                            }

                            return returnRef.ToArray();
                        }
                        //*********************************************************************************************************************
                        //Children selector****************************************************************************************************


                        //*********************************************************************************************************************


                        return null;
                    }
                }
                public class AbsoluteAttributeSelector : ParserStatement
                {
                    //Fields
                    public static string IdentifyRegex = "^[A-z,0-9]*$", SplitRegex = null; //example : "FeatureName"
                    public override IEvalResult[] Eval(IEvalResult[] parameters)
                    {
                        //Get parameters
                        List<BLL.BusinessObjects.Feature> featureReferences = new List<BusinessObjects.Feature>();
                        foreach (IEvalResult parameter in parameters)
                        {
                            try
                            {
                                ObjectReference objRef = (ObjectReference)parameter;
                                featureReferences.Add((BusinessObjects.Feature)objRef.GetReference());
                            }
                            catch (Exception ex)
                            {
                                throw new SyntaxIncorrectException();
                            }
                        }

                        //Get the Attributes and AttributeValues 
                        List<BLL.BusinessObjects.AttributeValue> attributeValues = new List<BusinessObjects.AttributeValue>();
                        foreach (BLL.BusinessObjects.Feature featureRef in featureReferences)
                        {
                            //Get the Attribute
                            string attributeName = _syntaxString.Replace("_", " ");
                            BusinessObjects.Attribute attribute = _configSession.Model.GetAttributeByName(featureRef, attributeName);
                            if (attribute != null)
                            {
                                //Get the AttributeValue
                                BusinessObjects.AttributeValue attributeValue = _configSession.Configuration.GetAttributeValueByAttributeID(attribute.ID);
                                attributeValues.Add(attributeValue);
                            }


                        }
                        //Return a list of references pointing to the each of the childFeatures
                        List<IEvalResult> returnRef = new List<IEvalResult>();
                        foreach (BLL.BusinessObjects.AttributeValue attrValue in attributeValues)
                        {
                            object target = (object)attrValue;
                            FieldReference objRef = new FieldReference(ref target, "Value");
                            returnRef.Add(objRef);
                        }
                        return returnRef.ToArray();
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
                    if (subString != "")
                    {
                        ParserStatement innerStatement = ParseString(ref configSession, subString);
                        instance.AddInnerStatement(innerStatement);
                    }
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
                if (RuleSyntax != "" && RuleSyntax != null)
                {
                    ParserStatement rootStatement = ParseString(ref configSession, RuleSyntax);
                    rootStatement.Eval();
                }
            }
            catch (ElementNotFoundException ex)
            {

            }
            catch (NullReferenceException ex)
            {
                //throw new SyntaxIncorrectException();
            }

            return true;
        }
    }


}
