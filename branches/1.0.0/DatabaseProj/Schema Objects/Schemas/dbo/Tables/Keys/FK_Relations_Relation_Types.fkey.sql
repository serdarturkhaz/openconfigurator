ALTER TABLE [dbo].[Relations]
    ADD CONSTRAINT [FK_Relations_Relation_Types] FOREIGN KEY ([RelationTypeID]) REFERENCES [dbo].[Relation_Types] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

