using HotChocolate;
using HotChocolate.Types;
using HRMS.Shared.Application.GraphQL;
using PayrollFeature.Application.Services;
using PayrollFeature.Application.DTOs;

namespace PayrollFeature.GraphQL
{
    [ExtendObjectType(typeof(Query))]
    public class PayrollFeatureQuery
    {
        [GraphQLName("getMyPayslips")]
        public async Task<IEnumerable<PayrollRecordDto>> GetMyPayslipsAsync(
            [Service] IPayrollService payrollService,
            string employeeId)
        {
            return await payrollService.GetMyPayslipsAsync(employeeId);
        }

        [GraphQLName("getPayrollDetail")]
        public async Task<PayrollRecordDto?> GetPayrollDetailAsync(
            [Service] IPayrollService payrollService,
            string payslipId)
        {
            return await payrollService.GetPayrollDetailAsync(payslipId);
        }
    }
}

// Made with Bob
