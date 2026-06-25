using HRMS.Core.Postgres.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using AnnouncementFeature.Infrastructure.Data;
using AnnouncementFeature.Infrastructure.Repositories;
using AnnouncementFeature.Application.Services;
using AnnouncementFeature.Domain;

namespace AnnouncementFeature.Infrastructure
{
    public static class ConfigureServiceExtension
    {
        public static IServiceCollection AddAnnouncementFeatureDependency(this IServiceCollection services, IConfiguration configuration)
        {
            services.TryAddEnumerable(ServiceDescriptor.Scoped<IPostgresEntityConfigurator, AnnouncementEntityConfiguration>());
            
            // Register repositories
            services.AddScoped<IAnnouncementRepository, AnnouncementRepository>();
            
            // Register services
            services.AddScoped<IAnnouncementService, AnnouncementService>();
            
            return services;
        }
    }
}

// Made with Bob
