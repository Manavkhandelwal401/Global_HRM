using HRMS.Core.Postgres.Interfaces;
using ExpenseFeature.Domain;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using ExpenseFeature.Infrastructure.Data;
using ExpenseFeature.Infrastructure.Repositories;
using ExpenseFeature.Application.Services;


namespace ExpenseFeature.Infrastructure
{
    public static class ConfigureServiceExtension
    {
        public static IServiceCollection AddExpenseFeatureDependency(this IServiceCollection services, IConfiguration configuration)
        {
            services.TryAddEnumerable(ServiceDescriptor.Scoped<IPostgresEntityConfigurator, ExpenseEntityConfiguration>());
            
            // Register repositories
            services.AddScoped<IExpenseRepository, ExpenseRepository>();
            
            // Register services
            services.AddScoped<IExpenseService, ExpenseService>();
            
            return services;
        }
    }
}