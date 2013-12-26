ALTER TABLE [dbo].[GroupRelations_To_Features]
    ADD CONSTRAINT [FK_GroupRelations_To_Features_ParentFeature] FOREIGN KEY ([ParentFeatureID]) REFERENCES [dbo].[Features] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

