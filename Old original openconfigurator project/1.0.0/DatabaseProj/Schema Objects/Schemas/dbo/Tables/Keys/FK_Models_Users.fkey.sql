﻿ALTER TABLE [dbo].[Models]
    ADD CONSTRAINT [FK_Models_Users] FOREIGN KEY ([UserID]) REFERENCES [dbo].[Users] ([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

