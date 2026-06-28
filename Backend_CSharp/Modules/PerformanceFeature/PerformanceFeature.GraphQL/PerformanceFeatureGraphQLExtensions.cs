using HotChocolate.Execution.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace PerformanceFeature.GraphQL
{
    public static class PerformanceFeatureGraphQLExtensions
    {
        public static IRequestExecutorBuilder AddPerformanceFeatureGraphQL(this IRequestExecutorBuilder builder)
        {
            return builder
                .AddTypeExtension<PerformanceFeatureMutation>()
                .AddTypeExtension<PerformanceFeatureQuery>();
        }
    }
}
