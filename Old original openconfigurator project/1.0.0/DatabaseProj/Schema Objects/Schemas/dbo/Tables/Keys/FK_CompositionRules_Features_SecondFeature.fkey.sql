ALTER TABLE [dbo].[CompositionRules]
    ADD CONSTRAINT [FK_CompositionRules_Features_SecondFeature] FOREIGN KEY ([SecondFeatureID]) REFERENCES [dbo].[Features] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

