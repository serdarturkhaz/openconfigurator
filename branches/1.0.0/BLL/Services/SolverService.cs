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
using BLL.RuleParser;

namespace BLL.Services
{
    public class SolverService
    {
        //Fields
        IParser _ruleParser;
        const string featuresCategory = "Features", attributesCategory = "Attributes", relationsCategory = "Relations",
            groupRelationsCategory = "GroupRelations", compositionRulesCategory = "CompositionRules";

        //Constructors
        public SolverService()
        {
            //Create a new SolverEngine
            _ruleParser = new StandardParser();
        }

        //Private methods
        private static ISolverContext InitializeContextFromModel(BusinessObjects.Model model)
        {
            //Return val
            ISolverContext context = new Z3Context();

            //Handle Features and Attributes
            foreach (BLL.BusinessObjects.Feature feature in model.Features)
            {
                //Add variable for Feature
                context.AddVariable(feature.Name, feature.ID.ToString(), featuresCategory, VariableDataTypes.Boolean);

                //Add variables for its Attributes
                feature.Attributes.ForEach(attribute => context.AddVariable(attribute.Name, attribute.ID.ToString(), attributesCategory, VariableDataTypes.Integer));
            }

            //Handle Relations, GroupRelations and CompositionRules
            model.Relations.ForEach(rel => context.AddConstraint(relationsCategory, TransformToStatement(context, rel)));
            model.GroupRelations.ForEach(groupRel => context.AddConstraint(groupRelationsCategory, TransformToStatement(context, groupRel)));
            model.CompositionRules.ForEach(compositionRule => context.AddConstraint(compositionRulesCategory, TransformToStatement(context, compositionRule)));

            //Create an initial restore point
            context.CreateInitialRestorePoint();
            return context;
        }
        private bool ExecuteCustomRule(ref ConfiguratorSession configSession, string Expression)
        {
            return _ruleParser.ExecuteSyntax(ref configSession, Expression);
        }
        private bool GetValidSelections(ref ConfiguratorSession configSession)
        {
            //Loop through all FeatureSelections
            foreach (BLL.BusinessObjects.FeatureSelection featureSelection in configSession.Configuration.FeatureSelections)
            {
                //Only FeatureSelections which have not been explicitly toggled by the user
                if (featureSelection.ToggledByUser == false)
                {
                    bool CanBeTrue = configSession.Context.CheckSolutionExists(featureSelection.FeatureID.ToString(), featuresCategory, VariableDataTypes.Boolean, true);
                    bool CanBeFalse = configSession.Context.CheckSolutionExists(featureSelection.FeatureID.ToString(), featuresCategory, VariableDataTypes.Boolean, false);

                    //Cannot be true nor false
                    if (!CanBeFalse && !CanBeTrue)
                    {
                        return false;
                    }
                    //Cannot be true
                    else if (!CanBeTrue)
                    {
                        featureSelection.SelectionState = BusinessObjects.FeatureSelectionStates.Deselected;
                        featureSelection.Disabled = true;
                    }
                    //Cannot be false
                    else if (!CanBeFalse)
                    {
                        featureSelection.SelectionState = BusinessObjects.FeatureSelectionStates.Selected;
                        featureSelection.Disabled = true;
                    }
                    //Can be true or false
                    else if (CanBeFalse && CanBeTrue)
                    {
                        featureSelection.SelectionState = BusinessObjects.FeatureSelectionStates.Unselected;
                        featureSelection.Disabled = false;
                    }
                }
            }

            //Loop through CustomRUles
            foreach (BLL.BusinessObjects.CustomRule customRule in configSession.Model.CustomRules)
            {
                ExecuteCustomRule(ref configSession, customRule.Expression);
            }


            //
            return true;

        }

        private static ISolverStatement TransformToStatement(ISolverContext context, BLL.BusinessObjects.Relation relation)
        {
            ISolverStatement returnStatement = null;
            switch (relation.RelationType)
            {
                case BusinessObjects.RelationTypes.Mandatory:
                    returnStatement = context.MakeEquivalence(featuresCategory, relation.ParentFeatureID.ToString(), relation.ChildFeatureID.ToString());
                    break;
                case BusinessObjects.RelationTypes.Optional:
                    returnStatement = context.MakeImplies(featuresCategory, relation.ChildFeatureID.ToString(), relation.ParentFeatureID.ToString());
                    break;
            }
            return returnStatement;
        }
        private static ISolverStatement TransformToStatement(ISolverContext context, BLL.BusinessObjects.GroupRelation groupRelation)
        {
            ISolverStatement returnStatement = null;
            switch (groupRelation.GroupRelationType)
            {
                case BusinessObjects.GroupRelationTypes.OR:
                    ISolverStatement innerOr1 = context.MakeOr(featuresCategory, groupRelation.ChildFeatureIDs.Select(k => k.ToString()).ToArray());
                    returnStatement = context.MakeEquivalence(featuresCategory, groupRelation.ParentFeatureID.ToString(), innerOr1);
                    break;
                case BusinessObjects.GroupRelationTypes.XOR:
                    ISolverStatement orStatement = context.MakeOr(featuresCategory, groupRelation.ChildFeatureIDs.Select(k => k.ToString()).ToArray());
                    ISolverStatement negatedAnds = context.MakeNotAndCombinations(featuresCategory, groupRelation.ChildFeatureIDs.Select(k => k.ToString()).ToArray());
                    ISolverStatement equivalence2 = context.MakeEquivalence(featuresCategory, groupRelation.ParentFeatureID.ToString(), orStatement);
                    returnStatement = context.MakeAnd(equivalence2, negatedAnds);
                    break;
                case BusinessObjects.GroupRelationTypes.Cardinal:

                    //Sum value constraint statement :  >= lowerbound AND <= upperbound
                    List<ISolverStatement> intConversions = new List<ISolverStatement>();
                    groupRelation.ChildFeatureIDs.ForEach(childFeatureID => intConversions.Add(context.MakeBoolToInt(childFeatureID.ToString(), featuresCategory)));
                    ISolverStatement sumLesserThan = context.MakeLowerOrEqual(context.MakeAdd(intConversions.ToArray()), context.MakeNumeral((int)groupRelation.UpperBound));
                    ISolverStatement sumGreaterThan = context.MakeGreaterOrEqual(context.MakeAdd(intConversions.ToArray()), context.MakeNumeral((int)groupRelation.LowerBound));
                    ISolverStatement sumEqualsZero = context.MakeEquals(context.MakeAdd(intConversions.ToArray()), context.MakeNumeral(0));
                    ISolverStatement sumValStatement = context.MakeAnd(sumLesserThan, context.MakeOr(sumGreaterThan, sumEqualsZero));

                    //
                    ISolverStatement orStatement2 = context.MakeOr(featuresCategory, groupRelation.ChildFeatureIDs.Select(k => k.ToString()).ToArray());
                    ISolverStatement equivalence3 = context.MakeEquivalence(featuresCategory, groupRelation.ParentFeatureID.ToString(), orStatement2);

                    returnStatement = context.MakeAnd(equivalence3, sumValStatement);
                    break;
            }
            return returnStatement;
        }
        private static ISolverStatement TransformToStatement(ISolverContext context, BLL.BusinessObjects.CompositionRule compositionRule)
        {
            ISolverStatement returnStatement = null;
            switch (compositionRule.CompositionRuleType)
            {
                case BusinessObjects.CompositionRuleTypes.Dependency:
                    returnStatement = context.MakeImplies(featuresCategory, compositionRule.FirstFeatureID.ToString(), compositionRule.SecondFeatureID.ToString());
                    break;
                case BusinessObjects.CompositionRuleTypes.MutualDependency:
                    returnStatement = context.MakeEquivalence(featuresCategory, compositionRule.FirstFeatureID.ToString(), compositionRule.SecondFeatureID.ToString());
                    break;
                case BusinessObjects.CompositionRuleTypes.MutualExclusion:
                    returnStatement = context.MakeExcludes(featuresCategory, compositionRule.FirstFeatureID.ToString(), compositionRule.SecondFeatureID.ToString());
                    break;
            }
            return returnStatement;
        }

        //Public methods  
        public static ISolverContext CreateNewContext(BusinessObjects.Model model)
        {
            ISolverContext context = InitializeContextFromModel(model);

            return context;
        }
        public bool UserToggleSelection(ref ConfiguratorSession configSession, int FeatureID, BLL.BusinessObjects.FeatureSelectionStates newState)
        {
            //Get the FeatureSelection corresponding to the given FeatureID
            BLL.BusinessObjects.FeatureSelection fSelection = configSession.Configuration.FeatureSelections.First(k => k.FeatureID == FeatureID);

            //Set the bool value in the context and in the appropriate FeatureSelection
            switch (newState)
            {
                case BusinessObjects.FeatureSelectionStates.Selected: //Assert-decision  :Selected
                    configSession.Context.AddOrModifyValueAssumption(FeatureID.ToString(), featuresCategory, VariableDataTypes.Boolean, true);
                    fSelection.SelectionState = BusinessObjects.FeatureSelectionStates.Selected;
                    fSelection.ToggledByUser = true;
                    break;
                case BusinessObjects.FeatureSelectionStates.Deselected: //Assert-decision  :Deselected
                    configSession.Context.AddOrModifyValueAssumption(FeatureID.ToString(), featuresCategory, VariableDataTypes.Boolean, false);
                    fSelection.SelectionState = BusinessObjects.FeatureSelectionStates.Deselected;
                    fSelection.ToggledByUser = true;
                    break;
                case BusinessObjects.FeatureSelectionStates.Unselected: //Retract-decision  :Unselected
                    configSession.Context.RemoveValueAssumption(FeatureID.ToString(), featuresCategory);
                    fSelection.SelectionState = BusinessObjects.FeatureSelectionStates.Unselected;
                    fSelection.ToggledByUser = false;
                    break;
            }

            //Make changes so that the user cannot break the validity of the model in the next change
            bool decisionIsValid = GetValidSelections(ref configSession);

            //
            return decisionIsValid;
        }
    }
    public class ConfiguratorSession
    {
        //Fields
        private BusinessObjects.Model _model;
        private ISolverContext _context;
        private BusinessObjects.Configuration _configuration;

        //Properties
        public BusinessObjects.Model Model
        {
            get { return _model; }
            set { _model = value; }
        }
        public ISolverContext Context
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
        public ConfiguratorSession(BusinessObjects.Model model, BusinessObjects.Configuration configuration, ISolverContext context)
        {
            _model = model;
            _context = context;
            _configuration = configuration;
        }

    }
}
