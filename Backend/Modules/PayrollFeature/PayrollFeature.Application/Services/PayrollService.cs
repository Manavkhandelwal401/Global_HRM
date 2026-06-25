using PayrollFeature.Application.DTOs;
using PayrollFeature.Domain;


namespace PayrollFeature.Application.Services
{
    public interface IPayrollService
    {
        Task<IEnumerable<PayrollRecordDto>> GetMyPayslipsAsync(string employeeId);
        Task<PayrollRecordDto?> GetPayrollDetailAsync(string payslipId);
    }

    public class PayrollService : IPayrollService
    {
        private readonly IPayrollRepository _payrollRepository;

        public PayrollService(IPayrollRepository payrollRepository)
        {
            _payrollRepository = payrollRepository;
        }

        public async Task<IEnumerable<PayrollRecordDto>> GetMyPayslipsAsync(string employeeId)
        {
            var payslips = await _payrollRepository.GetEmployeePayslipsAsync(employeeId);
            return payslips.Select(MapToDto);
        }

        public async Task<PayrollRecordDto?> GetPayrollDetailAsync(string payslipId)
        {
            var payslip = await _payrollRepository.GetPayrollByIdAsync(payslipId);
            return payslip != null ? MapToDto(payslip) : null;
        }

        private PayrollRecordDto MapToDto(PayrollRecord record)
        {
            return new PayrollRecordDto
            {
                Id = record.Id,
                EmployeeId = record.EmployeeId,
                EmployeeName = "Employee", // Would be populated from Employee service in real implementation
                PayPeriodStart = record.PayPeriodStart,
                PayPeriodEnd = record.PayPeriodEnd,
                BasicPay = record.BasicPay,
                HRA = record.HRA,
                Allowances = record.Allowances,
                GrossPay = record.GrossPay,
                PF = record.PF,
                IncomeTax = record.IncomeTax,
                ESI = record.ESI,
                Deductions = record.Deductions,
                NetPay = record.NetPay,
                Status = record.Status,
                CreatedAt = record.CreatedOn ?? DateTime.UtcNow
            };
        }
    }
}

// Made with Bob