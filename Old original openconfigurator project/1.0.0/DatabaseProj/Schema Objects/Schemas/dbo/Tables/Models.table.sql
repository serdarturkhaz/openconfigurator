CREATE TABLE [dbo].[Models] (
    [ID]               INT           IDENTITY (1, 1) NOT NULL,
    [UserID]           INT           NOT NULL,
    [Name]             NVARCHAR (50) NULL,
    [CreatedDate]      DATETIME      NULL,
    [LastModifiedDate] DATETIME      NULL
);



