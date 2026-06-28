using HotChocolate;
using HotChocolate.Types;
using OffboardingFeature.Application.Services;
using OffboardingFeature.Domain;
using HRMS.Shared.Application.GraphQL;
using System.Security.Claims;

namespace OffboardingFeature.GraphQL;

[ExtendObjectType(typeof(Mutation))]
public class OffboardingFeatureMutation
{
    [GraphQLName("submitResignation")]
    public async Task<Resignation> SubmitResignationAsync(
        [Service] IOffboardingService offboardingService,
        ClaimsPrincipal claimsPrincipal,
        string reason,
        DateTime lastWorkingDate)
    {
        var employeeId = claimsPrincipal.FindFirst(ClaimTypes.NameIdentifier)?.Value 
            ?? throw new UnauthorizedAccessException("User not authenticated");
        
        return await offboardingService.SubmitResignationAsync(employeeId, reason, lastWorkingDate);
    }

    [GraphQLName("updateResignationStatus")]
    public async Task<Resignation?> UpdateResignationStatusAsync(
        [Service] IOffboardingService offboardingService,
        ClaimsPrincipal claimsPrincipal,
        string resignationId,
        string status,
        DateTime? lastWorkingDate)
    {
        var approvedBy = claimsPrincipal.FindFirst(ClaimTypes.NameIdentifier)?.Value 
            ?? throw new UnauthorizedAccessException("User not authenticated");
        
        return await offboardingService.UpdateResignationStatusAsync(resignationId, status, lastWorkingDate, approvedBy);
    }

    [GraphQLName("toggleClearanceStatus")]
    public async Task<ClearanceItem?> ToggleClearanceStatusAsync(
        [Service] IOffboardingService offboardingService,
        ClaimsPrincipal claimsPrincipal,
        string clearanceId,
        bool isCleared)
    {
        var clearedBy = claimsPrincipal.FindFirst(ClaimTypes.NameIdentifier)?.Value 
            ?? throw new UnauthorizedAccessException("User not authenticated");
        
        return await offboardingService.ToggleClearanceStatusAsync(clearanceId, isCleared, clearedBy);
    }

    [GraphQLName("submitExitFeedback")]
    public async Task<ExitInterview> SubmitExitFeedbackAsync(
        [Service] IOffboardingService offboardingService,
        ClaimsPrincipal claimsPrincipal,
        string feedbackJson)
    {
        var employeeId = claimsPrincipal.FindFirst(ClaimTypes.NameIdentifier)?.Value 
            ?? throw new UnauthorizedAccessException("User not authenticated");
        
        return await offboardingService.SubmitExitFeedbackAsync(employeeId, feedbackJson);
    }
}

// Made with Bob