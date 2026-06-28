using HotChocolate;
using HotChocolate.Types;
using HRMS.Shared.Application.GraphQL;
using RecognitionFeature.Application.Services;
using RecognitionFeature.Application.DTOs;

namespace RecognitionFeature.GraphQL
{
    [ExtendObjectType(typeof(Query))]
    public class RecognitionFeatureQuery
    {
        [GraphQLName("getRecognitionFeed")]
        public async Task<IEnumerable<RecognitionNominationDto>> GetRecognitionFeedAsync(
            [Service] IRecognitionService recognitionService)
        {
            return await recognitionService.GetRecognitionFeedAsync();
        }

        [GraphQLName("getMyRecognitionPoints")]
        public async Task<int> GetMyRecognitionPointsAsync(
            [Service] IRecognitionService recognitionService,
            string employeeId)
        {
            return await recognitionService.GetMyRecognitionPointsAsync(employeeId);
        }
    }
}

// Made with Bob
