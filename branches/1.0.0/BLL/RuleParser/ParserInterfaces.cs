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
        public virtual IEvalResult[] Eval(IEvalResult[] parameters) { return null; }
        public virtual IEvalResult[] Eval() { return null; }


        //Factory constructor
        public static ParserStatement CreateInstance(Type statementType, ref ConfiguratorSession configSession, string syntaxString)
        {
            ParserStatement instance = (ParserStatement)Activator.CreateInstance(statementType, null);
            instance._configSession = configSession;
            instance._syntaxString = syntaxString;
            return instance;
        }
    }


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
