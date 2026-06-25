using HotChocolate;

namespace AnnouncementFeature.Domain.Enums
{
    public enum AnnouncementCategory
    {
        [GraphQLName("General")]
        General,

        [GraphQLName("Policy")]
        Policy,

        [GraphQLName("Event")]
        Event,

        [GraphQLName("Holiday")]
        Holiday,

        [GraphQLName("Emergency")]
        Emergency
    }
}

// Made with Bob
