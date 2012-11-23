CREATE TABLE [dbo].[UITemplates] (
    [ID]               INT            IDENTITY (1, 1) NOT NULL,
    [UserID]           INT            NOT NULL,
    [Name]             NCHAR (50)     NULL,
    [Content]          NVARCHAR (MAX) NULL,
    [CreatedDate]      DATETIME       NULL,
    [LastModifiedDate] DATETIME       NULL
);

