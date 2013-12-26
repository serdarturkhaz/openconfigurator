ALTER TABLE [dbo].[Configurations]
    ADD CONSTRAINT [FK_Configurations_Models] FOREIGN KEY ([ModelID]) REFERENCES [dbo].[Models] ([ID]) ON DELETE CASCADE ON UPDATE NO ACTION;

