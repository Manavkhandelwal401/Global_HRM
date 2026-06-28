using Microsoft.Extensions.DependencyInjection;
using ServiceRequestFeature.Application.Services;
using ServiceRequestFeature.Infrastructure.Repositories;
using ServiceRequestFeature.Domain.Repositories;

namespace ServiceRequestFeature.Infrastructure;

public static class ConfigureServiceExtension
{
    public static IServiceCollection AddServiceRequestFeatureInfrastructure(this IServiceCollection services)
    {
        // Register repositories
        services.AddScoped<IServiceRequestRepository, ServiceRequestRepository>();
        
        // Register services
        services.AddScoped<IServiceRequestService, ServiceRequestService>();
        
        return services;
    }
}

// Made with Bob