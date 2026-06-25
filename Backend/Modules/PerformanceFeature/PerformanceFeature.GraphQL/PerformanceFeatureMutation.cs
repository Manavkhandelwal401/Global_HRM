using HotChocolate;
using HotChocolate.Types;
using HRMS.Shared.Application.GraphQL;
using PerformanceFeature.Application.Services;
using PerformanceFeature.Application.DTOs;

namespace PerformanceFeature.GraphQL
{
    [ExtendObjectType(typeof(Mutation))]
    public class PerformanceFeatureMutation
    {
        [GraphQLName("updateGoalProgress")]
        public async Task<GoalDto?> UpdateGoalProgressAsync(
            [Service] IPerformanceService performanceService,
            string goalId,
            decimal currentValue)
        {
            return await performanceService.UpdateGoalProgressAsync(goalId, currentValue);
        }
    }
}

// Made with Bob
