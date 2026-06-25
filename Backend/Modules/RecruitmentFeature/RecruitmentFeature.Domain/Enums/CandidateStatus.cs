using HotChocolate;

namespace RecruitmentFeature.Domain.Enums
{
    public enum CandidateStatus
    {
        [GraphQLName("Applied")]
        Applied,

        [GraphQLName("Screening")]
        Screening,

        [GraphQLName("Interview")]
        Interview,

        [GraphQLName("Offered")]
        Offered,

        [GraphQLName("Hired")]
        Hired,

        [GraphQLName("Rejected")]
        Rejected
    }
}

// Made with Bob
