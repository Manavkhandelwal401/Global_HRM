namespace TeamFeature.Application.DTOs
{
    public class TeamMemberDto
    {
        public string Id { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty;
        public string? Department { get; set; }
        public string? ManagerId { get; set; }
        public string? ManagerName { get; set; }
        public string Status { get; set; } = "Active";
        public string? ProfilePictureUrl { get; set; }
    }
}

// Made with Bob