ALTER TABLE [dbo].[Constraints]
    ADD CONSTRAINT [FK_Constraints_Models] FOREIGN KEY ([ModelID]) REFERENCES [dbo].[Models] ([ID]) ON DELETE CASCADE ON UPDATE NO ACTION;