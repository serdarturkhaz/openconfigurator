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
        ISolverContext _context;

        //Constructors
        public SolverService(BLL.BusinessObjects.Model model)
        {
            //Create a new SolverEngine
            _engine = new Z3Engine();
            _context = _engine.InitNewContext();

            //Loop through Features
            foreach (BLL.BusinessObjects.Feature feature in model.Features)
            {
                _context.AddBoolVariable(feature.ID.ToString(), feature.Name);
            }

            //Loop through Relations
            foreach (BLL.BusinessObjects.Relation relation in model.Relations)
            {
                switch (relation.RelationType)
                {
                    case BusinessObjects.RelationTypes.Mandatory:
                        _context.AddConstraint(ConstraintTypes.MutualImplication, relation.ParentFeatureID.ToString(), relation.ChildFeatureID.ToString());
                        break;
                    case BusinessObjects.RelationTypes.Optional:
                        _context.AddConstraint(ConstraintTypes.Implies, relation.ChildFeatureID.ToString(), relation.ParentFeatureID.ToString());
                        break;
                }
            }

            //The root feature must always be selected as default
            _context.AssumeBoolVarValue(model.Features[0].ID.ToString(), true);

            ISolverSolution solution = _engine.GetSolution();
            Dictionary<string, bool?> dict = solution.GetAllVariableValues();
        }
        public SolverService(ISolverContext context)
        {
            _context = context;
            _engine = new Z3Engine(_context);
        }

        //Properties
        public ISolverContext Context
        {
            get
            {
                return _context;
            }
        }

        //Methods
        public List<BLL.BusinessObjects.FeatureSelection> GetInitialSelections()
        {
            ISolverSolution solution = _engine.GetSolution();

            return null;
        }
        public List<BLL.BusinessObjects.FeatureSelection> GetConsequences(int modelID, BLL.BusinessObjects.FeatureSelection featureSelection)
        {

            return null;
        }
        
       /* public void TestMethod()
        {
            using (Config config = new Config())
            {
                config.SetParamValue("MODEL", "true"); // corresponds to /m switch 

                using (Context context = new Context(config))
                {
                    Term root = context.MkConst("root", context.MkBoolSort());
                    Term b = context.MkConst("b", context.MkBoolSort());
                    Term c = context.MkConst("c", context.MkBoolSort());

                    //Term xor = context.MkOr(a, b);
                    Term Relation1 = context.MkAnd(root, b);
                    Term Relation2 = context.MkImplies(b, c);

                    //
                    context.AssertCnstr(Relation1);
                    context.AssertCnstr(Relation2);

                    //Assert a = true
                    //Term aTrue = context.MkEq(a, context.MkTrue());
                    context.AssertCnstr(Relation2);

                    Model model = null;
                    LBool result = context.CheckAndGetModel(out model);
                    Console.WriteLine(result);


                    if (model != null)
                    {
                        using (model)
                        {
                            Term r2 = model.Eval(b);
                            Term r3 = model.Eval(c);

                            //bool aVal = model.GetBoolValueBool(model.Eval(a));
                            //bool bVal = model.GetBoolValueBool(model.Eval(b));
                            //Console.WriteLine("a = {0}, b = {1}", aVal, bVal);
                        }
                    }
                }
            }


        }
        */
    }


}
