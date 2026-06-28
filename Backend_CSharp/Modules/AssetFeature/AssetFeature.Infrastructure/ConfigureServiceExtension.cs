using Microsoft.Extensions.DependencyInjection;
using AssetFeature.Application.Services;
using AssetFeature.Infrastructure.Repositories;
using AssetFeature.Domain.Repositories;

namespace AssetFeature.Infrastructure;

public static class ConfigureServiceExtension
{
    public static IServiceCollection AddAssetFeatureInfrastructure(this IServiceCollection services)
    {
        // Register repositories
        services.AddScoped<IAssetRepository, AssetRepository>();
        
        // Register services
        services.AddScoped<IAssetService, AssetService>();
        
        return services;
    }
}

// Made with Bob