using HRMS.Core.Postgres.Interfaces;
using PayrollFeature.Domain;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using PayrollFeature.Infrastructure.Data;
using PayrollFeature.Infrastructure.Repositories;
using PayrollFeature.Application.Services;


namespace PayrollFeature.Infrastructure
{
    public static class ConfigureServiceExtension
    {
        public static IServiceCollection AddPayrollFeatureDependency(this IServiceCollection services, IConfiguration configuration)
        {
            services.TryAddEnumerable(ServiceDescriptor.Scoped<IPostgresEntityConfigurator, PayrollEntityConfiguration>());
            
            // Register repositories
            services.AddScoped<IPayrollRepository, PayrollRepository>();
            
            // Register services
            services.AddScoped<IPayrollService, PayrollService>();
            
            return services;
        }
    }
}