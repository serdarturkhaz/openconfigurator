CREATE TABLE [dbo].[CompositionRules] (
    [ID]                    INT            IDENTITY (1, 1) NOT NULL,
    [ModelID]               INT            NOT NULL,
    [CompositionRuleTypeID] INT            NOT NULL,
    [FirstFeatureID]        INT            NOT NULL,
    [SecondFeatureID]       INT            NOT NULL,
    [Name]                  NVARCHAR (50)  NULL,
    [Description]           NVARCHAR (MAX) NULL
);



