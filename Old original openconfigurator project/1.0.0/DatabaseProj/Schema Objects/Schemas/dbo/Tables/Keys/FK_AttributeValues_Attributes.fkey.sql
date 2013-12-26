ALTER TABLE [dbo].[AttributeValues]
    ADD CONSTRAINT [FK_AttributeValues_Attributes] FOREIGN KEY ([AttributeID]) REFERENCES [dbo].[Attributes] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;


GO
ALTER TABLE [dbo].[AttributeValues] NOCHECK CONSTRAINT [FK_AttributeValues_Attributes];

