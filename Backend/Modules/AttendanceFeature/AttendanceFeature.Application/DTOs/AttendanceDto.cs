using AttendanceFeature.Domain.Enums;

namespace AttendanceFeature.Application.DTOs
{
    public class AttendanceDto
    {
        public string Id { get; set; } = string.Empty;
        public string EmployeeId { get; set; } = string.Empty;
        public string EmployeeName { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public DateTime? ClockIn { get; set; }
        public DateTime? ClockOut { get; set; }
        public decimal ProductiveHours { get; set; }
        public decimal BreakHours { get; set; }
        public decimal OvertimeHours { get; set; }
        public AttendanceStatus Status { get; set; }
    }

    public class ClockInRequest
    {
        public string EmployeeId { get; set; } = string.Empty;
    }

    public class ClockOutRequest
    {
        public string EmployeeId { get; set; } = string.Empty;
    }

    public class AttendanceHistoryRequest
    {
        public string EmployeeId { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }

    public class TeamAttendanceRequest
    {
        public string ManagerId { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public AttendanceStatus? StatusFilter { get; set; }
    }
}

// Made with Bob