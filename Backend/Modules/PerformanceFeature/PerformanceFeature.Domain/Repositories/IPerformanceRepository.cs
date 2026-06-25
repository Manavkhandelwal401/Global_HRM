using PerformanceFeature.Domain;

namespace PerformanceFeature.Domain.Repositories
{
    public interface IPerformanceRepository
    {
        // Goal operations
        Task<IEnumerable<Goal>> GetEmployeeGoalsAsync(string employeeId);
        Task<IEnumerable<Goal>> GetTeamGoalsAsync(string managerId);
        Task<Goal?> GetGoalByIdAsync(string goalId);
        Task<Goal> AddGoalAsync(Goal goal);
        Task<Goal> UpdateGoalAsync(string id, Goal goal);
        
        // Performance Review operations
        Task<IEnumerable<PerformanceReview>> GetEmployeeReviewsAsync(string employeeId);
        Task<PerformanceReview?> GetReviewByIdAsync(string reviewId);
        Task<PerformanceReview> AddReviewAsync(PerformanceReview review);
        Task<PerformanceReview> UpdateReviewAsync(string id, PerformanceReview review);
    }
}
