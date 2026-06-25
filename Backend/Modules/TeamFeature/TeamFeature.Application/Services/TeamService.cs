using TeamFeature.Application.DTOs;
using TeamFeature.Domain;
using TeamFeature.Domain.Repositories;

namespace TeamFeature.Application.Services
{
    public interface ITeamService
    {
        Task<IEnumerable<TeamMemberDto>> GetTeamDirectoryAsync(string? search, string? statusFilter);
        Task<IEnumerable<OrgNode>> GetOrgChartAsync(string rootEmployeeId);
    }

    public class TeamService : ITeamService
    {
        private readonly ITeamRepository _teamRepository;

        public TeamService(ITeamRepository teamRepository)
        {
            _teamRepository = teamRepository;
        }

        public async Task<IEnumerable<TeamMemberDto>> GetTeamDirectoryAsync(string? search, string? statusFilter)
        {
            var employees = await _teamRepository.GetTeamMembersAsync(search, statusFilter);
            return employees.Select(e => new TeamMemberDto
            {
                Id = e.Id,
                FullName = e.Name,
                Email = e.Email,
                Position = e.Designation,
                Department = e.Department,
                ManagerId = e.ManagerId,
                Status = "Active", // Can be enhanced with actual status logic
                ProfilePictureUrl = null
            });
        }

        public async Task<IEnumerable<OrgNode>> GetOrgChartAsync(string rootEmployeeId)
        {
            var allEmployees = await _teamRepository.GetAllEmployeesAsync();
            var employeeDict = allEmployees.ToDictionary(e => e.Id);

            // Build org chart starting from root
            var rootEmployee = employeeDict.GetValueOrDefault(rootEmployeeId);
            if (rootEmployee == null) return new List<OrgNode>();

            var orgNode = BuildOrgNode(rootEmployee, employeeDict);
            return new List<OrgNode> { orgNode };
        }

        private OrgNode BuildOrgNode(EmployeeFeature.Domain.Employee employee, Dictionary<string, EmployeeFeature.Domain.Employee> employeeDict)
        {
            var node = new OrgNode
            {
                EmployeeId = employee.Id,
                EmployeeName = employee.Name,
                Position = employee.Designation,
                Department = employee.Department,
                ManagerId = employee.ManagerId,
                DirectReports = new List<OrgNode>()
            };

            // Find direct reports
            var directReports = employeeDict.Values.Where(e => e.ManagerId == employee.Id);
            foreach (var report in directReports)
            {
                node.DirectReports.Add(BuildOrgNode(report, employeeDict));
            }

            return node;
        }
    }
}

// Made with Bob