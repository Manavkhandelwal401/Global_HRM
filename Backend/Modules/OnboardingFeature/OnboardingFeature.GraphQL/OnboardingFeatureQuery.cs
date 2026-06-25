using HotChocolate;
using HotChocolate.Types;
using OnboardingFeature.Application.DTOs;
using OnboardingFeature.Application.Services;
using HRMS.Shared.Application.GraphQL;

namespace OnboardingFeature.GraphQL;

[ExtendObjectType(typeof(Query))]
public class OnboardingFeatureQuery
{
    [GraphQLName("getNewHireChecklist")]
    public async Task<List<OnboardingChecklistDto>> GetNewHireChecklistAsync(
        [Service] IOnboardingService onboardingService,
        string employeeId)
    {
        return await onboardingService.GetNewHireChecklistAsync(employeeId);
    }

    [GraphQLName("getOnboardingProgressSummary")]
    public async Task<List<OnboardingProgressDto>> GetOnboardingProgressSummaryAsync(
        [Service] IOnboardingService onboardingService)
    {
        return await onboardingService.GetOnboardingProgressSummaryAsync();
    }
}

// Made with Bob
