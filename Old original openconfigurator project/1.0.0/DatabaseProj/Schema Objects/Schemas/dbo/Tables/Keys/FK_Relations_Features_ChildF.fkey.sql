ALTER TABLE [dbo].[Relations]
    ADD CONSTRAINT [FK_Relations_Features_ChildF] FOREIGN KEY ([ChildFeatureID]) REFERENCES [dbo].[Features] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

