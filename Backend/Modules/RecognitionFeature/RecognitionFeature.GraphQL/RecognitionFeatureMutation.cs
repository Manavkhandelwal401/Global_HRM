using HotChocolate;
using HotChocolate.Types;
using HRMS.Shared.Application.GraphQL;
using RecognitionFeature.Application.Services;
using RecognitionFeature.Application.DTOs;

namespace RecognitionFeature.GraphQL
{
    [ExtendObjectType(typeof(Mutation))]
    public class RecognitionFeatureMutation
    {
        [GraphQLName("nominatePeer")]
        public async Task<RecognitionNominationDto?> NominatePeerAsync(
            [Service] IRecognitionService recognitionService,
            string nomineeId,
            string coreValue,
            string reason,
            int points,
            string nominatorId)
        {
            var request = new NominatePeerRequest
            {
                NominatorId = nominatorId,
                NomineeId = nomineeId,
                CoreValue = coreValue,
                Reason = reason,
                Points = points
            };
            return await recognitionService.NominatePeerAsync(request);
        }

        [GraphQLName("approveNomination")]
        public async Task<RecognitionNominationDto?> ApproveNominationAsync(
            [Service] IRecognitionService recognitionService,
            string nominationId,
            string approverId,
            string? comments)
        {
            return await recognitionService.ApproveNominationAsync(nominationId, approverId, comments);
        }
    }
}

// Made with Bob
