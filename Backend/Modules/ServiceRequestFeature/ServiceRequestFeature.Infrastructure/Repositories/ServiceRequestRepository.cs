using Microsoft.EntityFrameworkCore;
using ServiceRequestFeature.Domain;
using ServiceRequestFeature.Domain.Enums;
using HRMS.Core.Postgres.Data;
using ServiceRequestFeature.Domain.Repositories;

namespace ServiceRequestFeature.Infrastructure.Repositories;

public class ServiceRequestRepository : IServiceRequestRepository
{
    private readonly PostgresDbContext _context;

    public ServiceRequestRepository(PostgresDbContext context)
    {
        _context = context;
    }

    public async Task CreateServiceRequestAsync(ServiceRequest serviceRequest)
    {
        await _context.Set<ServiceRequest>().AddAsync(serviceRequest);
        await _context.SaveChangesAsync();
    }

    public async Task<ServiceRequest?> GetServiceRequestByIdAsync(string id)
    {
        return await _context.Set<ServiceRequest>()
            .FirstOrDefaultAsync(sr => sr.Id == id);
    }

    public async Task<List<ServiceRequest>> GetServiceRequestsByEmployeeIdAsync(string employeeId)
    {
        return await _context.Set<ServiceRequest>()
            .Where(sr => sr.EmployeeId == employeeId)
            .OrderByDescending(sr => sr.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<ServiceRequest>> GetAllServiceRequestsAsync(string? category, string? status, string? priority)
    {
        var query = _context.Set<ServiceRequest>().AsQueryable();

        if (!string.IsNullOrEmpty(category))
        {
            var categoryEnum = Enum.Parse<RequestCategory>(category);
            query = query.Where(sr => sr.Category == categoryEnum);
        }

        if (!string.IsNullOrEmpty(status))
        {
            var statusEnum = Enum.Parse<RequestStatus>(status);
            query = query.Where(sr => sr.Status == statusEnum);
        }

        if (!string.IsNullOrEmpty(priority))
        {
            var priorityEnum = Enum.Parse<RequestPriority>(priority);
            query = query.Where(sr => sr.Priority == priorityEnum);
        }

        return await query.OrderByDescending(sr => sr.CreatedAt).ToListAsync();
    }

    public async Task UpdateServiceRequestAsync(ServiceRequest serviceRequest)
    {
        _context.Set<ServiceRequest>().Update(serviceRequest);
        await _context.SaveChangesAsync();
    }
}

// Made with Bob