using RecognitionFeature.Domain;
using RecognitionFeature.Domain.Enums;
using HRMS.Core.Postgres.Common;
using HRMS.Core.Postgres.Repositories;
using Microsoft.EntityFrameworkCore;
using RecognitionFeature.Domain.Repositories;
using HRMS.Core.Postgres.Data;
using HRMS.Core.Telemetry;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace RecognitionFeature.Infrastructure.Repositories
{
    public class RecognitionRepository : PostgresRepository<RecognitionNomination>, IRecognitionRepository
    {
        public RecognitionRepository(
            PostgresDbContext context,
            ILogger<RecognitionRepository> logger,
            ITelemetryService telemetryService,
            IHttpContextAccessor httpContextAccessor)
            : base(context, logger, telemetryService, httpContextAccessor)
        {
        }

        public async Task<RecognitionNomination?> GetByIdAsync(string id)
        {
            return await _context.Set<RecognitionNomination>()
                .FirstOrDefaultAsync(n => n.Id == id);
        }

        public async Task<IEnumerable<RecognitionNomination>> GetApprovedNominationsAsync()
        {
            return await _context.Set<RecognitionNomination>()
                .Where(n => n.Status == NominationStatus.Approved)
                .OrderByDescending(n => n.ApprovedOn)
                .Take(50)
                .ToListAsync();
        }

        public async Task<int> GetEmployeePointsAsync(string employeeId)
        {
            var points = await _context.Set<RecognitionNomination>()
                .Where(n => n.NomineeId == employeeId && n.Status == NominationStatus.Approved)
                .SumAsync(n => n.Points);
            
            return points;
        }

        public async Task<RecognitionNomination?> CreateAsync(RecognitionNomination nomination)
        {
            await _context.Set<RecognitionNomination>().AddAsync(nomination);
            await _context.SaveChangesAsync();
            return nomination;
        }

        public async Task<RecognitionNomination?> UpdateAsync(RecognitionNomination nomination)
        {
            _context.Set<RecognitionNomination>().Update(nomination);
            await _context.SaveChangesAsync();
            return nomination;
        }
    }
}

// Made with Bob