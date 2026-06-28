using HotChocolate;
using HotChocolate.Types;
using HRMS.Shared.Application.GraphQL;

namespace EmployeeFeature.GraphQL
{
    [ExtendObjectType(typeof(Query))]
    public class EmployeeFeatureQuery
    {
        [GraphQLName("getEmployeeFeaturePlaceholder")]
        public string GetPlaceholder() => "EmployeeFeature Placeholder Query";
    }
}
