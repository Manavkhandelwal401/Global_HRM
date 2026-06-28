using HotChocolate;
using HotChocolate.Types;
using HRMS.Shared.Application.GraphQL;
using CopilotFeature.Application.Services;
using CopilotFeature.Domain;

namespace CopilotFeature.GraphQL
{
    [ExtendObjectType(typeof(Mutation))]
    public class CopilotFeatureMutation
    {
        [GraphQLName("askHrCopilot")]
        public async Task<CopilotResponse> AskHrCopilotAsync(
            [Service] ICopilotService copilotService,
            string query,
            string employeeId)
        {
            return await copilotService.AskHrCopilotAsync(query, employeeId);
        }
    }
}
