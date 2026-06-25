using HotChocolate;

namespace DocumentFeature.Domain.Enums
{
    public enum DocumentCategory
    {
        [GraphQLName("Identity")]
        Identity,

        [GraphQLName("Tax")]
        Tax,

        [GraphQLName("WorkAuth")]
        WorkAuth,

        [GraphQLName("Education")]
        Education
    }
}

// Made with Bob
