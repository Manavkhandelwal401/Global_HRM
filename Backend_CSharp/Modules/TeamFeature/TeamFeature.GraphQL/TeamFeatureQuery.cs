using HotChocolate;
using HotChocolate.Types;
using HRMS.Shared.Application.GraphQL;
using TeamFeature.Application.Services;
using TeamFeature.Application.DTOs;
using TeamFeature.Domain;

namespace TeamFeature.GraphQL
{
    [ExtendObjectType(typeof(Query))]
    public class TeamFeatureQuery
    {
        [GraphQLName("getTeamDirectory")]
        public async Task<IEnumerable<TeamMemberDto>> GetTeamDirectoryAsync(
            [Service] ITeamService teamService,
            string? search,
            string? statusFilter)
        {
            return await teamService.GetTeamDirectoryAsync(search, statusFilter);
        }

        [GraphQLName("getOrgChart")]
        public async Task<IEnumerable<OrgNode>> GetOrgChartAsync(
            [Service] ITeamService teamService,
            string rootEmployeeId)
        {
            return await teamService.GetOrgChartAsync(rootEmployeeId);
        }
    }
}

// Made with Bob
