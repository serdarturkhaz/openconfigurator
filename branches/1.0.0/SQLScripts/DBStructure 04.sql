USE [OpenConfigurator_DEV]
GO
/****** Object:  Table [dbo].[Rule_Types]    Script Date: 12/15/2011 23:47:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Rule_Types](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](50) NULL,
 CONSTRAINT [PK_Rule_Types] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[Rule_Types] ON
INSERT [dbo].[Rule_Types] ([ID], [Name]) VALUES (1, N'Composition Rules')
INSERT [dbo].[Rule_Types] ([ID], [Name]) VALUES (2, N'Consequence Rules')
INSERT [dbo].[Rule_Types] ([ID], [Name]) VALUES (3, N'Global Constraints')
SET IDENTITY_INSERT [dbo].[Rule_Types] OFF
/****** Object:  Table [dbo].[Users]    Script Date: 12/15/2011 23:47:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Email] [nvarchar](50) NULL,
	[Password] [nvarchar](50) NULL,
 CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[Users] ON
INSERT [dbo].[Users] ([ID], [Email], [Password]) VALUES (1, N'Radu', N'hej123!')
SET IDENTITY_INSERT [dbo].[Users] OFF
/****** Object:  Table [dbo].[CompositionRule_Types]    Script Date: 12/15/2011 23:47:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CompositionRule_Types](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
 CONSTRAINT [PK_CompositionRule_Types] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[CompositionRule_Types] ON
INSERT [dbo].[CompositionRule_Types] ([ID], [Name]) VALUES (1, N'Dependency')
INSERT [dbo].[CompositionRule_Types] ([ID], [Name]) VALUES (2, N'Exclusion')
SET IDENTITY_INSERT [dbo].[CompositionRule_Types] OFF
/****** Object:  Table [dbo].[Attribute_Types]    Script Date: 12/15/2011 23:47:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Attribute_Types](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](50) NULL,
 CONSTRAINT [PK_Attribute_Types] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[Attribute_Types] ON
INSERT [dbo].[Attribute_Types] ([ID], [Name]) VALUES (1, N'Constant')
INSERT [dbo].[Attribute_Types] ([ID], [Name]) VALUES (2, N'Dynamic')
INSERT [dbo].[Attribute_Types] ([ID], [Name]) VALUES (3, N'UserInput')
SET IDENTITY_INSERT [dbo].[Attribute_Types] OFF
/****** Object:  Table [dbo].[Attribute_DataTypes]    Script Date: 12/15/2011 23:47:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Attribute_DataTypes](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](50) NULL,
 CONSTRAINT [PK_Attribute_DataTypes] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[Attribute_DataTypes] ON
INSERT [dbo].[Attribute_DataTypes] ([ID], [Name]) VALUES (1, N'Integer')
INSERT [dbo].[Attribute_DataTypes] ([ID], [Name]) VALUES (2, N'Boolean')
INSERT [dbo].[Attribute_DataTypes] ([ID], [Name]) VALUES (3, N'String')
SET IDENTITY_INSERT [dbo].[Attribute_DataTypes] OFF
/****** Object:  Table [dbo].[GroupRelation_Types]    Script Date: 12/15/2011 23:47:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[GroupRelation_Types](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](50) NULL,
	[FixedLowerBound] [int] NULL,
	[FixedUpperBound] [int] NULL,
 CONSTRAINT [PK_FeatureGroup_Types] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[GroupRelation_Types] ON
INSERT [dbo].[GroupRelation_Types] ([ID], [Name], [FixedLowerBound], [FixedUpperBound]) VALUES (1, N'OR', 1, NULL)
INSERT [dbo].[GroupRelation_Types] ([ID], [Name], [FixedLowerBound], [FixedUpperBound]) VALUES (2, N'XOR', 1, 1)
INSERT [dbo].[GroupRelation_Types] ([ID], [Name], [FixedLowerBound], [FixedUpperBound]) VALUES (3, N'Custom OR', NULL, NULL)
SET IDENTITY_INSERT [dbo].[GroupRelation_Types] OFF
/****** Object:  Table [dbo].[Relation_Types]    Script Date: 12/15/2011 23:47:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Relation_Types](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](50) NULL,
	[FixedLowerBound] [int] NULL,
	[FixedUpperBound] [int] NULL,
 CONSTRAINT [PK_Feature_Types] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[Relation_Types] ON
INSERT [dbo].[Relation_Types] ([ID], [Name], [FixedLowerBound], [FixedUpperBound]) VALUES (1, N'Mandatory', 1, 1)
INSERT [dbo].[Relation_Types] ([ID], [Name], [FixedLowerBound], [FixedUpperBound]) VALUES (2, N'Optional', 0, 1)
INSERT [dbo].[Relation_Types] ([ID], [Name], [FixedLowerBound], [FixedUpperBound]) VALUES (3, N'Cloneable', 0, NULL)
SET IDENTITY_INSERT [dbo].[Relation_Types] OFF
/****** Object:  Table [dbo].[Models]    Script Date: 12/15/2011 23:47:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Models](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[UserID] [int] NOT NULL,
	[Name] [nvarchar](50) NULL,
	[CreatedDate] [datetime] NULL,
	[LastModifiedDate] [datetime] NULL,
 CONSTRAINT [PK_Models] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[Models] ON
INSERT [dbo].[Models] ([ID], [UserID], [Name], [CreatedDate], [LastModifiedDate]) VALUES (44, 1, N'sdsdsd', CAST(0x00009F8B01446AE7 AS DateTime), CAST(0x00009FA1002A7B75 AS DateTime))
INSERT [dbo].[Models] ([ID], [UserID], [Name], [CreatedDate], [LastModifiedDate]) VALUES (78, 1, N'Bike model', CAST(0x00009F8E00B08A24 AS DateTime), CAST(0x00009FBA01826C9F AS DateTime))
INSERT [dbo].[Models] ([ID], [UserID], [Name], [CreatedDate], [LastModifiedDate]) VALUES (96, 1, N'Default Model', CAST(0x00009F9000D1D848 AS DateTime), CAST(0x00009F9000D1D848 AS DateTime))
INSERT [dbo].[Models] ([ID], [UserID], [Name], [CreatedDate], [LastModifiedDate]) VALUES (100, 1, N'Default Model', CAST(0x00009F9200191551 AS DateTime), CAST(0x00009F9200191551 AS DateTime))
INSERT [dbo].[Models] ([ID], [UserID], [Name], [CreatedDate], [LastModifiedDate]) VALUES (101, 1, N'Default Model', CAST(0x00009F930009B589 AS DateTime), CAST(0x00009F93000C85EC AS DateTime))
INSERT [dbo].[Models] ([ID], [UserID], [Name], [CreatedDate], [LastModifiedDate]) VALUES (105, 1, N'Default Model', CAST(0x00009F9700FBC194 AS DateTime), CAST(0x00009F9700FBC194 AS DateTime))
INSERT [dbo].[Models] ([ID], [UserID], [Name], [CreatedDate], [LastModifiedDate]) VALUES (106, 1, N'Default Model', CAST(0x00009FA20035A398 AS DateTime), CAST(0x00009FA20035A398 AS DateTime))
SET IDENTITY_INSERT [dbo].[Models] OFF
/****** Object:  Table [dbo].[Features]    Script Date: 12/15/2011 23:47:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Features](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[ModelID] [int] NOT NULL,
	[FeatureGroupID] [int] NULL,
	[Name] [nvarchar](50) NULL,
	[Description] [nvarchar](max) NULL,
	[IsRoot] [bit] NULL,
 CONSTRAINT [PK_Features] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CompositionRules]    Script Date: 12/15/2011 23:47:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CompositionRules](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[ModelID] [int] NOT NULL,
	[CompositionRuleTypeID] [int] NOT NULL,
	[FirstFeatureID] [int] NOT NULL,
	[SecondFeatureID] [int] NOT NULL,
	[Mutual] [bit] NULL,
	[Name] [nvarchar](50) NULL,
	[Description] [nvarchar](max) NULL,
 CONSTRAINT [PK_CompositionRules] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[GroupRelations]    Script Date: 12/15/2011 23:47:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[GroupRelations](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[ModelID] [int] NOT NULL,
	[GroupRelationTypeID] [int] NOT NULL,
	[LowerBound] [int] NULL,
	[UpperBound] [int] NULL,
 CONSTRAINT [PK_FeatureGroups] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Rules]    Script Date: 12/15/2011 23:47:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Rules](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[ModelID] [int] NOT NULL,
	[RuleTypeID] [int] NOT NULL,
	[Name] [nvarchar](50) NULL,
	[Expression] [nvarchar](max) NULL,
	[Description] [nvarchar](max) NULL,
 CONSTRAINT [PK_Rules] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Relations]    Script Date: 12/15/2011 23:47:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Relations](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[ModelID] [int] NOT NULL,
	[RelationTypeID] [int] NOT NULL,
	[ParentFeatureID] [int] NOT NULL,
	[ChildFeatureID] [int] NOT NULL,
	[LowerBound] [int] NULL,
	[UpperBound] [int] NULL,
 CONSTRAINT [PK_Relations] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Attributes]    Script Date: 12/15/2011 23:47:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Attributes](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[FeatureID] [int] NOT NULL,
	[AttributeTypeID] [int] NOT NULL,
	[DataTypeID] [int] NOT NULL,
	[Name] [nvarchar](50) NULL,
	[Description] [nvarchar](max) NULL,
 CONSTRAINT [PK_Attributes] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[GroupRelations_To_Features]    Script Date: 12/15/2011 23:47:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[GroupRelations_To_Features](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[GroupRelationID] [int] NOT NULL,
	[ParentFeatureID] [int] NOT NULL,
	[ChildFeatureID] [int] NOT NULL,
 CONSTRAINT [PK_GroupRelations_To_Features] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  ForeignKey [FK_Attributes_Attribute_DataTypes]    Script Date: 12/15/2011 23:47:48 ******/
ALTER TABLE [dbo].[Attributes]  WITH CHECK ADD  CONSTRAINT [FK_Attributes_Attribute_DataTypes] FOREIGN KEY([DataTypeID])
REFERENCES [dbo].[Attribute_DataTypes] ([ID])
GO
ALTER TABLE [dbo].[Attributes] CHECK CONSTRAINT [FK_Attributes_Attribute_DataTypes]
GO
/****** Object:  ForeignKey [FK_Attributes_Attribute_Types]    Script Date: 12/15/2011 23:47:48 ******/
ALTER TABLE [dbo].[Attributes]  WITH CHECK ADD  CONSTRAINT [FK_Attributes_Attribute_Types] FOREIGN KEY([AttributeTypeID])
REFERENCES [dbo].[Attribute_Types] ([ID])
GO
ALTER TABLE [dbo].[Attributes] CHECK CONSTRAINT [FK_Attributes_Attribute_Types]
GO
/****** Object:  ForeignKey [FK_Attributes_Features]    Script Date: 12/15/2011 23:47:48 ******/
ALTER TABLE [dbo].[Attributes]  WITH CHECK ADD  CONSTRAINT [FK_Attributes_Features] FOREIGN KEY([FeatureID])
REFERENCES [dbo].[Features] ([ID])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Attributes] CHECK CONSTRAINT [FK_Attributes_Features]
GO
/****** Object:  ForeignKey [FK_CompositionRules_CompositionRule_Types]    Script Date: 12/15/2011 23:47:48 ******/
ALTER TABLE [dbo].[CompositionRules]  WITH CHECK ADD  CONSTRAINT [FK_CompositionRules_CompositionRule_Types] FOREIGN KEY([CompositionRuleTypeID])
REFERENCES [dbo].[CompositionRule_Types] ([ID])
GO
ALTER TABLE [dbo].[CompositionRules] CHECK CONSTRAINT [FK_CompositionRules_CompositionRule_Types]
GO
/****** Object:  ForeignKey [FK_CompositionRules_Models]    Script Date: 12/15/2011 23:47:48 ******/
ALTER TABLE [dbo].[CompositionRules]  WITH CHECK ADD  CONSTRAINT [FK_CompositionRules_Models] FOREIGN KEY([ModelID])
REFERENCES [dbo].[Models] ([ID])
GO
ALTER TABLE [dbo].[CompositionRules] CHECK CONSTRAINT [FK_CompositionRules_Models]
GO
/****** Object:  ForeignKey [FK_Features_Models]    Script Date: 12/15/2011 23:47:48 ******/
ALTER TABLE [dbo].[Features]  WITH CHECK ADD  CONSTRAINT [FK_Features_Models] FOREIGN KEY([ModelID])
REFERENCES [dbo].[Models] ([ID])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Features] CHECK CONSTRAINT [FK_Features_Models]
GO
/****** Object:  ForeignKey [FK_FeatureGroups_Models]    Script Date: 12/15/2011 23:47:48 ******/
ALTER TABLE [dbo].[GroupRelations]  WITH CHECK ADD  CONSTRAINT [FK_FeatureGroups_Models] FOREIGN KEY([ModelID])
REFERENCES [dbo].[Models] ([ID])
GO
ALTER TABLE [dbo].[GroupRelations] CHECK CONSTRAINT [FK_FeatureGroups_Models]
GO
/****** Object:  ForeignKey [FK_GroupRelations_GroupRelation_Types]    Script Date: 12/15/2011 23:47:48 ******/
ALTER TABLE [dbo].[GroupRelations]  WITH CHECK ADD  CONSTRAINT [FK_GroupRelations_GroupRelation_Types] FOREIGN KEY([GroupRelationTypeID])
REFERENCES [dbo].[GroupRelation_Types] ([ID])
GO
ALTER TABLE [dbo].[GroupRelations] CHECK CONSTRAINT [FK_GroupRelations_GroupRelation_Types]
GO
/****** Object:  ForeignKey [FK_GroupRelations_To_Features_Features]    Script Date: 12/15/2011 23:47:48 ******/
ALTER TABLE [dbo].[GroupRelations_To_Features]  WITH CHECK ADD  CONSTRAINT [FK_GroupRelations_To_Features_Features] FOREIGN KEY([ParentFeatureID])
REFERENCES [dbo].[Features] ([ID])
GO
ALTER TABLE [dbo].[GroupRelations_To_Features] CHECK CONSTRAINT [FK_GroupRelations_To_Features_Features]
GO
/****** Object:  ForeignKey [FK_GroupRelations_To_Features_GroupRelations]    Script Date: 12/15/2011 23:47:48 ******/
ALTER TABLE [dbo].[GroupRelations_To_Features]  WITH CHECK ADD  CONSTRAINT [FK_GroupRelations_To_Features_GroupRelations] FOREIGN KEY([GroupRelationID])
REFERENCES [dbo].[GroupRelations] ([ID])
GO
ALTER TABLE [dbo].[GroupRelations_To_Features] CHECK CONSTRAINT [FK_GroupRelations_To_Features_GroupRelations]
GO
/****** Object:  ForeignKey [FK_Models_Users]    Script Date: 12/15/2011 23:47:48 ******/
ALTER TABLE [dbo].[Models]  WITH CHECK ADD  CONSTRAINT [FK_Models_Users] FOREIGN KEY([UserID])
REFERENCES [dbo].[Users] ([ID])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Models] CHECK CONSTRAINT [FK_Models_Users]
GO
/****** Object:  ForeignKey [FK_Relations_ChildFeatures]    Script Date: 12/15/2011 23:47:48 ******/
ALTER TABLE [dbo].[Relations]  WITH CHECK ADD  CONSTRAINT [FK_Relations_ChildFeatures] FOREIGN KEY([ChildFeatureID])
REFERENCES [dbo].[Features] ([ID])
GO
ALTER TABLE [dbo].[Relations] CHECK CONSTRAINT [FK_Relations_ChildFeatures]
GO
/****** Object:  ForeignKey [FK_Relations_Features]    Script Date: 12/15/2011 23:47:48 ******/
ALTER TABLE [dbo].[Relations]  WITH CHECK ADD  CONSTRAINT [FK_Relations_Features] FOREIGN KEY([ParentFeatureID])
REFERENCES [dbo].[Features] ([ID])
GO
ALTER TABLE [dbo].[Relations] CHECK CONSTRAINT [FK_Relations_Features]
GO
/****** Object:  ForeignKey [FK_Relations_Models]    Script Date: 12/15/2011 23:47:48 ******/
ALTER TABLE [dbo].[Relations]  WITH CHECK ADD  CONSTRAINT [FK_Relations_Models] FOREIGN KEY([ModelID])
REFERENCES [dbo].[Models] ([ID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Relations] CHECK CONSTRAINT [FK_Relations_Models]
GO
/****** Object:  ForeignKey [FK_Relations_Relation_Types]    Script Date: 12/15/2011 23:47:48 ******/
ALTER TABLE [dbo].[Relations]  WITH CHECK ADD  CONSTRAINT [FK_Relations_Relation_Types] FOREIGN KEY([RelationTypeID])
REFERENCES [dbo].[Relation_Types] ([ID])
GO
ALTER TABLE [dbo].[Relations] CHECK CONSTRAINT [FK_Relations_Relation_Types]
GO
/****** Object:  ForeignKey [FK_Rules_Models]    Script Date: 12/15/2011 23:47:48 ******/
ALTER TABLE [dbo].[Rules]  WITH CHECK ADD  CONSTRAINT [FK_Rules_Models] FOREIGN KEY([ModelID])
REFERENCES [dbo].[Models] ([ID])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Rules] CHECK CONSTRAINT [FK_Rules_Models]
GO
/****** Object:  ForeignKey [FK_Rules_Rule_Types]    Script Date: 12/15/2011 23:47:48 ******/
ALTER TABLE [dbo].[Rules]  WITH CHECK ADD  CONSTRAINT [FK_Rules_Rule_Types] FOREIGN KEY([RuleTypeID])
REFERENCES [dbo].[Rule_Types] ([ID])
GO
ALTER TABLE [dbo].[Rules] CHECK CONSTRAINT [FK_Rules_Rule_Types]
GO
