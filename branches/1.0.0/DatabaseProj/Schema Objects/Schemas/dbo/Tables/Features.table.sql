CREATE TABLE [dbo].[Features] (
    [ID]          INT            IDENTITY (1, 1) NOT NULL,
    [ModelID]     INT            NOT NULL,
    [Name]        NVARCHAR (50)  NULL,
    [Description] NVARCHAR (MAX) NULL,
    [IsRoot]      BIT            NULL,
    [XPos]        FLOAT          NULL,
    [YPos]        FLOAT          NULL
);



