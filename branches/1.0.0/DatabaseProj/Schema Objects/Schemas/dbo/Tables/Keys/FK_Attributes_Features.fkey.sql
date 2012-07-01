ALTER TABLE [dbo].[Attributes]
    ADD CONSTRAINT [FK_Attributes_Features] FOREIGN KEY ([FeatureID]) REFERENCES [dbo].[Features] ([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

