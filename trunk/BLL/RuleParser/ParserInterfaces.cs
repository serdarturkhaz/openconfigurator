using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using BLL.SolverEngines;
using System.Text.RegularExpressions;
using System.Reflection;

namespace BLL.RuleParser
{
    public interface IParser
    {
        bool ExecuteCustomRule(string RuleSyntax, ISolverContext context, ref List<BLL.BusinessObjects.FeatureSelection> featureSelections);
    }
    public abstract class ParserStatement
    {
        //Fields
        protected string _syntaxString = "";
        protected List<ParserStatement> innerStatements = new List<ParserStatement>();
        protected ISolverContext _context;
        protected List<BLL.BusinessObjects.FeatureSelection> featureSelections;

        //Methods
        public virtual void AddInnerStatement(ParserStatement statement)
        {
            innerStatements.Add(statement);
        }
        public abstract object Eval();

        //Factory constructor
        public static ParserStatement CreateInstance(Type statementType, string syntaxString, ISolverContext context, ref List<BLL.BusinessObjects.FeatureSelection> featureSelections)
        {
            ParserStatement instance = (ParserStatement)Activator.CreateInstance(statementType, null);
            instance._syntaxString = syntaxString;
            instance._context = context;
            instance.featureSelections = featureSelections;
            return instance;
        }
    }
    public class ObjectReference
    {
        //
        object targetInstance;
        string fieldName;

        //Constructor
        public ObjectReference(ref object instance, string field)
        {
            targetInstance = instance;
            fieldName = field;
        }

        //Methods
        private static object ConvertValue(object valToConvert, Type destinationType)
        {
            //Get the current type
            Type currentType = valToConvert.GetType();

            //Int to String
            if (destinationType.Name == "String" && currentType.Name == "Int32")
            {
                return valToConvert.ToString();
            }

            return null;
        }
        public void SetValue(object newValue)
        {
            PropertyInfo field = targetInstance.GetType().GetProperty(fieldName);
            Type fieldType = field.PropertyType;

            field.SetValue(targetInstance, (string)ConvertValue(newValue, fieldType), null);
        }
    }
    public enum StatementEvalTypes
    {
        Feature,
        Attribute,
        PrimitiveValue
    }

}
