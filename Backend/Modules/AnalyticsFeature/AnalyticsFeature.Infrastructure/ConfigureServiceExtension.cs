using HRMS.Core.Postgres.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using AnalyticsFeature.Infrastructure.Data;
using AnalyticsFeature.Infrastructure.Repositories;
using AnalyticsFeature.Application.Services;
using AnalyticsFeature.Domain;


namespace AnalyticsFeature.Infrastructure
{
    public static class ConfigureServiceExtension
    {
        public static IServiceCollection AddAnalyticsFeatureDependency(this IServiceCollection services, IConfiguration configuration)
        {
            services.TryAddEnumerable(ServiceDescriptor.Scoped<IPostgresEntityConfigurator, AnalyticsEntityConfiguration>());
            
            // Register repositories
            services.AddScoped<IAnalyticsRepository, AnalyticsRepository>();
            
            // Register services
            services.AddScoped<IAnalyticsService, AnalyticsService>();
            
            return services;
        }
    }
}
