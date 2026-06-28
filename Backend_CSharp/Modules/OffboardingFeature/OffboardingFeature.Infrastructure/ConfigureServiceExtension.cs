using Microsoft.Extensions.DependencyInjection;
using OffboardingFeature.Application.Services;
using OffboardingFeature.Infrastructure.Repositories;
using OffboardingFeature.Domain.Repositories;

namespace OffboardingFeature.Infrastructure;

public static class ConfigureServiceExtension
{
    public static IServiceCollection AddOffboardingFeatureInfrastructure(this IServiceCollection services)
    {
        // Register repositories
        services.AddScoped<IOffboardingRepository, OffboardingRepository>();
        
        // Register services
        services.AddScoped<IOffboardingService, OffboardingService>();
        
        return services;
    }
}

// Made with Bob