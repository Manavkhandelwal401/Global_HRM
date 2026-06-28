using HRMS.Core.Postgres.Interfaces;
using AttendanceFeature.Domain;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using AttendanceFeature.Infrastructure.Data;
using AttendanceFeature.Infrastructure.Repositories;
using AttendanceFeature.Application;

namespace AttendanceFeature.Infrastructure
{
    public static class ConfigureServiceExtension
    {
        public static IServiceCollection AddAttendanceFeatureDependency(this IServiceCollection services, IConfiguration configuration)
        {
            services.TryAddEnumerable(ServiceDescriptor.Scoped<IPostgresEntityConfigurator, AttendanceEntityConfiguration>());
            
            // Register Repository
            services.AddScoped<IAttendanceRepository, AttendanceRepository>();
            
            // Register Application Services
            services.AddAttendanceFeatureApplication(configuration);
            
            return services;
        }
    }
}