using AttendanceFeature.Application.DTOs;
using AttendanceFeature.Domain;
using AttendanceFeature.Domain.Enums;

using EmployeeFeature.Application.Services;

namespace AttendanceFeature.Application.Services
{
    public interface IAttendanceService
    {
        Task<AttendanceDto?> ClockInAsync(ClockInRequest request);
        Task<AttendanceDto?> ClockOutAsync(ClockOutRequest request);
        Task<AttendanceDto?> GetTodayAttendanceAsync(string employeeId);
        Task<IEnumerable<AttendanceDto>> GetMyAttendanceHistoryAsync(string employeeId, DateTime startDate, DateTime endDate);
        Task<IEnumerable<AttendanceDto>> GetTeamAttendanceAsync(string managerId, DateTime date, AttendanceStatus? statusFilter);
    }

    public class AttendanceService : IAttendanceService
    {
        private readonly IAttendanceRepository _attendanceRepository;
        private readonly IAuthService _authService;

        // Standard shift times (9 AM - 6 PM)
        private readonly TimeSpan _shiftStartTime = new TimeSpan(9, 0, 0);
        private readonly TimeSpan _shiftEndTime = new TimeSpan(18, 0, 0);
        private readonly decimal _lunchBreakHours = 1.0m;

        public AttendanceService(IAttendanceRepository attendanceRepository, IAuthService authService)
        {
            _attendanceRepository = attendanceRepository;
            _authService = authService;
        }

        public async Task<AttendanceDto?> ClockInAsync(ClockInRequest request)
        {
            var today = DateTime.UtcNow.Date;
            
            // Check if already clocked in today
            var existingRecord = await _attendanceRepository.GetTodayAttendanceAsync(request.EmployeeId, today);
            if (existingRecord != null && existingRecord.ClockIn.HasValue)
            {
                return MapToDto(existingRecord);
            }

            var clockInTime = DateTime.UtcNow;
            var clockInTimeOfDay = clockInTime.TimeOfDay;

            // Determine status based on clock-in time
            var status = AttendanceStatus.Present;
            if (clockInTimeOfDay > _shiftStartTime.Add(TimeSpan.FromMinutes(15)))
            {
                status = AttendanceStatus.Late;
            }

            var record = new AttendanceRecord
            {
                Id = Guid.NewGuid().ToString(),
                EmployeeId = request.EmployeeId,
                Date = today,
                ClockIn = clockInTime,
                Status = status,
                ProductiveHours = 0,
                BreakHours = 0,
                OvertimeHours = 0
            };

            var savedRecord = await _attendanceRepository.AddItemAsync(record);
            return MapToDto(savedRecord);
        }

        public async Task<AttendanceDto?> ClockOutAsync(ClockOutRequest request)
        {
            var today = DateTime.UtcNow.Date;
            
            var existingRecord = await _attendanceRepository.GetTodayAttendanceAsync(request.EmployeeId, today);
            if (existingRecord == null || !existingRecord.ClockIn.HasValue)
            {
                return null;
            }

            var clockOutTime = DateTime.UtcNow;
            existingRecord.ClockOut = clockOutTime;

            // Calculate total hours worked
            var totalHours = (decimal)(clockOutTime - existingRecord.ClockIn.Value).TotalHours;
            
            // Calculate productive hours (total - lunch break)
            existingRecord.ProductiveHours = Math.Max(0, totalHours - _lunchBreakHours);
            existingRecord.BreakHours = _lunchBreakHours;

            // Calculate overtime (hours beyond 9 hours including lunch)
            var standardWorkHours = 9.0m; // 9 AM to 6 PM
            if (totalHours > standardWorkHours)
            {
                existingRecord.OvertimeHours = totalHours - standardWorkHours;
            }

            // Update status if half-day
            if (existingRecord.ProductiveHours < 4.0m)
            {
                existingRecord.Status = AttendanceStatus.HalfDay;
            }

            var updatedRecord = await _attendanceRepository.UpdateItemAsync(existingRecord.Id, existingRecord);
            return MapToDto(updatedRecord);
        }

        public async Task<AttendanceDto?> GetTodayAttendanceAsync(string employeeId)
        {
            var today = DateTime.UtcNow.Date;
            var record = await _attendanceRepository.GetTodayAttendanceAsync(employeeId, today);
            return record != null ? MapToDto(record) : null;
        }

        public async Task<IEnumerable<AttendanceDto>> GetMyAttendanceHistoryAsync(string employeeId, DateTime startDate, DateTime endDate)
        {
            var records = await _attendanceRepository.GetAttendanceHistoryAsync(employeeId, startDate, endDate);
            return records.Select(MapToDto);
        }

        public async Task<IEnumerable<AttendanceDto>> GetTeamAttendanceAsync(string managerId, DateTime date, AttendanceStatus? statusFilter)
        {
            // Get manager's profile to find their department
            var manager = await _authService.GetCurrentUserAsync(managerId);
            if (manager == null)
            {
                return Enumerable.Empty<AttendanceDto>();
            }

            // For demo purposes, we'll use hardcoded team member IDs
            // In a real implementation, this would query employees by department or manager
            var teamMemberIds = new List<string> { "emp-001", "emp-002", "emp-003" };

            var records = await _attendanceRepository.GetTeamAttendanceAsync(teamMemberIds, date);
            
            var dtos = records.Select(MapToDto);

            // Apply status filter if provided
            if (statusFilter.HasValue)
            {
                dtos = dtos.Where(d => d.Status == statusFilter.Value);
            }

            return dtos;
        }

        private AttendanceDto MapToDto(AttendanceRecord record)
        {
            return new AttendanceDto
            {
                Id = record.Id,
                EmployeeId = record.EmployeeId,
                EmployeeName = "Employee", // Would be populated from Employee service in real implementation
                Date = record.Date,
                ClockIn = record.ClockIn,
                ClockOut = record.ClockOut,
                ProductiveHours = record.ProductiveHours,
                BreakHours = record.BreakHours,
                OvertimeHours = record.OvertimeHours,
                Status = record.Status
            };
        }
    }
}

// Made with Bob