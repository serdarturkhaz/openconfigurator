CREATE TABLE [dbo].[FeatureSelections] (
    [ID]               INT IDENTITY (1, 1) NOT NULL,
    [ConfigurationID]  INT NOT NULL,
    [FeatureID]        INT NOT NULL,
    [SelectionStateID] INT NOT NULL,
    [Disabled]         BIT NULL,
    [ToggledByUser]    BIT NULL
);



