using HotChocolate.Execution.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace AnnouncementFeature.GraphQL
{
    public static class AnnouncementFeatureGraphQLExtensions
    {
        public static IRequestExecutorBuilder AddAnnouncementFeatureGraphQL(this IRequestExecutorBuilder builder)
        {
            return builder
                .AddTypeExtension<AnnouncementFeatureMutation>()
                .AddTypeExtension<AnnouncementFeatureQuery>();
        }
    }
}
