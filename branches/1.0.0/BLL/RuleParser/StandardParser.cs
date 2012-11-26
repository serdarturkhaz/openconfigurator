// Developed by OpenConfigurator Core Team
// 
// Distributed under the MIT license
// ===========================================================
// Copyright (c) 2012 - Radu Mitache, Josef A. Habdank
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
                    typeof(Operations),
                    typeof(Comparisons), // JAH: add Comparisons, use OutcomeResult ot return the value of the rule
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
                    public static Dictionary<string, string> DependentReplacedString =
                        new Dictionary<string, string>
                            {
                                {">=", ">@"},
                                {"<=", "<@"},
                                {"==", "@@"},
                                {"!=", "!@"}
                            };

                    /// <summary>
                    /// the regex which makes sure there is only 1 = sign in a row (excludes >=, <=, ==, =<, =>)
                    /// </summary>
                    public static string IdentifyRegex = "^.*[^!<>=]=[^<>=].*$";

                    /// <summary>
                    /// splits the rule by a single = sign (ignores ==, >= <=)
                    /// </summary>
                    public static string SplitRegex = "=";

                    public static bool Identify(string command)
                    {
                        return Regex.IsMatch(command, IdentifyRegex);
                    }

                    public static string[] Split(string command)
                    {
                        // replace overlapping characters
                        string parsedCommand = command;

                        foreach (var replace in DependentReplacedString)
                            parsedCommand = parsedCommand.Replace(replace.Key, replace.Value);

                        // run the split
                        string[] retVal = Regex.Split(parsedCommand, SplitRegex);

                        // correct all the strings in the split command, revesring the split
                        for(int i = 0; i < retVal.Length; i++)
                        {
                            foreach (var replace in DependentReplacedString)
                                retVal[i] = retVal[i].Replace(replace.Value, replace.Key);    
                        }

                        return retVal;
                    }

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

                        // set the value
                        IEvalResult rightSide = base.innerStatements[1].Eval()[0];
                        leftSideRef.SetGenericReturnValue(rightSide.GetGenericReturnValue());

                        return new IEvalResult[] { (IEvalResult)rightSide.Clone() };

                        #region Old
                        ////Evaluate left side
                        //IEvalResult[] leftSide = base.innerStatements[0].Eval();
                        //FieldReference leftSideRef = null;
                        //if (leftSide.Length == 1 && leftSide[0].GetType() == typeof(FieldReference))
                        //{
                        //    leftSideRef = (FieldReference)leftSide[0];
                        //}
                        //else
                        //{
                        //    throw new SyntaxIncorrectException();
                        //}


                        ////Evaluate right side and perform assignment
                        //IEvalResult[] rightSide = base.innerStatements[1].Eval();
                        //if (rightSide.Length == 1 && rightSide[0].GetType() == typeof(FieldReference))
                        //{
                        //    FieldReference rightSideRef = (FieldReference)rightSide[0];
                        //    leftSideRef.SetValue(rightSideRef.GetValue());

                        //    //Return the reference, for chain functionality
                        //    return new IEvalResult[] { leftSideRef };
                        //}
                        //else if (rightSide.Length == 1 && rightSide[0].GetType() == typeof(ValueResult))
                        //{
                        //    ValueResult rightSideValue = (ValueResult)rightSide[0];
                        //    leftSideRef.SetValue(rightSideValue.GetValue());

                        //    // return value to allow multiple assignment
                        //    return new IEvalResult[] { new ValueResult(rightSideValue.GetValue()) };
                        //}
                        //else
                        //{
                        //    throw new SyntaxIncorrectException();
                        //} 
                        #endregion
                    }
                }
            }
            public static class Operations
            {
                //Methods
                public static List<Type> GetStatementTypes()
                {
                    return new List<Type>()
                    {
                        typeof(Power),
                        typeof(Multiplication),
                        typeof(Division),
                        typeof(Addition),
                        typeof(Substraction),
                    };
                }

                //StatementTypes
                public class Power : SingleValueResultIntParserStatement
                {
                    public static string IdentifyRegex = @"^.+\^.+$";
                    public static string SplitRegex = @"\^";

                    public override IEvalResult SingleEvalInt(int leftSide, int rightSide)
                    {
                        return new NumberResult((int)Math.Pow(leftSide, rightSide));
                    }
                }
                public class Multiplication : SingleValueResultParserStatement
                {
                    public static string IdentifyRegex = @"^.+\*.+$";
                    public static string SplitRegex = @"\*";

                    public override IEvalResult SingleEval(IEvalResult leftSide, IEvalResult rightSide)
                    {
                        var leftString = leftSide.GetGenericReturnValue().ToString();
                        int left = Convert.ToInt32(leftString);

                        var rightString = rightSide.GetGenericReturnValue().ToString();
                        int right = Convert.ToInt32(rightString);

                        return new NumberResult(left * right);
                    }
                }
                public class Division : SingleValueResultParserStatement
                {
                    public static string IdentifyRegex = @"^.+/.+$";
                    public static string SplitRegex = @"/";

                    public override IEvalResult SingleEval(IEvalResult leftSide, IEvalResult rightSide)
                    {
                        var leftString = leftSide.GetGenericReturnValue().ToString();
                        int left = Convert.ToInt32(leftString);

                        var rightString = rightSide.GetGenericReturnValue().ToString();
                        int right = Convert.ToInt32(rightString);

                        return new NumberResult(left / right);
                    }
                }

                public class Addition : SingleValueResultParserStatement
                {
                    public static string IdentifyRegex = @"^.+\+.+$";
                    public static string SplitRegex = @"\+";

                    public override IEvalResult SingleEval(IEvalResult leftSide, IEvalResult rightSide)
                    {
                        var leftString = leftSide.GetGenericReturnValue().ToString();
                        int left = Convert.ToInt32(leftString);

                        var rightString = rightSide.GetGenericReturnValue().ToString();
                        int right = Convert.ToInt32(rightString);

                        return new NumberResult(left + right);
                    }
                }
                public class Substraction : SingleValueResultParserStatement
                {
                    public static string IdentifyRegex = @"^.+-.*$";
                    public static string SplitRegex = @"-";

                    public override IEvalResult SingleEval(IEvalResult leftSide, IEvalResult rightSide)
                    {
                        var leftString = leftSide.GetGenericReturnValue().ToString();
                        int left = Convert.ToInt32(leftString);

                        var rightString = rightSide.GetGenericReturnValue().ToString();
                        int right = Convert.ToInt32(rightString);

                        return new NumberResult(left - right);
                    }
                }
            }
            public static class Comparisons
            {
                //Methods
                public static List<Type> GetStatementTypes()
                {
                    return new List<Type>()
                    {
                        typeof(EqualsComparison),
                        typeof(UnequalsComparison),
                        typeof(GreaterEqualsComparison),
                        typeof(GreaterComparison),
                        typeof(SmallerEqualsComparison),
                        typeof(SmallerComparison)
                    };
                }

                //StatementTypes
                public class EqualsComparison : ParserStatement
                {
                    // regex that takes two or more equal signs. could be improved
                    public static string IdentifyRegex = @"^.+==.+$", SplitRegex = @"==";

                    public override IEvalResult[] Eval()
                    {
                        OutcomeResult retVal = new OutcomeResult(false);

                        // Evaluate the child elements, left and right 
                        IEvalResult[] leftSide = base.innerStatements[0].Eval();
                        IEvalResult[] rightSide = base.innerStatements[1].Eval();
                        if (leftSide.Length == 1 &&
                            rightSide.Length == 1)
                        {

                            var comparisonResult = leftSide[0].GetGenericReturnValue().Equals(rightSide[0].GetGenericReturnValue());
                            retVal.SetValue(comparisonResult);

                            // TODO: use overriden .Equals function for the 
                            // or IEvalResult : ICloneable, IComparable
                            //retVal.SetValue(leftSide.Equals(rightSide));
                        }
                        else
                        {
                            throw new SyntaxIncorrectException();
                        }

                        return new IEvalResult[] { retVal };
                    }
                }
                //public class UnequalsComparison : SingleStronglyTypedValueResultParserStatement<NumberResult, NumberResult>
                public class UnequalsComparison : SingleValueResultParserStatement
                {
                    public static string IdentifyRegex = @"^.+!=.+$";
                    public static string SplitRegex = @"!=";

                    //public override IEvalResult SingleEvalStronglyTyped(NumberResult leftSide, NumberResult rightSide)
                    //{
                    //    OutcomeResult retVal = new OutcomeResult(false);

                    //    retVal.SetValue(leftSide.GetNumber() != rightSide.GetNumber());

                    //    return retVal;
                    //}

                    public override IEvalResult SingleEval(IEvalResult leftSide, IEvalResult rightSide)
                    {
                        var leftString = leftSide.GetGenericReturnValue().ToString();
                        int left = Convert.ToInt32(leftString);

                        var rightString = rightSide.GetGenericReturnValue().ToString();
                        int right = Convert.ToInt32(rightString);

                        return new OutcomeResult(left != right);
                    }
                }
                
                //public class GreaterEqualsComparison : SingleStronglyTypedValueResultParserStatement<NumberResult, NumberResult>
                public class GreaterEqualsComparison : SingleValueResultParserStatement
                {
                    public static string IdentifyRegex = @"^.+>=.+$";
                    public static string SplitRegex = @">=";

                    //public override IEvalResult SingleEvalStronglyTyped(NumberResult leftSide, NumberResult rightSide)
                    //{
                    //    OutcomeResult retVal = new OutcomeResult(false);

                    //    retVal.SetValue(leftSide.GetNumber() >= rightSide.GetNumber());

                    //    return retVal;
                    //}

                    public override IEvalResult SingleEval(IEvalResult leftSide, IEvalResult rightSide)
                    {
                        var leftString = leftSide.GetGenericReturnValue().ToString();
                        int left = Convert.ToInt32(leftString);

                        var rightString = rightSide.GetGenericReturnValue().ToString();
                        int right = Convert.ToInt32(rightString);

                        return new OutcomeResult(left >= right);
                    }
                }
                //public class GreaterComparison : SingleStronglyTypedValueResultParserStatement<NumberResult, NumberResult>
                public class GreaterComparison : SingleValueResultParserStatement
                {
                    public static string IdentifyRegex = @"^.+>[^=].*$";
                    public static string SplitRegex = @">";

                    //public override IEvalResult SingleEvalStronglyTyped(NumberResult leftSide, NumberResult rightSide)
                    //{
                    //    return new OutcomeResult(leftSide.GetNumber() > rightSide.GetNumber());
                    //}

                    public override IEvalResult SingleEval(IEvalResult leftSide, IEvalResult rightSide)
                    {
                        var leftString = leftSide.GetGenericReturnValue().ToString();
                        int left = Convert.ToInt32(leftString);

                        var rightString = rightSide.GetGenericReturnValue().ToString();
                        int right = Convert.ToInt32(rightString);

                        return new OutcomeResult(left > right);
                    }
                }
                //public class SmallerEqualsComparison : SingleStronglyTypedValueResultParserStatement<NumberResult, NumberResult>
                public class SmallerEqualsComparison : SingleValueResultParserStatement
                {
                    public static string IdentifyRegex = @"^.+<=.+$";
                    public static string SplitRegex = @"<=";

                    //public override IEvalResult SingleEvalStronglyTyped(IEvalResult leftSide, IEvalResult rightSide)
                    //{
                    //    return new OutcomeResult(leftSide.GetNumber() <= rightSide.GetNumber());
                    //}

                    public override IEvalResult SingleEval(IEvalResult leftSide, IEvalResult rightSide)
                    {
                        var leftString = leftSide.GetGenericReturnValue().ToString();
                        int left = Convert.ToInt32(leftString);

                        var rightString = rightSide.GetGenericReturnValue().ToString();
                        int right = Convert.ToInt32(rightString);

                        return new OutcomeResult(left <= right);
                    }
                }
                //public class SmallerComparison : SingleStronglyTypedValueResultParserStatement<NumberResult, NumberResult>
                public class SmallerComparison : SingleValueResultParserStatement
                {
                    //public static bool Identify(string command)
                    //{
                    //    return Regex.IsMatch(command, IdentifyRegex);
                    //}

                    public static string IdentifyRegex = @"^.+<[^=].*$";
                    public static string SplitRegex = @"<";

                    //public override IEvalResult SingleEvalStronglyTyped(NumberResult leftSide, NumberResult rightSide)
                    //{
                    //    return new OutcomeResult(leftSide.GetNumber() < rightSide.GetNumber());
                    //}

                    public override IEvalResult SingleEval(IEvalResult leftSide, IEvalResult rightSide)
                    {
                        var leftString = leftSide.GetGenericReturnValue().ToString();
                        int left = Convert.ToInt32(leftString);

                        var rightString = rightSide.GetGenericReturnValue().ToString();
                        int right = Convert.ToInt32(rightString);

                        return new OutcomeResult(left < right);
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
                        return new IEvalResult[] { new OutcomeResult(val) };
                    }
                }
                public class String : ParserStatement
                {
                    //
                    public static string IdentifyRegex = "^\"[A-z]+\"$", SplitRegex = null;
                    public override IEvalResult[] Eval()
                    {
                        string str = base._syntaxString.Replace("\"", "");
                        return new IEvalResult[] { new StringResult(str) };
                    }
                }
                public class Integer : ParserStatement
                {
                    //
                    public static string IdentifyRegex = "^[0-9]+$", SplitRegex = null;
                    public override IEvalResult[] Eval()
                    {
                        int val = System.Int32.Parse(base._syntaxString);
                        return new IEvalResult[] { new NumberResult(val) };
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
                    public static string IdentifyRegex = "^(#[A-z,0-9]*|root)$", SplitRegex = null; //example : "#FeatureName" or "root"
                    public override IEvalResult[] Eval()
                    {
                        //Root selector
                        if (_syntaxString == "root")
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
                            // Get the Feature and FeatureSelection
                            // remove the hash
                            string featureIdentifier = _syntaxString.Replace("#", "");
                            BusinessObjects.Feature feature = _configSession.Model.GetFeatureByIdentifier(featureIdentifier);

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
                    public static string IdentifyRegex = @"^(children|descendants)(\[(selected|deselected|unselected)\])?$", SplitRegex = null; //example : "descendants"

                    public override IEvalResult[] Eval(IEvalResult[] parameters)
                    {
                        // Setup parameters and variables
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
                        List<BLL.BusinessObjects.Feature> selectedFeatures = new List<BusinessObjects.Feature>();

                        // Select all the features
                        if (_syntaxString.Contains("children"))
                        {
                            //Children selector
                            foreach (BLL.BusinessObjects.Feature featureRef in featureReferences)
                            {
                                selectedFeatures.AddRange(_configSession.Model.GetChildFeatures(featureRef));
                            }
                        }
                        else if (_syntaxString.Contains("descendants"))
                        {
                            //Descendants selector
                            foreach (BLL.BusinessObjects.Feature featureRef in featureReferences)
                            {
                                selectedFeatures.AddRange(_configSession.Model.GetDescendantFeatures(featureRef));
                            }
                        }

                        // null if takes all the features
                        BusinessObjects.FeatureSelectionStates? featureSelectionState = null;

                        // find the feture state and save it to featureSelectionState, featureSelectionState remains null if could not find
                        foreach (var featureState in Enum.GetValues(typeof(BusinessObjects.FeatureSelectionStates)))
                        {
                            // get the state name
                            string enumSelector = string.Format(@"[{0}]", featureState.ToString().ToLower());

                            if (_syntaxString.Contains(enumSelector))
                            {
                                featureSelectionState = (BusinessObjects.FeatureSelectionStates)featureState;
                                break;
                            }
                        }

                        // Return a list of references pointing the selected features 
                        List<IEvalResult> returnRef = new List<IEvalResult>();
                        foreach (BLL.BusinessObjects.Feature childFeature in selectedFeatures)
                        {
                            // Only childFeatures which are selected in the configuration
                            BLL.BusinessObjects.FeatureSelection featureSelection = _configSession.Configuration.GetFeatureSelectionByFeatureID(childFeature.ID);

                            // get all if there was no selector, else get only those which are of the given state
                            if (featureSelectionState == null || featureSelection.SelectionState == featureSelectionState)
                            {
                                object target = (object)childFeature;
                                ObjectReference objRef = new ObjectReference(ref target);
                                returnRef.Add(objRef);
                            }

                            //if (featureSelection.SelectionState == BusinessObjects.FeatureSelectionStates.Selected)
                            //{
                            //    //
                            //    object target = (object)childFeature;
                            //    ObjectReference objRef = new ObjectReference(ref target);
                            //    returnRef.Add(objRef);
                            //}
                        }

                        return returnRef.ToArray();
                    }
                }
                public class AbsoluteAttributeSelector : ParserStatement
                {
                    //Fields
                    public static string IdentifyRegex = "^[A-z,0-9]+$", SplitRegex = null; //example : "FeatureName"
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
                            string attributeIdentifier = _syntaxString;
                            BusinessObjects.Attribute attribute = _configSession.Model.GetAttributeByIdentifier(featureRef, attributeIdentifier);

                            if (attribute != null) //if the feature doesn't have the Attribute, it is ignored
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
                            FieldReference objRef = new FieldReference(target, "Value");
                            returnRef.Add(objRef);
                        }
                        return returnRef.ToArray();
                    }
                }
            }
        }

        //Private Methods
        public ParserStatement ParseString(ref ConfiguratorSession configSession, string str)
        {
            // trim before the identification, allowing spaces in the code
            str = str.Trim();

            // Identify the string and creating a corresponding ParserStatement
            Type StatementType = IdentifyString(str);
            ParserStatement instance = (ParserStatement)ExecuteStaticMethod(StatementType, "CreateInstance", (object)StatementType, configSession, (object)str);

            string[] subStrings = null;

            // if defined, split using the Split method
            var splitResult = ExecuteStaticMethod(StatementType, "Split", str);
            if (splitResult != null)
                subStrings = (string[])splitResult;
            else
            // else use the regex to split
            {
                var splitRegex = (string)GetStaticField(StatementType, "SplitRegex");

                if (splitRegex != null)
                {
                    // split the regexa nd only take none empty elements
                    subStrings = Regex.Split(str, splitRegex).Where(s => !string.IsNullOrWhiteSpace(s)).ToArray();
                }
            }

            // if the string was split, then parse inner statements and add them to the parent
            if (subStrings != null)
                foreach (string subString in subStrings)
                {
                    ParserStatement innerStatement = ParseString(ref configSession, subString);
                    instance.AddInnerStatement(innerStatement);
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
                    // see if it has the Identify method, if it does then use it for identification
                    var IdentifyResult = ExecuteStaticMethod(StatementType, "Identify", str);
                    if (IdentifyResult != null)
                    {
                        if ((bool)IdentifyResult)
                            return StatementType;
                    }
                    else
                    {
                        // use the regex pattern for the identification
                        string regexExpression = (string)GetStaticField(StatementType, "IdentifyRegex");
                        if (Regex.IsMatch(str, regexExpression, RegexOptions.None))
                        {
                            return StatementType;
                        }
                    }
                }
            }

            return null;
        }
        private static object ExecuteStaticMethod(Type baseClass, string methodName)
        {
            return ExecuteStaticMethod(baseClass, methodName, null);
        }

        /// <summary>
        /// Excetures a static method. If the static method does not exists, it returns null
        /// </summary>
        /// <param name="baseClass"></param>
        /// <param name="methodName"></param>
        /// <param name="parameters"></param>
        /// <returns></returns>
        private static object ExecuteStaticMethod(Type baseClass, string methodName, params object[] parameters)
        {
            MethodInfo method = baseClass.GetMethod(methodName, BindingFlags.Static | BindingFlags.Public | BindingFlags.FlattenHierarchy);

            return method != null
                       ? method.Invoke(null, parameters)
                       : null;
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
                if (!String.IsNullOrEmpty(RuleSyntax))
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
