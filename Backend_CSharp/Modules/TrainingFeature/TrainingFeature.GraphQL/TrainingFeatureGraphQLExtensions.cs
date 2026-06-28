using HotChocolate.Execution.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace TrainingFeature.GraphQL
{
    public static class TrainingFeatureGraphQLExtensions
    {
        public static IRequestExecutorBuilder AddTrainingFeatureGraphQL(this IRequestExecutorBuilder builder)
        {
            return builder
                .AddTypeExtension<TrainingFeatureMutation>()
                .AddTypeExtension<TrainingFeatureQuery>();
        }
    }
}
