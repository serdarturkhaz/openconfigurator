/*#region Observables*/
var ObservableCollection = function () {

    // Fields
    var _innerArray = [];
    var _this = this;

    // Properties
    this.GetLength = function () {
        return _innerArray.length;
    }

    // Public methods
    this.Add = function (object) {

        // Raise pre-event
        var eventRaiseDetails = _this.Adding.RaiseEvent(object);

        // If no handlers cancelled the pre-event
        if (eventRaiseDetails.CancelTriggered() === false) {
            _innerArray.push(object)

            // Raise post-event
            _this.Added.RaiseEvent(object);
        }
    }
    this.RemoveAt = function (index) {
        var removedObject = _innerArray[index];
        _innerArray.splice(index, 1);
        _this.Removed.RaiseEvent(removedObject);
    }
    this.Remove = function (obj) {
        for (var index = 0; index < _innerArray.length; index++) {
            if (_innerArray[index] === obj) {
                break;
            }
        }

        _this.RemoveAt(index);
    }
    this.GetAt = function (index) {
        return _innerArray[index];
    }
    this.GetByCustomField = function (fieldName, fieldValue) {
        var object = null;
        for (var i = 0; i < _innerArray; i++) {

        }
        return object;
    }
    this.ToArray = function () {
        return _innerArray.splice();
    }

    // Events
    this.Adding = new Event();
    this.Added = new Event();
    this.Removed = new Event();
}
var ObservableField = function (sourceFieldParent, sourceFieldName) { // can also be called without parameters, then it just creates a simple koObservable

    // Variables
    var koObservable;

    // Implicit constructor logic
    if (sourceFieldParent !== undefined && sourceFieldName !== undefined) {
        var koObservable = ko.observable(sourceFieldParent[sourceFieldName]); // set the initial value for the koObservable to be that of the source field
        koObservable.subscribe(function (newVal) { // bind the koObs so it updates the value of the source field whenever it is changed itself
            sourceFieldParent[sourceFieldName] = newVal;
        });
    } else { 
        koObservable = ko.observable();
    }

    // Setup extra stuff
    koObservable.Changed = new Event();
    koObservable.subscribe(function (newVal) { 
        koObservable.Changed.RaiseEvent(newVal);
    });


    return koObservable;
}
/*#endregion*/
/*#region Events*/
var Event = function () {

    // Fields
    var _handlers = [];
    var _suppressionEnabled = false;
    var _this = this;

    // Methods
    this.AddHandler = function (handler) {

        _handlers.push(handler);
    }
    this.RaiseEvent = function () { // can be called with any number of arbitrary arguments (both as an array: [arg1, arg2] or directly as: arg1,arg2)

        // Get the arguments and place them in an array.
        var argsArray;
        if (arguments.length === 1 && $.isArray(arguments[0])) {
            argsArray = arguments[0]; // passed as array ([arg1, arg2])
        } else {
            argsArray = Array.prototype.slice.call(arguments, 0); // passed directly (arg1,arg2)
        }

        // Call each of the handlers, if event suppresion is not enabled 
        var eventRaiseObj = new EventRaiseDetails();
        if (_suppressionEnabled === false) {
            for (var i = 0; i < _handlers.length; i++) {
                _handlers[i].NotifyEventRaised.call(null, argsArray, eventRaiseObj);
            }
        }

        // Return the eventRaiseDetails object associated with this event raise
        return eventRaiseObj;
    }
    this.SetNotificationSuppresion = function (bool) { // allows to supress sending notifications to handlers when the event is raised
        _suppressionEnabled = bool;
    }
    this.RemoveAllHandlers = function () {
        _handlers = {};
    }
    this.RemoveHandler = function (name) {
        for (var i = 0; i < _handlers.length; i++) {
            if (_handlers[i].GetName() === name) {
                _handlers.splice(i, 1);
            }
        }
    }
}
var EventHandler = function (func, name) {

    // Fields
    var _func = func, _name = name;
    var _this = this;

    // Properties
    this.GetName = function () {
        if (_name !== undefined) {
            return _name;
        } else {
            return null;
        }
    }

    // Methods
    this.NotifyEventRaised = function (argsArray, eventRaiseObj) {

        // Variables
        var mergedArgs = argsArray.slice(0);
        mergedArgs.push(eventRaiseObj);

        // Call function
        _func.apply(this, mergedArgs); // the event raise object is passed as an extra argument
    }
}
var EventRaiseDetails = function () {

    // Fields
    var _cancelled = false;
    var _this = this;

    // Propertes
    this.CustomArguments = {}; // can be used for passing data between multiple event handlers, as well as from a pre-event handler to a post-event handler
    this.CancelTriggered = function () {
        return _cancelled;
    }

    // Methods
    this.TriggerCancel = function () {
        _cancelled = true;
    }
}
/*#endregion*/
/*#region States*/
var InnerStateManager = function (targetStatesReference, initialStateName, targetChangedEvent) {

    // Fields
    var _targetStatesReference = targetStatesReference, _initialStateName = initialStateName;
    var _targetChangedEvent = targetChangedEvent;
    var _currentStateName = null;
    var _this = this;

    // Init
    this.Initialize = function () {

        // Enter the initial state
        _currentStateName = _initialStateName;
        var currentState = targetStatesReference[_currentStateName];
        currentState.EnterState();
    }

    // Public methods
    this.GetCurrentStateName = function () {
        return _currentStateName;
    }
    this.SwitchToState = function (newStateName) {

        // Switch to the new state, as long as it is not the same
        if (newStateName !== _currentStateName) {

            // Remember the old UI state and set the new
            var oldStateName = _currentStateName;

            // Leave the old state and enter the new one
            var oldState = _targetStatesReference[oldStateName];
            var newState = _targetStatesReference[newStateName];
            oldState.LeaveState();
            _currentStateName = newStateName;
            newState.EnterState();

            // Raise target "changed" event, if one is provided
            if (_targetChangedEvent !== undefined && _targetChangedEvent !== null) {
                _targetChangedEvent.RaiseEvent(oldStateName, newStateName);
            }
        }
    }
}
/*#endregion*/

