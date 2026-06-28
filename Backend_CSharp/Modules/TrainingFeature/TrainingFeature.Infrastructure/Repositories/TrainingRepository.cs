using Microsoft.EntityFrameworkCore;
using HRMS.Core.Postgres.Data;
using TrainingFeature.Domain;

namespace TrainingFeature.Infrastructure.Repositories
{
    public class TrainingRepository : ITrainingRepository
    {
        private readonly PostgresDbContext _dbContext;

        public TrainingRepository(PostgresDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IEnumerable<TrainingModule>> GetEmployeeTrainingModulesAsync(string employeeId)
        {
            // In a real implementation, this would filter by employee assignments
            // For now, returning all training modules
            return await _dbContext.Set<TrainingModule>()
                .OrderByDescending(t => t.CreatedOn)
                .ToListAsync();
        }

        public async Task<TrainingModule?> GetTrainingModuleByIdAsync(string moduleId)
        {
            return await _dbContext.Set<TrainingModule>()
                .FirstOrDefaultAsync(t => t.Id == moduleId);
        }

        public async Task<TrainingModule> AddTrainingModuleAsync(TrainingModule module)
        {
            await _dbContext.Set<TrainingModule>().AddAsync(module);
            await _dbContext.SaveChangesAsync();
            return module;
        }

        public async Task<TrainingModule> UpdateTrainingModuleAsync(string id, TrainingModule module)
        {
            _dbContext.Set<TrainingModule>().Update(module);
            await _dbContext.SaveChangesAsync();
            return module;
        }
    }
}

// Made with Bob