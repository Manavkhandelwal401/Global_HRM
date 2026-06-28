using HotChocolate.Execution.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ServiceRequestFeature.GraphQL;

public static class ServiceRequestFeatureGraphQLExtensions
{
    public static IRequestExecutorBuilder AddServiceRequestFeatureGraphQL(this IRequestExecutorBuilder builder)
    {
        return builder
            .AddTypeExtension<ServiceRequestFeatureQuery>()
            .AddTypeExtension<ServiceRequestFeatureMutation>();
    }
}