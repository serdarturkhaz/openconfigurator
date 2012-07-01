ALTER TABLE [dbo].[GroupRelations_To_Features]
    ADD CONSTRAINT [FK_GroupRelations_To_Features_Features] FOREIGN KEY ([ParentFeatureID]) REFERENCES [dbo].[Features] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;


GO
ALTER TABLE [dbo].[GroupRelations_To_Features] NOCHECK CONSTRAINT [FK_GroupRelations_To_Features_Features];

