using HotChocolate;

namespace AnnouncementFeature.Domain.Enums
{
    public enum AnnouncementPriority
    {
        [GraphQLName("Low")]
        Low,

        [GraphQLName("Medium")]
        Medium,

        [GraphQLName("High")]
        High,

        [GraphQLName("Critical")]
        Critical
    }
}

// Made with Bob
