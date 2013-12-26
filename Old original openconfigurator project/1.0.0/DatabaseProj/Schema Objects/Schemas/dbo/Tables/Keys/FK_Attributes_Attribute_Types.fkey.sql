ALTER TABLE [dbo].[Attributes]
    ADD CONSTRAINT [FK_Attributes_Attribute_Types] FOREIGN KEY ([AttributeTypeID]) REFERENCES [dbo].[Attribute_Types] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

