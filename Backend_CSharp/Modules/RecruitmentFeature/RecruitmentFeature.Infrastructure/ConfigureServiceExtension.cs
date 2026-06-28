using HRMS.Core.Postgres.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using RecruitmentFeature.Infrastructure.Data;
using RecruitmentFeature.Infrastructure.Repositories;
using RecruitmentFeature.Application.Services;
using RecruitmentFeature.Domain;

namespace RecruitmentFeature.Infrastructure
{
    public static class ConfigureServiceExtension
    {
        public static IServiceCollection AddRecruitmentFeatureDependency(this IServiceCollection services, IConfiguration configuration)
        {
            services.TryAddEnumerable(ServiceDescriptor.Scoped<IPostgresEntityConfigurator, RecruitmentEntityConfiguration>());
            
            // Register repositories
            services.AddScoped<IRecruitmentRepository, RecruitmentRepository>();
            
            // Register services
            services.AddScoped<IRecruitmentService, RecruitmentService>();
            
            return services;
        }
    }
}

// Made with Bob
