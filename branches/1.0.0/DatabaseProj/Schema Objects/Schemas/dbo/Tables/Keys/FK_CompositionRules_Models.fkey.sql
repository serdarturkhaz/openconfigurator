ALTER TABLE [dbo].[CompositionRules]
    ADD CONSTRAINT [FK_CompositionRules_Models] FOREIGN KEY ([ModelID]) REFERENCES [dbo].[Models] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;



