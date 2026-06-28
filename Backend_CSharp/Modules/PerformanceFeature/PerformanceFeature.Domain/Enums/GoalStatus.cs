using HotChocolate;

namespace PerformanceFeature.Domain.Enums
{
    public enum GoalStatus
    {
        [GraphQLName("NotStarted")]
        NotStarted,

        [GraphQLName("InProgress")]
        InProgress,

        [GraphQLName("Completed")]
        Completed,

        [GraphQLName("Overdue")]
        Overdue
    }
}

// Made with Bob
