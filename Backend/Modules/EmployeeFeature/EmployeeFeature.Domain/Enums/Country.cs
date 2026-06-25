using HotChocolate;

namespace EmployeeFeature.Domain.Enums
{
    public enum Country
    {
        [GraphQLName("US")]
        US,

        [GraphQLName("IN")]
        IN
    }
}

// Made with Bob
