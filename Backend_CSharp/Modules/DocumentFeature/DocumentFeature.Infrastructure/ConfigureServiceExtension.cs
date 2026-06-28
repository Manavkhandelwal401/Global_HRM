using HRMS.Core.Postgres.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using DocumentFeature.Infrastructure.Data;
using DocumentFeature.Infrastructure.Repositories;
using DocumentFeature.Application.Services;
using DocumentFeature.Domain;


namespace DocumentFeature.Infrastructure
{
    public static class ConfigureServiceExtension
    {
        public static IServiceCollection AddDocumentFeatureDependency(this IServiceCollection services, IConfiguration configuration)
        {
            services.TryAddEnumerable(ServiceDescriptor.Scoped<IPostgresEntityConfigurator, DocumentEntityConfiguration>());
            
            // Register repositories
            services.AddScoped<IDocumentRepository, DocumentRepository>();
            
            // Register services
            services.AddScoped<IDocumentService, DocumentService>();
            
            return services;
        }
    }
}
