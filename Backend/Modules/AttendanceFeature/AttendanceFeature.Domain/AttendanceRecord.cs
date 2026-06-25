using HRMS.Core.Postgres.Common;
using AttendanceFeature.Domain.Enums;

namespace AttendanceFeature.Domain
{
    public class AttendanceRecord : BaseEntity
    {
        public string EmployeeId { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public DateTime? ClockIn { get; set; }
        public DateTime? ClockOut { get; set; }
        public decimal ProductiveHours { get; set; }
        public decimal BreakHours { get; set; }
        public decimal OvertimeHours { get; set; }
        public AttendanceStatus Status { get; set; } = AttendanceStatus.Present;
    }
}

// Made with Bob
