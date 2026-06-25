using DocumentFeature.Domain;

namespace DocumentFeature.Domain
{
    public interface IDocumentRepository
    {
        Task<IEnumerable<Document>> GetEmployeeDocumentsAsync(string employeeId);
        Task<Document?> GetDocumentByIdAsync(string documentId);
        Task<Document> AddItemAsync(Document document);
        Task<Document> UpdateItemAsync(string id, Document document);
    }
}

// Made with Bob