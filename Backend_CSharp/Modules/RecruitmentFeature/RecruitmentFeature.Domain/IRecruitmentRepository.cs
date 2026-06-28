using RecruitmentFeature.Domain;

namespace RecruitmentFeature.Domain
{
    public interface IRecruitmentRepository
    {
        // Job Posting operations
        Task<IEnumerable<JobPosting>> GetJobPostingsAsync();
        Task<JobPosting?> GetJobPostingByIdAsync(string jobId);
        Task<JobPosting> AddJobPostingAsync(JobPosting jobPosting);
        Task<JobPosting> UpdateJobPostingAsync(string id, JobPosting jobPosting);
        
        // Candidate operations
        Task<IEnumerable<Candidate>> GetCandidatesByJobIdAsync(string jobId);
        Task<Candidate?> GetCandidateByIdAsync(string candidateId);
        Task<Candidate> AddCandidateAsync(Candidate candidate);
        Task<Candidate> UpdateCandidateAsync(string id, Candidate candidate);
    }
}

// Made with Bob