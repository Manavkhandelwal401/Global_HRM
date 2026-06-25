using ExpenseFeature.Application.DTOs;
using ExpenseFeature.Domain;
using ExpenseFeature.Domain.Enums;


namespace ExpenseFeature.Application.Services
{
    public interface IExpenseService
    {
        Task<IEnumerable<ReimbursementDto>> GetMyExpensesAsync(string employeeId);
        Task<IEnumerable<ReimbursementDto>> GetPendingExpenseApprovalsAsync(string managerId);
        Task<ReimbursementDto?> SubmitExpenseAsync(SubmitExpenseRequest request);
        Task<ReimbursementDto?> ApproveExpenseAsync(string expenseId, string approverId, string? comments);
        Task<ReimbursementDto?> RejectExpenseAsync(string expenseId, string approverId, string? comments);
    }

    public class ExpenseService : IExpenseService
    {
        private readonly IExpenseRepository _expenseRepository;

        public ExpenseService(IExpenseRepository expenseRepository)
        {
            _expenseRepository = expenseRepository;
        }

        public async Task<IEnumerable<ReimbursementDto>> GetMyExpensesAsync(string employeeId)
        {
            var expenses = await _expenseRepository.GetEmployeeExpensesAsync(employeeId);
            return expenses.Select(MapToDto);
        }

        public async Task<IEnumerable<ReimbursementDto>> GetPendingExpenseApprovalsAsync(string managerId)
        {
            var expenses = await _expenseRepository.GetPendingApprovalsAsync(managerId);
            return expenses.Select(MapToDto);
        }

        public async Task<ReimbursementDto?> SubmitExpenseAsync(SubmitExpenseRequest request)
        {
            var expense = new Reimbursement
            {
                Id = Guid.NewGuid().ToString(),
                EmployeeId = request.EmployeeId,
                Category = request.Category,
                Amount = request.Amount,
                Currency = request.Currency,
                Date = request.Date,
                Status = ReimbursementStatus.Pending,
                Comments = request.Comments
            };

            var savedExpense = await _expenseRepository.AddItemAsync(expense);
            return MapToDto(savedExpense);
        }

        public async Task<ReimbursementDto?> ApproveExpenseAsync(string expenseId, string approverId, string? comments)
        {
            var expense = await _expenseRepository.GetExpenseByIdAsync(expenseId);
            if (expense == null)
            {
                throw new InvalidOperationException("Expense not found");
            }

            if (expense.Status != ReimbursementStatus.Pending)
            {
                throw new InvalidOperationException($"Cannot approve expense with status {expense.Status}");
            }

            expense.Status = ReimbursementStatus.Approved;
            expense.ApprovedBy = approverId;
            expense.ApprovedOn = DateTime.UtcNow;
            expense.Comments = comments;

            var updatedExpense = await _expenseRepository.UpdateItemAsync(expense.Id, expense);
            return MapToDto(updatedExpense);
        }

        public async Task<ReimbursementDto?> RejectExpenseAsync(string expenseId, string approverId, string? comments)
        {
            var expense = await _expenseRepository.GetExpenseByIdAsync(expenseId);
            if (expense == null)
            {
                throw new InvalidOperationException("Expense not found");
            }

            if (expense.Status != ReimbursementStatus.Pending)
            {
                throw new InvalidOperationException($"Cannot reject expense with status {expense.Status}");
            }

            expense.Status = ReimbursementStatus.Rejected;
            expense.ApprovedBy = approverId;
            expense.ApprovedOn = DateTime.UtcNow;
            expense.Comments = comments;

            var updatedExpense = await _expenseRepository.UpdateItemAsync(expense.Id, expense);
            return MapToDto(updatedExpense);
        }

        private ReimbursementDto MapToDto(Reimbursement expense)
        {
            return new ReimbursementDto
            {
                Id = expense.Id,
                EmployeeId = expense.EmployeeId,
                EmployeeName = "Employee", // Would be populated from Employee service in real implementation
                Category = expense.Category,
                Amount = expense.Amount,
                Currency = expense.Currency,
                Date = expense.Date,
                Status = expense.Status,
                Comments = expense.Comments,
                ApprovedBy = expense.ApprovedBy,
                ApprovedByName = expense.ApprovedBy != null ? "Manager" : null,
                ApprovedOn = expense.ApprovedOn,
                CreatedAt = expense.CreatedOn ?? DateTime.UtcNow
            };
        }
    }
}

// Made with Bob