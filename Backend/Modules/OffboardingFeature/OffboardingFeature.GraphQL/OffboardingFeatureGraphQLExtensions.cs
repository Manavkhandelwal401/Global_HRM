using HotChocolate.Execution.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace OffboardingFeature.GraphQL;

public static class OffboardingFeatureGraphQLExtensions
{
    public static IRequestExecutorBuilder AddOffboardingFeatureGraphQL(this IRequestExecutorBuilder builder)
    {
        return builder
            .AddTypeExtension<OffboardingFeatureQuery>()
            .AddTypeExtension<OffboardingFeatureMutation>();
    }
}