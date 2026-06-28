using HotChocolate;

namespace LeaveFeature.Domain.Enums
{
    public enum LeaveRequestStatus
    {
        [GraphQLName("Pending")]
        Pending,

        [GraphQLName("Approved")]
        Approved,

        [GraphQLName("Rejected")]
        Rejected
    }
}

// Made with Bob
