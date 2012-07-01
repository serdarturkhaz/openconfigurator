ALTER TABLE [dbo].[FeatureSelections]
    ADD CONSTRAINT [FK_FeatureSelections_Configurations] FOREIGN KEY ([ConfigurationID]) REFERENCES [dbo].[Configurations] ([ID]) ON DELETE CASCADE ON UPDATE NO ACTION;

