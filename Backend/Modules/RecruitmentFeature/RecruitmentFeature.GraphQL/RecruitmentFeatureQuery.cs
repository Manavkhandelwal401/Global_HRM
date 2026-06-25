using HotChocolate;
using HotChocolate.Types;
using HRMS.Shared.Application.GraphQL;
using RecruitmentFeature.Application.Services;
using RecruitmentFeature.Application.DTOs;

namespace RecruitmentFeature.GraphQL
{
    [ExtendObjectType(typeof(Query))]
    public class RecruitmentFeatureQuery
    {
        [GraphQLName("getJobPostings")]
        public async Task<IEnumerable<JobPostingDto>> GetJobPostingsAsync(
            [Service] IRecruitmentService recruitmentService)
        {
            return await recruitmentService.GetJobPostingsAsync();
        }

        [GraphQLName("getCandidates")]
        public async Task<IEnumerable<CandidateDto>> GetCandidatesAsync(
            [Service] IRecruitmentService recruitmentService,
            string jobId)
        {
            return await recruitmentService.GetCandidatesAsync(jobId);
        }
    }
}

// Made with Bob
