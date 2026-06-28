using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TodoFeature.Infrastructure;
using EmployeeFeature.Infrastructure;
using AttendanceFeature.Infrastructure;
using LeaveFeature.Infrastructure;
using PayrollFeature.Infrastructure;
using DocumentFeature.Infrastructure;
using ExpenseFeature.Infrastructure;
using PerformanceFeature.Infrastructure;
using TrainingFeature.Infrastructure;
using RecruitmentFeature.Infrastructure;
using AnnouncementFeature.Infrastructure;
using AnalyticsFeature.Infrastructure;
using CopilotFeature.Infrastructure;
using OffboardingFeature.Infrastructure;
using AssetFeature.Infrastructure;
using ServiceRequestFeature.Infrastructure;
using TeamFeature.Infrastructure;
using RecognitionFeature.Infrastructure;

namespace HRMS.API.RegisterDependencies
{
    public static class RepositoryRegistration
    {
        public static IServiceCollection AddModulesDependencyInjection(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddTodoDependency(configuration);
            services.AddEmployeeFeatureDependency(configuration);
            services.AddAttendanceFeatureDependency(configuration);
            services.AddLeaveFeatureDependency(configuration);
            services.AddPayrollFeatureDependency(configuration);
            services.AddDocumentFeatureDependency(configuration);
            services.AddExpenseFeatureDependency(configuration);
            services.AddPerformanceFeatureDependency(configuration);
            services.AddTrainingFeatureDependency(configuration);
            services.AddRecruitmentFeatureDependency(configuration);
            services.AddAnnouncementFeatureDependency(configuration);
            services.AddAnalyticsFeatureDependency(configuration);
            services.AddCopilotFeatureDependency(configuration);
            services.AddTeamFeatureDependency(configuration);
            services.AddRecognitionFeatureDependency(configuration);
            services.AddOffboardingFeatureInfrastructure();
            services.AddAssetFeatureInfrastructure();
            services.AddServiceRequestFeatureInfrastructure();
            return services;
        }
    }
}


