using PerformanceFeature.Application.DTOs;
using PerformanceFeature.Domain;
using PerformanceFeature.Domain.Enums;
using PerformanceFeature.Domain.Repositories;

namespace PerformanceFeature.Application.Services
{
    public interface IPerformanceService
    {
        Task<IEnumerable<GoalDto>> GetMyGoalsAsync(string employeeId);
        Task<IEnumerable<GoalDto>> GetTeamGoalsAsync(string managerId);
        Task<GoalDto?> UpdateGoalProgressAsync(string goalId, decimal currentValue);
        Task<IEnumerable<PerformanceReviewDto>> GetMyReviewsAsync(string employeeId);
    }

    public class PerformanceService : IPerformanceService
    {
        private readonly IPerformanceRepository _performanceRepository;

        public PerformanceService(IPerformanceRepository performanceRepository)
        {
            _performanceRepository = performanceRepository;
        }

        public async Task<IEnumerable<GoalDto>> GetMyGoalsAsync(string employeeId)
        {
            var goals = await _performanceRepository.GetEmployeeGoalsAsync(employeeId);
            return goals.Select(MapGoalToDto);
        }

        public async Task<IEnumerable<GoalDto>> GetTeamGoalsAsync(string managerId)
        {
            var goals = await _performanceRepository.GetTeamGoalsAsync(managerId);
            return goals.Select(MapGoalToDto);
        }

        public async Task<GoalDto?> UpdateGoalProgressAsync(string goalId, decimal currentValue)
        {
            var goal = await _performanceRepository.GetGoalByIdAsync(goalId);
            if (goal == null)
            {
                throw new InvalidOperationException("Goal not found");
            }

            goal.CurrentValue = currentValue;
            
            // Calculate progress percentage
            if (goal.TargetValue > 0)
            {
                goal.ProgressPercentage = Math.Min(100, (currentValue / goal.TargetValue) * 100);
            }

            // Update status based on progress
            if (goal.ProgressPercentage >= 100)
            {
                goal.Status = GoalStatus.Completed;
            }
            else if (goal.ProgressPercentage > 0)
            {
                goal.Status = GoalStatus.InProgress;
            }

            // Check if overdue
            if (goal.DueDate.HasValue && goal.DueDate.Value < DateTime.UtcNow && goal.Status != GoalStatus.Completed)
            {
                goal.Status = GoalStatus.Overdue;
            }

            var updatedGoal = await _performanceRepository.UpdateGoalAsync(goal.Id, goal);
            return MapGoalToDto(updatedGoal);
        }

        public async Task<IEnumerable<PerformanceReviewDto>> GetMyReviewsAsync(string employeeId)
        {
            var reviews = await _performanceRepository.GetEmployeeReviewsAsync(employeeId);
            return reviews.Select(MapReviewToDto);
        }

        private GoalDto MapGoalToDto(Goal goal)
        {
            return new GoalDto
            {
                Id = goal.Id,
                EmployeeId = goal.EmployeeId,
                EmployeeName = "Employee", // Would be populated from Employee service in real implementation
                Title = goal.Title,
                TargetValue = goal.TargetValue,
                CurrentValue = goal.CurrentValue,
                Weight = goal.Weight,
                Status = goal.Status,
                ProgressPercentage = goal.ProgressPercentage,
                DueDate = goal.DueDate,
                CreatedAt = goal.CreatedOn ?? DateTime.UtcNow
            };
        }

        private PerformanceReviewDto MapReviewToDto(PerformanceReview review)
        {
            return new PerformanceReviewDto
            {
                Id = review.Id,
                EmployeeId = review.EmployeeId,
                EmployeeName = "Employee", // Would be populated from Employee service in real implementation
                ReviewerId = review.ReviewerId,
                ReviewerName = "Reviewer", // Would be populated from Employee service in real implementation
                Period = review.Period,
                Rating = review.Rating,
                Strengths = review.Strengths,
                Improvements = review.Improvements,
                ReviewDate = review.ReviewDate,
                CreatedAt = review.CreatedOn ?? DateTime.UtcNow
            };
        }
    }
}

// Made with Bob