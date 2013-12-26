ALTER TABLE [dbo].[CustomFunctions]
    ADD CONSTRAINT [FK_CustomFunctions_Models] FOREIGN KEY ([ModelID]) REFERENCES [dbo].[Models] ([ID]) ON DELETE CASCADE ON UPDATE NO ACTION;

