using ServiceRequestFeature.Domain;

namespace ServiceRequestFeature.Domain.Repositories;

public interface IServiceRequestRepository
{
    Task CreateServiceRequestAsync(ServiceRequest serviceRequest);
    Task<ServiceRequest?> GetServiceRequestByIdAsync(string id);
    Task<List<ServiceRequest>> GetServiceRequestsByEmployeeIdAsync(string employeeId);
    Task<List<ServiceRequest>> GetAllServiceRequestsAsync(string? category, string? status, string? priority);
    Task UpdateServiceRequestAsync(ServiceRequest serviceRequest);
}
