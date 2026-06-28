using HotChocolate;
using HotChocolate.Types;
using AssetFeature.Application.Services;
using AssetFeature.Domain;
using HRMS.Shared.Application.GraphQL;
using System.Security.Claims;

namespace AssetFeature.GraphQL;

[ExtendObjectType(typeof(Query))]
public class AssetFeatureQuery
{
    [GraphQLName("getMyAllocatedAssets")]
    public async Task<List<AssetAllocation>> GetMyAllocatedAssetsAsync(
        [Service] IAssetService assetService,
        ClaimsPrincipal claimsPrincipal)
    {
        var employeeId = claimsPrincipal.FindFirst(ClaimTypes.NameIdentifier)?.Value 
            ?? throw new UnauthorizedAccessException("User not authenticated");
        
        return await assetService.GetMyAllocatedAssetsAsync(employeeId);
    }

    [GraphQLName("getAllAssets")]
    public async Task<List<Asset>> GetAllAssetsAsync(
        [Service] IAssetService assetService,
        string? category,
        string? status)
    {
        return await assetService.GetAllAssetsAsync(category, status);
    }

    [GraphQLName("getAllAllocations")]
    public async Task<List<AssetAllocation>> GetAllAllocationsAsync(
        [Service] IAssetService assetService)
    {
        return await assetService.GetAllAllocationsAsync();
    }
}

// Made with Bob