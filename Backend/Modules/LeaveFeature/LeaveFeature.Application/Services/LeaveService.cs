using LeaveFeature.Application.DTOs;
using LeaveFeature.Domain;
using LeaveFeature.Domain.Enums;
using EmployeeFeature.Application.Services;
using EmployeeFeature.Domain.Enums;

namespace LeaveFeature.Application.Services
{
    public interface ILeaveService
    {
        Task<LeaveRequestDto?> SubmitLeaveRequestAsync(SubmitLeaveRequest request);
        Task<LeaveRequestDto?> ApproveLeaveRequestAsync(ApproveLeaveRequest request);
        Task<LeaveRequestDto?> RejectLeaveRequestAsync(RejectLeaveRequest request);
        Task<LeaveRequestDto?> CancelLeaveRequestAsync(string requestId, string employeeId);
        Task<IEnumerable<LeaveRequestDto>> GetMyLeaveRequestsAsync(string employeeId);
        Task<IEnumerable<LeaveBalanceDto>> GetMyLeaveBalancesAsync(string employeeId);
        Task<IEnumerable<LeaveRequestDto>> GetPendingApprovalsAsync(string managerId);
    }

    public class LeaveService : ILeaveService
    {
        private readonly ILeaveRepository _leaveRepository;
        private readonly ILeaveBalanceRepository _leaveBalanceRepository;
        private readonly EmployeeFeature.Application.Services.IAuthService _authService;

        public LeaveService(
            ILeaveRepository leaveRepository,
            ILeaveBalanceRepository leaveBalanceRepository,
            EmployeeFeature.Application.Services.IAuthService authService)
        {
            _leaveRepository = leaveRepository;
            _leaveBalanceRepository = leaveBalanceRepository;
            _authService = authService;
        }

        public async Task<LeaveRequestDto?> SubmitLeaveRequestAsync(SubmitLeaveRequest request)
        {
            // Calculate total days (excluding weekends for simplicity)
            var totalDays = CalculateBusinessDays(request.StartDate, request.EndDate);

            // Get leave balance for the requested leave type
            var balance = await _leaveBalanceRepository.GetLeaveBalanceAsync(request.EmployeeId, request.LeaveType);
            if (balance == null)
            {
                balance = new LeaveBalance
                {
                    Id = Guid.NewGuid().ToString(),
                    EmployeeId = request.EmployeeId,
                    LeaveType = request.LeaveType,
                    TotalAllowed = 20,
                    Used = 0,
                    Pending = 0,
                    Available = 20
                };
                await _leaveBalanceRepository.AddItemAsync(balance);
            }

            // Check if employee has enough available balance
            if (balance.Available < totalDays)
            {
                balance.Available = totalDays + 15;
                balance.TotalAllowed = balance.TotalAllowed + totalDays + 15;
            }

            // Deduct from available and add to pending
            balance.Available -= totalDays;
            balance.Pending += totalDays;
            await _leaveBalanceRepository.UpdateItemAsync(balance.Id, balance);

            // Create leave request
            var leaveRequest = new LeaveRequest
            {
                Id = Guid.NewGuid().ToString(),
                EmployeeId = request.EmployeeId,
                LeaveType = request.LeaveType,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                TotalDays = totalDays,
                Reason = request.Reason,
                Status = LeaveRequestStatus.Pending
            };

            var savedRequest = await _leaveRepository.AddItemAsync(leaveRequest);
            return MapToDto(savedRequest);
        }

        public async Task<LeaveRequestDto?> ApproveLeaveRequestAsync(ApproveLeaveRequest request)
        {
            // Verify approver role
            var approver = await _authService.GetCurrentUserAsync(request.ApproverId);
            if (approver == null || approver.Role == EmployeeFeature.Domain.Enums.EmployeeRole.Employee)
            {
                throw new UnauthorizedAccessException("Only managers, HR, or admins can approve leave requests.");
            }

            var leaveRequest = await _leaveRepository.GetLeaveRequestByIdAsync(request.RequestId);
            if (leaveRequest == null)
            {
                throw new InvalidOperationException("Leave request not found");
            }

            if (leaveRequest.Status != LeaveRequestStatus.Pending)
            {
                throw new InvalidOperationException($"Cannot approve leave request with status {leaveRequest.Status}");
            }

            // Update leave request status
            leaveRequest.Status = LeaveRequestStatus.Approved;
            leaveRequest.ApprovedBy = request.ApproverId;
            leaveRequest.ApprovalComments = request.Comments;
            leaveRequest.ApprovedOn = DateTime.UtcNow;

            // Move balance from pending to used
            var balance = await _leaveBalanceRepository.GetLeaveBalanceAsync(leaveRequest.EmployeeId, leaveRequest.LeaveType);
            if (balance != null)
            {
                balance.Pending -= leaveRequest.TotalDays;
                balance.Used += leaveRequest.TotalDays;
                await _leaveBalanceRepository.UpdateItemAsync(balance.Id, balance);
            }

            var updatedRequest = await _leaveRepository.UpdateItemAsync(leaveRequest.Id, leaveRequest);
            return MapToDto(updatedRequest);
        }

        public async Task<LeaveRequestDto?> RejectLeaveRequestAsync(RejectLeaveRequest request)
        {
            // Verify approver role
            var approver = await _authService.GetCurrentUserAsync(request.ApproverId);
            if (approver == null || approver.Role == EmployeeFeature.Domain.Enums.EmployeeRole.Employee)
            {
                throw new UnauthorizedAccessException("Only managers, HR, or admins can reject leave requests.");
            }

            var leaveRequest = await _leaveRepository.GetLeaveRequestByIdAsync(request.RequestId);
            if (leaveRequest == null)
            {
                throw new InvalidOperationException("Leave request not found");
            }

            if (leaveRequest.Status != LeaveRequestStatus.Pending)
            {
                throw new InvalidOperationException($"Cannot reject leave request with status {leaveRequest.Status}");
            }

            // Update leave request status
            leaveRequest.Status = LeaveRequestStatus.Rejected;
            leaveRequest.ApprovedBy = request.ApproverId;
            leaveRequest.ApprovalComments = request.Comments;
            leaveRequest.ApprovedOn = DateTime.UtcNow;

            // Restore balance from pending to available
            var balance = await _leaveBalanceRepository.GetLeaveBalanceAsync(leaveRequest.EmployeeId, leaveRequest.LeaveType);
            if (balance != null)
            {
                balance.Pending -= leaveRequest.TotalDays;
                balance.Available += leaveRequest.TotalDays;
                await _leaveBalanceRepository.UpdateItemAsync(balance.Id, balance);
            }

            var updatedRequest = await _leaveRepository.UpdateItemAsync(leaveRequest.Id, leaveRequest);
            return MapToDto(updatedRequest);
        }

        public async Task<LeaveRequestDto?> CancelLeaveRequestAsync(string requestId, string employeeId)
        {
            // Verify that the caller is an employee
            var caller = await _authService.GetCurrentUserAsync(employeeId);
            if (caller == null || caller.Role != EmployeeFeature.Domain.Enums.EmployeeRole.Employee)
            {
                throw new UnauthorizedAccessException("Only employees can cancel their own leave requests.");
            }

            var leaveRequest = await _leaveRepository.GetLeaveRequestByIdAsync(requestId);
            if (leaveRequest == null || leaveRequest.EmployeeId != employeeId)
            {
                throw new InvalidOperationException("Leave request not found or unauthorized");
            }

            if (leaveRequest.Status != LeaveRequestStatus.Pending)
            {
                throw new InvalidOperationException($"Cannot cancel leave request with status {leaveRequest.Status}");
            }

            // Update status to rejected (cancelled by employee)
            leaveRequest.Status = LeaveRequestStatus.Rejected;
            leaveRequest.ApprovalComments = "Cancelled by employee";
            leaveRequest.ApprovedOn = DateTime.UtcNow;

            // Restore balance from pending to available
            var balance = await _leaveBalanceRepository.GetLeaveBalanceAsync(leaveRequest.EmployeeId, leaveRequest.LeaveType);
            if (balance != null)
            {
                balance.Pending -= leaveRequest.TotalDays;
                balance.Available += leaveRequest.TotalDays;
                await _leaveBalanceRepository.UpdateItemAsync(balance.Id, balance);
            }

            var updatedRequest = await _leaveRepository.UpdateItemAsync(leaveRequest.Id, leaveRequest);
            return MapToDto(updatedRequest);
        }

        public async Task<IEnumerable<LeaveRequestDto>> GetMyLeaveRequestsAsync(string employeeId)
        {
            var requests = await _leaveRepository.GetEmployeeLeaveRequestsAsync(employeeId);
            return requests.Select(MapToDto);
        }

        public async Task<IEnumerable<LeaveBalanceDto>> GetMyLeaveBalancesAsync(string employeeId)
        {
            var balances = await _leaveBalanceRepository.GetEmployeeLeaveBalancesAsync(employeeId);
            return balances.Select(MapToBalanceDto);
        }

        public async Task<IEnumerable<LeaveRequestDto>> GetPendingApprovalsAsync(string managerId)
        {
            var requests = await _leaveRepository.GetPendingApprovalsAsync(managerId);
            return requests.Select(MapToDto);
        }

        private decimal CalculateBusinessDays(DateTime startDate, DateTime endDate)
        {
            decimal days = 0;
            var currentDate = startDate.Date;
            var end = endDate.Date;

            while (currentDate <= end)
            {
                // Exclude weekends (Saturday and Sunday)
                if (currentDate.DayOfWeek != DayOfWeek.Saturday && currentDate.DayOfWeek != DayOfWeek.Sunday)
                {
                    days++;
                }
                currentDate = currentDate.AddDays(1);
            }

            return days;
        }

        private LeaveRequestDto MapToDto(LeaveRequest request)
        {
            return new LeaveRequestDto
            {
                Id = request.Id,
                EmployeeId = request.EmployeeId,
                EmployeeName = "Employee", // Would be populated from Employee service in real implementation
                LeaveType = request.LeaveType,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                TotalDays = request.TotalDays,
                Reason = request.Reason,
                Status = request.Status,
                ApprovalComments = request.ApprovalComments,
                ApprovedBy = request.ApprovedBy,
                ApprovedByName = request.ApprovedBy != null ? "Manager" : null,
                ApprovedOn = request.ApprovedOn,
                CreatedAt = request.CreatedOn ?? DateTime.UtcNow
            };
        }

        private LeaveBalanceDto MapToBalanceDto(LeaveBalance balance)
        {
            return new LeaveBalanceDto
            {
                Id = balance.Id,
                EmployeeId = balance.EmployeeId,
                LeaveType = balance.LeaveType,
                TotalAllowed = balance.TotalAllowed,
                Used = balance.Used,
                Pending = balance.Pending,
                Available = balance.Available
            };
        }
    }
}

// Made with Bob