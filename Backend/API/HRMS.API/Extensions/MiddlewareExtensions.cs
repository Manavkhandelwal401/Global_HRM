using HRMS.API.Middleware;

namespace HRMS.API.Extensions
{
    public static class MiddlewareExtensions
    {
        public static IApplicationBuilder AddMiddleware(this IApplicationBuilder app)
        {
            var environment = app.ApplicationServices.GetRequiredService<IWebHostEnvironment>();

            app.UseMiddleware<ExceptionMiddleware>();
            app.UseMiddleware<LocalAPIMiddleware>();

            if (!environment.IsDevelopment() && !environment.EnvironmentName.Equals("Local", StringComparison.OrdinalIgnoreCase))
            {
                app.UseMiddleware<IPAddressMiddleware>();
            }

            return app;
        }
    }
}