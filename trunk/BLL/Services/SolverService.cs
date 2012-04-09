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
                context.AddConstraint(relationsCategory, GetStatement(context, relation));
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
        private static ISolverStatement GetStatement(ISolverContext context, BLL.BusinessObjects.Relation relation)
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
        private static ISolverStatement GetStatement(ISolverContext context, BLL.BusinessObjects.GroupRelation groupRelation)
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
        private static ISolverStatement GetStatement(ISolverContext context, BLL.BusinessObjects.CompositionRule compositionRule)
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
                case BusinessObjects.FeatureSelectionStates.Selected: //Assert-decision
                    configSession.Context.AddValueAssumption(FeatureID.ToString(), featuresCategory, VariableDataTypes.Boolean, true);
                    fSelection.SelectionState = BusinessObjects.FeatureSelectionStates.Selected;
                    fSelection.ToggledByUser = true;
                    break;
                case BusinessObjects.FeatureSelectionStates.Unselected: //Retract-decision
                    configSession.Context.RemoveValueAssumption(FeatureID.ToString(), featuresCategory);
                    fSelection.SelectionState = BusinessObjects.FeatureSelectionStates.Unselected;
                    fSelection.ToggledByUser = false;
                    break;
            }

            //Check whether the model is still satisfiable
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
