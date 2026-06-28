using PayrollFeature.Domain.Enums;

namespace PayrollFeature.Application.DTOs
{
    public class PayrollRecordDto
    {
        public string Id { get; set; } = string.Empty;
        public string EmployeeId { get; set; } = string.Empty;
        public string EmployeeName { get; set; } = string.Empty;
        public DateTime PayPeriodStart { get; set; }
        public DateTime PayPeriodEnd { get; set; }
        public decimal BasicPay { get; set; }
        public decimal HRA { get; set; }
        public decimal Allowances { get; set; }
        public decimal GrossPay { get; set; }
        public decimal PF { get; set; }
        public decimal IncomeTax { get; set; }
        public decimal ESI { get; set; }
        public decimal Deductions { get; set; }
        public decimal NetPay { get; set; }
        public PayrollStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}

// Made with Bob