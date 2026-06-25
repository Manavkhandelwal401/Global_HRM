using HotChocolate;
using HotChocolate.Types;
using ServiceRequestFeature.Application.Services;
using ServiceRequestFeature.Domain;
using HRMS.Shared.Application.GraphQL;
using System.Security.Claims;

namespace ServiceRequestFeature.GraphQL;

[ExtendObjectType(typeof(Mutation))]
public class ServiceRequestFeatureMutation
{
    [GraphQLName("createServiceRequest")]
    public async Task<ServiceRequest> CreateServiceRequestAsync(
        [Service] IServiceRequestService serviceRequestService,
        ClaimsPrincipal claimsPrincipal,
        string title,
        string description,
        string category,
        string priority)
    {
        var employeeId = claimsPrincipal.FindFirst(ClaimTypes.NameIdentifier)?.Value 
            ?? throw new UnauthorizedAccessException("User not authenticated");
        
        return await serviceRequestService.CreateServiceRequestAsync(employeeId, title, description, category, priority);
    }

    [GraphQLName("assignServiceRequest")]
    public async Task<ServiceRequest?> AssignServiceRequestAsync(
        [Service] IServiceRequestService serviceRequestService,
        ClaimsPrincipal claimsPrincipal,
        string requestId,
        string assignedToId,
        string assignedToName)
    {
        var assignedBy = claimsPrincipal.FindFirst(ClaimTypes.NameIdentifier)?.Value 
            ?? throw new UnauthorizedAccessException("User not authenticated");
        
        return await serviceRequestService.AssignServiceRequestAsync(requestId, assignedToId, assignedToName);
    }

    [GraphQLName("resolveServiceRequest")]
    public async Task<ServiceRequest?> ResolveServiceRequestAsync(
        [Service] IServiceRequestService serviceRequestService,
        ClaimsPrincipal claimsPrincipal,
        string requestId,
        string resolutionComments)
    {
        var resolvedBy = claimsPrincipal.FindFirst(ClaimTypes.NameIdentifier)?.Value 
            ?? throw new UnauthorizedAccessException("User not authenticated");
        
        return await serviceRequestService.ResolveServiceRequestAsync(requestId, resolutionComments);
    }
}

// Made with Bob