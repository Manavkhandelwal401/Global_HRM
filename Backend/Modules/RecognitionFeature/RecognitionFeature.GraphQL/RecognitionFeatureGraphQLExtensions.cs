using HotChocolate.Execution.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace RecognitionFeature.GraphQL
{
    public static class RecognitionFeatureGraphQLExtensions
    {
        public static IRequestExecutorBuilder AddRecognitionFeatureGraphQL(this IRequestExecutorBuilder builder)
        {
            return builder
                .AddTypeExtension<RecognitionFeatureMutation>()
                .AddTypeExtension<RecognitionFeatureQuery>();
        }
    }
}

// Made with Bob
