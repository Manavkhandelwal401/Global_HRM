using HotChocolate.Execution.Configuration;
using TodoFeature.GraphQL;
using EmployeeFeature.GraphQL;
using AttendanceFeature.GraphQL;
using LeaveFeature.GraphQL;
using PayrollFeature.GraphQL;
using DocumentFeature.GraphQL;
using ExpenseFeature.GraphQL;
using PerformanceFeature.GraphQL;
using TrainingFeature.GraphQL;
using RecruitmentFeature.GraphQL;
using AnnouncementFeature.GraphQL;
using AnalyticsFeature.GraphQL;
using CopilotFeature.GraphQL;
using OffboardingFeature.GraphQL;
using AssetFeature.GraphQL;
using ServiceRequestFeature.GraphQL;
using TeamFeature.GraphQL;
using RecognitionFeature.GraphQL;

namespace HRMS.API.RegisterDependencies
{
    public static class GraphQLModuleRegistration
    {
        public static IRequestExecutorBuilder AddGraphQLModules(this IRequestExecutorBuilder builder)
        {
            return builder
                .AddTodosGraphQL()
                .AddEmployeeFeatureGraphQL()
                .AddAttendanceFeatureGraphQL()
                .AddLeaveFeatureGraphQL()
                .AddPayrollFeatureGraphQL()
                .AddDocumentFeatureGraphQL()
                .AddExpenseFeatureGraphQL()
                .AddPerformanceFeatureGraphQL()
                .AddTrainingFeatureGraphQL()
                .AddRecruitmentFeatureGraphQL()
                .AddAnnouncementFeatureGraphQL()
                .AddAnalyticsFeatureGraphQL()
                .AddCopilotFeatureGraphQL()
                .AddOffboardingFeatureGraphQL()
                .AddAssetFeatureGraphQL()
                .AddServiceRequestFeatureGraphQL()
                .AddTeamFeatureGraphQL()
                .AddRecognitionFeatureGraphQL();
        }
    }
}

