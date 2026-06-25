using HRMS.Core.Postgres.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using PerformanceFeature.Infrastructure.Data;
using PerformanceFeature.Infrastructure.Repositories;
using PerformanceFeature.Application.Services;
using PerformanceFeature.Domain.Repositories;

namespace PerformanceFeature.Infrastructure
{
    public static class ConfigureServiceExtension
    {
        public static IServiceCollection AddPerformanceFeatureDependency(this IServiceCollection services, IConfiguration configuration)
        {
            services.TryAddEnumerable(ServiceDescriptor.Scoped<IPostgresEntityConfigurator, PerformanceEntityConfiguration>());
            
            // Register repositories
            services.AddScoped<IPerformanceRepository, PerformanceRepository>();
            
            // Register services
            services.AddScoped<IPerformanceService, PerformanceService>();
            
            return services;
        }
    }
}

// Made with Bob
