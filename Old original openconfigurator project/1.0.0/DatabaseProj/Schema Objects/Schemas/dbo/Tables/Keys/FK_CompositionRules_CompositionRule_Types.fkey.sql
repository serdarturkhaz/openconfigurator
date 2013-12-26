ALTER TABLE [dbo].[CompositionRules]
    ADD CONSTRAINT [FK_CompositionRules_CompositionRule_Types] FOREIGN KEY ([CompositionRuleTypeID]) REFERENCES [dbo].[CompositionRule_Types] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

