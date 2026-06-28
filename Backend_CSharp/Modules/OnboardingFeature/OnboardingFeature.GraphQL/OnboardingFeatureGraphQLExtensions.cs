using HotChocolate.Execution.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace OnboardingFeature.GraphQL;

public static class OnboardingFeatureGraphQLExtensions
{
    public static IRequestExecutorBuilder AddOnboardingFeatureGraphQL(this IRequestExecutorBuilder builder)
    {
        return builder
            .AddTypeExtension<OnboardingFeatureQuery>()
            .AddTypeExtension<OnboardingFeatureMutation>();
    }
}

