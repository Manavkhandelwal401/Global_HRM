using HotChocolate;
using HotChocolate.Types;
using HRMS.Shared.Application.GraphQL;
using DocumentFeature.Application.Services;
using DocumentFeature.Application.DTOs;

namespace DocumentFeature.GraphQL
{
    [ExtendObjectType(typeof(Query))]
    public class DocumentFeatureQuery
    {
        [GraphQLName("getMyDocuments")]
        public async Task<IEnumerable<DocumentDto>> GetMyDocumentsAsync(
            [Service] IDocumentService documentService,
            string employeeId)
        {
            return await documentService.GetMyDocumentsAsync(employeeId);
        }
    }
}

// Made with Bob
