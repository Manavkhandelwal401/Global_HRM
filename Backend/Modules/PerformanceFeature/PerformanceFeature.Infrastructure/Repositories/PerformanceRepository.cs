using Microsoft.EntityFrameworkCore;
using HRMS.Core.Postgres.Data;
using PerformanceFeature.Domain;
using PerformanceFeature.Domain.Enums;
using PerformanceFeature.Domain.Repositories;

namespace PerformanceFeature.Infrastructure.Repositories
{
    public class PerformanceRepository : IPerformanceRepository
    {
        private readonly PostgresDbContext _dbContext;

        public PerformanceRepository(PostgresDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        // Goal operations
        public async Task<IEnumerable<Goal>> GetEmployeeGoalsAsync(string employeeId)
        {
            return await _dbContext.Set<Goal>()
                .Where(g => g.EmployeeId == employeeId)
                .OrderByDescending(g => g.CreatedOn)
                .ToListAsync();
        }

        public async Task<IEnumerable<Goal>> GetTeamGoalsAsync(string managerId)
        {
            // In a real implementation, this would join with Employee table to get team members
            // For now, returning all goals as a placeholder
            return await _dbContext.Set<Goal>()
                .Where(g => g.Status == GoalStatus.InProgress || g.Status == GoalStatus.NotStarted)
                .OrderByDescending(g => g.CreatedOn)
                .ToListAsync();
        }

        public async Task<Goal?> GetGoalByIdAsync(string goalId)
        {
            return await _dbContext.Set<Goal>()
                .FirstOrDefaultAsync(g => g.Id == goalId);
        }

        public async Task<Goal> AddGoalAsync(Goal goal)
        {
            await _dbContext.Set<Goal>().AddAsync(goal);
            await _dbContext.SaveChangesAsync();
            return goal;
        }

        public async Task<Goal> UpdateGoalAsync(string id, Goal goal)
        {
            _dbContext.Set<Goal>().Update(goal);
            await _dbContext.SaveChangesAsync();
            return goal;
        }

        // Performance Review operations
        public async Task<IEnumerable<PerformanceReview>> GetEmployeeReviewsAsync(string employeeId)
        {
            return await _dbContext.Set<PerformanceReview>()
                .Where(r => r.EmployeeId == employeeId)
                .OrderByDescending(r => r.ReviewDate ?? r.CreatedOn)
                .ToListAsync();
        }

        public async Task<PerformanceReview?> GetReviewByIdAsync(string reviewId)
        {
            return await _dbContext.Set<PerformanceReview>()
                .FirstOrDefaultAsync(r => r.Id == reviewId);
        }

        public async Task<PerformanceReview> AddReviewAsync(PerformanceReview review)
        {
            await _dbContext.Set<PerformanceReview>().AddAsync(review);
            await _dbContext.SaveChangesAsync();
            return review;
        }

        public async Task<PerformanceReview> UpdateReviewAsync(string id, PerformanceReview review)
        {
            _dbContext.Set<PerformanceReview>().Update(review);
            await _dbContext.SaveChangesAsync();
            return review;
        }
    }
}

// Made with Bob