ALTER TABLE [dbo].[GroupRelations]
    ADD CONSTRAINT [FK_GroupRelations_GroupRelation_Types] FOREIGN KEY ([GroupRelationTypeID]) REFERENCES [dbo].[GroupRelation_Types] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

