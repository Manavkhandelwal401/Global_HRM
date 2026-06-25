using AssetFeature.Domain;

namespace AssetFeature.Application.Services;

public interface IAssetService
{
    // Asset Management
    Task<Asset> CreateAssetAsync(string serialNumber, string assetName, string category);
    Task<List<Asset>> GetAllAssetsAsync(string? category, string? status);
    Task<Asset?> GetAssetByIdAsync(string assetId);
    
    // Asset Allocation
    Task<AssetAllocation> AllocateAssetAsync(string assetId, string employeeId);
    Task<AssetAllocation?> RequestAssetReturnAsync(string allocationId, string reason);
    Task<AssetAllocation?> ProcessAssetReturnAsync(string allocationId, string conditionOnReturn);
    
    // Employee View
    Task<List<AssetAllocation>> GetMyAllocatedAssetsAsync(string employeeId);
    
    // Admin View
    Task<List<AssetAllocation>> GetAllAllocationsAsync();
}

// Made with Bob