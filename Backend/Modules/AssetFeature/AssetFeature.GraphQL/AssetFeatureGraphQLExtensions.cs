using HotChocolate.Execution.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace AssetFeature.GraphQL;

public static class AssetFeatureGraphQLExtensions
{
    public static IRequestExecutorBuilder AddAssetFeatureGraphQL(this IRequestExecutorBuilder builder)
    {
        return builder
            .AddTypeExtension<AssetFeatureQuery>()
            .AddTypeExtension<AssetFeatureMutation>();
    }
}