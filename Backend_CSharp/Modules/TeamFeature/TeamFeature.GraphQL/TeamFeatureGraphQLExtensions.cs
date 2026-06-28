using HotChocolate.Execution.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace TeamFeature.GraphQL
{
    public static class TeamFeatureGraphQLExtensions
    {
        public static IRequestExecutorBuilder AddTeamFeatureGraphQL(this IRequestExecutorBuilder builder)
        {
            return builder
                .AddTypeExtension<TeamFeatureQuery>();
        }
    }
}

// Made with Bob
