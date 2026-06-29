import decimal
import datetime
import strawberry
from typing import List, Optional
from strawberry.types import Info
from strawberry.django.views import GraphQLView
from django.db import transaction

from api.models import (
    Employee, AttendanceRecord, LeaveRequest, LeaveBalance,
    TrainingModule, Announcement, PayrollRecord, Asset,
    AssetAllocation, CopilotInteraction, Document, Reimbursement,
    Resignation, ClearanceItem, ExitInterview, OnboardingChecklist,
    OnboardingTemplate, Goal, PerformanceReview, RecognitionNomination,
    JobPosting, Candidate, ServiceRequest, Todo, AnalyticsMetric
)

import enum

# Enums matching GraphQL
@strawberry.enum
class EmployeeRole(enum.Enum):
    Admin = "Admin"
    HR = "HR"
    Manager = "Manager"
    Employee = "Employee"

@strawberry.enum
class Country(enum.Enum):
    US = "US"
    IN = "IN"

@strawberry.enum
class Status(enum.Enum):
    Active = "Active"
    Inactive = "Inactive"
    Deleted = "Deleted"

@strawberry.enum
class AttendanceStatus(enum.Enum):
    Present = "Present"
    Absent = "Absent"
    OnLeave = "OnLeave"
    Late = "Late"

@strawberry.enum
class LeaveType(enum.Enum):
    Casual = "Casual"
    Sick = "Sick"
    Personal = "Personal"

@strawberry.enum
class DocumentCategory(enum.Enum):
    IDProof = "IDProof"
    AddressProof = "AddressProof"
    Education = "Education"
    Experience = "Experience"

@strawberry.enum
class DocumentStatus(enum.Enum):
    Missing = "Missing"
    Pending = "Pending"
    Approved = "Approved"
    Rejected = "Rejected"

@strawberry.enum
class ReimbursementCategory(enum.Enum):
    Travel = "Travel"
    Food = "Food"
    Medical = "Medical"
    Others = "Others"

@strawberry.enum
class ReimbursementStatus(enum.Enum):
    Pending = "Pending"
    Approved = "Approved"
    Rejected = "Rejected"

# Type Mappings
@strawberry.type
class UserProfile:
    id: str
    name: str
    email: str
    designation: Optional[str]
    department: Optional[str]
    role: str
    country: str
    isDemo: bool

@strawberry.type
class LoginResponse:
    success: bool
    message: str
    token: Optional[str]
    user: Optional[UserProfile]

@strawberry.type
class AttendanceDto:
    id: str
    employeeId: str
    employeeName: str
    date: str
    clockIn: Optional[str]
    clockOut: Optional[str]
    productiveHours: decimal.Decimal
    breakHours: decimal.Decimal
    overtimeHours: decimal.Decimal
    status: str

@strawberry.type
class LeaveBalanceDto:
    id: str
    employeeId: str
    leaveType: str
    totalAllowed: decimal.Decimal
    used: decimal.Decimal
    pending: decimal.Decimal
    available: decimal.Decimal

@strawberry.type
class LeaveRequestDto:
    id: str
    employeeId: str
    employeeName: str
    leaveType: str
    startDate: str
    endDate: str
    totalDays: decimal.Decimal
    reason: Optional[str]
    status: str
    approvalComments: Optional[str]
    approvedBy: Optional[str]
    approvedByName: Optional[str]
    approvedOn: Optional[str]
    createdAt: str

@strawberry.type
class TrainingModuleDto:
    id: str
    title: str
    category: str
    duration: int
    mandatory: bool
    status: str
    progressPercentage: decimal.Decimal
    description: Optional[str]

@strawberry.type
class AnnouncementDto:
    id: str
    title: str
    category: str
    content: str
    priority: str
    visibilityScope: str
    createdBy: Optional[str]
    createdByName: Optional[str]
    expiryDate: Optional[str]
    createdAt: str

@strawberry.type
class PayrollRecordDto:
    id: str
    employeeId: str
    employeeName: str
    payPeriodStart: str
    payPeriodEnd: str
    basicPay: decimal.Decimal
    hra: decimal.Decimal
    allowances: decimal.Decimal
    grossPay: decimal.Decimal
    pf: decimal.Decimal
    incomeTax: decimal.Decimal
    esi: decimal.Decimal
    deductions: decimal.Decimal
    net_pay: decimal.Decimal # netPay matches NetPay in db
    status: str
    createdAt: str

@strawberry.type
class AssetDto:
    id: str
    serialNumber: str
    assetName: str
    category: str
    condition: str
    status: str

@strawberry.type
class AssetAllocationDto:
    id: str
    assetId: str
    employeeId: str
    allocatedOn: str
    returnedOn: Optional[str]
    returnReason: Optional[str]
    conditionOnReturn: Optional[str]
    asset: Optional[AssetDto]

@strawberry.type
class CopilotResponseDto:
    query: str
    response: str
    suggestedQuestions: List[str]
    timestamp: str

@strawberry.type
class DocumentDto:
    id: str
    employeeId: str
    employeeName: str
    category: str
    name: str
    url: Optional[str]
    expiryDate: Optional[str]
    status: str
    rejectionReason: Optional[str]
    createdAt: str
    updatedAt: str

@strawberry.type
class ReimbursementDto:
    id: str
    employeeId: str
    employeeName: str
    category: str
    amount: decimal.Decimal
    currency: str
    date: str
    status: str
    comments: Optional[str]
    approvedBy: Optional[str]
    approvedByName: Optional[str]
    approvedOn: Optional[str]
    createdAt: str

@strawberry.type
class ResignationDto:
    id: str
    employeeId: str
    submissionDate: str
    lastWorkingDate: str
    reason: str
    status: str
    approvedBy: Optional[str]
    approvedOn: Optional[str]

@strawberry.type
class ClearanceItemDto:
    id: str
    employeeId: str
    department: str
    itemName: str
    status: str
    clearedBy: Optional[str]
    clearedOn: Optional[str]

@strawberry.type
class ExitInterviewDto:
    id: str
    employeeId: str
    feedbackJson: str
    createdAt: str

@strawberry.type
class OnboardingChecklistDto:
    id: str
    employeeId: str
    taskId: str
    taskName: str
    description: Optional[str]
    status: str
    completedAt: Optional[str]
    createdAt: str

@strawberry.type
class OnboardingProgressSummaryDto:
    employeeId: str
    employeeName: str
    department: Optional[str]
    totalTasks: int
    completedTasks: int
    progressPercentage: decimal.Decimal
    startDate: str

@strawberry.type
class OrgNodeDto:
    employeeId: str
    employeeName: str
    position: str
    department: Optional[str]
    managerId: Optional[str]
    directReports: List['OrgNodeDto']

@strawberry.type
class TeamDirectoryDto:
    id: str
    fullName: str
    email: str
    position: str
    department: str
    managerId: Optional[str]
    managerName: Optional[str]
    status: str
    profilePictureUrl: Optional[str]

@strawberry.type
class GoalDto:
    id: str
    employeeId: str
    title: str
    targetValue: decimal.Decimal
    currentValue: decimal.Decimal
    weight: decimal.Decimal
    status: str
    progressPercentage: decimal.Decimal
    dueDate: Optional[str]

@strawberry.type
class PerformanceReviewDto:
    id: str
    employeeId: str
    reviewerId: str
    period: str
    rating: decimal.Decimal
    strengths: Optional[str]
    improvements: Optional[str]
    reviewDate: Optional[str]

@strawberry.type
class RecognitionNominationDto:
    id: str
    nominatorId: str
    nominatorName: str
    nomineeId: str
    nomineeName: str
    coreValue: str
    reason: str
    points: int
    status: str
    approvedBy: Optional[str]
    approvedByName: Optional[str]
    approvedOn: Optional[str]
    createdAt: str

@strawberry.type
class JobPostingDto:
    id: str
    title: str
    department: Optional[str]
    location: Optional[str]
    experienceRequired: Optional[str]
    salaryRange: Optional[str]
    status: str
    description: Optional[str]
    postedDate: Optional[str]

@strawberry.type
class CandidateDto:
    id: str
    name: str
    roleApplied: Optional[str]
    status: str
    rating: decimal.Decimal
    experience: Optional[str]
    noticePeriod: Optional[str]
    skills: Optional[str]
    email: Optional[str]
    phone: Optional[str]
    jobPostingId: Optional[str]

@strawberry.type
class ServiceRequestDto:
    id: str
    employeeId: str
    title: str
    description: str
    category: str
    priority: str
    status: str
    assignedToId: Optional[str]
    assignedToName: Optional[str]
    resolutionComments: Optional[str]
    createdAt: str
    updatedAt: str

@strawberry.type
class TodoDto:
    id: str
    title: Optional[str]
    description: Optional[str]
    dueDate: Optional[str]
    isCompleted: bool
    userId: Optional[str]

@strawberry.type
class AttritionMetricsDto:
    riskPercentage: decimal.Decimal
    trendDirection: str
    highRiskEmployees: int

@strawberry.type
class DepartmentDiversityDto:
    department: str
    score: decimal.Decimal

@strawberry.type
class DiversityMetricsDto:
    byDepartment: List[DepartmentDiversityDto]
    overallDiversityScore: decimal.Decimal

@strawberry.type
class TrainingMetricsDto:
    completionPercentage: decimal.Decimal
    totalCourses: int
    completedCourses: int

@strawberry.type
class LeaveMetricsDto:
    patternsByMonth: List[str] # simple month summary representation
    averageLeavePerEmployee: decimal.Decimal

@strawberry.type
class HRAnalyticsSummaryDto:
    attrition: AttritionMetricsDto
    diversity: DiversityMetricsDto
    training: TrainingMetricsDto
    leave: LeaveMetricsDto

# Inputs
@strawberry.input
class SubmitLeaveRequestInput:
    employeeId: str
    leaveType: str
    startDate: str
    endDate: str
    totalDays: decimal.Decimal
    reason: Optional[str]

@strawberry.input
class ApproveLeaveRequestInput:
    requestId: str
    approverId: str
    comments: Optional[str]

@strawberry.input
class RejectLeaveRequestInput:
    requestId: str
    approverId: str
    comments: Optional[str]

@strawberry.input
class RequestParamInput:
    todoId: Optional[str] = None
    userId: Optional[str] = None
    isCompleted: Optional[bool] = None

@strawberry.input
class GetAllTodosRequest:
    pageIndex: int
    pageSize: int
    requestParam: Optional[RequestParamInput] = None

@strawberry.input
class CreateTodoRequest:
    title: str
    description: Optional[str] = None
    dueDate: Optional[str] = None
    userId: str

@strawberry.input
class UpdateTodoRequest:
    todoId: str
    title: Optional[str] = None
    description: Optional[str] = None
    dueDate: Optional[str] = None
    isCompleted: Optional[bool] = None

@strawberry.input
class DeleteTodoRequest:
    todoId: str

@strawberry.type
class CreateTodoResponse:
    id: str
    title: str

@strawberry.type
class UpdateTodoResponse:
    id: str
    success: bool

@strawberry.type
class DeleteTodoResponse:
    id: str
    success: bool

@strawberry.type
class BaseResponseTodoCreate:
    success: bool
    message: str
    data: Optional[CreateTodoResponse]

@strawberry.type
class BaseResponseTodoUpdate:
    success: bool
    message: str
    data: Optional[UpdateTodoResponse]

@strawberry.type
class BaseResponseTodoDelete:
    success: bool
    message: str
    data: Optional[DeleteTodoResponse]

@strawberry.type
class BaseResponsePaginationTodos:
    success: bool
    message: str
    data: List[TodoDto]
    totalCount: int

@strawberry.type
class DownloadPayslipResponse:
    downloadUrl: str
    success: bool
    message: str

# Queries
@strawberry.type
class Query:
    @strawberry.field
    def getCurrentUser(self, info: Info) -> Optional[UserProfile]:
        # C# Startup auth maps matching demo session restoration or direct retrieval
        # Since we use fake local auth, we resolve current user info
        auth_header = info.context.request.headers.get("Authorization", "")
        if not auth_header:
            return None
        token = auth_header.replace("Bearer ", "")
        if token.startswith("demo-token-"):
            original_user_id = token.replace("demo-token-", "")
        else:
            try:
                import jwt
                from django.conf import settings
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
                original_user_id = payload.get("nameid")
            except Exception:
                return None
        try:
            employee = Employee.objects.get(id=original_user_id)
            return UserProfile(
                id=employee.id,
                name=employee.name,
                email=employee.email,
                designation=employee.designation,
                department=employee.department,
                role=employee.role,
                country=employee.country,
                isDemo=employee.is_demo
            )
        except Employee.DoesNotExist:
            return None

    @strawberry.field
    def getTodayAttendance(self, employeeId: str) -> Optional[AttendanceDto]:
        today = datetime.date.today()
        try:
            record = AttendanceRecord.objects.get(employee_id=employeeId, date=today)
            employee = Employee.objects.get(id=employeeId)
            return AttendanceDto(
                id=record.id,
                employeeId=record.employee_id,
                employeeName=employee.name,
                date=record.date.strftime("%Y-%m-%d"),
                clockIn=record.clock_in.isoformat() if record.clock_in else None,
                clockOut=record.clock_out.isoformat() if record.clock_out else None,
                productiveHours=record.productive_hours,
                breakHours=record.break_hours,
                overtimeHours=record.overtime_hours,
                status=record.status
            )
        except (AttendanceRecord.DoesNotExist, Employee.DoesNotExist):
            return None

    @strawberry.field
    def getMyAttendance(self, employeeId: str, startDate: str, endDate: str) -> List[AttendanceDto]:
        start = datetime.datetime.fromisoformat(startDate.replace("Z", "+00:00")).date()
        end = datetime.datetime.fromisoformat(endDate.replace("Z", "+00:00")).date()
        records = AttendanceRecord.objects.filter(employee_id=employeeId, date__range=(start, end)).order_by('-date')
        
        try:
            employee = Employee.objects.get(id=employeeId)
            emp_name = employee.name
        except Employee.DoesNotExist:
            emp_name = "Unknown"

        dtos = []
        for record in records:
            dtos.append(AttendanceDto(
                id=record.id,
                employeeId=record.employee_id,
                employeeName=emp_name,
                date=record.date.strftime("%Y-%m-%d"),
                clockIn=record.clock_in.isoformat() if record.clock_in else None,
                clockOut=record.clock_out.isoformat() if record.clock_out else None,
                productiveHours=record.productive_hours,
                breakHours=record.break_hours,
                overtimeHours=record.overtime_hours,
                status=record.status
            ))
        return dtos

    @strawberry.field
    def getTeamAttendance(self, managerId: str, date: str, statusFilter: Optional[AttendanceStatus] = None) -> List[AttendanceDto]:
        dt = datetime.datetime.fromisoformat(date.replace("Z", "+00:00")).date()
        employees = Employee.objects.filter(manager_id=managerId)
        emp_ids = [e.id for e in employees]
        records = AttendanceRecord.objects.filter(employee_id__in=emp_ids, date=dt)
        if statusFilter:
            records = records.filter(status=statusFilter.value)
        
        emp_map = {e.id: e.name for e in employees}
        dtos = []
        for record in records:
            dtos.append(AttendanceDto(
                id=record.id,
                employeeId=record.employee_id,
                employeeName=emp_map.get(record.employee_id, "Unknown"),
                date=record.date.strftime("%Y-%m-%d"),
                clockIn=record.clock_in.isoformat() if record.clock_in else None,
                clockOut=record.clock_out.isoformat() if record.clock_out else None,
                productiveHours=record.productive_hours,
                breakHours=record.break_hours,
                overtimeHours=record.overtime_hours,
                status=record.status
            ))
        return dtos

    @strawberry.field
    def getMyLeaveBalances(self, employeeId: str) -> List[LeaveBalanceDto]:
        balances = LeaveBalance.objects.filter(employee_id=employeeId)
        return [LeaveBalanceDto(
            id=b.id,
            employeeId=b.employee_id,
            leaveType=b.leave_type,
            totalAllowed=b.total_allowed,
            used=b.used,
            pending=b.pending,
            available=b.available
        ) for b in balances]

    @strawberry.field
    def getMyLeaveRequests(self, employeeId: str) -> List[LeaveRequestDto]:
        requests = LeaveRequest.objects.filter(employee_id=employeeId).order_by('-created_on')
        try:
            employee = Employee.objects.get(id=employeeId)
            emp_name = employee.name
        except Employee.DoesNotExist:
            emp_name = "Unknown"

        dtos = []
        for r in requests:
            approved_by_name = None
            if r.approved_by:
                try:
                    approved_by_name = Employee.objects.get(id=r.approved_by).name
                except Employee.DoesNotExist:
                    pass
            dtos.append(LeaveRequestDto(
                id=r.id,
                employeeId=r.employee_id,
                employeeName=emp_name,
                leaveType=r.leave_type,
                startDate=r.start_date.isoformat(),
                endDate=r.end_date.isoformat(),
                totalDays=r.total_days,
                reason=r.reason,
                status=r.status,
                approvalComments=r.approval_comments,
                approvedBy=r.approved_by,
                approvedByName=approved_by_name,
                approvedOn=r.approved_on.isoformat() if r.approved_on else None,
                createdAt=r.created_on.isoformat() if r.created_on else ""
            ))
        return dtos

    @strawberry.field
    def getPendingLeaveApprovals(self, managerId: str) -> List[LeaveRequestDto]:
        try:
            approver = Employee.objects.get(id=managerId)
            approver_role = approver.role
        except Employee.DoesNotExist:
            return []

        # If employee sent the leave, it goes to Admin, HR, and Manager.
        # If HR sent the leave, it goes to Admin and Manager.
        # If Manager sent the leave, it goes to Admin.
        # Otherwise, check subordinates (manager_id).
        
        # Let's build a query for pending leave requests based on the role of the requester
        from django.db.models import Q
        
        # Get pending leave requests
        pending_requests = LeaveRequest.objects.filter(status="Pending").order_by('-created_on')
        
        dtos = []
        for r in pending_requests:
            try:
                requester = Employee.objects.get(id=r.employee_id)
                requester_role = requester.role
            except Employee.DoesNotExist:
                continue
            
            should_approve = False
            
            # Leave sent by Employee -> goes to Admin, HR, Manager
            if requester_role == "Employee":
                if approver_role in ["Admin", "HR"] or requester.manager_id == managerId:
                    should_approve = True
            
            # Leave sent by HR -> goes to Admin, Manager
            elif requester_role == "HR":
                if approver_role in ["Admin", "Manager"] or requester.manager_id == managerId:
                    should_approve = True
                    
            # Leave sent by Manager -> goes to Admin, Manager (their manager/admin)
            elif requester_role == "Manager":
                if approver_role == "Admin" or requester.manager_id == managerId:
                    should_approve = True
            
            # Leave sent by Admin -> goes to other Admins or manager
            elif requester_role == "Admin":
                if approver_role == "Admin" or requester.manager_id == managerId:
                    should_approve = True

            if should_approve:
                dtos.append(LeaveRequestDto(
                    id=r.id,
                    employeeId=r.employee_id,
                    employeeName=requester.name,
                    leaveType=r.leave_type,
                    startDate=r.start_date.isoformat(),
                    endDate=r.end_date.isoformat(),
                    totalDays=r.total_days,
                    reason=r.reason,
                    status=r.status,
                    approvalComments=r.approval_comments,
                    approvedBy=r.approved_by,
                    approvedByName=None,
                    approvedOn=r.approved_on.isoformat() if r.approved_on else None,
                    createdAt=r.created_on.isoformat() if r.created_on else ""
                ))
        return dtos

    @strawberry.field
    def getMyPayslips(self, employeeId: str) -> List[PayrollRecordDto]:
        records = PayrollRecord.objects.filter(employee_id__iexact=employeeId).order_by('-pay_period_end')
        try:
            employee = Employee.objects.get(id__iexact=employeeId)
            emp_name = employee.name
        except Employee.DoesNotExist:
            emp_name = "Unknown"

        return [PayrollRecordDto(
            id=r.id,
            employeeId=r.employee_id,
            employeeName=emp_name,
            payPeriodStart=r.pay_period_start.isoformat(),
            payPeriodEnd=r.pay_period_end.isoformat(),
            basicPay=r.basic_pay,
            hra=r.hra,
            allowances=r.allowances,
            grossPay=r.gross_pay,
            pf=r.pf,
            incomeTax=r.income_tax,
            esi=r.esi,
            deductions=r.deductions,
            net_pay=r.net_pay,
            status=r.status,
            createdAt=r.created_on.isoformat() if r.created_on else ""
        ) for r in records]

    @strawberry.field
    def getPayrollDetail(self, payslipId: str) -> Optional[PayrollRecordDto]:
        try:
            r = PayrollRecord.objects.get(id=payslipId)
            try:
                employee = Employee.objects.get(id=r.employee_id)
                emp_name = employee.name
            except Employee.DoesNotExist:
                emp_name = "Unknown"
            return PayrollRecordDto(
                id=r.id,
                employeeId=r.employee_id,
                employeeName=emp_name,
                payPeriodStart=r.pay_period_start.isoformat(),
                payPeriodEnd=r.pay_period_end.isoformat(),
                basicPay=r.basic_pay,
                hra=r.hra,
                allowances=r.allowances,
                grossPay=r.gross_pay,
                pf=r.pf,
                incomeTax=r.income_tax,
                esi=r.esi,
                deductions=r.deductions,
                net_pay=r.net_pay,
                status=r.status,
                createdAt=r.created_on.isoformat() if r.created_on else ""
            )
        except PayrollRecord.DoesNotExist:
            return None

    @strawberry.field
    def getMyExpenses(self, employeeId: str) -> List[ReimbursementDto]:
        records = Reimbursement.objects.filter(employee_id=employeeId).order_by('-created_on')
        try:
            employee = Employee.objects.get(id=employeeId)
            emp_name = employee.name
        except Employee.DoesNotExist:
            emp_name = "Unknown"

        dtos = []
        for r in records:
            approved_by_name = None
            if r.approved_by:
                try:
                    approved_by_name = Employee.objects.get(id=r.approved_by).name
                except Employee.DoesNotExist:
                    pass
            dtos.append(ReimbursementDto(
                id=r.id,
                employeeId=r.employee_id,
                employeeName=emp_name,
                category=r.category,
                amount=r.amount,
                currency=r.currency,
                date=r.date.strftime("%Y-%m-%d"),
                status=r.status,
                comments=r.comments,
                approvedBy=r.approved_by,
                approvedByName=approved_by_name,
                approvedOn=r.approved_on.isoformat() if r.approved_on else None,
                createdAt=r.created_on.isoformat() if r.created_on else ""
            ))
        return dtos

    @strawberry.field
    def getPendingExpenseApprovals(self, managerId: str) -> List[ReimbursementDto]:
        subordinates = Employee.objects.filter(manager_id=managerId)
        sub_ids = [s.id for s in subordinates]
        sub_map = {s.id: s.name for s in subordinates}

        records = Reimbursement.objects.filter(employee_id__in=sub_ids, status="Pending").order_by('-created_on')
        dtos = []
        for r in records:
            dtos.append(ReimbursementDto(
                id=r.id,
                employeeId=r.employee_id,
                employeeName=sub_map.get(r.employee_id, "Unknown"),
                category=r.category,
                amount=r.amount,
                currency=r.currency,
                date=r.date.strftime("%Y-%m-%d"),
                status=r.status,
                comments=r.comments,
                approvedBy=r.approved_by,
                approvedByName=None,
                approvedOn=r.approved_on.isoformat() if r.approved_on else None,
                createdAt=r.created_on.isoformat() if r.created_on else ""
            ))
        return dtos

    @strawberry.field
    def getNewHireChecklist(self, employeeId: str) -> List[OnboardingChecklistDto]:
        items = OnboardingChecklist.objects.filter(employee_id=employeeId).order_by('created_at')
        return [OnboardingChecklistDto(
            id=item.id,
            employeeId=item.employee_id,
            taskId=item.task_id,
            taskName=item.task_name,
            description=item.description,
            status=item.status,
            completedAt=item.completed_at.isoformat() if item.completed_at else None,
            createdAt=item.created_at.isoformat()
        ) for item in items]

    @strawberry.field
    def getOnboardingProgressSummary(self) -> List[OnboardingProgressSummaryDto]:
        employees = Employee.objects.filter(registration_status="Pending")
        dtos = []
        for emp in employees:
            checklist = OnboardingChecklist.objects.filter(employee_id=emp.id)
            total = checklist.count()
            completed = checklist.filter(status="Completed").count()
            progress = (decimal.Decimal(completed) / decimal.Decimal(total) * 100) if total > 0 else decimal.Decimal(0)
            dtos.append(OnboardingProgressSummaryDto(
                employeeId=emp.id,
                employeeName=emp.name,
                department=emp.department,
                totalTasks=total,
                completedTasks=completed,
                progressPercentage=progress,
                startDate=emp.created_on.isoformat() if emp.created_on else ""
            ))
        return dtos

    @strawberry.field
    def getMyResignationDetails(self, info: Info) -> Optional[ResignationDto]:
        original_user_id = info.context.request.headers.get("Authorization", "").replace("Bearer ", "").replace("demo-token-", "")
        if not original_user_id:
            return None
        try:
            r = Resignation.objects.filter(employee_id=original_user_id).latest('created_on')
            return ResignationDto(
                id=r.id,
                employeeId=r.employee_id,
                submissionDate=r.submission_date.isoformat(),
                lastWorkingDate=r.last_working_date.isoformat(),
                reason=r.reason,
                status=r.status,
                approvedBy=r.approved_by,
                approvedOn=r.approved_on.isoformat() if r.approved_on else None
            )
        except Resignation.DoesNotExist:
            return None

    @strawberry.field
    def getMyClearanceStatus(self, info: Info) -> List[ClearanceItemDto]:
        original_user_id = info.context.request.headers.get("Authorization", "").replace("Bearer ", "").replace("demo-token-", "")
        if not original_user_id:
            return []
        items = ClearanceItem.objects.filter(employee_id=original_user_id)
        return [ClearanceItemDto(
            id=c.id,
            employeeId=c.employee_id,
            department=c.department,
            itemName=c.item_name,
            status=c.status,
            clearedBy=c.cleared_by,
            clearedOn=c.cleared_on.isoformat() if c.cleared_on else None
        ) for c in items]

    @strawberry.field
    def getPendingOffboardingRequests(self) -> List[ResignationDto]:
        resignations = Resignation.objects.filter(status="Pending").order_by('-submission_date')
        return [ResignationDto(
            id=r.id,
            employeeId=r.employee_id,
            submissionDate=r.submission_date.isoformat(),
            lastWorkingDate=r.last_working_date.isoformat(),
            reason=r.reason,
            status=r.status,
            approvedBy=r.approved_by,
            approvedOn=r.approved_on.isoformat() if r.approved_on else None
        ) for r in resignations]

    @strawberry.field
    def getAllClearanceItems(self, employeeId: str) -> List[ClearanceItemDto]:
        items = ClearanceItem.objects.filter(employee_id=employeeId)
        return [ClearanceItemDto(
            id=c.id,
            employeeId=c.employee_id,
            department=c.department,
            itemName=c.item_name,
            status=c.status,
            clearedBy=c.cleared_by,
            clearedOn=c.cleared_on.isoformat() if c.cleared_on else None
        ) for c in items]

    @strawberry.field
    def getExitInterview(self, employeeId: str) -> Optional[ExitInterviewDto]:
        try:
            e = ExitInterview.objects.filter(employee_id=employeeId).latest('created_at')
            return ExitInterviewDto(
                id=e.id,
                employeeId=e.employee_id,
                feedbackJson=e.feedback_json,
                createdAt=e.created_at.isoformat()
            )
        except ExitInterview.DoesNotExist:
            return None

    @strawberry.field
    def getMyAllocatedAssets(self, info: Info) -> List[AssetAllocationDto]:
        original_user_id = info.context.request.headers.get("Authorization", "").replace("Bearer ", "").replace("demo-token-", "")
        if not original_user_id:
            return []
        allocations = AssetAllocation.objects.filter(employee_id=original_user_id, returned_on__isnull=True)
        dtos = []
        for a in allocations:
            asset_obj = None
            try:
                ast = Asset.objects.get(id=a.asset_id)
                asset_obj = AssetDto(
                    id=ast.id,
                    serialNumber=ast.serial_number,
                    assetName=ast.asset_name,
                    category=ast.category,
                    condition=ast.condition,
                    status=ast.status
                )
            except Asset.DoesNotExist:
                pass
            dtos.append(AssetAllocationDto(
                id=a.id,
                assetId=a.asset_id,
                employeeId=a.employee_id,
                allocatedOn=a.allocated_on.isoformat(),
                returnedOn=a.returned_on.isoformat() if a.returned_on else None,
                returnReason=a.return_reason,
                conditionOnReturn=a.condition_on_return,
                asset=asset_obj
            ))
        return dtos

    @strawberry.field
    def getAllAssets(self, category: Optional[str] = None, status: Optional[str] = None) -> List[AssetDto]:
        queryset = Asset.objects.all()
        if category:
            queryset = queryset.filter(category=category)
        if status:
            queryset = queryset.filter(status=status)
        return [AssetDto(
            id=a.id,
            serialNumber=a.serial_number,
            assetName=a.asset_name,
            category=a.category,
            condition=a.condition,
            status=a.status
        ) for a in queryset]

    @strawberry.field
    def getAllAllocations(self) -> List[AssetAllocationDto]:
        allocations = AssetAllocation.objects.all().order_by('-allocated_on')
        dtos = []
        for a in allocations:
            asset_obj = None
            try:
                ast = Asset.objects.get(id=a.asset_id)
                asset_obj = AssetDto(
                    id=ast.id,
                    serialNumber=ast.serial_number,
                    assetName=ast.asset_name,
                    category=ast.category,
                    condition=ast.condition,
                    status=ast.status
                )
            except Asset.DoesNotExist:
                pass
            dtos.append(AssetAllocationDto(
                id=a.id,
                assetId=a.asset_id,
                employeeId=a.employee_id,
                allocatedOn=a.allocated_on.isoformat(),
                returnedOn=a.returned_on.isoformat() if a.returned_on else None,
                returnReason=a.return_reason,
                conditionOnReturn=a.condition_on_return,
                asset=asset_obj
            ))
        return dtos

    @strawberry.field
    def getMyServiceRequests(self, info: Info) -> List[ServiceRequestDto]:
        original_user_id = info.context.request.headers.get("Authorization", "").replace("Bearer ", "").replace("demo-token-", "")
        if not original_user_id:
            return []
        requests = ServiceRequest.objects.filter(employee_id=original_user_id).order_by('-created_at')
        return [ServiceRequestDto(
            id=sr.id,
            employeeId=sr.employee_id,
            title=sr.title,
            description=sr.description,
            category=sr.category,
            priority=sr.priority,
            status=sr.status,
            assignedToId=sr.assigned_to_id,
            assignedToName=sr.assigned_to_name,
            resolutionComments=sr.resolution_comments,
            createdAt=sr.created_at.isoformat(),
            updatedAt=sr.updated_at.isoformat()
        ) for sr in requests]

    @strawberry.field
    def getAllServiceRequests(self, category: Optional[str] = None, status: Optional[str] = None, priority: Optional[str] = None) -> List[ServiceRequestDto]:
        queryset = ServiceRequest.objects.all().order_by('-created_at')
        if category:
            queryset = queryset.filter(category=category)
        if status:
            queryset = queryset.filter(status=status)
        if priority:
            queryset = queryset.filter(priority=priority)
        return [ServiceRequestDto(
            id=sr.id,
            employeeId=sr.employee_id,
            title=sr.title,
            description=sr.description,
            category=sr.category,
            priority=sr.priority,
            status=sr.status,
            assignedToId=sr.assigned_to_id,
            assignedToName=sr.assigned_to_name,
            resolutionComments=sr.resolution_comments,
            createdAt=sr.created_at.isoformat(),
            updatedAt=sr.updated_at.isoformat()
        ) for sr in queryset]

    @strawberry.field
    def getServiceRequestDetails(self, requestId: str) -> Optional[ServiceRequestDto]:
        try:
            sr = ServiceRequest.objects.get(id=requestId)
            return ServiceRequestDto(
                id=sr.id,
                employeeId=sr.employee_id,
                title=sr.title,
                description=sr.description,
                category=sr.category,
                priority=sr.priority,
                status=sr.status,
                assignedToId=sr.assigned_to_id,
                assignedToName=sr.assigned_to_name,
                resolutionComments=sr.resolution_comments,
                createdAt=sr.created_at.isoformat(),
                updatedAt=sr.updated_at.isoformat()
            )
        except ServiceRequest.DoesNotExist:
            return None

    @strawberry.field
    def getMyDocuments(self, employeeId: str) -> List[DocumentDto]:
        docs = Document.objects.filter(employee_id=employeeId).order_by('-created_on')
        try:
            employee = Employee.objects.get(id=employeeId)
            emp_name = employee.name
        except Employee.DoesNotExist:
            emp_name = "Unknown"
        return [DocumentDto(
            id=d.id,
            employeeId=d.employee_id,
            employeeName=emp_name,
            category=d.category,
            name=d.name,
            url=d.url,
            expiryDate=d.expiry_date.isoformat() if d.expiry_date else None,
            status=d.status,
            rejectionReason=d.rejection_reason,
            createdAt=d.created_on.isoformat() if d.created_on else "",
            updatedAt=d.modified_on.isoformat() if d.modified_on else ""
        ) for d in docs]

    @strawberry.field
    def getRecognitionFeed(self) -> List[RecognitionNominationDto]:
        nominations = RecognitionNomination.objects.all().order_by('-created_on')
        dtos = []
        for n in nominations:
            try:
                nominee = Employee.objects.get(id=n.nominee_id)
                nominee_name = nominee.name
            except Employee.DoesNotExist:
                nominee_name = "Unknown"
            
            try:
                nominator = Employee.objects.get(id=n.nominator_id)
                nominator_name = nominator.name
            except Employee.DoesNotExist:
                nominator_name = "Unknown"

            approved_by_name = None
            if n.approved_by:
                try:
                    approved_by_name = Employee.objects.get(id=n.approved_by).name
                except Employee.DoesNotExist:
                    pass

            dtos.append(RecognitionNominationDto(
                id=n.id,
                nominatorId=n.nominator_id,
                nominatorName=nominator_name,
                nomineeId=n.nominee_id,
                nomineeName=nominee_name,
                coreValue=n.core_value,
                reason=n.reason,
                points=n.points,
                status=n.status,
                approvedBy=n.approved_by,
                approvedByName=approved_by_name,
                approvedOn=n.approved_on.isoformat() if n.approved_on else None,
                createdAt=n.created_on.isoformat() if n.created_on else ""
            ))
        return dtos

    @strawberry.field
    def getMyRecognitionPoints(self, employeeId: str) -> int:
        nominations = RecognitionNomination.objects.filter(nominee_id=employeeId, status="Approved")
        return sum(n.points for n in nominations)

    @strawberry.field
    def getTeamDirectory(self, search: Optional[str] = None, statusFilter: Optional[str] = None) -> List[TeamDirectoryDto]:
        queryset = Employee.objects.all()
        if search:
            queryset = queryset.filter(name__icontains=search) | queryset.filter(email__icontains=search)
        if statusFilter:
            queryset = queryset.filter(status=statusFilter)
        
        # Build manager name lookup map
        all_emps = Employee.objects.all()
        emp_map = {e.id: e.name for e in all_emps}
        
        dtos = []
        for emp in queryset:
            dtos.append(TeamDirectoryDto(
                id=emp.id,
                fullName=emp.name,
                email=emp.email,
                position=emp.designation or "Employee",
                department=emp.department or "General",
                managerId=emp.manager_id,
                managerName=emp_map.get(emp.manager_id) if emp.manager_id else None,
                status=emp.status,
                profilePictureUrl=emp.profile_picture
            ))
        return dtos

    @strawberry.field
    def getOrgChart(self, rootEmployeeId: str) -> Optional[OrgNodeDto]:
        try:
            root = Employee.objects.get(id=rootEmployeeId)
            
            def build_node(emp):
                reports = Employee.objects.filter(manager_id=emp.id)
                direct_reports = [build_node(r) for r in reports]
                return OrgNodeDto(
                    employeeId=emp.id,
                    employeeName=emp.name,
                    position=emp.designation or "Employee",
                    department=emp.department,
                    managerId=emp.manager_id,
                    directReports=direct_reports
                )
            
            return build_node(root)
        except Employee.DoesNotExist:
            return None

    @strawberry.field
    def getHRMetrics(self) -> HRAnalyticsSummaryDto:
        # Fetch seeded HRAnalytics metrics or compute aggregates
        # We fetch from database and structure default representations
        active_count = Employee.objects.filter(status="Active").count()
        total_courses = TrainingModule.objects.count()
        completed_courses = TrainingModule.objects.filter(status="Completed").count()
        completion_pct = (decimal.Decimal(completed_courses) / decimal.Decimal(total_courses) * 100) if total_courses > 0 else decimal.Decimal(0)

        # Average leave per employee
        leave_taken = LeaveRequest.objects.filter(status="Approved")
        average_leave = decimal.Decimal(0.0)
        if active_count > 0:
            average_leave = decimal.Decimal(sum(l.total_days for l in leave_taken)) / decimal.Decimal(active_count)

        return HRAnalyticsSummaryDto(
            attrition=AttritionMetricsDto(
                riskPercentage=decimal.Decimal(12.5),
                trendDirection="stable",
                highRiskEmployees=2
            ),
            diversity=DiversityMetricsDto(
                byDepartment=[
                    DepartmentDiversityDto(department="Engineering", score=decimal.Decimal(45.0)),
                    DepartmentDiversityDto(department="Human Resources", score=decimal.Decimal(70.0))
                ],
                overallDiversityScore=decimal.Decimal(52.5)
            ),
            training=TrainingMetricsDto(
                completionPercentage=completion_pct,
                totalCourses=total_courses,
                completedCourses=completed_courses
            ),
            leave=LeaveMetricsDto(
                patternsByMonth=["Jan: 5", "Feb: 3", "Mar: 8"],
                averageLeavePerEmployee=average_leave
            )
        )

    @strawberry.field
    def getAllTodos(self, request: GetAllTodosRequest) -> BaseResponsePaginationTodos:
        # C# MediatR handler for Todo features
        queryset = Todo.objects.all()
        if request.requestParam:
            params = request.requestParam
            if params.todoId:
                queryset = queryset.filter(id=params.todoId)
            if params.userId:
                queryset = queryset.filter(user_id=params.userId)
            if params.isCompleted is not None:
                queryset = queryset.filter(is_completed=params.isCompleted)
        
        total_count = queryset.count()
        # Pagination
        start = (request.pageIndex - 1) * request.pageSize
        end = start + request.pageSize
        todos = queryset.order_by('due_date')[start:end]

        todos_dtos = [TodoDto(
            id=t.id,
            title=t.title,
            description=t.description,
            dueDate=t.due_date.isoformat() if t.due_date else None,
            isCompleted=t.is_completed,
            userId=t.user_id
        ) for t in todos]

        return BaseResponsePaginationTodos(
            success=True,
            message="Todos retrieved successfully",
            data=todos_dtos,
            totalCount=total_count
        )


# Mutations
@strawberry.type
class Mutation:
    @strawberry.mutation
    def switchDemoRole(self, userId: str, newRole: EmployeeRole) -> Optional[UserProfile]:
        try:
            employee = Employee.objects.get(id=userId)
            if not employee.is_demo:
                return None
            employee.role = newRole.value
            employee.save()
            return UserProfile(
                id=employee.id,
                name=employee.name,
                email=employee.email,
                designation=employee.designation,
                department=employee.department,
                role=employee.role,
                country=employee.country,
                isDemo=employee.is_demo
            )
        except Employee.DoesNotExist:
            return None

    @strawberry.mutation
    def clockIn(self, employeeId: str) -> Optional[AttendanceDto]:
        # Atomic transactions for clocks
        with transaction.atomic():
            today = datetime.date.today()
            record, created = AttendanceRecord.objects.get_or_create(
                employee_id=employeeId,
                date=today,
                defaults={
                    "clock_in": datetime.datetime.now(datetime.timezone.utc),
                    "status": "Present"
                }
            )
            if not created and not record.clock_in:
                record.clock_in = datetime.datetime.now(datetime.timezone.utc)
                record.status = "Present"
                record.save()
            
            try:
                employee = Employee.objects.get(id=employeeId)
                emp_name = employee.name
            except Employee.DoesNotExist:
                emp_name = "Unknown"

            return AttendanceDto(
                id=record.id,
                employeeId=record.employee_id,
                employeeName=emp_name,
                date=record.date.strftime("%Y-%m-%d"),
                clockIn=record.clock_in.isoformat() if record.clock_in else None,
                clockOut=record.clock_out.isoformat() if record.clock_out else None,
                productiveHours=record.productive_hours,
                breakHours=record.break_hours,
                overtimeHours=record.overtime_hours,
                status=record.status
            )

    @strawberry.mutation
    def clockOut(self, employeeId: str) -> Optional[AttendanceDto]:
        with transaction.atomic():
            today = datetime.date.today()
            try:
                record = AttendanceRecord.objects.get(employee_id=employeeId, date=today)
                if not record.clock_out:
                    record.clock_out = datetime.datetime.now(datetime.timezone.utc)
                    # Compute productive hours
                    if record.clock_in:
                        delta = record.clock_out - record.clock_in
                        hours = decimal.Decimal(delta.total_seconds() / 3600.0)
                        record.productive_hours = round(hours, 2)
                    record.save()

                try:
                    employee = Employee.objects.get(id=employeeId)
                    emp_name = employee.name
                except Employee.DoesNotExist:
                    emp_name = "Unknown"

                return AttendanceDto(
                    id=record.id,
                    employeeId=record.employee_id,
                    employeeName=emp_name,
                    date=record.date.strftime("%Y-%m-%d"),
                    clockIn=record.clock_in.isoformat() if record.clock_in else None,
                    clockOut=record.clock_out.isoformat() if record.clock_out else None,
                    productiveHours=record.productive_hours,
                    breakHours=record.break_hours,
                    overtimeHours=record.overtime_hours,
                    status=record.status
                )
            except AttendanceRecord.DoesNotExist:
                return None

    @strawberry.mutation
    def submitLeaveRequest(self, request: SubmitLeaveRequestInput) -> Optional[LeaveRequestDto]:
        with transaction.atomic():
            # Check leave balances first
            try:
                balance = LeaveBalance.objects.get(employee_id=request.employeeId, leave_type=request.leaveType)
                if balance.available < request.totalDays:
                    raise Exception("Insufficient leave balance")
                
                # Create request
                lr = LeaveRequest.objects.create(
                    employee_id=request.employeeId,
                    leave_type=request.leaveType,
                    start_date=datetime.datetime.fromisoformat(request.startDate.replace("Z", "+00:00")),
                    end_date=datetime.datetime.fromisoformat(request.endDate.replace("Z", "+00:00")),
                    total_days=request.totalDays,
                    reason=request.reason,
                    status="Pending"
                )
                
                # Update pending balance
                balance.pending += request.totalDays
                balance.available -= request.totalDays
                balance.save()
                
                try:
                    employee = Employee.objects.get(id=request.employeeId)
                    emp_name = employee.name
                except Employee.DoesNotExist:
                    emp_name = "Unknown"

                return LeaveRequestDto(
                    id=lr.id,
                    employeeId=lr.employee_id,
                    employeeName=emp_name,
                    leaveType=lr.leave_type,
                    startDate=lr.start_date.isoformat(),
                    endDate=lr.end_date.isoformat(),
                    totalDays=lr.total_days,
                    reason=lr.reason,
                    status=lr.status,
                    approvalComments=lr.approval_comments,
                    approvedBy=lr.approved_by,
                    approvedByName=None,
                    approvedOn=None,
                    createdAt=lr.created_on.isoformat() if lr.created_on else ""
                )
            except LeaveBalance.DoesNotExist:
                return None

    @strawberry.mutation
    def approveLeaveRequest(self, request: ApproveLeaveRequestInput) -> Optional[LeaveRequestDto]:
        with transaction.atomic():
            try:
                lr = LeaveRequest.objects.get(id=request.requestId)
                if lr.status != "Pending":
                    return None
                
                lr.status = "Approved"
                lr.approved_by = request.approverId
                lr.approved_on = datetime.datetime.now(datetime.timezone.utc)
                lr.approval_comments = request.comments
                lr.save()
                
                # Update employee leave balances
                balance = LeaveBalance.objects.get(employee_id=lr.employee_id, leave_type=lr.leave_type)
                balance.pending -= lr.total_days
                balance.used += lr.total_days
                balance.save()

                try:
                    employee = Employee.objects.get(id=lr.employee_id)
                    emp_name = employee.name
                except Employee.DoesNotExist:
                    emp_name = "Unknown"

                try:
                    approver = Employee.objects.get(id=request.approverId)
                    app_name = approver.name
                except Employee.DoesNotExist:
                    app_name = "Unknown"

                return LeaveRequestDto(
                    id=lr.id,
                    employeeId=lr.employee_id,
                    employeeName=emp_name,
                    leaveType=lr.leave_type,
                    startDate=lr.start_date.isoformat(),
                    endDate=lr.end_date.isoformat(),
                    totalDays=lr.total_days,
                    reason=lr.reason,
                    status=lr.status,
                    approvalComments=lr.approval_comments,
                    approvedBy=lr.approved_by,
                    approvedByName=app_name,
                    approvedOn=lr.approved_on.isoformat() if lr.approved_on else None,
                    createdAt=lr.created_on.isoformat() if lr.created_on else ""
                )
            except (LeaveRequest.DoesNotExist, LeaveBalance.DoesNotExist):
                return None

    @strawberry.mutation
    def rejectLeaveRequest(self, request: RejectLeaveRequestInput) -> Optional[LeaveRequestDto]:
        with transaction.atomic():
            try:
                lr = LeaveRequest.objects.get(id=request.requestId)
                if lr.status != "Pending":
                    return None
                
                lr.status = "Rejected"
                lr.approved_by = request.approverId
                lr.approved_on = datetime.datetime.now(datetime.timezone.utc)
                lr.approval_comments = request.comments
                lr.save()
                
                # Return leave balance available
                balance = LeaveBalance.objects.get(employee_id=lr.employee_id, leave_type=lr.leave_type)
                balance.pending -= lr.total_days
                balance.available += lr.total_days
                balance.save()

                try:
                    employee = Employee.objects.get(id=lr.employee_id)
                    emp_name = employee.name
                except Employee.DoesNotExist:
                    emp_name = "Unknown"

                try:
                    approver = Employee.objects.get(id=request.approverId)
                    app_name = approver.name
                except Employee.DoesNotExist:
                    app_name = "Unknown"

                return LeaveRequestDto(
                    id=lr.id,
                    employeeId=lr.employee_id,
                    employeeName=emp_name,
                    leaveType=lr.leave_type,
                    startDate=lr.start_date.isoformat(),
                    endDate=lr.end_date.isoformat(),
                    totalDays=lr.total_days,
                    reason=lr.reason,
                    status=lr.status,
                    approvalComments=lr.approval_comments,
                    approvedBy=lr.approved_by,
                    approvedByName=app_name,
                    approvedOn=lr.approved_on.isoformat() if lr.approved_on else None,
                    createdAt=lr.created_on.isoformat() if lr.created_on else ""
                )
            except (LeaveRequest.DoesNotExist, LeaveBalance.DoesNotExist):
                return None

    @strawberry.mutation
    def cancelLeaveRequest(self, requestId: str, employeeId: str) -> Optional[LeaveRequestDto]:
        with transaction.atomic():
            try:
                lr = LeaveRequest.objects.get(id=requestId, employee_id=employeeId)
                if lr.status not in ["Pending", "Approved"]:
                    return None
                
                old_status = lr.status
                lr.status = "Cancelled"
                lr.save()
                
                balance = LeaveBalance.objects.get(employee_id=lr.employee_id, leave_type=lr.leave_type)
                if old_status == "Pending":
                    balance.pending -= lr.total_days
                    balance.available += lr.total_days
                elif old_status == "Approved":
                    balance.used -= lr.total_days
                    balance.available += lr.total_days
                balance.save()

                try:
                    employee = Employee.objects.get(id=lr.employee_id)
                    emp_name = employee.name
                except Employee.DoesNotExist:
                    emp_name = "Unknown"

                return LeaveRequestDto(
                    id=lr.id,
                    employeeId=lr.employee_id,
                    employeeName=emp_name,
                    leaveType=lr.leave_type,
                    startDate=lr.start_date.isoformat(),
                    endDate=lr.end_date.isoformat(),
                    totalDays=lr.total_days,
                    reason=lr.reason,
                    status=lr.status,
                    approvalComments=lr.approval_comments,
                    approvedBy=lr.approved_by,
                    approvedByName=None,
                    approvedOn=lr.approved_on.isoformat() if lr.approved_on else None,
                    createdAt=lr.created_on.isoformat() if lr.created_on else ""
                )
            except (LeaveRequest.DoesNotExist, LeaveBalance.DoesNotExist):
                return None

    @strawberry.mutation
    def askHrCopilot(self, query: str, employeeId: str) -> CopilotResponseDto:
        # Leverage simulated responses
        # Simple policy lookup simulator
        lower_query = query.lower()
        if "leave" in lower_query or "lwp" in lower_query:
            response = "Leave Without Pay (LWP) policy: Employees can request unpaid leave after exhausting their paid leave balance. LWP requires manager approval and affects salary calculations. You can apply for LWP through the Leave Management module."
            suggested = ["How many leaves do I have remaining?", "What is the sick leave policy?", "How do I apply for leave?"]
        elif "benefit" in lower_query or "insurance" in lower_query:
            response = "Our benefits package includes: Health Insurance (family coverage), Life Insurance, Retirement Plans (401k matching), Paid Time Off, and Professional Development allowances. You can view your specific benefits in the Employee Portal."
            suggested = ["How do I enroll in health insurance?", "What is the 401k matching policy?", "When can I use my professional development budget?"]
        elif "goal" in lower_query or "performance" in lower_query:
            response = "Performance goals are set quarterly and reviewed during performance review cycles. You can track your goals in the Performance Management module. Goals should be SMART (Specific, Measurable, Achievable, Relevant, Time-bound)."
            suggested = ["How do I set my quarterly goals?", "When is the next performance review?", "How are goals weighted?"]
        elif "expense" in lower_query or "reimbursement" in lower_query:
            response = "Expense reimbursements are processed within 7-10 business days after approval. Eligible expenses include travel, meals (with receipts), and approved business purchases. Submit expenses through the Expense Management module."
            suggested = ["What expenses are reimbursable?", "How do I submit an expense claim?", "What is the meal allowance policy?"]
        else:
            response = "I'm here to help with HR-related questions! You can ask me about leave policies, benefits, performance goals, expense reimbursements, and more. Try asking a specific question about any HR topic."
            suggested = ["What is the LWP policy?", "How many leaves do I have?", "What benefits are available?", "How do I submit expenses?"]
        
        # Save to DB
        CopilotInteraction.objects.create(
            employee_id=employeeId,
            query=query,
            response=response,
            interaction_time=datetime.datetime.now(datetime.timezone.utc),
            was_helpful=True
        )

        return CopilotResponseDto(
            query=query,
            response=response,
            suggestedQuestions=suggested,
            timestamp=datetime.datetime.now(datetime.timezone.utc).isoformat()
        )

    @strawberry.mutation
    def uploadDocument(self, employeeId: str, category: DocumentCategory, name: str, url: str, expiryDate: Optional[str] = None) -> Optional[DocumentDto]:
        expiry = datetime.datetime.fromisoformat(expiryDate.replace("Z", "+00:00")) if expiryDate else None
        doc = Document.objects.create(
            employee_id=employeeId,
            category=category.value,
            name=name,
            url=url,
            expiry_date=expiry,
            status="Pending"
        )
        try:
            employee = Employee.objects.get(id=employeeId)
            emp_name = employee.name
        except Employee.DoesNotExist:
            emp_name = "Unknown"
        return DocumentDto(
            id=doc.id,
            employeeId=doc.employee_id,
            employeeName=emp_name,
            category=doc.category,
            name=doc.name,
            url=doc.url,
            expiryDate=doc.expiry_date.isoformat() if doc.expiry_date else None,
            status=doc.status,
            rejectionReason=doc.rejection_reason,
            createdAt=doc.created_on.isoformat() if doc.created_on else "",
            updatedAt=doc.modified_on.isoformat() if doc.modified_on else ""
        )

    @strawberry.mutation
    def verifyDocument(self, documentId: str) -> Optional[DocumentDto]:
        try:
            d = Document.objects.get(id=documentId)
            d.status = "Approved"
            d.save()
            try:
                employee = Employee.objects.get(id=d.employee_id)
                emp_name = employee.name
            except Employee.DoesNotExist:
                emp_name = "Unknown"
            return DocumentDto(
                id=d.id,
                employeeId=d.employee_id,
                employeeName=emp_name,
                category=d.category,
                name=d.name,
                url=d.url,
                expiryDate=d.expiry_date.isoformat() if d.expiry_date else None,
                status=d.status,
                rejectionReason=d.rejection_reason,
                createdAt=d.created_on.isoformat() if d.created_on else "",
                updatedAt=d.modified_on.isoformat() if d.modified_on else ""
            )
        except Document.DoesNotExist:
            return None

    @strawberry.mutation
    def rejectDocument(self, documentId: str, reason: str) -> Optional[DocumentDto]:
        try:
            d = Document.objects.get(id=documentId)
            d.status = "Rejected"
            d.rejection_reason = reason
            d.save()
            try:
                employee = Employee.objects.get(id=d.employee_id)
                emp_name = employee.name
            except Employee.DoesNotExist:
                emp_name = "Unknown"
            return DocumentDto(
                id=d.id,
                employeeId=d.employee_id,
                employeeName=emp_name,
                category=d.category,
                name=d.name,
                url=d.url,
                expiryDate=d.expiry_date.isoformat() if d.expiry_date else None,
                status=d.status,
                rejectionReason=d.rejection_reason,
                createdAt=d.created_on.isoformat() if d.created_on else "",
                updatedAt=d.modified_on.isoformat() if d.modified_on else ""
            )
        except Document.DoesNotExist:
            return None

    @strawberry.mutation
    def submitExpense(self, employeeId: str, category: ReimbursementCategory, amount: decimal.Decimal, currency: str, date: str, comments: Optional[str] = None) -> Optional[ReimbursementDto]:
        dt = datetime.datetime.fromisoformat(date.replace("Z", "+00:00")).date()
        r = Reimbursement.objects.create(
            employee_id=employeeId,
            category=category.value,
            amount=amount,
            currency=currency,
            date=dt,
            comments=comments,
            status="Pending"
        )
        try:
            employee = Employee.objects.get(id=employeeId)
            emp_name = employee.name
        except Employee.DoesNotExist:
            emp_name = "Unknown"

        return ReimbursementDto(
            id=r.id,
            employeeId=r.employee_id,
            employeeName=emp_name,
            category=r.category,
            amount=r.amount,
            currency=r.currency,
            date=r.date.strftime("%Y-%m-%d"),
            status=r.status,
            comments=r.comments,
            approvedBy=None,
            approvedByName=None,
            approvedOn=None,
            createdAt=r.created_on.isoformat() if r.created_on else ""
        )

    @strawberry.mutation
    def approveExpense(self, expenseId: str, approverId: str, comments: Optional[str] = None) -> Optional[ReimbursementDto]:
        try:
            r = Reimbursement.objects.get(id=expenseId)
            r.status = "Approved"
            r.approved_by = approverId
            r.approved_on = datetime.datetime.now(datetime.timezone.utc)
            if comments:
                r.comments = comments
            r.save()

            try:
                employee = Employee.objects.get(id=r.employee_id)
                emp_name = employee.name
            except Employee.DoesNotExist:
                emp_name = "Unknown"

            try:
                approver = Employee.objects.get(id=approverId)
                app_name = approver.name
            except Employee.DoesNotExist:
                app_name = "Unknown"

            return ReimbursementDto(
                id=r.id,
                employeeId=r.employee_id,
                employeeName=emp_name,
                category=r.category,
                amount=r.amount,
                currency=r.currency,
                date=r.date.strftime("%Y-%m-%d"),
                status=r.status,
                comments=r.comments,
                approvedBy=r.approved_by,
                approvedByName=app_name,
                approvedOn=r.approved_on.isoformat() if r.approved_on else None,
                createdAt=r.created_on.isoformat() if r.created_on else ""
            )
        except Reimbursement.DoesNotExist:
            return None

    @strawberry.mutation
    def rejectExpense(self, expenseId: str, approverId: str, comments: Optional[str] = None) -> Optional[ReimbursementDto]:
        try:
            r = Reimbursement.objects.get(id=expenseId)
            r.status = "Rejected"
            r.approved_by = approverId
            r.approved_on = datetime.datetime.now(datetime.timezone.utc)
            if comments:
                r.comments = comments
            r.save()

            try:
                employee = Employee.objects.get(id=r.employee_id)
                emp_name = employee.name
            except Employee.DoesNotExist:
                emp_name = "Unknown"

            try:
                approver = Employee.objects.get(id=approverId)
                app_name = approver.name
            except Employee.DoesNotExist:
                app_name = "Unknown"

            return ReimbursementDto(
                id=r.id,
                employeeId=r.employee_id,
                employeeName=emp_name,
                category=r.category,
                amount=r.amount,
                currency=r.currency,
                date=r.date.strftime("%Y-%m-%d"),
                status=r.status,
                comments=r.comments,
                approvedBy=r.approved_by,
                approvedByName=app_name,
                approvedOn=r.approved_on.isoformat() if r.approved_on else None,
                createdAt=r.created_on.isoformat() if r.created_on else ""
            )
        except Reimbursement.DoesNotExist:
            return None

    @strawberry.mutation
    def submitResignation(self, reason: str, lastWorkingDate: str, info: Info) -> Optional[ResignationDto]:
        original_user_id = info.context.request.headers.get("Authorization", "").replace("Bearer ", "").replace("demo-token-", "")
        if not original_user_id:
            return None
        dt = datetime.datetime.fromisoformat(lastWorkingDate.replace("Z", "+00:00"))
        r = Resignation.objects.create(
            employee_id=original_user_id,
            last_working_date=dt,
            reason=reason,
            status="Pending"
        )
        return ResignationDto(
            id=r.id,
            employeeId=r.employee_id,
            submissionDate=r.submission_date.isoformat(),
            lastWorkingDate=r.last_working_date.isoformat(),
            reason=r.reason,
            status=r.status,
            approvedBy=r.approved_by,
            approvedOn=r.approved_on.isoformat() if r.approved_on else None
        )

    @strawberry.mutation
    def updateResignationStatus(self, resignationId: str, status: str, lastWorkingDate: Optional[str] = None) -> Optional[ResignationDto]:
        try:
            r = Resignation.objects.get(id=resignationId)
            r.status = status
            if lastWorkingDate:
                r.last_working_date = datetime.datetime.fromisoformat(lastWorkingDate.replace("Z", "+00:00"))
            r.save()
            return ResignationDto(
                id=r.id,
                employeeId=r.employee_id,
                submissionDate=r.submission_date.isoformat(),
                lastWorkingDate=r.last_working_date.isoformat(),
                reason=r.reason,
                status=r.status,
                approvedBy=r.approved_by,
                approvedOn=r.approved_on.isoformat() if r.approved_on else None
            )
        except Resignation.DoesNotExist:
            return None

    @strawberry.mutation
    def toggleClearanceStatus(self, clearanceId: str, isCleared: bool) -> Optional[ClearanceItemDto]:
        try:
            c = ClearanceItem.objects.get(id=clearanceId)
            c.status = "Cleared" if isCleared else "Pending"
            c.cleared_on = datetime.datetime.now(datetime.timezone.utc) if isCleared else None
            c.save()
            return ClearanceItemDto(
                id=c.id,
                employeeId=c.employee_id,
                department=c.department,
                itemName=c.item_name,
                status=c.status,
                clearedBy=c.cleared_by,
                clearedOn=c.cleared_on.isoformat() if c.cleared_on else None
            )
        except ClearanceItem.DoesNotExist:
            return None

    @strawberry.mutation
    def submitExitFeedback(self, feedbackJson: str, info: Info) -> Optional[ExitInterviewDto]:
        original_user_id = info.context.request.headers.get("Authorization", "").replace("Bearer ", "").replace("demo-token-", "")
        if not original_user_id:
            return None
        e = ExitInterview.objects.create(
            employee_id=original_user_id,
            feedback_json=feedbackJson
        )
        return ExitInterviewDto(
            id=e.id,
            employeeId=e.employee_id,
            feedbackJson=e.feedback_json,
            createdAt=e.created_at.isoformat()
        )

    @strawberry.mutation
    def createOnboardingChecklist(self, employeeId: str, role: str) -> List[OnboardingChecklistDto]:
        with transaction.atomic():
            # Query the OnboardingTemplate or fallback to a default list of tasks
            try:
                template = OnboardingTemplate.objects.get(role=role)
                tasks = json.loads(template.tasks_json)
            except OnboardingTemplate.DoesNotExist:
                # Default mock template tasks
                tasks = [
                    {"id": "task-1", "name": "Complete Profile Setup", "description": "Fill all details"},
                    {"id": "task-2", "name": "Upload Documents", "description": "Upload ID proofs"},
                    {"id": "task-3", "name": "Complete Security Training", "description": "Information Security course"}
                ]
            
            created_items = []
            for t in tasks:
                item = OnboardingChecklist.objects.create(
                    employee_id=employeeId,
                    task_id=t["id"],
                    task_name=t["name"],
                    description=t.get("description", ""),
                    status="Pending"
                )
                created_items.append(OnboardingChecklistDto(
                    id=item.id,
                    employeeId=item.employee_id,
                    taskId=item.task_id,
                    taskName=item.task_name,
                    description=item.description,
                    status=item.status,
                    completedAt=None,
                    createdAt=item.created_at.isoformat()
                ))
            return created_items

    @strawberry.mutation
    def toggleOnboardingTask(self, checklistId: str, isCompleted: bool) -> Optional[OnboardingChecklistDto]:
        try:
            item = OnboardingChecklist.objects.get(id=checklistId)
            item.status = "Completed" if isCompleted else "Pending"
            item.completed_at = datetime.datetime.now(datetime.timezone.utc) if isCompleted else None
            item.save()
            return OnboardingChecklistDto(
                id=item.id,
                employeeId=item.employee_id,
                taskId=item.task_id,
                taskName=item.task_name,
                description=item.description,
                status=item.status,
                completedAt=item.completed_at.isoformat() if item.completed_at else None,
                createdAt=item.created_at.isoformat()
            )
        except OnboardingChecklist.DoesNotExist:
            return None

    @strawberry.mutation
    def createAsset(self, serialNumber: str, name: str, category: str) -> AssetDto:
        a = Asset.objects.create(
            serial_number=serialNumber,
            asset_name=name,
            category=category,
            condition="New",
            status="Available"
        )
        return AssetDto(
            id=a.id,
            serialNumber=a.serial_number,
            assetName=a.asset_name,
            category=a.category,
            condition=a.condition,
            status=a.status
        )

    @strawberry.mutation
    def allocateAsset(self, assetId: str, employeeId: str) -> Optional[AssetAllocationDto]:
        with transaction.atomic():
            try:
                ast = Asset.objects.get(id=assetId)
                if ast.status != "Available":
                    return None
                
                ast.status = "Allocated"
                ast.save()

                allocation = AssetAllocation.objects.create(
                    asset_id=assetId,
                    employee_id=employeeId,
                    allocated_on=datetime.datetime.now(datetime.timezone.utc)
                )

                asset_obj = AssetDto(
                    id=ast.id,
                    serialNumber=ast.serial_number,
                    assetName=ast.asset_name,
                    category=ast.category,
                    condition=ast.condition,
                    status=ast.status
                )

                return AssetAllocationDto(
                    id=allocation.id,
                    assetId=allocation.asset_id,
                    employeeId=allocation.employee_id,
                    allocatedOn=allocation.allocated_on.isoformat(),
                    returnedOn=None,
                    returnReason=None,
                    conditionOnReturn=None,
                    asset=asset_obj
                )
            except Asset.DoesNotExist:
                return None

    @strawberry.mutation
    def requestAssetReturn(self, allocationId: str, reason: str) -> Optional[AssetAllocationDto]:
        try:
            a = AssetAllocation.objects.get(id=allocationId)
            a.return_reason = reason
            a.save()
            return AssetAllocationDto(
                id=a.id,
                assetId=a.asset_id,
                employeeId=a.employee_id,
                allocatedOn=a.allocated_on.isoformat(),
                returnedOn=None,
                returnReason=a.return_reason,
                conditionOnReturn=None,
                asset=None
            )
        except AssetAllocation.DoesNotExist:
            return None

    @strawberry.mutation
    def processAssetReturn(self, allocationId: str, conditionOnReturn: str) -> Optional[AssetAllocationDto]:
        with transaction.atomic():
            try:
                a = AssetAllocation.objects.get(id=allocationId)
                a.returned_on = datetime.datetime.now(datetime.timezone.utc)
                a.condition_on_return = conditionOnReturn
                a.save()

                # Update asset status
                ast = Asset.objects.get(id=a.asset_id)
                ast.status = "Available"
                ast.condition = conditionOnReturn
                ast.save()

                return AssetAllocationDto(
                    id=a.id,
                    assetId=a.asset_id,
                    employeeId=a.employee_id,
                    allocatedOn=a.allocated_on.isoformat(),
                    returnedOn=a.returned_on.isoformat(),
                    returnReason=a.return_reason,
                    conditionOnReturn=a.condition_on_return,
                    asset=None
                )
            except (AssetAllocation.DoesNotExist, Asset.DoesNotExist):
                return None

    @strawberry.mutation
    def createServiceRequest(self, title: str, description: str, category: str, priority: str, info: Info) -> Optional[ServiceRequestDto]:
        original_user_id = info.context.request.headers.get("Authorization", "").replace("Bearer ", "").replace("demo-token-", "")
        if not original_user_id:
            return None
        sr = ServiceRequest.objects.create(
            employee_id=original_user_id,
            title=title,
            description=description,
            category=category,
            priority=priority,
            status="Open"
        )
        return ServiceRequestDto(
            id=sr.id,
            employeeId=sr.employee_id,
            title=sr.title,
            description=sr.description,
            category=sr.category,
            priority=sr.priority,
            status=sr.status,
            assignedToId=None,
            assignedToName=None,
            resolutionComments=None,
            createdAt=sr.created_at.isoformat(),
            updatedAt=sr.updated_at.isoformat()
        )

    @strawberry.mutation
    def assignServiceRequest(self, requestId: str, assignedToId: str, assignedToName: str) -> Optional[ServiceRequestDto]:
        try:
            sr = ServiceRequest.objects.get(id=requestId)
            sr.assigned_to_id = assignedToId
            sr.assigned_to_name = assignedToName
            sr.status = "InProgress"
            sr.save()
            return ServiceRequestDto(
                id=sr.id,
                employeeId=sr.employee_id,
                title=sr.title,
                description=sr.description,
                category=sr.category,
                priority=sr.priority,
                status=sr.status,
                assignedToId=sr.assigned_to_id,
                assignedToName=sr.assigned_to_name,
                resolutionComments=sr.resolution_comments,
                createdAt=sr.created_at.isoformat(),
                updatedAt=sr.updated_at.isoformat()
            )
        except ServiceRequest.DoesNotExist:
            return None

    @strawberry.mutation
    def resolveServiceRequest(self, requestId: str, resolutionComments: str) -> Optional[ServiceRequestDto]:
        try:
            sr = ServiceRequest.objects.get(id=requestId)
            sr.resolution_comments = resolutionComments
            sr.status = "Resolved"
            sr.save()
            return ServiceRequestDto(
                id=sr.id,
                employeeId=sr.employee_id,
                title=sr.title,
                description=sr.description,
                category=sr.category,
                priority=sr.priority,
                status=sr.status,
                assignedToId=sr.assigned_to_id,
                assignedToName=sr.assigned_to_name,
                resolutionComments=sr.resolution_comments,
                createdAt=sr.created_at.isoformat(),
                updatedAt=sr.updated_at.isoformat()
            )
        except ServiceRequest.DoesNotExist:
            return None

    @strawberry.mutation
    def nominatePeer(self, nomineeId: str, coreValue: str, reason: str, points: int, nominatorId: str) -> Optional[RecognitionNominationDto]:
        n = RecognitionNomination.objects.create(
            nominator_id=nominatorId,
            nominee_id=nomineeId,
            core_value=coreValue,
            reason=reason,
            points=points,
            status="Pending"
        )
        try:
            nominee = Employee.objects.get(id=nomineeId)
            nominee_name = nominee.name
        except Employee.DoesNotExist:
            nominee_name = "Unknown"

        try:
            nominator = Employee.objects.get(id=nominatorId)
            nominator_name = nominator.name
        except Employee.DoesNotExist:
            nominator_name = "Unknown"

        return RecognitionNominationDto(
            id=n.id,
            nominatorId=n.nominator_id,
            nominatorName=nominator_name,
            nomineeId=n.nominee_id,
            nomineeName=nominee_name,
            coreValue=n.core_value,
            reason=n.reason,
            points=n.points,
            status=n.status,
            approvedBy=None,
            approvedByName=None,
            approvedOn=None,
            createdAt=n.created_on.isoformat() if n.created_on else ""
        )

    @strawberry.mutation
    def approveNomination(self, nominationId: str, approverId: str, comments: Optional[str] = None) -> Optional[RecognitionNominationDto]:
        try:
            n = RecognitionNomination.objects.get(id=nominationId)
            n.status = "Approved"
            n.approved_by = approverId
            n.approved_on = datetime.datetime.now(datetime.timezone.utc)
            n.save()

            try:
                nominee = Employee.objects.get(id=n.nominee_id)
                nominee_name = nominee.name
            except Employee.DoesNotExist:
                nominee_name = "Unknown"

            try:
                nominator = Employee.objects.get(id=n.nominator_id)
                nominator_name = nominator.name
            except Employee.DoesNotExist:
                nominator_name = "Unknown"

            try:
                approver = Employee.objects.get(id=approverId)
                app_name = approver.name
            except Employee.DoesNotExist:
                app_name = "Unknown"

            return RecognitionNominationDto(
                id=n.id,
                nominatorId=n.nominator_id,
                nominatorName=nominator_name,
                nomineeId=n.nominee_id,
                nomineeName=nominee_name,
                coreValue=n.core_value,
                reason=n.reason,
                points=n.points,
                status=n.status,
                approvedBy=n.approved_by,
                approvedByName=app_name,
                approvedOn=n.approved_on.isoformat() if n.approved_on else None,
                createdAt=n.created_on.isoformat() if n.created_on else ""
            )
        except RecognitionNomination.DoesNotExist:
            return None

    @strawberry.mutation
    def downloadPayslip(self, payslipId: str) -> DownloadPayslipResponse:
        # C# mock payslip download mapping
        return DownloadPayslipResponse(
            downloadUrl=f"https://globalhrm.me/api/payslips/download/{payslipId}",
            success=True,
            message="Payslip generated successfully"
        )

    @strawberry.mutation
    def createAnnouncement(self, title: str, category: str, content: str, priority: str, scope: str, createdBy: str, expiryDate: Optional[str] = None) -> Optional[AnnouncementDto]:
        expiry = datetime.datetime.fromisoformat(expiryDate.replace("Z", "+00:00")) if expiryDate else None
        a = Announcement.objects.create(
            title=title,
            category=category,
            content=content,
            priority=priority,
            visibility_scope=scope,
            created_by=createdBy,
            expiry_date=expiry
        )
        try:
            creator = Employee.objects.get(id=createdBy)
            creator_name = creator.name
        except Employee.DoesNotExist:
            creator_name = "Unknown"

        return AnnouncementDto(
            id=a.id,
            title=a.title,
            category=a.category,
            content=a.content,
            priority=a.priority,
            visibilityScope=a.visibility_scope,
            createdBy=a.created_by,
            createdByName=creator_name,
            expiryDate=a.expiry_date.isoformat() if a.expiry_date else None,
            createdAt=a.created_on.isoformat() if a.created_on else ""
        )

    @strawberry.mutation
    def acknowledgeAnnouncement(self, announcementId: str, employeeId: str) -> Optional[AnnouncementDto]:
        # Simple placeholder return matching C# behaviour
        try:
            a = Announcement.objects.get(id=announcementId)
            try:
                creator = Employee.objects.get(id=a.created_by)
                creator_name = creator.name
            except Employee.DoesNotExist:
                creator_name = "Unknown"
            return AnnouncementDto(
                id=a.id,
                title=a.title,
                category=a.category,
                content=a.content,
                priority=a.priority,
                visibilityScope=a.visibility_scope,
                createdBy=a.created_by,
                createdByName=creator_name,
                expiryDate=a.expiry_date.isoformat() if a.expiry_date else None,
                createdAt=a.created_on.isoformat() if a.created_on else ""
            )
        except Announcement.DoesNotExist:
            return None

    @strawberry.mutation
    def createTodo(self, request: CreateTodoRequest) -> BaseResponseTodoCreate:
        t = Todo.objects.create(
            title=request.title,
            description=request.description,
            due_date=datetime.datetime.fromisoformat(request.dueDate.replace("Z", "+00:00")) if request.dueDate else None,
            user_id=request.userId,
            is_completed=False
        )
        return BaseResponseTodoCreate(
            success=True,
            message="Todo created successfully",
            data=CreateTodoResponse(id=t.id, title=t.title)
        )

    @strawberry.mutation
    def updateTodo(self, request: UpdateTodoRequest) -> BaseResponseTodoUpdate:
        try:
            t = Todo.objects.get(id=request.todoId)
            if request.title:
                t.title = request.title
            if request.description:
                t.description = request.description
            if request.dueDate:
                t.due_date = datetime.datetime.fromisoformat(request.dueDate.replace("Z", "+00:00"))
            if request.isCompleted is not None:
                t.is_completed = request.isCompleted
            t.save()
            return BaseResponseTodoUpdate(
                success=True,
                message="Todo updated successfully",
                data=UpdateTodoResponse(id=t.id, success=True)
            )
        except Todo.DoesNotExist:
            return BaseResponseTodoUpdate(
                success=False,
                message="Todo not found",
                data=None
            )

    @strawberry.mutation
    def createEmployee(
        self,
        employeeId: str,
        name: str,
        email: str,
        position: str,
        department: str,
        role: str,
        activationCode: str,
        managerId: Optional[str] = None
    ) -> Optional[TeamDirectoryDto]:
        with transaction.atomic():
            # Check if employee with same ID or email already exists
            if Employee.objects.filter(id=employeeId).exists() or Employee.objects.filter(email__iexact=email).exists():
                raise Exception("Employee ID or Email already exists")
            
            # Map role string to enum integer
            role_mappings = {"Admin": 0, "HR": 1, "Manager": 2, "Employee": 3}
            role_val = role_mappings.get(role, 3)

            emp = Employee.objects.create(
                id=employeeId,
                name=name,
                email=email,
                designation=position,
                department=department,
                role=role_val,
                activation_code=activationCode,
                registration_status="Pending",
                activation_code_status="Unused",
                is_demo=False
            )

            # Auto-seed leave balances for the new employee
            LeaveBalance.objects.create(employee_id=employeeId, leave_type="Casual", total_allowed=15, available=15, used=0, pending=0)
            LeaveBalance.objects.create(employee_id=employeeId, leave_type="Sick", total_allowed=10, available=10, used=0, pending=0)
            LeaveBalance.objects.create(employee_id=employeeId, leave_type="Personal", total_allowed=5, available=5, used=0, pending=0)

            return TeamDirectoryDto(
                id=emp.id,
                fullName=emp.name,
                email=emp.email,
                position=emp.designation or "Employee",
                department=emp.department or "General",
                managerId=emp.manager_id,
                managerName=None,
                status=emp.status,
                profilePictureUrl=None
            )

    @strawberry.mutation
    def deleteTodo(self, request: DeleteTodoRequest) -> BaseResponseTodoDelete:
        try:
            t = Todo.objects.get(id=request.todoId)
            t.delete()
            return BaseResponseTodoDelete(
                success=True,
                message="Todo deleted successfully",
                data=DeleteTodoResponse(id=request.todoId, success=True)
            )
        except Todo.DoesNotExist:
            return BaseResponseTodoDelete(
                success=False,
                message="Todo not found",
                data=None
            )

# Create the executable schema
schema = strawberry.Schema(query=Query, mutation=Mutation)
