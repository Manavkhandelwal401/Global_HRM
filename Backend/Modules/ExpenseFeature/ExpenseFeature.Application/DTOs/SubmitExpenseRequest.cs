using ExpenseFeature.Domain.Enums;

namespace ExpenseFeature.Application.DTOs
{
    public class SubmitExpenseRequest
    {
        public string EmployeeId { get; set; } = string.Empty;
        public ReimbursementCategory Category { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "USD";
        public DateTime Date { get; set; }
        public string? Comments { get; set; }
    }
}

// Made with Bob