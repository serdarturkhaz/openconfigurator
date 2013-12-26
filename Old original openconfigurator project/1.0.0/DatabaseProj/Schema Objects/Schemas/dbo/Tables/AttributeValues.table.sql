CREATE TABLE [dbo].[AttributeValues] (
    [ID]                 INT            IDENTITY (1, 1) NOT NULL,
    [FeatureSelectionID] INT            NOT NULL,
    [AttributeID]        INT            NOT NULL,
    [Value]              NVARCHAR (MAX) NULL
);



