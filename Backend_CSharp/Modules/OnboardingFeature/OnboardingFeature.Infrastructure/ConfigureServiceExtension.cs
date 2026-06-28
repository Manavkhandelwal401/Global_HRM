using Microsoft.Extensions.DependencyInjection;
using OnboardingFeature.Application.Services;
using OnboardingFeature.Infrastructure.Repositories;

namespace OnboardingFeature.Infrastructure;

public static class ConfigureServiceExtension
{
    public static IServiceCollection AddOnboardingFeatureInfrastructure(this IServiceCollection services)
    {
        // Register repositories
        services.AddScoped<IOnboardingRepository, OnboardingRepository>();
        
        // Register services
        services.AddScoped<IOnboardingService, OnboardingService>();
        
        return services;
    }
}

// Made with Bob
