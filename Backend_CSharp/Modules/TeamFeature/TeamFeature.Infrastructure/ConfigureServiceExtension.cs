using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TeamFeature.Infrastructure.Repositories;
using TeamFeature.Application.Services;
using TeamFeature.Domain.Repositories;

namespace TeamFeature.Infrastructure
{
    public static class ConfigureServiceExtension
    {
        public static IServiceCollection AddTeamFeatureDependency(this IServiceCollection services, IConfiguration configuration)
        {
            // Register repositories
            services.AddScoped<ITeamRepository, TeamRepository>();
            
            // Register services
            services.AddScoped<ITeamService, TeamService>();
            
            return services;
        }
    }
}

// Made with Bob
