ALTER TABLE [dbo].[GroupRelations_To_Features]
    ADD CONSTRAINT [FK_GroupRelations_To_Features_GroupRelations] FOREIGN KEY ([GroupRelationID]) REFERENCES [dbo].[GroupRelations] ([ID]) ON DELETE CASCADE ON UPDATE NO ACTION;

