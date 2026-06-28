using HotChocolate.Execution.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace AttendanceFeature.GraphQL
{
    public static class AttendanceFeatureGraphQLExtensions
    {
        public static IRequestExecutorBuilder AddAttendanceFeatureGraphQL(this IRequestExecutorBuilder builder)
        {
            return builder
                .AddTypeExtension<AttendanceFeatureMutation>()
                .AddTypeExtension<AttendanceFeatureQuery>();
        }
    }
}
