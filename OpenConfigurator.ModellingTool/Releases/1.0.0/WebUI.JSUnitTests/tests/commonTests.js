/// <reference path="../../qunit/qunit.js" />
/// <reference path="../../jquery/jquery-2.0.3.js" />
/// <reference path="../../sinon/sinon-1.7.3.js" />
/// <reference path="../../sinon/sinon-qunit-1.0.0.js" />
/// <reference path="../../scripts/common.js" />


var sandbox;

//#region Event tests
module('Event', {
    setup: function () {
        sandbox = sinon.sandbox.create();
    },
    teardown: function () {
        sandbox.restore();
    }
});
test("RaiseEvent - WithNoArgs_CallsNotifyEventRaisedOnAttachedEventHandlers", function () {

    //Setup
    var event = new Event();
    var mock = sinon.mock({
        NotifyEventRaised: function () { }
    });
    mock.expects("NotifyEventRaised").once();
    event.AddHandler(mock.object);

    //Act
    event.RaiseEvent();

    //Add handler and raise event
    mock.verify();
});
//#endregion
