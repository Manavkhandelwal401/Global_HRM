using HotChocolate;
using HotChocolate.Types;
using HRMS.Shared.Application.GraphQL;

namespace EmployeeFeature.GraphQL
{
    [ExtendObjectType(typeof(Mutation))]
    public class EmployeeFeatureMutation
    {
        [GraphQLName("mutateEmployeeFeaturePlaceholder")]
        public string MutatePlaceholder() => "EmployeeFeature Placeholder Mutation";
    }
}
