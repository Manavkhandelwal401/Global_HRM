using ServiceRequestFeature.Domain;
using ServiceRequestFeature.Domain.Enums;
using ServiceRequestFeature.Domain.Repositories;

namespace ServiceRequestFeature.Application.Services;

public class ServiceRequestService : IServiceRequestService
{
    private readonly IServiceRequestRepository _repository;

    public ServiceRequestService(IServiceRequestRepository repository)
    {
        _repository = repository;
    }

    public async Task<ServiceRequest> CreateServiceRequestAsync(string employeeId, string title, string description, string category, string priority)
    {
        var serviceRequest = new ServiceRequest
        {
            Id = Guid.NewGuid().ToString(),
            EmployeeId = employeeId,
            Title = title,
            Description = description,
            Category = Enum.Parse<RequestCategory>(category),
            Priority = Enum.Parse<RequestPriority>(priority),
            Status = RequestStatus.Open,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _repository.CreateServiceRequestAsync(serviceRequest);
        return serviceRequest;
    }

    public async Task<ServiceRequest?> AssignServiceRequestAsync(string requestId, string assignedToId, string assignedToName)
    {
        var serviceRequest = await _repository.GetServiceRequestByIdAsync(requestId);
        
        if (serviceRequest == null)
            return null;

        serviceRequest.AssignedToId = assignedToId;
        serviceRequest.AssignedToName = assignedToName;
        serviceRequest.Status = RequestStatus.InProgress;
        serviceRequest.UpdatedAt = DateTime.UtcNow;

        await _repository.UpdateServiceRequestAsync(serviceRequest);
        return serviceRequest;
    }

    public async Task<ServiceRequest?> ResolveServiceRequestAsync(string requestId, string comments)
    {
        var serviceRequest = await _repository.GetServiceRequestByIdAsync(requestId);
        
        if (serviceRequest == null)
            return null;

        serviceRequest.ResolutionComments = comments;
        serviceRequest.Status = RequestStatus.Resolved;
        serviceRequest.UpdatedAt = DateTime.UtcNow;

        await _repository.UpdateServiceRequestAsync(serviceRequest);
        return serviceRequest;
    }

    public async Task<List<ServiceRequest>> GetMyServiceRequestsAsync(string employeeId)
    {
        return await _repository.GetServiceRequestsByEmployeeIdAsync(employeeId);
    }

    public async Task<List<ServiceRequest>> GetAllServiceRequestsAsync(string? category, string? status, string? priority)
    {
        return await _repository.GetAllServiceRequestsAsync(category, status, priority);
    }

    public async Task<ServiceRequest?> GetServiceRequestDetailsAsync(string requestId)
    {
        return await _repository.GetServiceRequestByIdAsync(requestId);
    }
}

// Made with Bob