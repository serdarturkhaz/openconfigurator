CREATE TABLE [dbo].[Attributes] (
    [ID]              INT            IDENTITY (1, 1) NOT NULL,
    [FeatureID]       INT            NOT NULL,
    [AttributeTypeID] INT            NOT NULL,
    [DataTypeID]      INT            NOT NULL,
    [Identifier]      NVARCHAR (50)  NULL,
    [Name]            NVARCHAR (50)  NULL,
    [Description]     NVARCHAR (MAX) NULL,
    [ConstantValue]   NVARCHAR (50)  NULL
);





