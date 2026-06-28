using RecruitmentFeature.Application.DTOs;
using RecruitmentFeature.Domain;
using RecruitmentFeature.Domain.Enums;


namespace RecruitmentFeature.Application.Services
{
    public interface IRecruitmentService
    {
        Task<IEnumerable<JobPostingDto>> GetJobPostingsAsync();
        Task<IEnumerable<CandidateDto>> GetCandidatesAsync(string jobId);
        Task<CandidateDto?> UpdateCandidateStatusAsync(string candidateId, CandidateStatus newStatus);
        Task<CandidateDto?> ScheduleInterviewAsync(string candidateId, DateTime interviewDate, string interviewerId);
    }

    public class RecruitmentService : IRecruitmentService
    {
        private readonly IRecruitmentRepository _recruitmentRepository;

        public RecruitmentService(IRecruitmentRepository recruitmentRepository)
        {
            _recruitmentRepository = recruitmentRepository;
        }

        public async Task<IEnumerable<JobPostingDto>> GetJobPostingsAsync()
        {
            var jobPostings = await _recruitmentRepository.GetJobPostingsAsync();
            var jobPostingDtos = new List<JobPostingDto>();

            foreach (var job in jobPostings)
            {
                var candidates = await _recruitmentRepository.GetCandidatesByJobIdAsync(job.Id);
                var dto = MapJobPostingToDto(job);
                dto.CandidateCount = candidates.Count();
                jobPostingDtos.Add(dto);
            }

            return jobPostingDtos;
        }

        public async Task<IEnumerable<CandidateDto>> GetCandidatesAsync(string jobId)
        {
            var candidates = await _recruitmentRepository.GetCandidatesByJobIdAsync(jobId);
            var job = await _recruitmentRepository.GetJobPostingByIdAsync(jobId);
            
            return candidates.Select(c =>
            {
                var dto = MapCandidateToDto(c);
                dto.JobTitle = job?.Title;
                return dto;
            });
        }

        public async Task<CandidateDto?> UpdateCandidateStatusAsync(string candidateId, CandidateStatus newStatus)
        {
            var candidate = await _recruitmentRepository.GetCandidateByIdAsync(candidateId);
            if (candidate == null)
            {
                throw new InvalidOperationException("Candidate not found");
            }

            candidate.Status = newStatus;
            var updatedCandidate = await _recruitmentRepository.UpdateCandidateAsync(candidate.Id, candidate);
            return MapCandidateToDto(updatedCandidate);
        }

        public async Task<CandidateDto?> ScheduleInterviewAsync(string candidateId, DateTime interviewDate, string interviewerId)
        {
            var candidate = await _recruitmentRepository.GetCandidateByIdAsync(candidateId);
            if (candidate == null)
            {
                throw new InvalidOperationException("Candidate not found");
            }

            // Update candidate status to Interview if not already
            if (candidate.Status == CandidateStatus.Applied || candidate.Status == CandidateStatus.Screening)
            {
                candidate.Status = CandidateStatus.Interview;
            }

            var updatedCandidate = await _recruitmentRepository.UpdateCandidateAsync(candidate.Id, candidate);
            var dto = MapCandidateToDto(updatedCandidate);
            dto.InterviewDate = interviewDate;
            dto.InterviewerId = interviewerId;
            
            return dto;
        }

        private JobPostingDto MapJobPostingToDto(JobPosting job)
        {
            return new JobPostingDto
            {
                Id = job.Id,
                Title = job.Title,
                Department = job.Department,
                Location = job.Location,
                ExperienceRequired = job.ExperienceRequired,
                SalaryRange = job.SalaryRange,
                Status = job.Status,
                Description = job.Description,
                PostedDate = job.PostedDate,
                CandidateCount = 0, // Will be set by caller
                CreatedAt = job.CreatedOn ?? DateTime.UtcNow
            };
        }

        private CandidateDto MapCandidateToDto(Candidate candidate)
        {
            return new CandidateDto
            {
                Id = candidate.Id,
                Name = candidate.Name,
                RoleApplied = candidate.RoleApplied,
                Status = candidate.Status,
                Rating = candidate.Rating,
                Experience = candidate.Experience,
                NoticePeriod = candidate.NoticePeriod,
                Skills = candidate.Skills,
                Email = candidate.Email,
                Phone = candidate.Phone,
                JobPostingId = candidate.JobPostingId,
                CreatedAt = candidate.CreatedOn ?? DateTime.UtcNow
            };
        }
    }
}

// Made with Bob