using HotChocolate;

namespace TrainingFeature.Domain.Enums
{
    public enum TrainingStatus
    {
        [GraphQLName("NotStarted")]
        NotStarted,

        [GraphQLName("InProgress")]
        InProgress,

        [GraphQLName("Completed")]
        Completed
    }
}

// Made with Bob
