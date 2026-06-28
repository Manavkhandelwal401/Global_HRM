using HotChocolate;
using HotChocolate.Types;
using HRMS.Shared.Application.GraphQL;

namespace CopilotFeature.GraphQL
{
    [ExtendObjectType(typeof(Query))]
    public class CopilotFeatureQuery
    {
        [GraphQLName("getCopilotFeaturePlaceholder")]
        public string GetPlaceholder() => "CopilotFeature Placeholder Query";
    }
}
