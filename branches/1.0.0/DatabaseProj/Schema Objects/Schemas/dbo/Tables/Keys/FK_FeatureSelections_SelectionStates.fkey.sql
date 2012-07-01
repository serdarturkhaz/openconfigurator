ALTER TABLE [dbo].[FeatureSelections]
    ADD CONSTRAINT [FK_FeatureSelections_SelectionStates] FOREIGN KEY ([SelectionStateID]) REFERENCES [dbo].[SelectionStates] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

