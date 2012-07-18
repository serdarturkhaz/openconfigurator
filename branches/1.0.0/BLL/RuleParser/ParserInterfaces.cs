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
    public abstract class SingleValueResultParserStatement : ParserStatement
    {
        public override IEvalResult[] Eval()
        {
            IEvalResult retVal = null;

            // Evaluate the child elements, left and right 
            IEvalResult[] leftSide = base.innerStatements[0].Eval();
            IEvalResult[] rightSide = base.innerStatements[1].Eval();
            if (leftSide.Length == 1 &&
                rightSide.Length == 1)
            {
                retVal = this.SingleEval(leftSide[0], rightSide[0]);
            }
            else
            {
                throw new SyntaxIncorrectException();
            }

            return new IEvalResult[] { retVal };
        }

        public abstract IEvalResult SingleEval(IEvalResult leftSide, IEvalResult rightSide);
    }
    public abstract class SingleStronglyTypedValueResultParserStatement<TLeftSide, TRightSide> : SingleValueResultParserStatement
        where TLeftSide : class, IEvalResult
        where TRightSide : class, IEvalResult
    {
        public override IEvalResult SingleEval(IEvalResult leftSide, IEvalResult rightSide)
        {
            if (leftSide is TLeftSide && rightSide is TRightSide)
            {
                return SingleEvalStronglyTyped(leftSide as TLeftSide, rightSide as TRightSide);
            }
            // else
            throw new SyntaxIncorrectException();
        }

        public abstract IEvalResult SingleEvalStronglyTyped(TLeftSide leftSide, TRightSide rightSide);
    }

    public interface IEvalResult : ICloneable
    {
        object GetGenericReturnValue();
        void SetGenericReturnValue(object obj);
        object Clone();
    }
    public class ValueResult : IEvalResult
    {
        //Fields
        protected object _value;
        //Constructor
        public ValueResult(object value)
        {
            this._value = value;
        }
        public object GetGenericReturnValue()
        {
            return _value;
        }
        public void SetGenericReturnValue(object obj)
        {
            this._value = obj;
        }

        public object Clone()
        {
            //return this.MemberwiseClone();
            return new ValueResult(_value);
        }
    }
    public class ValueResult<T> : ValueResult
    {
        //Fields
        protected T _value;
        //Constructor
        public ValueResult(T value) : base(value) { }
        public void SetValue(T obj)
        {
            SetGenericReturnValue(obj);
        }
        public T GetValue()
        {
            return (T)GetGenericReturnValue();
        }
    }
    public class OutcomeResult : ValueResult<bool>
    {
        public OutcomeResult(bool value) : base(value) { }

        public bool GetOutcome()
        {
            return GetValue();
        }
    }
    public class StringResult : ValueResult<string>
    {
        public StringResult(string value) : base(value) { }

        public string GetString()
        {
            return GetValue();
        }
    }
    public class NumberResult : ValueResult<int>
    {
        public NumberResult(int value) : base(value) { }

        public int GetNumber()
        {
            return GetValue();
        }
    }
    public class FieldReference : IEvalResult
    {
        //Fields
        protected object _objectReference;
        protected string _fieldName;
        protected PropertyInfo _field;

        //Constructor
        public FieldReference(object instance, string fieldName)
        {
            _objectReference = instance;
            _fieldName = fieldName;
            _field = _objectReference.GetType().GetProperty(_fieldName);
        }
        public object GetReference()
        {
            return _objectReference;
        }
        public object GetGenericReturnValue()
        {
            return _field.GetValue(_objectReference, null);
        }
        public void SetGenericReturnValue(object obj)
        {
            PropertyInfo field = _objectReference.GetType().GetProperty(_fieldName);
            Type fieldType = field.PropertyType;

            field.SetValue(_objectReference, obj.ToString(), null);
        }
        public object Clone()
        {
            return this.MemberwiseClone();
        }
    } // attribute/property referece referece
    public class FieldReference<T> : FieldReference
    {
        //Constructor
        public FieldReference(object instance, string fieldName)
            : base(instance, fieldName)
        {
            if (_field.PropertyType != typeof(T))
                throw new ArgumentException("The field reference type {0} does not match actual type of {}");
        }
        public void SetValue(T newValue)
        {
            SetGenericReturnValue(newValue);
        }
        public T GetValue()
        {
            return (T)GetGenericReturnValue();
        }
    } // attribute/property referece referece
    public class ObjectReference : IEvalResult
    {
        //Fields
        object _objectReference;

        //Constructor
        public ObjectReference(ref object instance)
        {
            // TODO: remove the ref
            _objectReference = instance;
        }
        //Methods
        public object GetReference()
        {
            return _objectReference;
        }
        public object GetGenericReturnValue()
        {
            return GetReference();
        }
        public void SetGenericReturnValue(object obj)
        {
            _objectReference = obj;
        }
        public object Clone()
        {
            return this.MemberwiseClone();
        }
    } // feature/node referece

    //Exceptions
    public class ElementNotFoundException : Exception
    {

    }
    public class SyntaxIncorrectException : Exception
    {

    }
}
