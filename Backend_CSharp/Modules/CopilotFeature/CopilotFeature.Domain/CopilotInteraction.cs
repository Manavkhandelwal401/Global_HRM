using HRMS.Core.Postgres.Common;

namespace CopilotFeature.Domain
{
    public class CopilotInteraction : BaseEntity
    {
        public string EmployeeId { get; set; } = string.Empty;
        public string Query { get; set; } = string.Empty;
        public string Response { get; set; } = string.Empty;
        public DateTime InteractionTime { get; set; }
        public string? Context { get; set; }
        public bool WasHelpful { get; set; }
    }
}

// Made with Bob
