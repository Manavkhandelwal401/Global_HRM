using ServiceRequestFeature.Domain;

namespace ServiceRequestFeature.Application.Services;

public interface IServiceRequestService
{
    // Create and manage service requests
    Task<ServiceRequest> CreateServiceRequestAsync(string employeeId, string title, string description, string category, string priority);
    Task<ServiceRequest?> AssignServiceRequestAsync(string requestId, string assignedToId, string assignedToName);
    Task<ServiceRequest?> ResolveServiceRequestAsync(string requestId, string comments);
    
    // Query service requests
    Task<List<ServiceRequest>> GetMyServiceRequestsAsync(string employeeId);
    Task<List<ServiceRequest>> GetAllServiceRequestsAsync(string? category, string? status, string? priority);
    Task<ServiceRequest?> GetServiceRequestDetailsAsync(string requestId);
}

// Made with Bob