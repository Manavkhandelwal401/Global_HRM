using Microsoft.EntityFrameworkCore;
using HRMS.Core.Postgres.Data;
using RecruitmentFeature.Domain;
using RecruitmentFeature.Domain.Enums;

namespace RecruitmentFeature.Infrastructure.Repositories
{
    public class RecruitmentRepository : IRecruitmentRepository
    {
        private readonly PostgresDbContext _dbContext;

        public RecruitmentRepository(PostgresDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        // Job Posting operations
        public async Task<IEnumerable<JobPosting>> GetJobPostingsAsync()
        {
            return await _dbContext.Set<JobPosting>()
                .Where(j => j.Status == JobStatus.Open)
                .OrderByDescending(j => j.PostedDate ?? j.CreatedOn)
                .ToListAsync();
        }

        public async Task<JobPosting?> GetJobPostingByIdAsync(string jobId)
        {
            return await _dbContext.Set<JobPosting>()
                .FirstOrDefaultAsync(j => j.Id == jobId);
        }

        public async Task<JobPosting> AddJobPostingAsync(JobPosting jobPosting)
        {
            await _dbContext.Set<JobPosting>().AddAsync(jobPosting);
            await _dbContext.SaveChangesAsync();
            return jobPosting;
        }

        public async Task<JobPosting> UpdateJobPostingAsync(string id, JobPosting jobPosting)
        {
            _dbContext.Set<JobPosting>().Update(jobPosting);
            await _dbContext.SaveChangesAsync();
            return jobPosting;
        }

        // Candidate operations
        public async Task<IEnumerable<Candidate>> GetCandidatesByJobIdAsync(string jobId)
        {
            return await _dbContext.Set<Candidate>()
                .Where(c => c.JobPostingId == jobId)
                .OrderByDescending(c => c.CreatedOn)
                .ToListAsync();
        }

        public async Task<Candidate?> GetCandidateByIdAsync(string candidateId)
        {
            return await _dbContext.Set<Candidate>()
                .FirstOrDefaultAsync(c => c.Id == candidateId);
        }

        public async Task<Candidate> AddCandidateAsync(Candidate candidate)
        {
            await _dbContext.Set<Candidate>().AddAsync(candidate);
            await _dbContext.SaveChangesAsync();
            return candidate;
        }

        public async Task<Candidate> UpdateCandidateAsync(string id, Candidate candidate)
        {
            _dbContext.Set<Candidate>().Update(candidate);
            await _dbContext.SaveChangesAsync();
            return candidate;
        }
    }
}

// Made with Bob