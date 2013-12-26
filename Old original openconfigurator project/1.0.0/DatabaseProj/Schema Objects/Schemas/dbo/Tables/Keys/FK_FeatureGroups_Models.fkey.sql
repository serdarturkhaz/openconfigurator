ALTER TABLE [dbo].[GroupRelations]
    ADD CONSTRAINT [FK_FeatureGroups_Models] FOREIGN KEY ([ModelID]) REFERENCES [dbo].[Models] ([ID]) ON DELETE CASCADE ON UPDATE NO ACTION;

