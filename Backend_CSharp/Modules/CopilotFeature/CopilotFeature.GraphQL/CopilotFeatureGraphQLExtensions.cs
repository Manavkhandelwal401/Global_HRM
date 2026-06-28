using HotChocolate.Execution.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace CopilotFeature.GraphQL
{
    public static class CopilotFeatureGraphQLExtensions
    {
        public static IRequestExecutorBuilder AddCopilotFeatureGraphQL(this IRequestExecutorBuilder builder)
        {
            return builder
                .AddTypeExtension<CopilotFeatureMutation>()
                .AddTypeExtension<CopilotFeatureQuery>();
        }
    }
}
