using HotChocolate;
using HotChocolate.Types;
using HRMS.Shared.Application.GraphQL;

namespace AnalyticsFeature.GraphQL
{
    [ExtendObjectType(typeof(Mutation))]
    public class AnalyticsFeatureMutation
    {
        [GraphQLName("mutateAnalyticsFeaturePlaceholder")]
        public string MutatePlaceholder() => "AnalyticsFeature Placeholder Mutation";
    }
}
