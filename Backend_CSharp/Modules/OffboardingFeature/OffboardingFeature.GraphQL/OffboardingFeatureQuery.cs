using HotChocolate;
using HotChocolate.Types;
using OffboardingFeature.Application.Services;
using OffboardingFeature.Domain;
using HRMS.Shared.Application.GraphQL;
using System.Security.Claims;

namespace OffboardingFeature.GraphQL;

[ExtendObjectType(typeof(Query))]
public class OffboardingFeatureQuery
{
    [GraphQLName("getMyResignationDetails")]
    public async Task<Resignation?> GetMyResignationDetailsAsync(
        [Service] IOffboardingService offboardingService,
        ClaimsPrincipal claimsPrincipal)
    {
        var employeeId = claimsPrincipal.FindFirst(ClaimTypes.NameIdentifier)?.Value 
            ?? throw new UnauthorizedAccessException("User not authenticated");
        
        return await offboardingService.GetResignationByEmployeeIdAsync(employeeId);
    }

    [GraphQLName("getMyClearanceStatus")]
    public async Task<List<ClearanceItem>> GetMyClearanceStatusAsync(
        [Service] IOffboardingService offboardingService,
        ClaimsPrincipal claimsPrincipal)
    {
        var employeeId = claimsPrincipal.FindFirst(ClaimTypes.NameIdentifier)?.Value 
            ?? throw new UnauthorizedAccessException("User not authenticated");
        
        return await offboardingService.GetClearanceItemsByEmployeeIdAsync(employeeId);
    }

    [GraphQLName("getPendingOffboardingRequests")]
    public async Task<List<Resignation>> GetPendingOffboardingRequestsAsync(
        [Service] IOffboardingService offboardingService)
    {
        return await offboardingService.GetPendingResignationsAsync();
    }

    [GraphQLName("getAllClearanceItems")]
    public async Task<List<ClearanceItem>> GetAllClearanceItemsAsync(
        [Service] IOffboardingService offboardingService,
        string employeeId)
    {
        return await offboardingService.GetClearanceItemsByEmployeeIdAsync(employeeId);
    }

    [GraphQLName("getExitInterview")]
    public async Task<ExitInterview?> GetExitInterviewAsync(
        [Service] IOffboardingService offboardingService,
        string employeeId)
    {
        return await offboardingService.GetExitInterviewByEmployeeIdAsync(employeeId);
    }
}

// Made with Bob