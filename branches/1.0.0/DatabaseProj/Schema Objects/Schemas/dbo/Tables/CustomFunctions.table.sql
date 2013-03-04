CREATE TABLE [dbo].[CustomFunctions] (
    [ID]          INT            IDENTITY (1, 1) NOT NULL,
    [ModelID]     INT            NOT NULL,
    [Identifier]  NVARCHAR (50)  NULL,
    [Name]        NVARCHAR (50)  NULL,
    [Expression]  NVARCHAR (MAX) NULL,
    [Description] NVARCHAR (MAX) NULL
);

