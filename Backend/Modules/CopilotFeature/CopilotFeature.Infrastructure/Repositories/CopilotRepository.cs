using CopilotFeature.Domain;
using CopilotFeature.Domain.Repositories;
using HRMS.Core.Postgres.Common;
using HRMS.Core.Postgres.Repositories;
using Microsoft.EntityFrameworkCore;
using HRMS.Core.Postgres.Data;
using HRMS.Core.Telemetry;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace CopilotFeature.Infrastructure.Repositories
{
    public class CopilotRepository : PostgresRepository<CopilotInteraction>, ICopilotRepository
    {
        public CopilotRepository(
            PostgresDbContext context,
            ILogger<CopilotRepository> logger,
            ITelemetryService telemetryService,
            IHttpContextAccessor httpContextAccessor)
            : base(context, logger, telemetryService, httpContextAccessor)
        {
        }

        public async Task<CopilotInteraction?> CreateAsync(CopilotInteraction interaction)
        {
            await _context.Set<CopilotInteraction>().AddAsync(interaction);
            await _context.SaveChangesAsync();
            return interaction;
        }

        public async Task<IEnumerable<CopilotInteraction>> GetEmployeeInteractionsAsync(string employeeId)
        {
            return await _context.Set<CopilotInteraction>()
                .Where(i => i.EmployeeId == employeeId)
                .OrderByDescending(i => i.InteractionTime)
                .Take(10)
                .ToListAsync();
        }
    }
}

// Made with Bob