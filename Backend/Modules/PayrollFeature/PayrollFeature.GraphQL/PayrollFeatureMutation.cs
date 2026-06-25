using HotChocolate.Types;
using HRMS.Shared.Application.GraphQL;

namespace PayrollFeature.GraphQL
{
    [ExtendObjectType(typeof(Mutation))]
    public class PayrollFeatureMutation
    {
        // Payroll mutations would be added here if needed
        // For now, payroll is read-only for employees
    }
}

// Made with Bob
