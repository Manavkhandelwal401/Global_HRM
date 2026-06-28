using HotChocolate;

namespace AttendanceFeature.Domain.Enums
{
    public enum AttendanceStatus
    {
        [GraphQLName("Present")]
        Present,

        [GraphQLName("Late")]
        Late,

        [GraphQLName("HalfDay")]
        HalfDay,

        [GraphQLName("Absent")]
        Absent
    }
}

// Made with Bob
