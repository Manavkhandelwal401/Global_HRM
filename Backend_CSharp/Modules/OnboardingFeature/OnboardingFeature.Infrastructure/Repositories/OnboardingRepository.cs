using Microsoft.EntityFrameworkCore;
using OnboardingFeature.Domain;
using HRMS.Core.Postgres.Data;

namespace OnboardingFeature.Infrastructure.Repositories;

public class OnboardingRepository : IOnboardingRepository
{
    private readonly PostgresDbContext _context;

    public OnboardingRepository(PostgresDbContext context)
    {
        _context = context;
    }

    public async Task CreateChecklistsAsync(List<OnboardingChecklist> checklists)
    {
        await _context.Set<OnboardingChecklist>().AddRangeAsync(checklists);
        await _context.SaveChangesAsync();
    }

    public async Task<OnboardingChecklist?> GetChecklistByIdAsync(string id)
    {
        return await _context.Set<OnboardingChecklist>()
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<List<OnboardingChecklist>> GetChecklistsByEmployeeIdAsync(string employeeId)
    {
        return await _context.Set<OnboardingChecklist>()
            .Where(c => c.EmployeeId == employeeId)
            .OrderBy(c => c.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<OnboardingChecklist>> GetAllChecklistsAsync()
    {
        return await _context.Set<OnboardingChecklist>()
            .OrderBy(c => c.CreatedAt)
            .ToListAsync();
    }

    public async Task UpdateChecklistAsync(OnboardingChecklist checklist)
    {
        _context.Set<OnboardingChecklist>().Update(checklist);
        await _context.SaveChangesAsync();
    }
}

// Made with Bob
