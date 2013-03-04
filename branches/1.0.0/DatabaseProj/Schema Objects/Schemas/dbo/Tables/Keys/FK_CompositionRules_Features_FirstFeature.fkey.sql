ALTER TABLE [dbo].[CompositionRules]
    ADD CONSTRAINT [FK_CompositionRules_Features_FirstFeature] FOREIGN KEY ([FirstFeatureID]) REFERENCES [dbo].[Features] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

