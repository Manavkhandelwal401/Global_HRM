using HotChocolate;
using HotChocolate.Types;
using HRMS.Shared.Application.GraphQL;
using DocumentFeature.Application.Services;
using DocumentFeature.Application.DTOs;
using DocumentFeature.Domain.Enums;

namespace DocumentFeature.GraphQL
{
    [ExtendObjectType(typeof(Mutation))]
    public class DocumentFeatureMutation
    {
        [GraphQLName("uploadDocument")]
        public async Task<DocumentDto?> UploadDocumentAsync(
            [Service] IDocumentService documentService,
            string employeeId,
            DocumentCategory category,
            string name,
            string url,
            DateTime? expiryDate)
        {
            var request = new UploadDocumentRequest
            {
                EmployeeId = employeeId,
                Category = category,
                Name = name,
                Url = url,
                ExpiryDate = expiryDate
            };
            return await documentService.UploadDocumentAsync(request);
        }

        [GraphQLName("verifyDocument")]
        public async Task<DocumentDto?> VerifyDocumentAsync(
            [Service] IDocumentService documentService,
            string documentId)
        {
            return await documentService.VerifyDocumentAsync(documentId);
        }

        [GraphQLName("rejectDocument")]
        public async Task<DocumentDto?> RejectDocumentAsync(
            [Service] IDocumentService documentService,
            string documentId,
            string reason)
        {
            return await documentService.RejectDocumentAsync(documentId, reason);
        }
    }
}

// Made with Bob
