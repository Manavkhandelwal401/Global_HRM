using HotChocolate;

namespace EmployeeFeature.Domain.Enums
{
    public enum EmployeeRole
    {
        [GraphQLName("Admin")]
        Admin,

        [GraphQLName("HR")]
        HR,

        [GraphQLName("Manager")]
        Manager,

        [GraphQLName("Employee")]
        Employee
    }
}

// Made with Bob
