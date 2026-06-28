using AnalyticsFeature.Domain;
using HRMS.Core.Postgres.Data;
using HRMS.Core.Postgres.Common;
using HRMS.Core.Postgres.Repositories;
using HRMS.Core.Telemetry;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace AnalyticsFeature.Infrastructure.Repositories
{
    public class AnalyticsRepository : PostgresRepository<AnalyticsMetric>, IAnalyticsRepository
    {
        public AnalyticsRepository(
            PostgresDbContext context,
            ILogger<AnalyticsRepository> logger,
            ITelemetryService telemetryService,
            IHttpContextAccessor httpContextAccessor)
            : base(context, logger, telemetryService, httpContextAccessor)
        {
        }
    }
}

// Made with Bob