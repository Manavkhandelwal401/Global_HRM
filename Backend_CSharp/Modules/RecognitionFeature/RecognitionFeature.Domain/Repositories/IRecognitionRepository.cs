using RecognitionFeature.Domain;

namespace RecognitionFeature.Domain.Repositories
{
    public interface IRecognitionRepository
    {
        Task<RecognitionNomination?> GetByIdAsync(string id);
        Task<IEnumerable<RecognitionNomination>> GetApprovedNominationsAsync();
        Task<int> GetEmployeePointsAsync(string employeeId);
        Task<RecognitionNomination?> CreateAsync(RecognitionNomination nomination);
        Task<RecognitionNomination?> UpdateAsync(RecognitionNomination nomination);
    }
}
