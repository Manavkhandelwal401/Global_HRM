using TrainingFeature.Application.DTOs;
using TrainingFeature.Domain;
using TrainingFeature.Domain.Enums;


namespace TrainingFeature.Application.Services
{
    public interface ITrainingService
    {
        Task<IEnumerable<TrainingModuleDto>> GetMyTrainingModulesAsync(string employeeId);
        Task<TrainingModuleDto?> CompleteTrainingItemAsync(string moduleId, string itemId);
    }

    public class TrainingService : ITrainingService
    {
        private readonly ITrainingRepository _trainingRepository;

        public TrainingService(ITrainingRepository trainingRepository)
        {
            _trainingRepository = trainingRepository;
        }

        public async Task<IEnumerable<TrainingModuleDto>> GetMyTrainingModulesAsync(string employeeId)
        {
            var modules = await _trainingRepository.GetEmployeeTrainingModulesAsync(employeeId);
            return modules.Select(MapToDto);
        }

        public async Task<TrainingModuleDto?> CompleteTrainingItemAsync(string moduleId, string itemId)
        {
            var module = await _trainingRepository.GetTrainingModuleByIdAsync(moduleId);
            if (module == null)
            {
                throw new InvalidOperationException("Training module not found");
            }

            // Simulate completing a training item by incrementing progress
            // In a real implementation, this would track individual items
            module.ProgressPercentage = Math.Min(100, module.ProgressPercentage + 10);

            // Update status based on progress
            if (module.ProgressPercentage >= 100)
            {
                module.Status = TrainingStatus.Completed;
            }
            else if (module.ProgressPercentage > 0)
            {
                module.Status = TrainingStatus.InProgress;
            }

            var updatedModule = await _trainingRepository.UpdateTrainingModuleAsync(module.Id, module);
            return MapToDto(updatedModule);
        }

        private TrainingModuleDto MapToDto(TrainingModule module)
        {
            return new TrainingModuleDto
            {
                Id = module.Id,
                Title = module.Title,
                Category = module.Category,
                Duration = module.Duration,
                Mandatory = module.Mandatory,
                Status = module.Status,
                ProgressPercentage = module.ProgressPercentage,
                Description = module.Description,
                CertificateIssued = module.ProgressPercentage >= 100,
                CreatedAt = module.CreatedOn ?? DateTime.UtcNow
            };
        }
    }
}

// Made with Bob