CREATE TABLE [dbo].[UITemplates] (
    [ID]               INT            IDENTITY (1, 1) NOT NULL,
    [UserID]           INT            NOT NULL,
    [Name]             NVARCHAR (50)  NULL,
    [Content]          NVARCHAR (MAX) NULL,
    [Stylesheet]       NVARCHAR (MAX) NULL,
    [CreatedDate]      DATETIME       NULL,
    [LastModifiedDate] DATETIME       NULL
);



