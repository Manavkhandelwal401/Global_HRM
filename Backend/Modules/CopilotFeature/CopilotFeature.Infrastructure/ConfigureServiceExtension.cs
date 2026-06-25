using HRMS.Core.Postgres.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using CopilotFeature.Infrastructure.Data;
using CopilotFeature.Infrastructure.Repositories;
using CopilotFeature.Application.Services;
using CopilotFeature.Domain.Repositories;


namespace CopilotFeature.Infrastructure
{
    public static class ConfigureServiceExtension
    {
        public static IServiceCollection AddCopilotFeatureDependency(this IServiceCollection services, IConfiguration configuration)
        {
            services.TryAddEnumerable(ServiceDescriptor.Scoped<IPostgresEntityConfigurator, CopilotEntityConfiguration>());
            
            // Register repositories
            services.AddScoped<ICopilotRepository, CopilotRepository>();
            
            // Register services
            services.AddScoped<ICopilotService, CopilotService>();
            
            return services;
        }
    }
}
