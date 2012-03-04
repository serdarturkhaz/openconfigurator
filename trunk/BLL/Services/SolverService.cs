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
        private ISolverContext InitializeContextFromModel(ref ISolverContext context, BusinessObjects.Model model)
        {
            //Loop through Features
            foreach (BLL.BusinessObjects.Feature feature in model.Features)
            {
                context.AddVariable(feature.Name, feature.ID.ToString(), featuresCategory, VariableDataTypes.Boolean);

                //Loop through Attributes
                foreach (BLL.BusinessObjects.Attribute attribute in feature.Attributes)
                {
                    context.AddVariable(attribute.Name, attribute.ID.ToString(), attributesCategory, VariableDataTypes.Integer);
                }
            }

            //Loop through Relations
            List<ISolverStatement> statementsList = new List<ISolverStatement>();
            foreach (BLL.BusinessObjects.Relation relation in model.Relations)
            {
                context.AddConstraint(relationsCategory, GetStatement(context,relation));
            }

            //Loop through GroupRelations
            foreach (BLL.BusinessObjects.GroupRelation groupRelation in model.GroupRelations)
            {
                context.AddConstraint(groupRelationsCategory, GetStatement(context, groupRelation));
            }

            //Loop through CompositionRules
            foreach (BLL.BusinessObjects.CompositionRule compositionRule in model.CompositionRules)
            {
                context.AddConstraint(compositionRulesCategory, GetStatement(context, compositionRule));
            }


            //Create an initial point
            context.CreateInitialRestorePoint();

            return context;
        }
        private bool GetValidSelections(ISolverContext context, ref List<BLL.BusinessObjects.FeatureSelection> featureSelections)
        {
            //Loop through all FeatureSelections
            foreach (BLL.BusinessObjects.FeatureSelection featureSelection in featureSelections)
            {
                //For those which the user has not set
                if (featureSelection.ToggledByUser == false)
                {
                    bool CanBeTrue = context.CheckSolutionExists(featureSelection.FeatureID.ToString(), featuresCategory, VariableDataTypes.Boolean, true);
                    bool CanBeFalse = context.CheckSolutionExists(featureSelection.FeatureID.ToString(), featuresCategory, VariableDataTypes.Boolean, false);

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

            //

            //
            return true;

        }
        private ISolverStatement GetStatement(ISolverContext context, BLL.BusinessObjects.Relation relation)
        {
            ISolverStatement returnStatement = null;
            switch (relation.RelationType)
            {
                case BusinessObjects.RelationTypes.Mandatory:
                    returnStatement = context.CreateStatement(StatementTypes.Equivalence, featuresCategory, relation.ParentFeatureID.ToString(), relation.ChildFeatureID.ToString());
                    break;
                case BusinessObjects.RelationTypes.Optional:
                    returnStatement = context.CreateStatement(StatementTypes.Implies, featuresCategory, relation.ChildFeatureID.ToString(), relation.ParentFeatureID.ToString());
                    break;
            }
            return returnStatement;
        }
        private ISolverStatement GetStatement(ISolverContext context, BLL.BusinessObjects.GroupRelation groupRelation)
        {
            ISolverStatement returnStatement = null;
            switch (groupRelation.GroupRelationType)
            {
                case BusinessObjects.GroupRelationTypes.OR:
                    ISolverStatement innerOr1 = context.CreateStatement(StatementTypes.Or, featuresCategory, groupRelation.ChildFeatureIDs.Select(k => k.ToString()).ToArray());
                    returnStatement = context.CreateStatement(StatementTypes.Equivalence, featuresCategory, groupRelation.ParentFeatureID.ToString(), innerOr1);
                    break;
                case BusinessObjects.GroupRelationTypes.XOR:
                    ISolverStatement orStatement = context.CreateStatement(StatementTypes.Or, featuresCategory, groupRelation.ChildFeatureIDs.Select(k => k.ToString()).ToArray());
                    ISolverStatement negatedAnds = context.CreateStatement(StatementTypes.NotAndCombinations, featuresCategory, groupRelation.ChildFeatureIDs.Select(k => k.ToString()).ToArray());
                    ISolverStatement equivalence2 = context.CreateStatement(StatementTypes.Equivalence, featuresCategory, groupRelation.ParentFeatureID.ToString(), orStatement);
                    returnStatement = context.CreateStatement(StatementTypes.And, equivalence2, negatedAnds);
                    break;
            }
            return returnStatement;
        }
        private ISolverStatement GetStatement(ISolverContext context, BLL.BusinessObjects.CompositionRule compositionRule)
        {
            ISolverStatement returnStatement = null;
            switch (compositionRule.CompositionRuleType)
            {
                case BusinessObjects.CompositionRuleTypes.Dependency:
                    returnStatement = context.CreateStatement(StatementTypes.Implies, featuresCategory, compositionRule.FirstFeatureID.ToString(), compositionRule.SecondFeatureID.ToString());
                    break;
                case BusinessObjects.CompositionRuleTypes.MutualDependency:
                    returnStatement = context.CreateStatement(StatementTypes.Equivalence, featuresCategory, compositionRule.FirstFeatureID.ToString(), compositionRule.SecondFeatureID.ToString());
                    break;
                case BusinessObjects.CompositionRuleTypes.MutualExclusion:
                    returnStatement = context.CreateStatement(StatementTypes.Excludes, featuresCategory, compositionRule.FirstFeatureID.ToString(), compositionRule.SecondFeatureID.ToString());
                    break;
            }
            return returnStatement;
        }
        
        //Public methods  
        public ISolverContext CreateNewContext(BusinessObjects.Model model)
        {
            ISolverContext context = new Z3Context();
            InitializeContextFromModel(ref context, model);

            return context;
        }
        public bool UserToggleSelection(ISolverContext context, ref List<BLL.BusinessObjects.FeatureSelection> featureSelections, int FeatureID, BLL.BusinessObjects.FeatureSelectionStates newState)
        {
            //Get the FeatureSelection corresponding to the given FeatureID
            BLL.BusinessObjects.FeatureSelection fSelection = featureSelections.First(k => k.FeatureID == FeatureID);

            //Set the bool value in the context and in the appropriate FeatureSelection
            switch (newState)
            {
                case BusinessObjects.FeatureSelectionStates.Selected: //Assert-decision
                    context.AddValueAssumption(FeatureID.ToString(), featuresCategory, VariableDataTypes.Boolean, true);
                    fSelection.SelectionState = BusinessObjects.FeatureSelectionStates.Selected;
                    fSelection.ToggledByUser = true;
                    break;
                case BusinessObjects.FeatureSelectionStates.Unselected: //Retract-decision
                    context.RemoveValueAssumption(FeatureID.ToString(), featuresCategory);
                    fSelection.SelectionState = BusinessObjects.FeatureSelectionStates.Unselected;
                    fSelection.ToggledByUser = false;
                    break;
            }

            //Check whether the model is still satisfiable
            bool decisionIsValid = GetValidSelections(context, ref featureSelections);

            //
            return decisionIsValid;
        }
        public bool ExecuteCustomRule(ISolverContext context, string Expression, ref List<BLL.BusinessObjects.FeatureSelection> featureSelections)
        {
            _ruleParser.ExecuteSyntax(Expression, context, ref featureSelections);
            return false;
        }
    }


}
