ALTER TABLE [dbo].[Relations]
    ADD CONSTRAINT [FK_Relations_Features_ParentF] FOREIGN KEY ([ParentFeatureID]) REFERENCES [dbo].[Features] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

