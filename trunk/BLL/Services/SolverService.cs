using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.Z3;
using System.Linq.Expressions;
using System.IO;
using BLL.SolverEngines;

namespace BLL.Services
{
    public class SolverService
    {
        //Fields
        ISolverEngine _engine;

        //Constructors
        public SolverService()
        {
            //Create a new SolverEngine
            _engine = new Z3Engine();
        }

        //Private methods
        private ISolverContext InitializeContextFromModel(ref ISolverContext context, BusinessObjects.Model model)
        {
            //Loop through Features
            foreach (BLL.BusinessObjects.Feature feature in model.Features)
            {
                context.AddBoolVariable(feature.ID.ToString(), feature.Name);
            }

            //Loop through Relations
            List<ISolverStatement> statementsList = new List<ISolverStatement>();
            foreach (BLL.BusinessObjects.Relation relation in model.Relations)
            {
                switch (relation.RelationType)
                {
                    case BusinessObjects.RelationTypes.Mandatory:
                        ISolverStatement equivalence1 = context.CreateStatement(StatementTypes.Equivalence, relation.ParentFeatureID.ToString(), relation.ChildFeatureID.ToString());
                        context.AddConstraint(equivalence1);
                        break;
                    case BusinessObjects.RelationTypes.Optional:
                        ISolverStatement implication1 = context.CreateStatement(StatementTypes.Implies, relation.ChildFeatureID.ToString(), relation.ParentFeatureID.ToString());
                        context.AddConstraint(implication1);
                        break;
                }
            }

            //Loop through GroupRelations
            foreach (BLL.BusinessObjects.GroupRelation groupRelation in model.GroupRelations)
            {
                switch (groupRelation.GroupRelationType)
                {
                    case BusinessObjects.GroupRelationTypes.OR:
                        ISolverStatement innerOr1 = context.CreateStatement(StatementTypes.Or, groupRelation.ChildFeatureIDs.Select(k => k.ToString()).ToArray());
                        ISolverStatement equivalence1 = context.CreateStatement(StatementTypes.Equivalence, groupRelation.ParentFeatureID.ToString(), innerOr1);
                        context.AddConstraint(equivalence1);
                        break;
                    case BusinessObjects.GroupRelationTypes.XOR:
                        ISolverStatement xor1 = context.CreateStatement(StatementTypes.Xor, groupRelation.ChildFeatureIDs.Select(k => k.ToString()).ToArray());
                        ISolverStatement implication1 = context.CreateStatement(StatementTypes.Implies, groupRelation.ParentFeatureID.ToString(), xor1);
                        context.AddConstraint(implication1);
                        break;
                }
            }

            //Loop through CompositionRules
            foreach (BLL.BusinessObjects.CompositionRule compositionRule in model.CompositionRules)
            {
                switch (compositionRule.CompositionRuleType)
                {
                    case BusinessObjects.CompositionRuleTypes.Dependency:
                        ISolverStatement implication1 = context.CreateStatement(StatementTypes.Implies, compositionRule.FirstFeatureID.ToString(), compositionRule.SecondFeatureID.ToString());
                        context.AddConstraint(implication1);
                        break;
                    case BusinessObjects.CompositionRuleTypes.MutualDependency:
                        ISolverStatement equivalence1 = context.CreateStatement(StatementTypes.Equivalence, compositionRule.FirstFeatureID.ToString(), compositionRule.SecondFeatureID.ToString());
                        context.AddConstraint(equivalence1);
                        break;
                    case BusinessObjects.CompositionRuleTypes.MutualExclusion:
                        ISolverStatement exclusion1 = context.CreateStatement(StatementTypes.Excludes, compositionRule.FirstFeatureID.ToString(), compositionRule.SecondFeatureID.ToString());
                        context.AddConstraint(exclusion1);
                        break;
                }
            }

            return context;
        }

        //Public methods  
        public ISolverContext CreateNewContext(BusinessObjects.Model model)
        {
            ISolverContext context = _engine.CreateBlankContext();
            InitializeContextFromModel(ref context, model);

            return context;
        }
        public bool UserToggleSelection(ISolverContext context, ref List<BLL.BusinessObjects.FeatureSelection> featureSelections, int FeatureID, BLL.BusinessObjects.FeatureSelectionStates newState)
        {
            //Set the bool value in the context and in the appropriate FeatureSelection
            BLL.BusinessObjects.FeatureSelection fSelection = featureSelections.First(k => k.FeatureID == FeatureID);
            
            switch(newState) {
                case BusinessObjects.FeatureSelectionStates.Selected: //Assert-decision
                    context.AssumeBoolVarValue(FeatureID.ToString(), true, AssumptionTypes.User);
                    fSelection.SelectionState = BusinessObjects.FeatureSelectionStates.Selected;
                    fSelection.ToggledByUser = true;
                    break;
                case BusinessObjects.FeatureSelectionStates.Unselected: //Retract-decision
                    context.ResetBoolVarValue(FeatureID.ToString());
                    fSelection.SelectionState = BusinessObjects.FeatureSelectionStates.Unselected;
                    //fSelection.ToggledByUser = false;
                    break;
            }

            //Check whether the model is still satisfiable
            bool decisionIsValid = GetValidSelections(context, ref featureSelections);

            //
            return decisionIsValid;
        }
        private bool GetValidSelections(ISolverContext context, ref List<BLL.BusinessObjects.FeatureSelection> featureSelections)
        {
            //Loop through all FeatureSelections
            foreach (BLL.BusinessObjects.FeatureSelection featureSelection in featureSelections)
            {
                //For those which the user has not set
                if (featureSelection.ToggledByUser == false)
                {
                    bool CanBeTrue = _engine.CheckSolutionExists(context, featureSelection.FeatureID.ToString(), true);
                    bool CanBeFalse = _engine.CheckSolutionExists(context, featureSelection.FeatureID.ToString(), false);

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
            return true;

        }

    }


}
