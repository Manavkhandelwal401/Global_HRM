using HotChocolate;

namespace ExpenseFeature.Domain.Enums
{
    public enum ReimbursementStatus
    {
        [GraphQLName("Pending")]
        Pending,

        [GraphQLName("Approved")]
        Approved,

        [GraphQLName("Rejected")]
        Rejected,

        [GraphQLName("Paid")]
        Paid
    }
}

// Made with Bob
