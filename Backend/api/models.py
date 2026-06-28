from django.db import models
import uuid

class StringEnumIntegerField(models.IntegerField):
    def __init__(self, enum_mappings, *args, **kwargs):
        self.str_to_int = enum_mappings
        self.int_to_str = {v: k for k, v in enum_mappings.items()}
        super().__init__(*args, **kwargs)

    def deconstruct(self):
        name, path, args, kwargs = super().deconstruct()
        kwargs['enum_mappings'] = self.str_to_int
        return name, path, args, kwargs

    def get_prep_value(self, value):
        if value is None:
            return None
        if isinstance(value, int):
            return value
        if hasattr(value, 'value'):
            value = value.value
        if isinstance(value, str):
            if value in self.str_to_int:
                return self.str_to_int[value]
            if value.isdigit():
                return int(value)
        return super().get_prep_value(value)

    def from_db_value(self, value, expression, connection):
        if value is None:
            return None
        return self.int_to_str.get(value, str(value))

    def to_python(self, value):
        if value is None:
            return None
        if isinstance(value, int):
            return self.int_to_str.get(value, str(value))
        if hasattr(value, 'value'):
            value = value.value
        if isinstance(value, str) and value.isdigit():
            return self.int_to_str.get(int(value), value)
        return value


# Base Abstract Model mimicking BaseEntity/DocumentBase in C#
class BaseEntity(models.Model):
    id = models.CharField(primary_key=True, max_length=128, default=uuid.uuid4, db_column='Id')
    document_type = models.CharField(max_length=128, db_column='DocumentType')
    created_by_user_id = models.CharField(max_length=100, null=True, blank=True, db_column='CreatedByUserId')
    created_by_user_name = models.CharField(max_length=200, null=True, blank=True, db_column='CreatedByUserName')
    created_on = models.DateTimeField(null=True, blank=True, db_column='CreatedOn')
    modified_by_user_id = models.CharField(max_length=100, null=True, blank=True, db_column='ModifiedByUserId')
    modified_by_user_name = models.CharField(max_length=200, null=True, blank=True, db_column='ModifiedByUserName')
    modified_on = models.DateTimeField(null=True, blank=True, db_column='ModifiedOn')
    profile_picture = models.CharField(max_length=500, null=True, blank=True, db_column='ProfilePicture')

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        if not self.document_type:
            self.document_type = self.__class__.__name__
        if not self.id:
            self.id = str(uuid.uuid4())
        super().save(*args, **kwargs)


class Employee(BaseEntity):
    name = models.CharField(max_length=200, db_column='Name')
    email = models.EmailField(max_length=200, unique=True, db_column='Email')
    designation = models.CharField(max_length=100, null=True, blank=True, db_column='Designation')
    department = models.CharField(max_length=100, null=True, blank=True, db_index=True, db_column='Department')
    manager_id = models.CharField(max_length=128, null=True, blank=True, db_index=True, db_column='ManagerId')
    role = StringEnumIntegerField(enum_mappings={"Admin": 0, "HR": 1, "Manager": 2, "Employee": 3}, default=3, db_index=True, db_column='Role')
    joining_date = models.DateTimeField(null=True, blank=True, db_column='JoiningDate')
    country = StringEnumIntegerField(enum_mappings={"US": 0, "IN": 1}, default=0, db_column='Country')
    status = StringEnumIntegerField(enum_mappings={"Active": 0, "Inactive": 1, "Deleted": 2}, default=0, db_index=True, db_column='Status')
    password_hash = models.CharField(max_length=500, null=True, blank=True, db_column='PasswordHash')
    activation_code = models.CharField(max_length=100, null=True, blank=True, db_column='ActivationCode')
    registration_status = models.CharField(max_length=50, default='Pending', db_column='RegistrationStatus')
    activation_code_status = models.CharField(max_length=50, default='Unused', db_column='ActivationCodeStatus')
    activation_code_expiry = models.DateTimeField(null=True, blank=True, db_column='ActivationCodeExpiry')
    registration_timestamp = models.DateTimeField(null=True, blank=True, db_column='RegistrationTimestamp')
    is_demo = models.BooleanField(default=False, db_column='IsDemo')

    class Meta:
        db_table = 'Employees'


class AttendanceRecord(BaseEntity):
    employee_id = models.CharField(max_length=128, db_index=True, db_column='EmployeeId')
    date = models.DateTimeField(db_index=True, db_column='Date')
    clock_in = models.DateTimeField(null=True, blank=True, db_column='ClockIn')
    clock_out = models.DateTimeField(null=True, blank=True, db_column='ClockOut')
    productive_hours = models.DecimalField(max_digits=5, decimal_places=2, default=0.0, db_column='ProductiveHours')
    break_hours = models.DecimalField(max_digits=5, decimal_places=2, default=0.0, db_column='BreakHours')
    overtime_hours = models.DecimalField(max_digits=5, decimal_places=2, default=0.0, db_column='OvertimeHours')
    status = StringEnumIntegerField(enum_mappings={"Present": 0, "Absent": 1, "OnLeave": 2, "Late": 3}, default=0, db_index=True, db_column='Status')

    class Meta:
        db_table = 'AttendanceRecords'
        unique_together = (('employee_id', 'date'),)


class LeaveRequest(BaseEntity):
    employee_id = models.CharField(max_length=128, db_index=True, db_column='EmployeeId')
    leave_type = StringEnumIntegerField(enum_mappings={"Casual": 0, "Sick": 1, "Personal": 2}, db_column='LeaveType')
    start_date = models.DateTimeField(db_index=True, db_column='StartDate')
    end_date = models.DateTimeField(db_column='EndDate')
    total_days = models.DecimalField(max_digits=5, decimal_places=2, db_column='TotalDays')
    reason = models.CharField(max_length=500, null=True, blank=True, db_column='Reason')
    status = StringEnumIntegerField(enum_mappings={"Pending": 0, "Approved": 1, "Rejected": 2, "Cancelled": 3}, default=0, db_index=True, db_column='Status')
    approval_comments = models.CharField(max_length=500, null=True, blank=True, db_column='ApprovalComments')
    approved_by = models.CharField(max_length=128, null=True, blank=True, db_column='ApprovedBy')
    approved_on = models.DateTimeField(null=True, blank=True, db_column='ApprovedOn')

    class Meta:
        db_table = 'LeaveRequests'


class LeaveBalance(BaseEntity):
    employee_id = models.CharField(max_length=128, db_index=True, db_column='EmployeeId')
    leave_type = StringEnumIntegerField(enum_mappings={"Casual": 0, "Sick": 1, "Personal": 2}, db_column='LeaveType')
    total_allowed = models.DecimalField(max_digits=5, decimal_places=2, db_column='TotalAllowed')
    used = models.DecimalField(max_digits=5, decimal_places=2, default=0.0, db_column='Used')
    pending = models.DecimalField(max_digits=5, decimal_places=2, default=0.0, db_column='Pending')
    available = models.DecimalField(max_digits=5, decimal_places=2, db_column='Available')

    class Meta:
        db_table = 'LeaveBalances'
        unique_together = (('employee_id', 'leave_type'),)


class TrainingModule(BaseEntity):
    title = models.CharField(max_length=200, db_column='Title')
    category = StringEnumIntegerField(enum_mappings={"Compliance": 0, "Leadership": 1, "Technical": 2}, db_column='Category')
    duration = models.IntegerField(db_column='Duration')
    mandatory = models.BooleanField(default=False, db_column='Mandatory')
    status = StringEnumIntegerField(enum_mappings={"NotStarted": 0, "InProgress": 1, "Completed": 2}, default=0, db_column='Status')
    progress_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0.0, db_column='ProgressPercentage')
    description = models.CharField(max_length=2000, null=True, blank=True, db_column='Description')

    class Meta:
        db_table = 'TrainingModules'


class Announcement(BaseEntity):
    title = models.CharField(max_length=200, db_column='Title')
    category = StringEnumIntegerField(enum_mappings={"General": 0, "Holiday": 1, "Policy": 2}, db_column='Category')
    content = models.TextField(db_column='Content')
    priority = StringEnumIntegerField(enum_mappings={"Low": 0, "Medium": 1, "High": 2}, default=1, db_column='Priority')
    visibility_scope = StringEnumIntegerField(enum_mappings={"Global": 0, "Department": 1, "Location": 2}, default=0, db_column='VisibilityScope')
    created_by = models.CharField(max_length=128, null=True, blank=True, db_column='CreatedBy')
    expiry_date = models.DateTimeField(null=True, blank=True, db_column='ExpiryDate')
    target_department = models.CharField(max_length=100, null=True, blank=True, db_column='TargetDepartment')
    target_location = models.CharField(max_length=100, null=True, blank=True, db_column='TargetLocation')

    class Meta:
        db_table = 'Announcements'


class PayrollRecord(BaseEntity):
    employee_id = models.CharField(max_length=128, db_index=True, db_column='EmployeeId')
    pay_period_start = models.DateTimeField(db_column='PayPeriodStart')
    pay_period_end = models.DateTimeField(db_column='PayPeriodEnd')
    basic_pay = models.DecimalField(max_digits=18, decimal_places=2, db_column='BasicPay')
    hra = models.DecimalField(max_digits=18, decimal_places=2, db_column='HRA')
    allowances = models.DecimalField(max_digits=18, decimal_places=2, db_column='Allowances')
    gross_pay = models.DecimalField(max_digits=18, decimal_places=2, db_column='GrossPay')
    pf = models.DecimalField(max_digits=18, decimal_places=2, db_column='PF')
    income_tax = models.DecimalField(max_digits=18, decimal_places=2, db_column='IncomeTax')
    esi = models.DecimalField(max_digits=18, decimal_places=2, db_column='ESI')
    deductions = models.DecimalField(max_digits=18, decimal_places=2, db_column='Deductions')
    net_pay = models.DecimalField(max_digits=18, decimal_places=2, db_column='NetPay')
    status = StringEnumIntegerField(enum_mappings={"Draft": 0, "Paid": 1}, default=0, db_column='Status')

    class Meta:
        db_table = 'PayrollRecords'


class Asset(BaseEntity):
    serial_number = models.CharField(max_length=100, unique=True, db_column='SerialNumber')
    asset_name = models.CharField(max_length=200, db_column='AssetName')
    category = StringEnumIntegerField(enum_mappings={"Laptop": 0, "Mobile": 1, "Accessories": 2}, default=0, db_column='Category')
    condition = StringEnumIntegerField(enum_mappings={"New": 0, "Good": 1, "Damaged": 2}, default=0, db_column='Condition')
    status = StringEnumIntegerField(enum_mappings={"Available": 0, "Allocated": 1, "Maintenance": 2}, default=0, db_column='Status')

    class Meta:
        db_table = 'Assets'


class AssetAllocation(BaseEntity):
    asset_id = models.CharField(max_length=128, db_column='AssetId')
    employee_id = models.CharField(max_length=128, db_column='EmployeeId')
    allocated_on = models.DateTimeField(db_column='AllocatedOn')
    returned_on = models.DateTimeField(null=True, blank=True, db_column='ReturnedOn')
    return_reason = models.CharField(max_length=500, null=True, blank=True, db_column='ReturnReason')
    condition_on_return = models.CharField(max_length=50, null=True, blank=True, db_column='ConditionOnReturn')

    class Meta:
        db_table = 'AssetAllocations'


class CopilotInteraction(BaseEntity):
    employee_id = models.CharField(max_length=128, db_index=True, db_column='EmployeeId')
    query = models.CharField(max_length=2000, db_column='Query')
    response = models.CharField(max_length=4000, db_column='Response')
    interaction_time = models.DateTimeField(db_index=True, db_column='InteractionTime')
    context = models.CharField(max_length=1000, null=True, blank=True, db_column='Context')
    was_helpful = models.BooleanField(default=False, db_column='WasHelpful')

    class Meta:
        db_table = 'CopilotInteractions'


class Document(BaseEntity):
    employee_id = models.CharField(max_length=128, db_index=True, db_column='EmployeeId')
    category = StringEnumIntegerField(enum_mappings={"IDProof": 0, "AddressProof": 1, "Education": 2, "Experience": 3}, db_index=True, db_column='Category')
    name = models.CharField(max_length=200, db_column='Name')
    url = models.CharField(max_length=500, null=True, blank=True, db_column='Url')
    expiry_date = models.DateTimeField(null=True, blank=True, db_column='ExpiryDate')
    status = StringEnumIntegerField(enum_mappings={"Missing": 0, "Pending": 1, "Approved": 2, "Rejected": 3}, default=0, db_index=True, db_column='Status')
    rejection_reason = models.CharField(max_length=500, null=True, blank=True, db_column='RejectionReason')

    class Meta:
        db_table = 'Documents'


class Reimbursement(BaseEntity):
    employee_id = models.CharField(max_length=128, db_index=True, db_column='EmployeeId')
    category = StringEnumIntegerField(enum_mappings={"Travel": 0, "Food": 1, "Medical": 2, "Others": 3}, db_column='Category')
    amount = models.DecimalField(max_digits=18, decimal_places=2, db_column='Amount')
    currency = models.CharField(max_length=10, default='USD', db_column='Currency')
    date = models.DateTimeField(db_index=True, db_column='Date')
    status = StringEnumIntegerField(enum_mappings={"Pending": 0, "Approved": 1, "Rejected": 2}, default=0, db_index=True, db_column='Status')
    comments = models.CharField(max_length=500, null=True, blank=True, db_column='Comments')
    approved_by = models.CharField(max_length=128, null=True, blank=True, db_column='ApprovedBy')
    approved_on = models.DateTimeField(null=True, blank=True, db_column='ApprovedOn')

    class Meta:
        db_table = 'Reimbursements'


class Resignation(BaseEntity):
    employee_id = models.CharField(max_length=128, db_index=True, db_column='EmployeeId')
    submission_date = models.DateTimeField(db_column='SubmissionDate')
    last_working_date = models.DateTimeField(db_column='LastWorkingDate')
    reason = models.CharField(max_length=2000, db_column='Reason')
    status = StringEnumIntegerField(enum_mappings={"Pending": 0, "Approved": 1, "Rejected": 2}, default=0, db_index=True, db_column='Status')
    approved_by = models.CharField(max_length=128, null=True, blank=True, db_column='ApprovedBy')
    approved_on = models.DateTimeField(null=True, blank=True, db_column='ApprovedOn')

    class Meta:
        db_table = 'Resignations'


class ClearanceItem(BaseEntity):
    employee_id = models.CharField(max_length=128, db_index=True, db_column='EmployeeId')
    department = StringEnumIntegerField(enum_mappings={"IT": 0, "HR": 1, "Finance": 2, "Admin": 3}, db_index=True, db_column='Department')
    item_name = models.CharField(max_length=500, db_column='ItemName')
    status = StringEnumIntegerField(enum_mappings={"Pending": 0, "Cleared": 1}, default=0, db_index=True, db_column='Status')
    cleared_by = models.CharField(max_length=128, null=True, blank=True, db_column='ClearedBy')
    cleared_on = models.DateTimeField(null=True, blank=True, db_column='ClearedOn')

    class Meta:
        db_table = 'ClearanceItems'


class ExitInterview(BaseEntity):
    employee_id = models.CharField(max_length=128, db_index=True, db_column='EmployeeId')
    feedback_json = models.TextField(db_column='FeedbackJson')
    created_at = models.DateTimeField(db_column='CreatedAt')

    class Meta:
        db_table = 'ExitInterviews'


class OnboardingChecklist(BaseEntity):
    employee_id = models.CharField(max_length=128, db_index=True, db_column='EmployeeId')
    task_id = models.CharField(max_length=100, db_column='TaskId')
    task_name = models.CharField(max_length=200, db_column='TaskName')
    description = models.CharField(max_length=1000, null=True, blank=True, db_column='Description')
    status = StringEnumIntegerField(enum_mappings={"Pending": 0, "Completed": 1}, default=0, db_index=True, db_column='Status')
    completed_at = models.DateTimeField(null=True, blank=True, db_column='CompletedAt')
    created_at = models.DateTimeField(db_column='CreatedAt')

    class Meta:
        db_table = 'OnboardingChecklists'


class OnboardingTemplate(BaseEntity):
    role = models.CharField(max_length=100, db_index=True, db_column='Role')
    tasks_json = models.TextField(db_column='TasksJson')
    created_at = models.DateTimeField(db_column='CreatedAt')

    class Meta:
        db_table = 'OnboardingTemplates'


class Goal(BaseEntity):
    employee_id = models.CharField(max_length=128, db_index=True, db_column='EmployeeId')
    title = models.CharField(max_length=200, db_column='Title')
    target_value = models.DecimalField(max_digits=18, decimal_places=2, db_column='TargetValue')
    current_value = models.DecimalField(max_digits=18, decimal_places=2, db_column='CurrentValue')
    weight = models.DecimalField(max_digits=5, decimal_places=2, db_column='Weight')
    status = StringEnumIntegerField(enum_mappings={"NotStarted": 0, "InProgress": 1, "Completed": 2}, default=0, db_index=True, db_column='Status')
    progress_percentage = models.DecimalField(max_digits=5, decimal_places=2, db_column='ProgressPercentage')
    due_date = models.DateTimeField(null=True, blank=True, db_column='DueDate')

    class Meta:
        db_table = 'Goals'


class PerformanceReview(BaseEntity):
    employee_id = models.CharField(max_length=128, db_index=True, db_column='EmployeeId')
    reviewer_id = models.CharField(max_length=128, db_index=True, db_column='ReviewerId')
    period = models.CharField(max_length=50, db_column='Period')
    rating = models.DecimalField(max_digits=3, decimal_places=2, db_column='Rating')
    strengths = models.CharField(max_length=1000, null=True, blank=True, db_column='Strengths')
    improvements = models.CharField(max_length=1000, null=True, blank=True, db_column='Improvements')
    review_date = models.DateTimeField(null=True, blank=True, db_column='ReviewDate')

    class Meta:
        db_table = 'PerformanceReviews'


class RecognitionNomination(BaseEntity):
    nominator_id = models.CharField(max_length=128, db_column='NominatorId')
    nominee_id = models.CharField(max_length=128, db_index=True, db_column='NomineeId')
    core_value = models.CharField(max_length=100, db_column='CoreValue')
    reason = models.CharField(max_length=1000, db_column='Reason')
    points = models.IntegerField(db_column='Points')
    status = StringEnumIntegerField(enum_mappings={"Pending": 0, "Approved": 1, "Rejected": 2}, default=0, db_index=True, db_column='Status')
    approved_by = models.CharField(max_length=128, null=True, blank=True, db_column='ApprovedBy')
    approved_on = models.DateTimeField(null=True, blank=True, db_index=True, db_column='ApprovedOn')

    class Meta:
        db_table = 'RecognitionNominations'


class JobPosting(BaseEntity):
    title = models.CharField(max_length=200, db_column='Title')
    department = models.CharField(max_length=100, null=True, blank=True, db_index=True, db_column='Department')
    location = models.CharField(max_length=100, null=True, blank=True, db_column='Location')
    experience_required = models.CharField(max_length=50, null=True, blank=True, db_column='ExperienceRequired')
    salary_range = models.CharField(max_length=100, null=True, blank=True, db_column='SalaryRange')
    status = StringEnumIntegerField(enum_mappings={"Open": 0, "Closed": 1}, default=0, db_index=True, db_column='Status')
    description = models.CharField(max_length=2000, null=True, blank=True, db_column='Description')
    posted_date = models.DateTimeField(null=True, blank=True, db_column='PostedDate')

    class Meta:
        db_table = 'JobPostings'


class Candidate(BaseEntity):
    name = models.CharField(max_length=200, db_column='Name')
    role_applied = models.CharField(max_length=200, null=True, blank=True, db_column='RoleApplied')
    status = StringEnumIntegerField(enum_mappings={"Applied": 0, "Screening": 1, "Interviewing": 2, "Offered": 3, "Rejected": 4}, default=0, db_index=True, db_column='Status')
    rating = models.DecimalField(max_digits=3, decimal_places=2, db_column='Rating')
    experience = models.CharField(max_length=50, null=True, blank=True, db_column='Experience')
    notice_period = models.CharField(max_length=50, null=True, blank=True, db_column='NoticePeriod')
    skills = models.CharField(max_length=500, null=True, blank=True, db_column='Skills')
    email = models.CharField(max_length=200, null=True, blank=True, db_index=True, db_column='Email')
    phone = models.CharField(max_length=20, null=True, blank=True, db_column='Phone')
    job_posting_id = models.CharField(max_length=50, null=True, blank=True, db_index=True, db_column='JobPostingId')

    class Meta:
        db_table = 'Candidates'


class ServiceRequest(BaseEntity):
    employee_id = models.CharField(max_length=128, db_index=True, db_column='EmployeeId')
    title = models.CharField(max_length=500, db_column='Title')
    description = models.CharField(max_length=5000, db_column='Description')
    category = StringEnumIntegerField(enum_mappings={"IT": 0, "HR": 1, "Finance": 2, "Facilities": 3}, default=0, db_index=True, db_column='Category')
    priority = StringEnumIntegerField(enum_mappings={"Low": 0, "Medium": 1, "High": 2}, default=1, db_index=True, db_column='Priority')
    status = StringEnumIntegerField(enum_mappings={"Open": 0, "InProgress": 1, "Resolved": 2, "Closed": 3}, default=0, db_index=True, db_column='Status')
    assigned_to_id = models.CharField(max_length=100, null=True, blank=True, db_index=True, db_column='AssignedToId')
    assigned_to_name = models.CharField(max_length=200, null=True, blank=True, db_column='AssignedToName')
    resolution_comments = models.CharField(max_length=5000, null=True, blank=True, db_column='ResolutionComments')
    created_at = models.DateTimeField(db_column='CreatedAt')
    updated_at = models.DateTimeField(db_column='UpdatedAt')

    class Meta:
        db_table = 'ServiceRequests'


class Todo(BaseEntity):
    title = models.CharField(max_length=500, null=True, blank=True, db_column='Title')
    description = models.TextField(null=True, blank=True, db_column='Description')
    due_date = models.DateTimeField(null=True, blank=True, db_column='DueDate')
    is_completed = models.BooleanField(default=False, db_index=True, db_column='IsCompleted')
    user_id = models.CharField(max_length=128, null=True, blank=True, db_index=True, db_column='UserId')

    class Meta:
        db_table = 'Todo'


class AnalyticsMetric(BaseEntity):
    metric_name = models.CharField(max_length=200, db_index=True, db_column='MetricName')
    metric_type = models.CharField(max_length=100, db_column='MetricType')
    value = models.CharField(max_length=500, db_column='Value')
    recorded_at = models.DateTimeField(db_index=True, db_column='RecordedAt')
    department = models.CharField(max_length=100, null=True, blank=True, db_index=True, db_column='Department')
    category = models.CharField(max_length=100, null=True, blank=True, db_column='Category')

    class Meta:
        db_table = 'AnalyticsMetrics'
