using ExpenseFeature.Domain;
using ExpenseFeature.Domain.Enums;
using HRMS.Core.Postgres.Common;
using HRMS.Core.Postgres.Repositories;
using Microsoft.EntityFrameworkCore;
using HRMS.Core.Postgres.Data;
using HRMS.Core.Telemetry;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace ExpenseFeature.Infrastructure.Repositories
{
    public class ExpenseRepository : PostgresRepository<Reimbursement>, IExpenseRepository
    {
        public ExpenseRepository(
            PostgresDbContext context,
            ILogger<ExpenseRepository> logger,
            ITelemetryService telemetryService,
            IHttpContextAccessor httpContextAccessor)
            : base(context, logger, telemetryService, httpContextAccessor)
        {
        }

        public async Task<IEnumerable<Reimbursement>> GetEmployeeExpensesAsync(string employeeId)
        {
            return await _context.Set<Reimbursement>()
                .Where(r => r.EmployeeId == employeeId)
                .OrderByDescending(r => r.Date)
                .ToListAsync();
        }

        public async Task<IEnumerable<Reimbursement>> GetPendingApprovalsAsync(string managerId)
        {
            // Get all employees who report to this manager
            var employees = await _context.Set<EmployeeFeature.Domain.Employee>()
                .Where(e => e.ManagerId == managerId)
                .Select(e => e.Id)
                .ToListAsync();

            // Get pending expense requests for those employees
            return await _context.Set<Reimbursement>()
                .Where(r => employees.Contains(r.EmployeeId) && r.Status == ReimbursementStatus.Pending)
                .OrderBy(r => r.Date)
                .ToListAsync();
        }

        public async Task<Reimbursement?> GetExpenseByIdAsync(string expenseId)
        {
            return await _context.Set<Reimbursement>()
                .FirstOrDefaultAsync(r => r.Id == expenseId);
        }
    }
}

// Made with Bob