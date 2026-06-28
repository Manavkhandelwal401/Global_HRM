using RecognitionFeature.Application.DTOs;
using RecognitionFeature.Domain;
using RecognitionFeature.Domain.Enums;
using RecognitionFeature.Domain.Repositories;

namespace RecognitionFeature.Application.Services
{
    public interface IRecognitionService
    {
        Task<IEnumerable<RecognitionNominationDto>> GetRecognitionFeedAsync();
        Task<int> GetMyRecognitionPointsAsync(string employeeId);
        Task<RecognitionNominationDto?> NominatePeerAsync(NominatePeerRequest request);
        Task<RecognitionNominationDto?> ApproveNominationAsync(string nominationId, string approverId, string? comments);
    }

    public class RecognitionService : IRecognitionService
    {
        private readonly IRecognitionRepository _recognitionRepository;

        public RecognitionService(IRecognitionRepository recognitionRepository)
        {
            _recognitionRepository = recognitionRepository;
        }

        public async Task<IEnumerable<RecognitionNominationDto>> GetRecognitionFeedAsync()
        {
            var nominations = await _recognitionRepository.GetApprovedNominationsAsync();
            return nominations.Select(MapToDto);
        }

        public async Task<int> GetMyRecognitionPointsAsync(string employeeId)
        {
            return await _recognitionRepository.GetEmployeePointsAsync(employeeId);
        }

        public async Task<RecognitionNominationDto?> NominatePeerAsync(NominatePeerRequest request)
        {
            var nomination = new RecognitionNomination
            {
                Id = Guid.NewGuid().ToString(),
                NominatorId = request.NominatorId,
                NomineeId = request.NomineeId,
                CoreValue = request.CoreValue,
                Reason = request.Reason,
                Points = request.Points,
                Status = NominationStatus.Pending,
                CreatedOn = DateTime.UtcNow
            };

            var created = await _recognitionRepository.CreateAsync(nomination);
            return created != null ? MapToDto(created) : null;
        }

        public async Task<RecognitionNominationDto?> ApproveNominationAsync(string nominationId, string approverId, string? comments)
        {
            var nomination = await _recognitionRepository.GetByIdAsync(nominationId);
            if (nomination == null) return null;

            nomination.Status = NominationStatus.Approved;
            nomination.ApprovedBy = approverId;
            nomination.ApprovedOn = DateTime.UtcNow;
            nomination.ModifiedOn = DateTime.UtcNow;

            var updated = await _recognitionRepository.UpdateAsync(nomination);
            return updated != null ? MapToDto(updated) : null;
        }

        private RecognitionNominationDto MapToDto(RecognitionNomination nomination)
        {
            return new RecognitionNominationDto
            {
                Id = nomination.Id,
                NominatorId = nomination.NominatorId,
                NominatorName = "Employee", // Will be populated via GraphQL resolver
                NomineeId = nomination.NomineeId,
                NomineeName = "Employee", // Will be populated via GraphQL resolver
                CoreValue = nomination.CoreValue,
                Reason = nomination.Reason,
                Points = nomination.Points,
                Status = nomination.Status,
                ApprovedBy = nomination.ApprovedBy,
                ApprovedByName = nomination.ApprovedBy != null ? "Manager" : null,
                ApprovedOn = nomination.ApprovedOn,
                CreatedAt = nomination.CreatedOn ?? DateTime.UtcNow
            };
        }
    }
}

// Made with Bob