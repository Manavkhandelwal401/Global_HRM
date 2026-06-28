using HotChocolate.Execution.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace LeaveFeature.GraphQL
{
    public static class LeaveFeatureGraphQLExtensions
    {
        public static IRequestExecutorBuilder AddLeaveFeatureGraphQL(this IRequestExecutorBuilder builder)
        {
            return builder
                .AddTypeExtension<LeaveFeatureMutation>()
                .AddTypeExtension<LeaveFeatureQuery>();
        }
    }
}
