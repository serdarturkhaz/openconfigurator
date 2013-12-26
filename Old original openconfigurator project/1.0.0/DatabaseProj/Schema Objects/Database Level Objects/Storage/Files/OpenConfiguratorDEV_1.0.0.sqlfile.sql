ALTER DATABASE [$(DatabaseName)]
    ADD FILE (NAME = [OpenConfiguratorDEV_1.0.0], FILENAME = 'C:\Program Files\Microsoft SQL Server\MSSQL10_50.MSSQLSERVER\MSSQL\DATA\OpenConfiguratorDEV_1.0.0.mdf', SIZE = 3072 KB, FILEGROWTH = 1024 KB) TO FILEGROUP [PRIMARY];

