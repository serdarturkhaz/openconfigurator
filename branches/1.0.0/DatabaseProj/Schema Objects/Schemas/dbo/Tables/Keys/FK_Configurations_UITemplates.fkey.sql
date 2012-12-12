ALTER TABLE [dbo].[Configurations]
    ADD CONSTRAINT [FK_Configurations_UITemplates] FOREIGN KEY ([UITemplateID]) REFERENCES [dbo].[UITemplates] ([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

