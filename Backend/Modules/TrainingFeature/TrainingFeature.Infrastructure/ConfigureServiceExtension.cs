using HRMS.Core.Postgres.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using TrainingFeature.Infrastructure.Data;
using TrainingFeature.Infrastructure.Repositories;
using TrainingFeature.Application.Services;
using TrainingFeature.Domain;

namespace TrainingFeature.Infrastructure
{
    public static class ConfigureServiceExtension
    {
        public static IServiceCollection AddTrainingFeatureDependency(this IServiceCollection services, IConfiguration configuration)
        {
            services.TryAddEnumerable(ServiceDescriptor.Scoped<IPostgresEntityConfigurator, TrainingEntityConfiguration>());
            
            // Register repositories
            services.AddScoped<ITrainingRepository, TrainingRepository>();
            
            // Register services
            services.AddScoped<ITrainingService, TrainingService>();
            
            return services;
        }
    }
}

// Made with Bob
