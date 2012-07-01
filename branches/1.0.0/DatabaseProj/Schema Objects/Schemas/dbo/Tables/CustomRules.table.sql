CREATE TABLE [dbo].[CustomRules] (
    [ID]          INT            IDENTITY (1, 1) NOT NULL,
    [ModelID]     INT            NOT NULL,
    [Name]        NVARCHAR (50)  NULL,
    [Expression]  NVARCHAR (MAX) NULL,
    [Description] NVARCHAR (MAX) NULL
);



