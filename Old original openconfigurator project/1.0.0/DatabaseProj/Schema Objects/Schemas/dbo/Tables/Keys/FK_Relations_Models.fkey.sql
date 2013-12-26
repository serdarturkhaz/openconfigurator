ALTER TABLE [dbo].[Relations]
    ADD CONSTRAINT [FK_Relations_Models] FOREIGN KEY ([ModelID]) REFERENCES [dbo].[Models] ([ID]) ON DELETE CASCADE ON UPDATE NO ACTION;

