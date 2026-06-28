using LeaveFeature.Domain;
using LeaveFeature.Domain.Enums;
using HRMS.Core.Postgres.Repositories;

namespace LeaveFeature.Domain
{
    public interface ILeaveRepository : IPostgresRepository<LeaveRequest>
    {
        Task<IEnumerable<LeaveRequest>> GetEmployeeLeaveRequestsAsync(string employeeId);
        Task<IEnumerable<LeaveRequest>> GetPendingApprovalsAsync(string managerId);
        Task<IEnumerable<LeaveRequest>> GetLeaveRequestsByStatusAsync(string employeeId, LeaveRequestStatus status);
        Task<LeaveRequest?> GetLeaveRequestByIdAsync(string requestId);
    }
}

// Made with Bob