using Microsoft.EntityFrameworkCore;
using OffboardingFeature.Domain;
using OffboardingFeature.Domain.Enums;
using HRMS.Core.Postgres.Data;
using OffboardingFeature.Domain.Repositories;

namespace OffboardingFeature.Infrastructure.Repositories;

public class OffboardingRepository : IOffboardingRepository
{
    private readonly PostgresDbContext _context;

    public OffboardingRepository(PostgresDbContext context)
    {
        _context = context;
    }

    // Resignation operations
    public async Task CreateResignationAsync(Resignation resignation)
    {
        await _context.Set<Resignation>().AddAsync(resignation);
        await _context.SaveChangesAsync();
    }

    public async Task<Resignation?> GetResignationByIdAsync(string id)
    {
        return await _context.Set<Resignation>()
            .FirstOrDefaultAsync(r => r.Id == id);
    }

    public async Task<Resignation?> GetResignationByEmployeeIdAsync(string employeeId)
    {
        return await _context.Set<Resignation>()
            .Where(r => r.EmployeeId == employeeId)
            .OrderByDescending(r => r.SubmissionDate)
            .FirstOrDefaultAsync();
    }

    public async Task<List<Resignation>> GetPendingResignationsAsync()
    {
        return await _context.Set<Resignation>()
            .Where(r => r.Status == ResignationStatus.Pending)
            .OrderBy(r => r.SubmissionDate)
            .ToListAsync();
    }

    public async Task UpdateResignationAsync(Resignation resignation)
    {
        _context.Set<Resignation>().Update(resignation);
        await _context.SaveChangesAsync();
    }

    // Clearance operations
    public async Task CreateClearanceItemsAsync(List<ClearanceItem> clearanceItems)
    {
        await _context.Set<ClearanceItem>().AddRangeAsync(clearanceItems);
        await _context.SaveChangesAsync();
    }

    public async Task<ClearanceItem?> GetClearanceItemByIdAsync(string id)
    {
        return await _context.Set<ClearanceItem>()
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<List<ClearanceItem>> GetClearanceItemsByEmployeeIdAsync(string employeeId)
    {
        return await _context.Set<ClearanceItem>()
            .Where(c => c.EmployeeId == employeeId)
            .OrderBy(c => c.Department)
            .ToListAsync();
    }

    public async Task UpdateClearanceItemAsync(ClearanceItem clearanceItem)
    {
        _context.Set<ClearanceItem>().Update(clearanceItem);
        await _context.SaveChangesAsync();
    }

    // Exit interview operations
    public async Task CreateExitInterviewAsync(ExitInterview exitInterview)
    {
        await _context.Set<ExitInterview>().AddAsync(exitInterview);
        await _context.SaveChangesAsync();
    }

    public async Task<ExitInterview?> GetExitInterviewByEmployeeIdAsync(string employeeId)
    {
        return await _context.Set<ExitInterview>()
            .Where(e => e.EmployeeId == employeeId)
            .OrderByDescending(e => e.CreatedAt)
            .FirstOrDefaultAsync();
    }
}

// Made with Bob