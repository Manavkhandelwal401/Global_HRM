using HotChocolate;
using HotChocolate.Types;
using HRMS.Shared.Application.GraphQL;
using RecruitmentFeature.Application.Services;
using RecruitmentFeature.Application.DTOs;
using RecruitmentFeature.Domain.Enums;

namespace RecruitmentFeature.GraphQL
{
    [ExtendObjectType(typeof(Mutation))]
    public class RecruitmentFeatureMutation
    {
        [GraphQLName("updateCandidateStatus")]
        public async Task<CandidateDto?> UpdateCandidateStatusAsync(
            [Service] IRecruitmentService recruitmentService,
            string candidateId,
            CandidateStatus newStatus)
        {
            return await recruitmentService.UpdateCandidateStatusAsync(candidateId, newStatus);
        }

        [GraphQLName("scheduleInterview")]
        public async Task<CandidateDto?> ScheduleInterviewAsync(
            [Service] IRecruitmentService recruitmentService,
            string candidateId,
            DateTime interviewDate,
            string interviewerId)
        {
            return await recruitmentService.ScheduleInterviewAsync(candidateId, interviewDate, interviewerId);
        }
    }
}

// Made with Bob
