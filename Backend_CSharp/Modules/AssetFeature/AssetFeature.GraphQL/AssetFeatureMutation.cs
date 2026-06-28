using HotChocolate;
using HotChocolate.Types;
using AssetFeature.Application.Services;
using AssetFeature.Domain;
using HRMS.Shared.Application.GraphQL;
using System.Security.Claims;

namespace AssetFeature.GraphQL;

[ExtendObjectType(typeof(Mutation))]
public class AssetFeatureMutation
{
    [GraphQLName("createAsset")]
    public async Task<Asset> CreateAssetAsync(
        [Service] IAssetService assetService,
        string serialNumber,
        string name,
        string category)
    {
        return await assetService.CreateAssetAsync(serialNumber, name, category);
    }

    [GraphQLName("allocateAsset")]
    public async Task<AssetAllocation> AllocateAssetAsync(
        [Service] IAssetService assetService,
        string assetId,
        string employeeId)
    {
        return await assetService.AllocateAssetAsync(assetId, employeeId);
    }

    [GraphQLName("requestAssetReturn")]
    public async Task<AssetAllocation?> RequestAssetReturnAsync(
        [Service] IAssetService assetService,
        ClaimsPrincipal claimsPrincipal,
        string allocationId,
        string reason)
    {
        return await assetService.RequestAssetReturnAsync(allocationId, reason);
    }

    [GraphQLName("processAssetReturn")]
    public async Task<AssetAllocation?> ProcessAssetReturnAsync(
        [Service] IAssetService assetService,
        string allocationId,
        string conditionOnReturn)
    {
        return await assetService.ProcessAssetReturnAsync(allocationId, conditionOnReturn);
    }
}

// Made with Bob