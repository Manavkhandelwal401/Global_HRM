using DocumentFeature.Domain;
using HRMS.Core.Postgres.Common;
using HRMS.Core.Postgres.Repositories;
using Microsoft.EntityFrameworkCore;
using HRMS.Core.Postgres.Data;
using HRMS.Core.Telemetry;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace DocumentFeature.Infrastructure.Repositories
{
    public class DocumentRepository : PostgresRepository<Document>, IDocumentRepository
    {
        public DocumentRepository(
            PostgresDbContext context,
            ILogger<DocumentRepository> logger,
            ITelemetryService telemetryService,
            IHttpContextAccessor httpContextAccessor)
            : base(context, logger, telemetryService, httpContextAccessor)
        {
        }

        public async Task<IEnumerable<Document>> GetEmployeeDocumentsAsync(string employeeId)
        {
            return await _context.Set<Document>()
                .Where(d => d.EmployeeId == employeeId)
                .OrderBy(d => d.Category)
                .ThenByDescending(d => d.CreatedOn)
                .ToListAsync();
        }

        public async Task<Document?> GetDocumentByIdAsync(string documentId)
        {
            return await _context.Set<Document>()
                .FirstOrDefaultAsync(d => d.Id == documentId);
        }
    }
}

// Made with Bob