using HRMS.Core.Postgres.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using LeaveFeature.Infrastructure.Data;
using LeaveFeature.Infrastructure.Repositories;
using LeaveFeature.Application.Services;
using LeaveFeature.Domain;

namespace LeaveFeature.Infrastructure
{
    public static class ConfigureServiceExtension
    {
        public static IServiceCollection AddLeaveFeatureDependency(this IServiceCollection services, IConfiguration configuration)
        {
            services.TryAddEnumerable(ServiceDescriptor.Scoped<IPostgresEntityConfigurator, LeaveEntityConfiguration>());
            
            // Register repositories
            services.AddScoped<ILeaveRepository, LeaveRepository>();
            services.AddScoped<ILeaveBalanceRepository, LeaveBalanceRepository>();
            
            // Register services
            services.AddScoped<ILeaveService, LeaveService>();
            
            return services;
        }
    }
}
