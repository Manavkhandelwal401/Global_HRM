using CopilotFeature.Domain;

namespace CopilotFeature.Domain.Repositories
{
    public interface ICopilotRepository
    {
        Task<CopilotInteraction?> CreateAsync(CopilotInteraction interaction);
        Task<IEnumerable<CopilotInteraction>> GetEmployeeInteractionsAsync(string employeeId);
    }
}
