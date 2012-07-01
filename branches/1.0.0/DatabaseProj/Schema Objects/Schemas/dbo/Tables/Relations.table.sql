CREATE TABLE [dbo].[Relations] (
    [ID]              INT IDENTITY (1, 1) NOT NULL,
    [ModelID]         INT NOT NULL,
    [RelationTypeID]  INT NOT NULL,
    [ParentFeatureID] INT NOT NULL,
    [ChildFeatureID]  INT NOT NULL,
    [LowerBound]      INT NULL,
    [UpperBound]      INT NULL
);



