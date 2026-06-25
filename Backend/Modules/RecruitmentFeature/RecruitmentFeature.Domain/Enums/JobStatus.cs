using HotChocolate;

namespace RecruitmentFeature.Domain.Enums
{
    public enum JobStatus
    {
        [GraphQLName("Open")]
        Open,

        [GraphQLName("Closed")]
        Closed,

        [GraphQLName("OnHold")]
        OnHold
    }
}

// Made with Bob
