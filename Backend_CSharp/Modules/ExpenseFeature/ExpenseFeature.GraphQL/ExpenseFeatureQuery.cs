using HotChocolate;
using HotChocolate.Types;
using HRMS.Shared.Application.GraphQL;
using ExpenseFeature.Application.Services;
using ExpenseFeature.Application.DTOs;

namespace ExpenseFeature.GraphQL
{
    [ExtendObjectType(typeof(Query))]
    public class ExpenseFeatureQuery
    {
        [GraphQLName("getMyExpenses")]
        public async Task<IEnumerable<ReimbursementDto>> GetMyExpensesAsync(
            [Service] IExpenseService expenseService,
            string employeeId)
        {
            return await expenseService.GetMyExpensesAsync(employeeId);
        }

        [GraphQLName("getPendingExpenseApprovals")]
        public async Task<IEnumerable<ReimbursementDto>> GetPendingExpenseApprovalsAsync(
            [Service] IExpenseService expenseService,
            string managerId)
        {
            return await expenseService.GetPendingExpenseApprovalsAsync(managerId);
        }
    }
}

// Made with Bob
