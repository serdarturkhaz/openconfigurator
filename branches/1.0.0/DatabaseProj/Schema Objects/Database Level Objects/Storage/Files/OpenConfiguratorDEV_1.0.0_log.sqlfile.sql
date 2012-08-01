ALTER DATABASE [$(DatabaseName)]
    ADD LOG FILE (NAME = [OpenConfiguratorDEV_1.0.0_log], FILENAME = 'C:\Program Files\Microsoft SQL Server\MSSQL10_50.MSSQLSERVER\MSSQL\DATA\OpenConfiguratorDEV_1.0.0_log.ldf', SIZE = 1024 KB, MAXSIZE = 2097152 MB, FILEGROWTH = 10 %);

