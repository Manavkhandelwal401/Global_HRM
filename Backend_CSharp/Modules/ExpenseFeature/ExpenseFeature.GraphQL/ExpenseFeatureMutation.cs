using HotChocolate;
using HotChocolate.Types;
using HRMS.Shared.Application.GraphQL;
using ExpenseFeature.Application.Services;
using ExpenseFeature.Application.DTOs;
using ExpenseFeature.Domain.Enums;

namespace ExpenseFeature.GraphQL
{
    [ExtendObjectType(typeof(Mutation))]
    public class ExpenseFeatureMutation
    {
        [GraphQLName("submitExpense")]
        public async Task<ReimbursementDto?> SubmitExpenseAsync(
            [Service] IExpenseService expenseService,
            string employeeId,
            ReimbursementCategory category,
            decimal amount,
            string currency,
            DateTime date,
            string? comments)
        {
            var request = new SubmitExpenseRequest
            {
                EmployeeId = employeeId,
                Category = category,
                Amount = amount,
                Currency = currency,
                Date = date,
                Comments = comments
            };
            return await expenseService.SubmitExpenseAsync(request);
        }

        [GraphQLName("approveExpense")]
        public async Task<ReimbursementDto?> ApproveExpenseAsync(
            [Service] IExpenseService expenseService,
            string expenseId,
            string approverId,
            string? comments)
        {
            return await expenseService.ApproveExpenseAsync(expenseId, approverId, comments);
        }

        [GraphQLName("rejectExpense")]
        public async Task<ReimbursementDto?> RejectExpenseAsync(
            [Service] IExpenseService expenseService,
            string expenseId,
            string approverId,
            string? comments)
        {
            return await expenseService.RejectExpenseAsync(expenseId, approverId, comments);
        }
    }
}

// Made with Bob
