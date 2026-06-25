using TrainingFeature.Domain;

namespace TrainingFeature.Domain
{
    public interface ITrainingRepository
    {
        Task<IEnumerable<TrainingModule>> GetEmployeeTrainingModulesAsync(string employeeId);
        Task<TrainingModule?> GetTrainingModuleByIdAsync(string moduleId);
        Task<TrainingModule> AddTrainingModuleAsync(TrainingModule module);
        Task<TrainingModule> UpdateTrainingModuleAsync(string id, TrainingModule module);
    }
}

// Made with Bob