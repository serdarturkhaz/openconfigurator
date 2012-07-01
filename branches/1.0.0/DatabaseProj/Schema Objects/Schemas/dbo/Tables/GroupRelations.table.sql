CREATE TABLE [dbo].[GroupRelations] (
    [ID]                  INT IDENTITY (1, 1) NOT NULL,
    [ModelID]             INT NOT NULL,
    [GroupRelationTypeID] INT NOT NULL,
    [LowerBound]          INT NULL,
    [UpperBound]          INT NULL
);



