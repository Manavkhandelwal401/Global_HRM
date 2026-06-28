using HRMS.Core.Postgres.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using RecognitionFeature.Infrastructure.Data;
using RecognitionFeature.Infrastructure.Repositories;
using RecognitionFeature.Application.Services;
using RecognitionFeature.Domain.Repositories;


namespace RecognitionFeature.Infrastructure
{
    public static class ConfigureServiceExtension
    {
        public static IServiceCollection AddRecognitionFeatureDependency(this IServiceCollection services, IConfiguration configuration)
        {
            services.TryAddEnumerable(ServiceDescriptor.Scoped<IPostgresEntityConfigurator, RecognitionEntityConfiguration>());
            
            // Register repositories
            services.AddScoped<IRecognitionRepository, RecognitionRepository>();
            
            // Register services
            services.AddScoped<IRecognitionService, RecognitionService>();
            
            return services;
        }
    }
}

// Made with Bob
