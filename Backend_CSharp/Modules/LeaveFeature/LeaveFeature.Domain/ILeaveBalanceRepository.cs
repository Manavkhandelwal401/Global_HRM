using LeaveFeature.Domain;
using LeaveFeature.Domain.Enums;
using HRMS.Core.Postgres.Repositories;

namespace LeaveFeature.Domain
{
    public interface ILeaveBalanceRepository : IPostgresRepository<LeaveBalance>
    {
        Task<IEnumerable<LeaveBalance>> GetEmployeeLeaveBalancesAsync(string employeeId);
        Task<LeaveBalance?> GetLeaveBalanceAsync(string employeeId, LeaveType leaveType);
    }
}

// Made with Bob