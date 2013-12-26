ALTER TABLE [dbo].[Attributes]
    ADD CONSTRAINT [FK_Attributes_Attribute_DataTypes] FOREIGN KEY ([DataTypeID]) REFERENCES [dbo].[Attribute_DataTypes] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

