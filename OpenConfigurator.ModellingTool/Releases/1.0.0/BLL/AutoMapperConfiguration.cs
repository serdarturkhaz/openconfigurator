using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;

namespace BLL
{
    public static class AutoMapperConfiguration
    {
        public static void Configure()
        {
            // Standard mappings (both ways)
            Mapper.CreateMap<BLL.BLOs.FeatureModel, DAL.DataEntities.FeatureModel>().ReverseMap();
            Mapper.CreateMap<BLL.BLOs.Feature, DAL.DataEntities.Feature>().ReverseMap();
            Mapper.CreateMap<BLL.BLOs.Attribute, DAL.DataEntities.Attribute>().ReverseMap();
            Mapper.CreateMap<BLL.BLOs.CustomRule, DAL.DataEntities.CustomRule>().ReverseMap();
            Mapper.CreateMap<BLL.BLOs.CustomFunction, DAL.DataEntities.CustomFunction>().ReverseMap();

            // Mappings with Identifier references (BLO to DataEntity)
            Mapper.CreateMap<BLL.BLOs.Relation, DAL.DataEntities.Relation>();
            Mapper.CreateMap<BLL.BLOs.GroupRelation, DAL.DataEntities.GroupRelation>()
                .ForMember(dest => dest.ChildFeatureIdentifiers, opt => opt.MapFrom(so => so.ChildFeatures.Select(f => f.Identifier).ToList()));
            Mapper.CreateMap<BLL.BLOs.CompositionRule, DAL.DataEntities.CompositionRule>();

            // Mappings with Identifier references (DataEntity to BLO)
            Mapper.CreateMap<DAL.DataEntities.Relation, BLL.BLOs.Relation>()
                .ForMember(dest => dest.ParentFeature, opt => opt.ResolveUsing<FeatureReferenceIDConverter>().FromMember(src => src.ParentFeatureIdentifier))
                .ForMember(dest => dest.ChildFeature, opt => opt.ResolveUsing<FeatureReferenceIDConverter>().FromMember(src => src.ChildFeatureIdentifier));

            Mapper.CreateMap<DAL.DataEntities.GroupRelation, BLL.BLOs.GroupRelation>()
                .ForMember(dest => dest.ParentFeature, opt => opt.ResolveUsing<FeatureReferenceIDConverter>().FromMember(src => src.ParentFeatureIdentifier))
                .ForMember(dest => dest.ChildFeatures, opt => opt.ResolveUsing<FeatureReferenceIDListConverter>().FromMember(src => src.ChildFeatureIdentifiers));

            Mapper.CreateMap<DAL.DataEntities.CompositionRule, BLL.BLOs.CompositionRule>()
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
                BLOs.FeatureModel parentFeatureModel = (BLOs.FeatureModel)source.Context.InstanceCache.Values.Where(v => v.GetType() == typeof(BLOs.FeatureModel)).First();

                // Get the Feature corresponding to the given Identifier
                string featureIdentifier = (string)source.Value;
                BLOs.Feature feature = parentFeatureModel.Features.Where(f => f.Identifier == featureIdentifier).First();
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
                BLOs.FeatureModel parentFeatureModel = (BLOs.FeatureModel)source.Context.InstanceCache.Values.Where(v => v.GetType() == typeof(BLOs.FeatureModel)).First();

                // Get the Features corresponding to the given Identifiers
                List<string> featureIdentifiers = (List<string>)source.Value;
                List<BLOs.Feature> featuresList = new List<BLOs.Feature>();
                for (int i = 0; i < featureIdentifiers.Count; i++)
                {
                    BLOs.Feature feature = parentFeatureModel.Features.Where(f => f.Identifier == featureIdentifiers[i]).First();
                    featuresList.Add(feature);
                }
                return source.New(featuresList);
            }
        }


    }
}
