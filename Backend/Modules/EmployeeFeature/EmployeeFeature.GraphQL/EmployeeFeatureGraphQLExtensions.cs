using HotChocolate.Execution.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace EmployeeFeature.GraphQL
{
    public static class EmployeeFeatureGraphQLExtensions
    {
        public static IRequestExecutorBuilder AddEmployeeFeatureGraphQL(this IRequestExecutorBuilder builder)
        {
            return builder
                .AddTypeExtension<EmployeeFeatureMutation>()
                .AddTypeExtension<EmployeeFeatureQuery>()
                .AddTypeExtension<AuthMutation>()
                .AddTypeExtension<AuthQuery>();
        }
    }
}
