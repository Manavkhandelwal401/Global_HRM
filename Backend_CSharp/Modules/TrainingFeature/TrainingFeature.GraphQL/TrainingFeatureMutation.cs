using HotChocolate;
using HotChocolate.Types;
using HRMS.Shared.Application.GraphQL;
using TrainingFeature.Application.Services;
using TrainingFeature.Application.DTOs;

namespace TrainingFeature.GraphQL
{
    [ExtendObjectType(typeof(Mutation))]
    public class TrainingFeatureMutation
    {
        [GraphQLName("completeTrainingItem")]
        public async Task<TrainingModuleDto?> CompleteTrainingItemAsync(
            [Service] ITrainingService trainingService,
            string moduleId,
            string itemId)
        {
            return await trainingService.CompleteTrainingItemAsync(moduleId, itemId);
        }
    }
}

// Made with Bob
