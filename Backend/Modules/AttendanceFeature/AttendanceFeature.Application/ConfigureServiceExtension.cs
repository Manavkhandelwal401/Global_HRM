using AttendanceFeature.Application.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace AttendanceFeature.Application
{
    public static class ConfigureServiceExtension
    {
        public static IServiceCollection AddAttendanceFeatureApplication(this IServiceCollection services, IConfiguration configuration)
        {
            // Register Services
            services.AddScoped<IAttendanceService, AttendanceService>();
            
            return services;
        }
    }
}

// Made with Bob