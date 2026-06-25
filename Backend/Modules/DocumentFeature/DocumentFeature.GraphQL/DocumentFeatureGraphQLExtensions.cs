using HotChocolate.Execution.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace DocumentFeature.GraphQL
{
    public static class DocumentFeatureGraphQLExtensions
    {
        public static IRequestExecutorBuilder AddDocumentFeatureGraphQL(this IRequestExecutorBuilder builder)
        {
            return builder
                .AddTypeExtension<DocumentFeatureMutation>()
                .AddTypeExtension<DocumentFeatureQuery>();
        }
    }
}
