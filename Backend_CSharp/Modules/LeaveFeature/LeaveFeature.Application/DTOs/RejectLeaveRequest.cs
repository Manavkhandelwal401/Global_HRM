namespace LeaveFeature.Application.DTOs
{
    public class RejectLeaveRequest
    {
        public string RequestId { get; set; } = string.Empty;
        public string ApproverId { get; set; } = string.Empty;
        public string? Comments { get; set; }
    }
}

// Made with Bob