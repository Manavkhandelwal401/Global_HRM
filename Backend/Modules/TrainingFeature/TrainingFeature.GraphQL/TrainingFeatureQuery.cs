using HotChocolate;
using HotChocolate.Types;
using HRMS.Shared.Application.GraphQL;
using TrainingFeature.Application.Services;
using TrainingFeature.Application.DTOs;

namespace TrainingFeature.GraphQL
{
    [ExtendObjectType(typeof(Query))]
    public class TrainingFeatureQuery
    {
        [GraphQLName("getMyTrainingModules")]
        public async Task<IEnumerable<TrainingModuleDto>> GetMyTrainingModulesAsync(
            [Service] ITrainingService trainingService,
            string employeeId)
        {
            return await trainingService.GetMyTrainingModulesAsync(employeeId);
        }
    }
}

// Made with Bob
