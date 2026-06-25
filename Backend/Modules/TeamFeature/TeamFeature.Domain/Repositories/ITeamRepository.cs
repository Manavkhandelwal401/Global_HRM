using EmployeeFeature.Domain;

namespace TeamFeature.Domain.Repositories
{
    public interface ITeamRepository
    {
        Task<IEnumerable<Employee>> GetTeamMembersAsync(string? search, string? statusFilter);
        Task<IEnumerable<Employee>> GetAllEmployeesAsync();
    }
}
