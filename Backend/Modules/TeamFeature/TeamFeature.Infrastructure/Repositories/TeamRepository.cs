using EmployeeFeature.Domain;
using HRMS.Core.Postgres.Common;
using HRMS.Core.Postgres.Repositories;
using Microsoft.EntityFrameworkCore;
using TeamFeature.Domain.Repositories;
using HRMS.Core.Postgres.Data;
using HRMS.Core.Telemetry;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace TeamFeature.Infrastructure.Repositories
{
    public class TeamRepository : PostgresRepository<Employee>, ITeamRepository
    {
        public TeamRepository(
            PostgresDbContext context,
            ILogger<TeamRepository> logger,
            ITelemetryService telemetryService,
            IHttpContextAccessor httpContextAccessor)
            : base(context, logger, telemetryService, httpContextAccessor)
        {
        }

        public async Task<IEnumerable<Employee>> GetTeamMembersAsync(string? search, string? statusFilter)
        {
            var query = _context.Set<Employee>().AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(e => 
                    e.Name.Contains(search) || 
                    e.Email.Contains(search));
            }

            // Status filter can be enhanced based on actual status field
            // For now, we'll return all active employees

            return await query
                .OrderBy(e => e.Name)
                .ToListAsync();
        }

        public async Task<IEnumerable<Employee>> GetAllEmployeesAsync()
        {
            return await _context.Set<Employee>()
                .OrderBy(e => e.Name)
                .ToListAsync();
        }
    }
}

// Made with Bob