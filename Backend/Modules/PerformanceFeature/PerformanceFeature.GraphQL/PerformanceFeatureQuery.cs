using HotChocolate;
using HotChocolate.Types;
using HRMS.Shared.Application.GraphQL;
using PerformanceFeature.Application.Services;
using PerformanceFeature.Application.DTOs;

namespace PerformanceFeature.GraphQL
{
    [ExtendObjectType(typeof(Query))]
    public class PerformanceFeatureQuery
    {
        [GraphQLName("getMyGoals")]
        public async Task<IEnumerable<GoalDto>> GetMyGoalsAsync(
            [Service] IPerformanceService performanceService,
            string employeeId)
        {
            return await performanceService.GetMyGoalsAsync(employeeId);
        }

        [GraphQLName("getTeamGoals")]
        public async Task<IEnumerable<GoalDto>> GetTeamGoalsAsync(
            [Service] IPerformanceService performanceService,
            string managerId)
        {
            return await performanceService.GetTeamGoalsAsync(managerId);
        }

        [GraphQLName("getMyReviews")]
        public async Task<IEnumerable<PerformanceReviewDto>> GetMyReviewsAsync(
            [Service] IPerformanceService performanceService,
            string employeeId)
        {
            return await performanceService.GetMyReviewsAsync(employeeId);
        }
    }
}

// Made with Bob
