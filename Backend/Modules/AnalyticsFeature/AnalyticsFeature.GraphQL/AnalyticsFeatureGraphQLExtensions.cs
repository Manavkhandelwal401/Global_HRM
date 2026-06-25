using HotChocolate.Execution.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace AnalyticsFeature.GraphQL
{
    public static class AnalyticsFeatureGraphQLExtensions
    {
        public static IRequestExecutorBuilder AddAnalyticsFeatureGraphQL(this IRequestExecutorBuilder builder)
        {
            return builder
                .AddTypeExtension<AnalyticsFeatureMutation>()
                .AddTypeExtension<AnalyticsFeatureQuery>();
        }
    }
}
