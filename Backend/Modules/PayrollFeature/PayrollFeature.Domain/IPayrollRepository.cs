using PayrollFeature.Domain;

namespace PayrollFeature.Domain
{
    public interface IPayrollRepository
    {
        Task<IEnumerable<PayrollRecord>> GetEmployeePayslipsAsync(string employeeId);
        Task<PayrollRecord?> GetPayrollByIdAsync(string payslipId);
    }
}

// Made with Bob