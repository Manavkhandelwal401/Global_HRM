using HotChocolate.Execution.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ExpenseFeature.GraphQL
{
    public static class ExpenseFeatureGraphQLExtensions
    {
        public static IRequestExecutorBuilder AddExpenseFeatureGraphQL(this IRequestExecutorBuilder builder)
        {
            return builder
                .AddTypeExtension<ExpenseFeatureMutation>()
                .AddTypeExtension<ExpenseFeatureQuery>();
        }
    }
}
