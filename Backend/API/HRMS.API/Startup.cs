using Microsoft.EntityFrameworkCore;
using HRMS.Core.Postgres;
using HRMS.API.Extensions;
using HRMS.API.RegisterDependencies;
using HRMS.Shared.Infrastructure.Extensions;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Net;
using System.Reflection;
using System.Text.Json.Serialization;
using TodoFeature.Application.DTO;
using EmployeeFeature.Application.Services;
using EmployeeFeature.Application.DTOs;

namespace HRMS.API
{
    public class NoCacheFilter : IActionFilter
    {
        public void OnActionExecuted(ActionExecutedContext context)
        {
            //we return in case of WebSockets
            if (!context.HttpContext.WebSockets.IsWebSocketRequest)
            {
                context.HttpContext.Response.Headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0";
                context.HttpContext.Response.Headers["Pragma"] = "no-cache";
                context.HttpContext.Response.Headers["Expires"] = "-1";
            }
        }

        public void OnActionExecuting(ActionExecutingContext context)
        { }
    }

    public class Startup
    {
        public void Configure(WebApplication app, IWebHostEnvironment env, IConfiguration configuration)
        {
            app.UseForwardedHeaders();

            app.UseHttpsRedirection();

            app.UseStaticFiles();

            _ = Task.Run(() =>
            {
                try
                {
                    using (var serviceScope = app.Services.GetRequiredService<IServiceScopeFactory>().CreateScope())
                    {
                        var context = serviceScope.ServiceProvider.GetRequiredService<HRMS.Core.Postgres.Data.PostgresDbContext>();
                        context.Database.EnsureCreated();

                        // Run ALTER TABLE to ensure registration columns exist in the DB
                        context.Database.OpenConnection();
                        // Step 1: Add registration columns if they don't exist
                        using (var cmd = context.Database.GetDbConnection().CreateCommand())
                        {
                            cmd.CommandText = @"
                                ALTER TABLE ""Employees"" ADD COLUMN IF NOT EXISTS ""PasswordHash"" character varying(500);
                                ALTER TABLE ""Employees"" ADD COLUMN IF NOT EXISTS ""ActivationCode"" character varying(100);
                                ALTER TABLE ""Employees"" ADD COLUMN IF NOT EXISTS ""RegistrationStatus"" character varying(50);
                                ALTER TABLE ""Employees"" ADD COLUMN IF NOT EXISTS ""ActivationCodeStatus"" character varying(50);
                                ALTER TABLE ""Employees"" ADD COLUMN IF NOT EXISTS ""ActivationCodeExpiry"" timestamp with time zone;
                                ALTER TABLE ""Employees"" ADD COLUMN IF NOT EXISTS ""RegistrationTimestamp"" timestamp with time zone;
                            ";
                            cmd.ExecuteNonQuery();
                        }

                        // Step 2: Upsert seed employees with correct auth data
                        using (var cmd = context.Database.GetDbConnection().CreateCommand())
                        {
                            cmd.CommandText = @"
                                -- Upsert Admin, HR, Manager with full auth data (always overwrite so they can always log in)
                                INSERT INTO ""Employees"" (""Id"", ""Name"", ""Email"", ""Designation"", ""Department"", ""Role"", ""JoiningDate"", ""Country"", ""Status"", ""PasswordHash"", ""RegistrationStatus"", ""ActivationCodeStatus"", ""ActivationCode"", ""ActivationCodeExpiry"", ""CreatedOn"", ""DocumentType"")
                                VALUES 
                                ('emp-admin-001', 'Mayank Khandelwal', 'mayank@workflowglobal.com', 'System Administrator', 'IT', 0, '2020-01-01 00:00:00+00', 0, 0, 'v9a3tFBDqT0rQA9JwmZChOrETMYnobmNRr4RuMDEpo0=', 'Registered', 'Used', 'REG-MAYANK-123', '2028-01-01 00:00:00+00', NOW(), 'Employee'),
                                ('emp-hr-001', 'Darsh Khandelwal', 'darsh@workflowglobal.com', 'HR Manager', 'Human Resources', 1, '2020-03-15 00:00:00+00', 0, 0, 'nZm+XUELmxSPQW8EPkOlv0hYzpirvXcJUiZuOv5txRc=', 'Registered', 'Used', 'REG-DARSH-123', '2028-01-01 00:00:00+00', NOW(), 'Employee'),
                                ('emp-mgr-001', 'Parul Goyal', 'parul@workflowglobal.com', 'Engineering Manager', 'Engineering', 2, '2021-06-01 00:00:00+00', 0, 0, 'YkeL0AEnYhr9Q0T6gPc29T2PClGjI10U3q9EHzkS5Ng=', 'Registered', 'Used', 'REG-PARUL-123', '2028-01-01 00:00:00+00', NOW(), 'Employee')
                                ON CONFLICT (""Id"") DO UPDATE SET 
                                    ""Name"" = EXCLUDED.""Name"",
                                    ""Email"" = EXCLUDED.""Email"",
                                    ""Designation"" = EXCLUDED.""Designation"",
                                    ""Department"" = EXCLUDED.""Department"",
                                    ""PasswordHash"" = EXCLUDED.""PasswordHash"",
                                    ""RegistrationStatus"" = 'Registered',
                                    ""ActivationCodeStatus"" = 'Used',
                                    ""ActivationCode"" = EXCLUDED.""ActivationCode"",
                                    ""ActivationCodeExpiry"" = EXCLUDED.""ActivationCodeExpiry"",
                                    ""Role"" = EXCLUDED.""Role"";

                                -- Upsert pending employees (preserve PasswordHash/RegistrationStatus if already self-registered)
                                INSERT INTO ""Employees"" (""Id"", ""Name"", ""Email"", ""Designation"", ""Department"", ""ManagerId"", ""Role"", ""JoiningDate"", ""Country"", ""Status"", ""PasswordHash"", ""RegistrationStatus"", ""ActivationCodeStatus"", ""ActivationCode"", ""ActivationCodeExpiry"", ""CreatedOn"", ""DocumentType"")
                                VALUES 
                                ('emp-001', 'Varshita Sharma', 'varshita@workflowglobal.com', 'Senior Software Engineer', 'Engineering', 'emp-mgr-001', 3, '2022-01-10 00:00:00+00', 0, 0, NULL, 'Pending', 'Unused', 'REG-VARSHITA-987', '2028-01-01 00:00:00+00', NOW(), 'Employee'),
                                ('emp-002', 'Bhavishya Khandelwal', 'bhavishya@workflowglobal.com', 'Junior Developer', 'Engineering', 'emp-mgr-001', 3, '2023-05-01 00:00:00+00', 0, 0, NULL, 'Pending', 'Unused', 'REG-BHAVISHYA-654', '2028-01-01 00:00:00+00', NOW(), 'Employee')
                                ON CONFLICT (""Id"") DO UPDATE SET
                                    -- Only update activation code; preserve RegistrationStatus/PasswordHash if already registered
                                    ""ActivationCode"" = CASE WHEN ""Employees"".""RegistrationStatus"" = 'Pending' THEN EXCLUDED.""ActivationCode"" ELSE ""Employees"".""ActivationCode"" END,
                                    ""ActivationCodeExpiry"" = CASE WHEN ""Employees"".""RegistrationStatus"" = 'Pending' THEN EXCLUDED.""ActivationCodeExpiry"" ELSE ""Employees"".""ActivationCodeExpiry"" END,
                                    ""ActivationCodeStatus"" = CASE WHEN ""Employees"".""RegistrationStatus"" = 'Pending' THEN 'Unused' ELSE ""Employees"".""ActivationCodeStatus"" END;

                                -- Fix any other existing employees that have NULL RegistrationStatus but have a PasswordHash (old data pre-migration)
                                UPDATE ""Employees"" SET ""RegistrationStatus"" = 'Registered' 
                                WHERE ""RegistrationStatus"" IS NULL AND ""PasswordHash"" IS NOT NULL AND ""PasswordHash"" != '';

                                -- Fix any existing employees with NULL RegistrationStatus and no password (set to Pending)
                                UPDATE ""Employees"" SET ""RegistrationStatus"" = 'Pending', ""ActivationCodeStatus"" = COALESCE(""ActivationCodeStatus"", 'Unused')
                                WHERE ""RegistrationStatus"" IS NULL AND (""PasswordHash"" IS NULL OR ""PasswordHash"" = '');
                            ";
                            cmd.ExecuteNonQuery();
                        }
                    }
                    Console.WriteLine("PostgreSQL database initialized successfully");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error initializing PostgreSQL database: {ex.Message}");
                }
            });

            app.UseRouting();
            app.UseRequestTimeouts();
            app.UseCors();
            app.AddMiddleware();
            app.UseAuthentication();
            app.UseAuthorization();

            app.Use(async (context, next) =>
            {
                context.Response.Headers.CacheControl = "no-store, no-cache, must-revalidate, max-age=0";
                context.Response.Headers.Pragma = "no-cache";
                context.Response.Headers.Expires = "-1";
                await next();
            });

            bool enableGraphQLTool = configuration.GetValue<bool>("GraphQL:Tool:Enable", env.IsDevelopment());

            app.MapControllers();

            app.MapPost("/auth/login", async (HttpContext context, IAuthService authService) =>
            {
                var request = await context.Request.ReadFromJsonAsync<LoginRequest>();
                if (request == null) return Results.BadRequest("Invalid request");
                var response = await authService.LoginAsync(request);
                if (!response.Success || response.User == null)
                {
                    return Results.Json(new { message = response.Message ?? "Invalid credentials" }, statusCode: 400);
                }
                return Results.Ok(new
                {
                    accessToken = response.Token,
                    refreshToken = response.Token,
                    user = new
                    {
                        id = response.User.Id,
                        email = response.User.Email,
                        name = response.User.Name,
                        role = response.User.Role.ToString()
                    }
                });
            });

            app.MapPost("/auth/refresh", (HttpContext context) =>
            {
                return Results.Ok(new { accessToken = "demo-refresh-token", refreshToken = "demo-refresh-token" });
            });

            app.MapPost("/auth/signup", async (HttpContext context, IAuthService authService) =>
            {
                var request = await context.Request.ReadFromJsonAsync<SignupRequest>();
                if (request == null) return Results.BadRequest("Invalid signup request");
                var response = await authService.SignupAsync(request.EmployeeId, request.Email, request.RegistrationCode, request.Password);
                if (!response.Success)
                {
                    return Results.Json(new { message = response.Message ?? "Registration failed" }, statusCode: 400);
                }
                return Results.Ok(new { message = response.Message });
            });

            app.MapGraphQL()
                .WithOptions(options =>
                {
                    options.Tool.Enable = enableGraphQLTool;
                });

            //app.UseVoyager(new VoyagerOptions
            //{
            //    Path = "/voyager",
            //});
        }

        public void ConfigureServices(IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<ForwardedHeadersOptions>(options =>
            {
                options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
                // Replace with your actual reverse proxy / load balancer IP. For Azure App Gateway
                // or Front Door, add their published egress ranges to KnownNetworks instead of a
                // single IP: options.KnownNetworks.Add(new IPNetwork(IPAddress.Parse("10.0.0.0"), 8));
                options.KnownProxies.Add(IPAddress.Parse("10.0.0.1"));
            });

            services.AddControllers()
                   .AddJsonOptions(options =>
                   {
                       options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
                   });

            services.AddEndpointsApiExplorer();

            // Register IHttpClientFactory for proper HttpClient management This prevents socket
            // exhaustion and memory leaks from creating new HttpClient instances
            services.AddHttpClient();

            services.AddInjectionApplication(configuration, [typeof(CreateTodoHandler).Assembly]);
            services.AddInjectionPostgres(configuration);
            services.AddModulesDependencyInjection(configuration);

            // Background services are not needed without websocket middleware.

            services.ConfigureApiBehavior();
            services.ConfigureCorsPolicy(configuration);
            services.ConfigureGraphQL(configuration);

            services.AddMemoryCache();
            services.AddMvc(options =>
            {
                options.Filters.Add(new NoCacheFilter());
            });

            //services.AddApiVersioning(config =>
            //{
            //    config.DefaultApiVersion = new ApiVersion(1, 0);
            //    config.AssumeDefaultVersionWhenUnspecified = true;
            //    config.ApiVersionReader = ApiVersionReader.Combine(
            //        new UrlSegmentApiVersionReader(),
            //        new QueryStringApiVersionReader("version"),
            //        new HeaderApiVersionReader("X-Version")
            //    );
            //});
        }
    }

    public class SignupRequest
    {
        public string EmployeeId { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string RegistrationCode { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
