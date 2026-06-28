using HRMS.Core.Postgres.Common;
using PayrollFeature.Domain.Enums;

namespace PayrollFeature.Domain
{
    public class PayrollRecord : BaseEntity
    {
        public string EmployeeId { get; set; } = string.Empty;
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
        public PayrollStatus Status { get; set; } = PayrollStatus.Draft;
    }
}

// Made with Bob
