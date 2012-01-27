using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.Z3;
using System.Linq.Expressions;
using System.IO; 

namespace BLL.Services
{
    public class SolverService 
    {
        //Fields
        private Context _context;

        //Constructors
        public SolverService()
        {
        }

        //Methods
        public Context InitializeContext(int modelID)
        {

            return null;
        }
        
        public void TestMethod()
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
       
    }
}
