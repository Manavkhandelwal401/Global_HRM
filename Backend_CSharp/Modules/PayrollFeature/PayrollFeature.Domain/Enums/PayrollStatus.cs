using HotChocolate;

namespace PayrollFeature.Domain.Enums
{
    public enum PayrollStatus
    {
        [GraphQLName("Draft")]
        Draft,

        [GraphQLName("Processed")]
        Processed,

        [GraphQLName("Paid")]
        Paid
    }
}

// Made with Bob
