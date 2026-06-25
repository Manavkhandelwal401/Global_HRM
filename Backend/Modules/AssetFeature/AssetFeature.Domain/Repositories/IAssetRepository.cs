using AssetFeature.Domain;

namespace AssetFeature.Domain.Repositories;

public interface IAssetRepository
{
    // Asset operations
    Task CreateAssetAsync(Asset asset);
    Task<Asset?> GetAssetByIdAsync(string id);
    Task<List<Asset>> GetAllAssetsAsync(string? category, string? status);
    Task UpdateAssetAsync(Asset asset);
    
    // Allocation operations
    Task CreateAllocationAsync(AssetAllocation allocation);
    Task<AssetAllocation?> GetAllocationByIdAsync(string id);
    Task<List<AssetAllocation>> GetAllocationsByEmployeeIdAsync(string employeeId);
    Task<List<AssetAllocation>> GetAllAllocationsAsync();
    Task UpdateAllocationAsync(AssetAllocation allocation);
}
