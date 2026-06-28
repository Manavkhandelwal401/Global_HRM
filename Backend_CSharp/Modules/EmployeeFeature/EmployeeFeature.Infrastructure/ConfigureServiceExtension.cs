using HRMS.Core.Postgres.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using EmployeeFeature.Infrastructure.Data;
using EmployeeFeature.Application.Services;

namespace EmployeeFeature.Infrastructure
{
    public static class ConfigureServiceExtension
    {
        public static IServiceCollection AddEmployeeFeatureDependency(this IServiceCollection services, IConfiguration configuration)
        {
            services.TryAddEnumerable(ServiceDescriptor.Scoped<IPostgresEntityConfigurator, EmployeeEntityConfiguration>());
            services.AddScoped<IAuthService, AuthService>();
            return services;
        }
    }
}
