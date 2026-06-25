using HotChocolate;
using HotChocolate.Types;
using ServiceRequestFeature.Application.Services;
using ServiceRequestFeature.Domain;
using HRMS.Shared.Application.GraphQL;
using System.Security.Claims;

namespace ServiceRequestFeature.GraphQL;

[ExtendObjectType(typeof(Query))]
public class ServiceRequestFeatureQuery
{
    [GraphQLName("getMyServiceRequests")]
    public async Task<List<ServiceRequest>> GetMyServiceRequestsAsync(
        [Service] IServiceRequestService serviceRequestService,
        ClaimsPrincipal claimsPrincipal)
    {
        var employeeId = claimsPrincipal.FindFirst(ClaimTypes.NameIdentifier)?.Value 
            ?? throw new UnauthorizedAccessException("User not authenticated");
        
        return await serviceRequestService.GetMyServiceRequestsAsync(employeeId);
    }

    [GraphQLName("getAllServiceRequests")]
    public async Task<List<ServiceRequest>> GetAllServiceRequestsAsync(
        [Service] IServiceRequestService serviceRequestService,
        string? category = null,
        string? status = null,
        string? priority = null)
    {
        return await serviceRequestService.GetAllServiceRequestsAsync(category, status, priority);
    }

    [GraphQLName("getServiceRequestDetails")]
    public async Task<ServiceRequest?> GetServiceRequestDetailsAsync(
        [Service] IServiceRequestService serviceRequestService,
        string requestId)
    {
        return await serviceRequestService.GetServiceRequestDetailsAsync(requestId);
    }
}

// Made with Bob