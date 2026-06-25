using HotChocolate;

namespace AnnouncementFeature.Domain.Enums
{
    public enum VisibilityScope
    {
        [GraphQLName("Global")]
        Global,

        [GraphQLName("Department")]
        Department,

        [GraphQLName("Location")]
        Location
    }
}

// Made with Bob
