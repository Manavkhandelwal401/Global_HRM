using HotChocolate;

namespace DocumentFeature.Domain.Enums
{
    public enum DocumentStatus
    {
        [GraphQLName("Missing")]
        Missing,

        [GraphQLName("Uploaded")]
        Uploaded,

        [GraphQLName("Verified")]
        Verified,

        [GraphQLName("Rejected")]
        Rejected
    }
}

// Made with Bob
