CREATE TABLE [dbo].[GroupRelations_To_Features] (
    [ID]              INT IDENTITY (1, 1) NOT NULL,
    [GroupRelationID] INT NOT NULL,
    [ParentFeatureID] INT NOT NULL,
    [ChildFeatureID]  INT NOT NULL
);



