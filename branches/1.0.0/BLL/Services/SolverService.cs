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
using Microsoft.Z3;
using System.Linq.Expressions;
using System.IO;
using BLL.SolverEngines;
using BLL.Parsers;
using BLL.BusinessObjects;
using Attribute = BLL.BusinessObjects.Attribute;
namespace BLL.Services
{
    public class SolverService
    {
        //Fields
        private IParser _ruleParser;
        private DatabindParser _databindParser;

        //Private methods
        private bool VerifyAssumption(ConfiguratorSession configSession, string featureVarID, bool value)
        {
            //Add a new assumption to test for the "valueToTest" value
            bool assumptionValid = false;
            configSession.Context.AddValueAssumption(featureVarID, VariableDataTypes.Boolean, value);
            assumptionValid = configSession.Context.IsValid();

            //Clean up and return the value
            configSession.Context.RemoveValueAssumption(featureVarID);
            return assumptionValid;
        }
        private bool ApplyFeedbackAlgorithm(ref ConfiguratorSession configSession)
        {
            //Variables
            bool validity = true;

            //Loop through all FeatureSelections
            foreach (BLL.BusinessObjects.FeatureSelection fSelection in configSession.Configuration.FeatureSelections)
            {
                //Determine the state of each Feature - so as to keep the validity of the configuration 
                if (fSelection.ToggledByUser == false)
                {
                    Feature feature = configSession.Model.GetFeatureByID(fSelection.FeatureID);
                    bool CanBeTrue = VerifyAssumption(configSession, feature.SlvMapIdentifier, true);
                    bool CanBeFalse = VerifyAssumption(configSession, feature.SlvMapIdentifier, false);

                    //Feature cannot be false nor true - configuration INVALID  
                    if (!CanBeFalse && !CanBeTrue)
                    {
                        validity = false;
                    }
                    //Feature has to be false - disable and DESELECT
                    else if (!CanBeTrue)
                    {
                        fSelection.SelectionState = BusinessObjects.FeatureSelectionStates.Deselected;
                        fSelection.Disabled = true;
                    }
                    //Feature has to be true - disable and SELECT
                    else if (!CanBeFalse)
                    {
                        fSelection.SelectionState = BusinessObjects.FeatureSelectionStates.Selected;
                        fSelection.Disabled = true;
                    }
                    //Feature can be anything - enable and UNSELECT
                    else if (CanBeFalse && CanBeTrue)
                    {
                        fSelection.SelectionState = BusinessObjects.FeatureSelectionStates.Unselected;
                        fSelection.Disabled = false;
                    }
                }
            }

            //
            return validity;
        }

        private static ISolverStatement TransformToStatement(Z3Context context, BLL.BusinessObjects.Relation relation)
        {
            ISolverStatement returnStatement = null;
            switch (relation.RelationType)
            {
                case BusinessObjects.RelationTypes.Mandatory:
                    returnStatement = context.MakeEquivalence(relation.ParentFeature.SlvMapIdentifier, relation.ChildFeature.SlvMapIdentifier);
                    break;
                case BusinessObjects.RelationTypes.Optional:
                    returnStatement = context.MakeImplies(relation.ChildFeature.SlvMapIdentifier, relation.ParentFeature.SlvMapIdentifier);
                    break;
            }
            return returnStatement;
        }
        private static ISolverStatement TransformToStatement(Z3Context context, BLL.BusinessObjects.GroupRelation groupRelation)
        {
            ISolverStatement returnStatement = null;
            switch (groupRelation.GroupRelationType)
            {
                case BusinessObjects.GroupRelationTypes.OR:
                    ISolverStatement innerOr1 = context.MakeOr(groupRelation.ChildFeatures.Select(k => k.SlvMapIdentifier).ToArray());
                    returnStatement = context.MakeEquivalence(groupRelation.ParentFeature.SlvMapIdentifier, innerOr1);
                    break;

                case BusinessObjects.GroupRelationTypes.XOR:
                    ISolverStatement orStatement = context.MakeOr(groupRelation.ChildFeatures.Select(k => k.SlvMapIdentifier).ToArray());
                    ISolverStatement negatedAnds = context.MakeNegatedAndCombinations(groupRelation.ChildFeatures.Select(k => k.SlvMapIdentifier).ToArray());
                    ISolverStatement equivalence2 = context.MakeEquivalence(groupRelation.ParentFeature.SlvMapIdentifier, orStatement);
                    returnStatement = context.MakeAnd(equivalence2, negatedAnds);
                    break;

                case BusinessObjects.GroupRelationTypes.Cardinal:

                    //Sum value customFunction statement :  >= lowerbound AND <= upperbound
                    List<ISolverStatement> intConversions = new List<ISolverStatement>();
                    groupRelation.ChildFeatures.ForEach(c => intConversions.Add(context.MakeBoolToInt(c.SlvMapIdentifier)));
                    ISolverStatement sumLesserThan = context.MakeLowerOrEqual(context.MakeAdd(intConversions.ToArray()), context.MakeNumeral((int)groupRelation.UpperBound));
                    ISolverStatement sumGreaterThan = context.MakeGreaterOrEqual(context.MakeAdd(intConversions.ToArray()), context.MakeNumeral((int)groupRelation.LowerBound));
                    ISolverStatement sumEqualsZero = context.MakeEquals(context.MakeAdd(intConversions.ToArray()), context.MakeNumeral(0));
                    ISolverStatement sumValStatement = context.MakeAnd(sumLesserThan, context.MakeOr(sumGreaterThan, sumEqualsZero));

                    //Issue - when lowerbound is = 0, the solver does not allow all elements in a groupRelation to be set to 0
                    ISolverStatement orStatement2 = context.MakeOr(groupRelation.ChildFeatures.Select(k => k.SlvMapIdentifier).ToArray());
                    ISolverStatement equivalence3 = context.MakeEquivalence(groupRelation.ParentFeature.SlvMapIdentifier, orStatement2);
                    returnStatement = context.MakeAnd(equivalence3, sumValStatement);
                    break;
            }
            return returnStatement;
        }
        private static ISolverStatement TransformToStatement(Z3Context context, BLL.BusinessObjects.CompositionRule compositionRule)
        {
            ISolverStatement returnStatement = null;
            switch (compositionRule.CompositionRuleType)
            {
                case BusinessObjects.CompositionRuleTypes.Dependency:
                    returnStatement = context.MakeImplies(compositionRule.FirstFeature.SlvMapIdentifier, compositionRule.SecondFeature.SlvMapIdentifier);
                    break;
                case BusinessObjects.CompositionRuleTypes.MutualDependency:
                    returnStatement = context.MakeEquivalence(compositionRule.FirstFeature.SlvMapIdentifier, compositionRule.SecondFeature.SlvMapIdentifier);
                    break;
                case BusinessObjects.CompositionRuleTypes.MutualExclusion:
                    returnStatement = context.MakeExcludes(compositionRule.FirstFeature.SlvMapIdentifier, compositionRule.SecondFeature.SlvMapIdentifier);
                    break;
            }
            return returnStatement;
        }
        private static ISolverStatement TransformToStatement(Z3Context context, BLL.BusinessObjects.CustomFunction customFunction)
        {
            ISolverStatement returnStatement = null;

            return returnStatement;
        }
        

        //Constructors
        public SolverService()
        {
            //
            _ruleParser = new StandardParser();
            _databindParser = new DatabindParser();
        }

        //Public methods  
        public static Z3Context CreateNewContext(BusinessObjects.Model model)
        {
            //Create a new SolverContext
            Z3Context context = new Z3Context();

            //Create variables for Features and Attributes
            foreach (BLL.BusinessObjects.Feature feature in model.Features)
            {
                //Feature
                context.AddVariable(feature.SlvMapIdentifier, VariableDataTypes.Boolean);

                //Attributes
                feature.Attributes.ForEach(attribute =>
                {
                    switch (attribute.AttributeDataType)
                    {
                        case BusinessObjects.AttributeDataTypes.Integer:
                            context.AddVariable(attribute.SlvMapIdentifier, VariableDataTypes.Integer);
                            break;
                        case BusinessObjects.AttributeDataTypes.Boolean:
                            context.AddVariable(attribute.SlvMapIdentifier, VariableDataTypes.Boolean);
                            break;
                        case BusinessObjects.AttributeDataTypes.String:
                            //throw new Exception("String attributes not supported yet");
                            break;
                    }
                });

                //feature.Attributes.ForEach(attribute =>
                //{
                //    if (attribute.AttributeDataType == BusinessObjects.AttributeDataTypes.Integer && !String.IsNullOrEmpty(attribute.ConstantValue))
                //        context.AddImpliedValueAssumption(feature.ID.ToString(), featuresCategory, attribute.ID.ToString(), attributesCategory, VariableDataTypes.Integer, int.Parse(attribute.ConstantValue));
                //});
            }

            //Create customFunctions
            model.Relations.ForEach(rel => context.AddConstraint(rel.SlvMapIdentifier, TransformToStatement(context, rel)));
            model.GroupRelations.ForEach(groupRel => context.AddConstraint(groupRel.SlvMapIdentifier, TransformToStatement(context, groupRel)));
            model.CompositionRules.ForEach(compositionRule => context.AddConstraint(compositionRule.SlvMapIdentifier, TransformToStatement(context, compositionRule)));
            //model.CustomFunctions.ForEach(customFunction => context.AddCustomFunction(customFunction.SlvMapIdentifier, TransformToStatement(context, customFunction)));

            //Create an initial restore point and return the new context
            context.CreateInitialRestorePoint();
            return context;
        }
        public void UserToggleFeature(ref ConfiguratorSession configSession, int featureID, BLL.BusinessObjects.FeatureSelectionStates newState)
        {
            //Modify the selection state of the FeatureSelection matching the given featureID
            FeatureSelection fSelection = configSession.Configuration.GetFeatureSelectionByFeatureID(featureID);
            Feature feature = configSession.Model.GetFeatureByID(featureID);

            switch (newState)
            {
                //Assert-decision  :Selected
                case BusinessObjects.FeatureSelectionStates.Selected:
                    configSession.Context.AddOrModifyValueAssumption(feature.SlvMapIdentifier, VariableDataTypes.Boolean, true);
                    fSelection.SelectionState = BusinessObjects.FeatureSelectionStates.Selected;
                    fSelection.ToggledByUser = true;
                    break;

                //Assert-decision  :Deselected
                case BusinessObjects.FeatureSelectionStates.Deselected:
                    configSession.Context.AddOrModifyValueAssumption(feature.SlvMapIdentifier, VariableDataTypes.Boolean, false);
                    fSelection.SelectionState = BusinessObjects.FeatureSelectionStates.Deselected;
                    fSelection.ToggledByUser = true;
                    break;

                //Retract-decision  :Unselected
                case BusinessObjects.FeatureSelectionStates.Unselected:
                    configSession.Context.RemoveValueAssumption(feature.SlvMapIdentifier);
                    fSelection.SelectionState = BusinessObjects.FeatureSelectionStates.Unselected;
                    fSelection.ToggledByUser = false;
                    break;
            }

            //Call feedback algorithm
            bool decisionIsValid = ApplyFeedbackAlgorithm(ref configSession);
        }
        public object EvalExpression(ref ConfiguratorSession configSession, string expression)
        {
            //Variables
            List<object> resultSet = new List<object>();

            //Evaluate the expression
            IEvalResult[] expResult = _databindParser.EvalExpression(ref configSession, expression);
            if (expResult != null)
            {
                expResult.ToList().ForEach(returnResult =>
                {
                    object obj = returnResult.GetGenericReturnValue();
                    var resultEntry = new
                    {
                        BusinessObject = obj,
                        Type = obj.GetType().Name
                    };

                    resultSet.Add(resultEntry);
                });
            }

            //
            return resultSet;
        }
    }
    public class ConfiguratorSession
    {
        //Fields
        private BusinessObjects.Model _model;
        private Z3Context _context;
        private BusinessObjects.Configuration _configuration;

        //Properties
        public BusinessObjects.Model Model
        {
            get { return _model; }
            set { _model = value; }
        }
        public Z3Context Context
        {
            get { return _context; }
            set { _context = value; }
        }
        public BusinessObjects.Configuration Configuration
        {
            get { return _configuration; }
            set { _configuration = value; }
        }

        //Constructor
        public ConfiguratorSession(BusinessObjects.Model model, BusinessObjects.Configuration configuration, Z3Context context)
        {
            _model = model;
            _context = context;
            _configuration = configuration;
        }

    }
}
