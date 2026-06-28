using HotChocolate;

namespace TrainingFeature.Domain.Enums
{
    public enum TrainingCategory
    {
        [GraphQLName("Technical")]
        Technical,

        [GraphQLName("Soft_Skills")]
        SoftSkills,

        [GraphQLName("Compliance")]
        Compliance,

        [GraphQLName("Leadership")]
        Leadership
    }
}

// Made with Bob
