ALTER TABLE [dbo].[AttributeValues]
    ADD CONSTRAINT [FK_AttributeValues_FeatureSelections] FOREIGN KEY ([FeatureSelectionID]) REFERENCES [dbo].[FeatureSelections] ([ID]) ON DELETE CASCADE ON UPDATE NO ACTION;

