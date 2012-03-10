using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using BLL.SolverEngines;
using System.Text.RegularExpressions;
using System.Reflection;
using BLL.Services;

namespace BLL.RuleParser
{
    public interface IParser
    {
        bool ExecuteSyntax(ref ConfiguratorSession configSession, string RuleSyntax);
    }
    public abstract class ParserStatement
    {
        //Fields
        protected string _syntaxString = "";
        protected List<ParserStatement> innerStatements = new List<ParserStatement>();
        protected ConfiguratorSession _configSession;

        //Methods
        public virtual void AddInnerStatement(ParserStatement statement)
        {
            innerStatements.Add(statement);
        }
        public virtual IEvalResult Eval(IEvalResult[] parameters) { return null; }
        public virtual IEvalResult Eval() { return null; }


        //Factory constructor
        public static ParserStatement CreateInstance(Type statementType, ref ConfiguratorSession configSession, string syntaxString)
        {
            ParserStatement instance = (ParserStatement)Activator.CreateInstance(statementType, null);
            instance._configSession = configSession;
            instance._syntaxString = syntaxString;
            return instance;
        }
    }

    ////Helper classes
    //public class ObjectReference
    //{
    //    //Fields
    //    object targetInstance;
    //    string fieldName;

    //    //Constructor
    //    public ObjectReference(ref object instance, string field)
    //    {
    //        targetInstance = instance;
    //        fieldName = field;
    //    }
    //    public ObjectReference(ref object instance)
    //    {
    //        targetInstance = instance;
    //        fieldName = null;
    //    }

    //    //Methods
    //    private static object ConvertValue(object valToConvert, Type destinationType)
    //    {
    //        //Get the current type
    //        Type currentType = valToConvert.GetType();

    //        //Int to String
    //        if (destinationType.Name == "String" && currentType.Name == "Int32")
    //        {
    //            return valToConvert.ToString();
    //        }

    //        return null;
    //    }
    //    public object GetTargetObject()
    //    {
    //        return targetInstance;
    //    }
    //    public void SetValue(object newValue)
    //    {
    //        PropertyInfo field = targetInstance.GetType().GetProperty(fieldName);
    //        Type fieldType = field.PropertyType;

    //        field.SetValue(targetInstance, (string)ConvertValue(newValue, fieldType), null);
    //    }
    //}

    public interface IEvalResult
    {

    }
    public class ValueResult : IEvalResult
    {
        //Fields
        object _value;

        //Constructor
        public ValueResult(object value)
        {
            _value = value;
        }

        //Methods
        public object GetValue()
        {
            return _value;
        }
    }
    public class FieldReference : IEvalResult
    {
        //Fields
        object _objectReference;
        string _fieldName;

        //Constructor
        public FieldReference(ref object instance, string fieldName)
        {
            _objectReference = instance;
            _fieldName = fieldName;
        }

        //Methods
        private static object ConvertValue(object valToConvert, Type destinationType)
        {
            //Get the current type
            Type currentType = valToConvert.GetType();

            //Int to String
            if (currentType.Name == "Int32" && destinationType.Name == "String")
            {
                return valToConvert.ToString();
            }

            //String to String
            if (currentType.Name == "String" && destinationType.Name == "String")
            {
                return valToConvert;
            }

            return null;
        }
        public object GetValue()
        {
            PropertyInfo field = _objectReference.GetType().GetProperty(_fieldName);
            Type fieldType = field.PropertyType;

            return field.GetValue(_objectReference, null);
        }
        public void SetValue(object newValue)
        {
            PropertyInfo field = _objectReference.GetType().GetProperty(_fieldName);
            Type fieldType = field.PropertyType;

            field.SetValue(_objectReference, (string)ConvertValue(newValue, fieldType), null);
        }
        public object GetReference()
        {
            return _objectReference;
        }
    }
    public class ObjectReference : IEvalResult
    {
        //Fields
        object _objectReference;

        //Constructor
        public ObjectReference(ref object instance)
        {
            _objectReference = instance;
        }

        //Methods
        public object GetReference()
        {
            return _objectReference;
        }
    }
    public class OutcomeResult : IEvalResult
    {
        //Fields
        bool _outcome;

        //Constructor
        public OutcomeResult(bool outcome)
        {
            _outcome = outcome;
        }

        //Methods
        public bool GetOutcome()
        {
            return _outcome;
        }
    }
   
    //Exceptions
    public class ElementNotFoundException : Exception
    {

    }
    public class SyntaxIncorrectException : Exception
    {

    }
}
