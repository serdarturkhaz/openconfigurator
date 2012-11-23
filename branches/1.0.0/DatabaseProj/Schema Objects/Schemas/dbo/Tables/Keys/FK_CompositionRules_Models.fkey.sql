ALTER TABLE [dbo].[CompositionRules]
    ADD CONSTRAINT [FK_CompositionRules_Models] FOREIGN KEY ([ModelID]) REFERENCES [dbo].[Models] ([ID]) ON DELETE CASCADE ON UPDATE NO ACTION;





