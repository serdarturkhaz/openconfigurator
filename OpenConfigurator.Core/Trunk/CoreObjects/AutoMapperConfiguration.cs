using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using OpenConfigurator.Core.CoreObjects.BLOs;

namespace OpenConfigurator.Core.CoreObjects
{
    public static class AutoMapperConfiguration
    {
        public static void Configure()
        {
            // Standard mappings (both ways)
            Mapper.CreateMap<OpenConfigurator.Core.CoreObjects.BLOs.FeatureModel, OpenConfigurator.Core.XmlDAL.DataEntities.FeatureModel>().ReverseMap();
            Mapper.CreateMap<OpenConfigurator.Core.CoreObjects.BLOs.Feature, OpenConfigurator.Core.XmlDAL.DataEntities.Feature>().ReverseMap();
            Mapper.CreateMap<OpenConfigurator.Core.CoreObjects.BLOs.Attribute, OpenConfigurator.Core.XmlDAL.DataEntities.Attribute>().ReverseMap();
            Mapper.CreateMap<OpenConfigurator.Core.CoreObjects.BLOs.CustomRule, OpenConfigurator.Core.XmlDAL.DataEntities.CustomRule>().ReverseMap();
            Mapper.CreateMap<OpenConfigurator.Core.CoreObjects.BLOs.CustomFunction, OpenConfigurator.Core.XmlDAL.DataEntities.CustomFunction>().ReverseMap();
            Mapper.CreateMap<OpenConfigurator.Core.CoreObjects.BLOs.ModelFile, OpenConfigurator.Core.XmlDAL.DataEntities.ModelFile>().ReverseMap();

            // Mappings with Identifier references (BLO to DataEntity)
            Mapper.CreateMap<OpenConfigurator.Core.CoreObjects.BLOs.Relation, OpenConfigurator.Core.XmlDAL.DataEntities.Relation>();
            Mapper.CreateMap<OpenConfigurator.Core.CoreObjects.BLOs.GroupRelation, OpenConfigurator.Core.XmlDAL.DataEntities.GroupRelation>()
                .ForMember(dest => dest.ChildFeatureIdentifiers, opt => opt.MapFrom(so => so.ChildFeatures.Select(f => f.Identifier).ToList()));
            Mapper.CreateMap<OpenConfigurator.Core.CoreObjects.BLOs.CompositionRule, OpenConfigurator.Core.XmlDAL.DataEntities.CompositionRule>();

            // Mappings with Identifier references (DataEntity to BLO)
            Mapper.CreateMap<OpenConfigurator.Core.XmlDAL.DataEntities.Relation, OpenConfigurator.Core.CoreObjects.BLOs.Relation>()
                .ForMember(dest => dest.ParentFeature, opt => opt.ResolveUsing<FeatureReferenceIDConverter>().FromMember(src => src.ParentFeatureIdentifier))
                .ForMember(dest => dest.ChildFeature, opt => opt.ResolveUsing<FeatureReferenceIDConverter>().FromMember(src => src.ChildFeatureIdentifier));

            Mapper.CreateMap<OpenConfigurator.Core.XmlDAL.DataEntities.GroupRelation, OpenConfigurator.Core.CoreObjects.BLOs.GroupRelation>()
                .ForMember(dest => dest.ParentFeature, opt => opt.ResolveUsing<FeatureReferenceIDConverter>().FromMember(src => src.ParentFeatureIdentifier))
                .ForMember(dest => dest.ChildFeatures, opt => opt.ResolveUsing<FeatureReferenceIDListConverter>().FromMember(src => src.ChildFeatureIdentifiers));

            Mapper.CreateMap<OpenConfigurator.Core.XmlDAL.DataEntities.CompositionRule, OpenConfigurator.Core.CoreObjects.BLOs.CompositionRule>()
                .ForMember(dest => dest.FirstFeature, opt => opt.ResolveUsing<FeatureReferenceIDConverter>().FromMember(src => src.FirstFeatureIdentifier))
                .ForMember(dest => dest.SecondFeature, opt => opt.ResolveUsing<FeatureReferenceIDConverter>().FromMember(src => src.SecondFeatureIdentifier));
        }

        ///<summary>
        /// Resolves a single FeatureIdentifier reference field by returning the BLO.Feature it refers to
        ///</summary>
        public class FeatureReferenceIDConverter : IValueResolver
        {
            public ResolutionResult Resolve(ResolutionResult source)
            {

                // Get the parent FeatureModel
                FeatureModel parentFeatureModel = (FeatureModel)source.Context.InstanceCache.Values.Where(v => v.GetType() == typeof(FeatureModel)).First();

                // Get the Feature corresponding to the given Identifier
                string featureIdentifier = (string)source.Value;
                Feature feature = parentFeatureModel.Features.Where(f => f.Identifier == featureIdentifier).First();
                return source.New(feature);
            }
        }
        ///<summary>
        /// Resolves a List of FeatureIdentifier reference fields by returning the BLO.Feature it refers to
        ///</summary>
        public class FeatureReferenceIDListConverter : IValueResolver
        {
            public ResolutionResult Resolve(ResolutionResult source)
            {

                // Get the parent FeatureModel
                FeatureModel parentFeatureModel = (FeatureModel)source.Context.InstanceCache.Values.Where(v => v.GetType() == typeof(FeatureModel)).First();

                // Get the Features corresponding to the given Identifiers
                List<string> featureIdentifiers = (List<string>)source.Value;
                List<Feature> featuresList = new List<Feature>();
                for (int i = 0; i < featureIdentifiers.Count; i++)
                {
                    Feature feature = parentFeatureModel.Features.Where(f => f.Identifier == featureIdentifiers[i]).First();
                    featuresList.Add(feature);
                }
                return source.New(featuresList);
            }
        }


    }
}
