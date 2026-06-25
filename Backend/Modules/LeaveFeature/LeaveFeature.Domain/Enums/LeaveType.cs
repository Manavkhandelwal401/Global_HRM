using HotChocolate;

namespace LeaveFeature.Domain.Enums
{
    public enum LeaveType
    {
        [GraphQLName("Casual")]
        Casual,

        [GraphQLName("Sick")]
        Sick,

        [GraphQLName("Personal")]
        Personal,

        [GraphQLName("LWP")]
        LWP,

        [GraphQLName("CompOff")]
        CompOff
    }
}

// Made with Bob
