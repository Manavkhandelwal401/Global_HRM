using HotChocolate.Execution.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace RecruitmentFeature.GraphQL
{
    public static class RecruitmentFeatureGraphQLExtensions
    {
        public static IRequestExecutorBuilder AddRecruitmentFeatureGraphQL(this IRequestExecutorBuilder builder)
        {
            return builder
                .AddTypeExtension<RecruitmentFeatureMutation>()
                .AddTypeExtension<RecruitmentFeatureQuery>();
        }
    }
}
