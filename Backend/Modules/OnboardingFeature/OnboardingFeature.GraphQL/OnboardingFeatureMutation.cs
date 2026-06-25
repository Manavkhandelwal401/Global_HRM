using HotChocolate;
using HotChocolate.Types;
using OnboardingFeature.Application.DTOs;
using OnboardingFeature.Application.Services;
using HRMS.Shared.Application.GraphQL;

namespace OnboardingFeature.GraphQL;

[ExtendObjectType(typeof(Mutation))]
public class OnboardingFeatureMutation
{
    [GraphQLName("createOnboardingChecklist")]
    public async Task<List<OnboardingChecklistDto>> CreateOnboardingChecklistAsync(
        [Service] IOnboardingService onboardingService,
        string employeeId,
        string role)
    {
        return await onboardingService.CreateOnboardingChecklistAsync(employeeId, role);
    }

    [GraphQLName("toggleOnboardingTask")]
    public async Task<OnboardingChecklistDto?> ToggleOnboardingTaskAsync(
        [Service] IOnboardingService onboardingService,
        string checklistId,
        bool isCompleted)
    {
        return await onboardingService.ToggleOnboardingTaskAsync(checklistId, isCompleted);
    }
}

// Made with Bob
