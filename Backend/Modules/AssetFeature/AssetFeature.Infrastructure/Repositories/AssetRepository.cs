using Microsoft.EntityFrameworkCore;
using AssetFeature.Domain;
using AssetFeature.Domain.Enums;
using HRMS.Core.Postgres.Data;
using AssetFeature.Domain.Repositories;

namespace AssetFeature.Infrastructure.Repositories;

public class AssetRepository : IAssetRepository
{
    private readonly PostgresDbContext _context;

    public AssetRepository(PostgresDbContext context)
    {
        _context = context;
    }

    // Asset operations
    public async Task CreateAssetAsync(Asset asset)
    {
        await _context.Set<Asset>().AddAsync(asset);
        await _context.SaveChangesAsync();
    }

    public async Task<Asset?> GetAssetByIdAsync(string id)
    {
        return await _context.Set<Asset>()
            .FirstOrDefaultAsync(a => a.Id == id);
    }

    public async Task<List<Asset>> GetAllAssetsAsync(string? category, string? status)
    {
        var query = _context.Set<Asset>().AsQueryable();

        if (!string.IsNullOrEmpty(category))
        {
            var categoryEnum = Enum.Parse<AssetCategory>(category);
            query = query.Where(a => a.Category == categoryEnum);
        }

        if (!string.IsNullOrEmpty(status))
        {
            var statusEnum = Enum.Parse<AssetStatus>(status);
            query = query.Where(a => a.Status == statusEnum);
        }

        return await query.OrderBy(a => a.AssetName).ToListAsync();
    }

    public async Task UpdateAssetAsync(Asset asset)
    {
        _context.Set<Asset>().Update(asset);
        await _context.SaveChangesAsync();
    }

    // Allocation operations
    public async Task CreateAllocationAsync(AssetAllocation allocation)
    {
        await _context.Set<AssetAllocation>().AddAsync(allocation);
        await _context.SaveChangesAsync();
    }

    public async Task<AssetAllocation?> GetAllocationByIdAsync(string id)
    {
        return await _context.Set<AssetAllocation>()
            .Include(a => a.Asset)
            .FirstOrDefaultAsync(a => a.Id == id);
    }

    public async Task<List<AssetAllocation>> GetAllocationsByEmployeeIdAsync(string employeeId)
    {
        return await _context.Set<AssetAllocation>()
            .Include(a => a.Asset)
            .Where(a => a.EmployeeId == employeeId && a.ReturnedOn == null)
            .OrderByDescending(a => a.AllocatedOn)
            .ToListAsync();
    }

    public async Task<List<AssetAllocation>> GetAllAllocationsAsync()
    {
        return await _context.Set<AssetAllocation>()
            .Include(a => a.Asset)
            .OrderByDescending(a => a.AllocatedOn)
            .ToListAsync();
    }

    public async Task UpdateAllocationAsync(AssetAllocation allocation)
    {
        _context.Set<AssetAllocation>().Update(allocation);
        await _context.SaveChangesAsync();
    }
}

// Made with Bob