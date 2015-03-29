// Settings and defaults
var CLOTypes = {
    ConfigurationInstance: "ConfigurationInstance",
    FeatureSelection: "FeatureSelection",
    AttributeValue: "AttributeValue"
}
var Enums = {
    AttributeTypes: {
        Constant: 0,
        Dynamic: 1,
        UserInput: 2
    },
    AttributeDataTypes: {
        Integer: 0,
        Boolean: 1,
        String: 2
    },
    RelationTypes: {
        Mandatory: 0,
        Optional: 1,
        Cloneable: 2
    },
    GroupRelationTypes: {
        OR: 0,
        XOR: 1,
        Cardinal: 2
    },
    CompositionRuleTypes: {
        Dependency: 0,
        MutualDependency: 1,
        MutualExclusion: 2
    },
    FeatureSelectionStates: {
        Selected: 0,
        Deselected: 1,
        Unselected: 2
    }
}
