using HotChocolate;

namespace ExpenseFeature.Domain.Enums
{
    public enum ReimbursementCategory
    {
        [GraphQLName("Travel")]
        Travel,

        [GraphQLName("Food")]
        Food,

        [GraphQLName("Accommodation")]
        Accommodation,

        [GraphQLName("Medical")]
        Medical,

        [GraphQLName("Other")]
        Other
    }
}

// Made with Bob
