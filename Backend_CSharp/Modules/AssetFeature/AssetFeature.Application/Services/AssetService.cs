using AssetFeature.Domain;
using AssetFeature.Domain.Enums;
using AssetFeature.Domain.Repositories;

namespace AssetFeature.Application.Services;

public class AssetService : IAssetService
{
    private readonly IAssetRepository _repository;

    public AssetService(IAssetRepository repository)
    {
        _repository = repository;
    }

    public async Task<Asset> CreateAssetAsync(string serialNumber, string assetName, string category)
    {
        var asset = new Asset
        {
            Id = Guid.NewGuid().ToString(),
            SerialNumber = serialNumber,
            AssetName = assetName,
            Category = Enum.Parse<AssetCategory>(category),
            Condition = AssetCondition.New,
            Status = AssetStatus.Available
        };

        await _repository.CreateAssetAsync(asset);
        return asset;
    }

    public async Task<List<Asset>> GetAllAssetsAsync(string? category, string? status)
    {
        return await _repository.GetAllAssetsAsync(category, status);
    }

    public async Task<Asset?> GetAssetByIdAsync(string assetId)
    {
        return await _repository.GetAssetByIdAsync(assetId);
    }

    public async Task<AssetAllocation> AllocateAssetAsync(string assetId, string employeeId)
    {
        var asset = await _repository.GetAssetByIdAsync(assetId);
        
        if (asset == null)
            throw new Exception("Asset not found");
        
        if (asset.Status != AssetStatus.Available)
            throw new Exception("Asset is not available for allocation");

        var allocation = new AssetAllocation
        {
            Id = Guid.NewGuid().ToString(),
            AssetId = assetId,
            EmployeeId = employeeId,
            AllocatedOn = DateTime.UtcNow
        };

        // Update asset status
        asset.Status = AssetStatus.Allocated;
        await _repository.UpdateAssetAsync(asset);

        await _repository.CreateAllocationAsync(allocation);
        return allocation;
    }

    public async Task<AssetAllocation?> RequestAssetReturnAsync(string allocationId, string reason)
    {
        var allocation = await _repository.GetAllocationByIdAsync(allocationId);
        
        if (allocation == null)
            return null;

        allocation.ReturnReason = reason;
        await _repository.UpdateAllocationAsync(allocation);
        
        return allocation;
    }

    public async Task<AssetAllocation?> ProcessAssetReturnAsync(string allocationId, string conditionOnReturn)
    {
        var allocation = await _repository.GetAllocationByIdAsync(allocationId);
        
        if (allocation == null)
            return null;

        allocation.ReturnedOn = DateTime.UtcNow;
        allocation.ConditionOnReturn = Enum.Parse<AssetCondition>(conditionOnReturn);

        // Update asset status and condition
        var asset = await _repository.GetAssetByIdAsync(allocation.AssetId);
        if (asset != null)
        {
            asset.Status = AssetStatus.Returned;
            asset.Condition = allocation.ConditionOnReturn.Value;
            await _repository.UpdateAssetAsync(asset);
        }

        await _repository.UpdateAllocationAsync(allocation);
        return allocation;
    }

    public async Task<List<AssetAllocation>> GetMyAllocatedAssetsAsync(string employeeId)
    {
        return await _repository.GetAllocationsByEmployeeIdAsync(employeeId);
    }

    public async Task<List<AssetAllocation>> GetAllAllocationsAsync()
    {
        return await _repository.GetAllAllocationsAsync();
    }
}

// Made with Bob