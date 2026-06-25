using HotChocolate.Execution.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace PayrollFeature.GraphQL
{
    public static class PayrollFeatureGraphQLExtensions
    {
        public static IRequestExecutorBuilder AddPayrollFeatureGraphQL(this IRequestExecutorBuilder builder)
        {
            return builder
                .AddTypeExtension<PayrollFeatureMutation>()
                .AddTypeExtension<PayrollFeatureQuery>();
        }
    }
}
