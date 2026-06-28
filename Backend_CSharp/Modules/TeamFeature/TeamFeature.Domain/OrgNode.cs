namespace TeamFeature.Domain
{
    public class OrgNode
    {
        public string EmployeeId { get; set; } = string.Empty;
        public string EmployeeName { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty;
        public string? Department { get; set; }
        public string? ManagerId { get; set; }
        public List<OrgNode> DirectReports { get; set; } = new();
    }
}

// Made with Bob