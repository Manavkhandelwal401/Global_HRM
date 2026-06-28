using ExpenseFeature.Domain;

namespace ExpenseFeature.Domain
{
    public interface IExpenseRepository
    {
        Task<IEnumerable<Reimbursement>> GetEmployeeExpensesAsync(string employeeId);
        Task<IEnumerable<Reimbursement>> GetPendingApprovalsAsync(string managerId);
        Task<Reimbursement?> GetExpenseByIdAsync(string expenseId);
        Task<Reimbursement> AddItemAsync(Reimbursement expense);
        Task<Reimbursement> UpdateItemAsync(string id, Reimbursement expense);
    }
}

// Made with Bob