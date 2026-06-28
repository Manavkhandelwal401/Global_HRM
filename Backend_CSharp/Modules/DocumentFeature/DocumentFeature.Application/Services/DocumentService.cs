using DocumentFeature.Application.DTOs;
using DocumentFeature.Domain;
using DocumentFeature.Domain.Enums;


namespace DocumentFeature.Application.Services
{
    public interface IDocumentService
    {
        Task<IEnumerable<DocumentDto>> GetMyDocumentsAsync(string employeeId);
        Task<DocumentDto?> UploadDocumentAsync(UploadDocumentRequest request);
        Task<DocumentDto?> VerifyDocumentAsync(string documentId);
        Task<DocumentDto?> RejectDocumentAsync(string documentId, string reason);
    }

    public class DocumentService : IDocumentService
    {
        private readonly IDocumentRepository _documentRepository;

        public DocumentService(IDocumentRepository documentRepository)
        {
            _documentRepository = documentRepository;
        }

        public async Task<IEnumerable<DocumentDto>> GetMyDocumentsAsync(string employeeId)
        {
            var documents = await _documentRepository.GetEmployeeDocumentsAsync(employeeId);
            return documents.Select(MapToDto);
        }

        public async Task<DocumentDto?> UploadDocumentAsync(UploadDocumentRequest request)
        {
            var document = new Document
            {
                Id = Guid.NewGuid().ToString(),
                EmployeeId = request.EmployeeId,
                Category = request.Category,
                Name = request.Name,
                Url = request.Url,
                ExpiryDate = request.ExpiryDate,
                Status = DocumentStatus.Uploaded
            };

            var savedDocument = await _documentRepository.AddItemAsync(document);
            return MapToDto(savedDocument);
        }

        public async Task<DocumentDto?> VerifyDocumentAsync(string documentId)
        {
            var document = await _documentRepository.GetDocumentByIdAsync(documentId);
            if (document == null)
            {
                throw new InvalidOperationException("Document not found");
            }

            if (document.Status != DocumentStatus.Uploaded)
            {
                throw new InvalidOperationException($"Cannot verify document with status {document.Status}");
            }

            document.Status = DocumentStatus.Verified;
            document.RejectionReason = null;

            var updatedDocument = await _documentRepository.UpdateItemAsync(document.Id, document);
            return MapToDto(updatedDocument);
        }

        public async Task<DocumentDto?> RejectDocumentAsync(string documentId, string reason)
        {
            var document = await _documentRepository.GetDocumentByIdAsync(documentId);
            if (document == null)
            {
                throw new InvalidOperationException("Document not found");
            }

            if (document.Status != DocumentStatus.Uploaded)
            {
                throw new InvalidOperationException($"Cannot reject document with status {document.Status}");
            }

            document.Status = DocumentStatus.Rejected;
            document.RejectionReason = reason;

            var updatedDocument = await _documentRepository.UpdateItemAsync(document.Id, document);
            return MapToDto(updatedDocument);
        }

        private DocumentDto MapToDto(Document document)
        {
            return new DocumentDto
            {
                Id = document.Id,
                EmployeeId = document.EmployeeId,
                EmployeeName = "Employee", // Would be populated from Employee service in real implementation
                Category = document.Category,
                Name = document.Name,
                Url = document.Url,
                ExpiryDate = document.ExpiryDate,
                Status = document.Status,
                RejectionReason = document.RejectionReason,
                CreatedAt = document.CreatedOn ?? DateTime.UtcNow,
                UpdatedAt = document.ModifiedOn
            };
        }
    }
}

// Made with Bob