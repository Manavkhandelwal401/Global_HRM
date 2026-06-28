using EmployeeFeature.Domain;
using EmployeeFeature.Domain.Enums;
using AttendanceFeature.Domain;
using AttendanceFeature.Domain.Enums;
using LeaveFeature.Domain;
using LeaveFeature.Domain.Enums;
using TrainingFeature.Domain;
using TrainingFeature.Domain.Enums;
using AnnouncementFeature.Domain;
using AnnouncementFeature.Domain.Enums;
using HRMS.Shared.Domain.Enum;
using Microsoft.EntityFrameworkCore;
using PayrollFeature.Domain;
using PayrollFeature.Domain.Enums;

namespace HRMS.Shared.Infrastructure.Data
{
    public static class HRMSSeedData
    {
        public static void SeedData(ModelBuilder modelBuilder)
        {
            // Seed Employees
            var employees = new[]
            {
                new Employee
                {
                    Id = "emp-admin-001",
                    Name = "Mayank Khandelwal",
                    Email = "mayank@workflowglobal.com",
                    Designation = "System Administrator",
                    Department = "IT",
                    Role = EmployeeRole.Admin,
                    JoiningDate = new DateTime(2020, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                    Country = Country.US,
                    Status = Status.Active,
                    PasswordHash = "v9a3tFBDqT0rQA9JwmZChOrETMYnobmNRr4RuMDEpo0=",
                    RegistrationStatus = "Registered",
                    ActivationCodeStatus = "Used",
                    ActivationCode = "REG-MAYANK-123",
                    ActivationCodeExpiry = DateTime.SpecifyKind(new DateTime(2028, 1, 1), DateTimeKind.Utc),
                    CreatedOn = DateTime.UtcNow
                },
                new Employee
                {
                    Id = "emp-hr-001",
                    Name = "Darsh Khandelwal",
                    Email = "darsh@workflowglobal.com",
                    Designation = "HR Manager",
                    Department = "Human Resources",
                    Role = EmployeeRole.HR,
                    JoiningDate = new DateTime(2020, 3, 15, 0, 0, 0, DateTimeKind.Utc),
                    Country = Country.US,
                    Status = Status.Active,
                    PasswordHash = "nZm+XUELmxSPQW8EPkOlv0hYzpirvXcJUiZuOv5txRc=",
                    RegistrationStatus = "Registered",
                    ActivationCodeStatus = "Used",
                    ActivationCode = "REG-DARSH-123",
                    ActivationCodeExpiry = DateTime.SpecifyKind(new DateTime(2028, 1, 1), DateTimeKind.Utc),
                    CreatedOn = DateTime.UtcNow
                },
                new Employee
                {
                    Id = "emp-mgr-001",
                    Name = "Parul Goyal",
                    Email = "parul@workflowglobal.com",
                    Designation = "Engineering Manager",
                    Department = "Engineering",
                    Role = EmployeeRole.Manager,
                    JoiningDate = new DateTime(2021, 6, 1, 0, 0, 0, DateTimeKind.Utc),
                    Country = Country.US,
                    Status = Status.Active,
                    PasswordHash = "YkeL0AEnYhr9Q0T6gPc29T2PClGjI10U3q9EHzkS5Ng=",
                    RegistrationStatus = "Registered",
                    ActivationCodeStatus = "Used",
                    ActivationCode = "REG-PARUL-123",
                    ActivationCodeExpiry = DateTime.SpecifyKind(new DateTime(2028, 1, 1), DateTimeKind.Utc),
                    CreatedOn = DateTime.UtcNow
                },
                new Employee
                {
                    Id = "emp-001",
                    Name = "Varshita Sharma",
                    Email = "varshita@workflowglobal.com",
                    Designation = "Senior Software Engineer",
                    Department = "Engineering",
                    ManagerId = "emp-mgr-001",
                    Role = EmployeeRole.Employee,
                    JoiningDate = new DateTime(2022, 1, 10, 0, 0, 0, DateTimeKind.Utc),
                    Country = Country.US,
                    Status = Status.Active,
                    PasswordHash = null,
                    RegistrationStatus = "Pending",
                    ActivationCodeStatus = "Unused",
                    ActivationCode = "REG-VARSHITA-987",
                    ActivationCodeExpiry = DateTime.SpecifyKind(new DateTime(2028, 1, 1), DateTimeKind.Utc),
                    CreatedOn = DateTime.UtcNow
                },
                new Employee
                {
                    Id = "emp-002",
                    Name = "Bhavishya Gupta",
                    Email = "bhavishya@workflowglobal.com",
                    Designation = "Marketing Associate",
                    Department = "Marketing",
                    ManagerId = "emp-mgr-001",
                    Role = EmployeeRole.Employee,
                    JoiningDate = new DateTime(2022, 3, 20, 0, 0, 0, DateTimeKind.Utc),
                    Country = Country.IN,
                    Status = Status.Active,
                    PasswordHash = null,
                    RegistrationStatus = "Pending",
                    ActivationCodeStatus = "Unused",
                    ActivationCode = "REG-BHAVISHYA-654",
                    ActivationCodeExpiry = DateTime.SpecifyKind(new DateTime(2028, 1, 1), DateTimeKind.Utc),
                    CreatedOn = DateTime.UtcNow
                }
            };

            modelBuilder.Entity<Employee>().HasData(employees);

            // Seed Attendance Records (last 7 days for emp-001)
            var attendanceRecords = new List<AttendanceRecord>();
            for (int i = 0; i < 7; i++)
            {
                var date = DateTime.SpecifyKind(DateTime.Today.AddDays(-i), DateTimeKind.Utc);
                attendanceRecords.Add(new AttendanceRecord
                {
                    Id = $"att-001-{i:D3}",
                    EmployeeId = "emp-001",
                    Date = date,
                    ClockIn = date.AddHours(9),
                    ClockOut = date.AddHours(18),
                    ProductiveHours = 8.0m,
                    BreakHours = 1.0m,
                    OvertimeHours = 0.0m,
                    Status = AttendanceStatus.Present,
                    CreatedOn = DateTime.UtcNow
                });
            }

            modelBuilder.Entity<AttendanceRecord>().HasData(attendanceRecords);

            // Seed Leave Balances
            var leaveBalances = new List<LeaveBalance>();
            var leaveTypes = new[] { LeaveType.Casual, LeaveType.Sick, LeaveType.Personal };
            
            foreach (var emp in employees.Where(e => e.Role == EmployeeRole.Employee))
            {
                foreach (var leaveType in leaveTypes)
                {
                    leaveBalances.Add(new LeaveBalance
                    {
                        Id = $"lb-{emp.Id}-{leaveType}",
                        EmployeeId = emp.Id,
                        LeaveType = leaveType,
                        TotalAllowed = leaveType == LeaveType.Casual ? 12 : leaveType == LeaveType.Sick ? 10 : 5,
                        Used = 2,
                        Pending = 0,
                        Available = leaveType == LeaveType.Casual ? 10 : leaveType == LeaveType.Sick ? 8 : 3,
                        CreatedOn = DateTime.UtcNow
                    });
                }
            }

            modelBuilder.Entity<LeaveBalance>().HasData(leaveBalances);

            // Seed Training Modules
            var trainingModules = new[]
            {
                new TrainingModule
                {
                    Id = "trn-001",
                    Title = "Information Security Awareness",
                    Category = TrainingCategory.Compliance,
                    Duration = 60,
                    Mandatory = true,
                    Status = TrainingStatus.NotStarted,
                    ProgressPercentage = 0,
                    Description = "Essential security training for all employees",
                    CreatedOn = DateTime.UtcNow
                },
                new TrainingModule
                {
                    Id = "trn-002",
                    Title = "Leadership Fundamentals",
                    Category = TrainingCategory.Leadership,
                    Duration = 120,
                    Mandatory = false,
                    Status = TrainingStatus.NotStarted,
                    ProgressPercentage = 0,
                    Description = "Core leadership skills for managers",
                    CreatedOn = DateTime.UtcNow
                },
                new TrainingModule
                {
                    Id = "trn-003",
                    Title = "Advanced C# Programming",
                    Category = TrainingCategory.Technical,
                    Duration = 180,
                    Mandatory = false,
                    Status = TrainingStatus.NotStarted,
                    ProgressPercentage = 0,
                    Description = "Deep dive into C# advanced features",
                    CreatedOn = DateTime.UtcNow
                }
            };

            modelBuilder.Entity<TrainingModule>().HasData(trainingModules);

            // Seed Announcements
            var announcements = new[]
            {
                new Announcement
                {
                    Id = "ann-001",
                    Title = "Welcome to WorkFlow Global HRMS",
                    Category = AnnouncementCategory.General,
                    Content = "We are excited to launch our new HRMS platform. Please explore the features and provide feedback.",
                    Priority = AnnouncementPriority.High,
                    VisibilityScope = VisibilityScope.Global,
                    CreatedBy = "emp-admin-001",
                    ExpiryDate = DateTime.UtcNow.AddMonths(1),
                    CreatedOn = DateTime.UtcNow
                },
                new Announcement
                {
                    Id = "ann-002",
                    Title = "Holiday Notice - Independence Day",
                    Category = AnnouncementCategory.Holiday,
                    Content = "Office will be closed on July 4th for Independence Day celebration.",
                    Priority = AnnouncementPriority.Medium,
                    VisibilityScope = VisibilityScope.Global,
                    CreatedBy = "emp-hr-001",
                    ExpiryDate = new DateTime(2026, 7, 5, 0, 0, 0, DateTimeKind.Utc),
                    CreatedOn = DateTime.UtcNow
                }
            };

            modelBuilder.Entity<Announcement>().HasData(announcements);

            // Seed Payroll Records
            var payrollRecords = new[]
            {
                // === MAY 2026 ===
                new PayrollRecord
                {
                    Id = "pay-001-may",
                    EmployeeId = "EMP-001",
                    PayPeriodStart = new DateTime(2026, 5, 1, 0, 0, 0, DateTimeKind.Utc),
                    PayPeriodEnd = new DateTime(2026, 5, 31, 0, 0, 0, DateTimeKind.Utc),
                    BasicPay = 50000,
                    HRA = 20000,
                    Allowances = 15000,
                    GrossPay = 85000,
                    PF = 6000,
                    IncomeTax = 8000,
                    ESI = 1000,
                    Deductions = 15000,
                    NetPay = 70000,
                    Status = PayrollStatus.Paid,
                    CreatedOn = DateTime.UtcNow
                },
                new PayrollRecord
                {
                    Id = "pay-001-may-lower",
                    EmployeeId = "emp-001",
                    PayPeriodStart = new DateTime(2026, 5, 1, 0, 0, 0, DateTimeKind.Utc),
                    PayPeriodEnd = new DateTime(2026, 5, 31, 0, 0, 0, DateTimeKind.Utc),
                    BasicPay = 50000,
                    HRA = 20000,
                    Allowances = 15000,
                    GrossPay = 85000,
                    PF = 6000,
                    IncomeTax = 8000,
                    ESI = 1000,
                    Deductions = 15000,
                    NetPay = 70000,
                    Status = PayrollStatus.Paid,
                    CreatedOn = DateTime.UtcNow
                },
                // === APRIL 2026 ===
                new PayrollRecord
                {
                    Id = "pay-001-apr",
                    EmployeeId = "EMP-001",
                    PayPeriodStart = new DateTime(2026, 4, 1, 0, 0, 0, DateTimeKind.Utc),
                    PayPeriodEnd = new DateTime(2026, 4, 30, 0, 0, 0, DateTimeKind.Utc),
                    BasicPay = 50000,
                    HRA = 20000,
                    Allowances = 15000,
                    GrossPay = 85000,
                    PF = 6000,
                    IncomeTax = 8000,
                    ESI = 1000,
                    Deductions = 15000,
                    NetPay = 70000,
                    Status = PayrollStatus.Paid,
                    CreatedOn = DateTime.UtcNow
                },
                new PayrollRecord
                {
                    Id = "pay-001-apr-lower",
                    EmployeeId = "emp-001",
                    PayPeriodStart = new DateTime(2026, 4, 1, 0, 0, 0, DateTimeKind.Utc),
                    PayPeriodEnd = new DateTime(2026, 4, 30, 0, 0, 0, DateTimeKind.Utc),
                    BasicPay = 50000,
                    HRA = 20000,
                    Allowances = 15000,
                    GrossPay = 85000,
                    PF = 6000,
                    IncomeTax = 8000,
                    ESI = 1000,
                    Deductions = 15000,
                    NetPay = 70000,
                    Status = PayrollStatus.Paid,
                    CreatedOn = DateTime.UtcNow
                },
                // === MARCH 2026 ===
                new PayrollRecord
                {
                    Id = "pay-001-mar",
                    EmployeeId = "EMP-001",
                    PayPeriodStart = new DateTime(2026, 3, 1, 0, 0, 0, DateTimeKind.Utc),
                    PayPeriodEnd = new DateTime(2026, 3, 31, 0, 0, 0, DateTimeKind.Utc),
                    BasicPay = 50000,
                    HRA = 20000,
                    Allowances = 15000,
                    GrossPay = 85000,
                    PF = 6000,
                    IncomeTax = 8000,
                    ESI = 1000,
                    Deductions = 15000,
                    NetPay = 70000,
                    Status = PayrollStatus.Paid,
                    CreatedOn = DateTime.UtcNow
                },
                new PayrollRecord
                {
                    Id = "pay-001-mar-lower",
                    EmployeeId = "emp-001",
                    PayPeriodStart = new DateTime(2026, 3, 1, 0, 0, 0, DateTimeKind.Utc),
                    PayPeriodEnd = new DateTime(2026, 3, 31, 0, 0, 0, DateTimeKind.Utc),
                    BasicPay = 50000,
                    HRA = 20000,
                    Allowances = 15000,
                    GrossPay = 85000,
                    PF = 6000,
                    IncomeTax = 8000,
                    ESI = 1000,
                    Deductions = 15000,
                    NetPay = 70000,
                    Status = PayrollStatus.Paid,
                    CreatedOn = DateTime.UtcNow
                },
                // === FEBRUARY 2026 ===
                new PayrollRecord
                {
                    Id = "pay-001-feb",
                    EmployeeId = "EMP-001",
                    PayPeriodStart = new DateTime(2026, 2, 1, 0, 0, 0, DateTimeKind.Utc),
                    PayPeriodEnd = new DateTime(2026, 2, 28, 0, 0, 0, DateTimeKind.Utc),
                    BasicPay = 50000,
                    HRA = 20000,
                    Allowances = 15000,
                    GrossPay = 85000,
                    PF = 6000,
                    IncomeTax = 8000,
                    ESI = 1000,
                    Deductions = 15000,
                    NetPay = 70000,
                    Status = PayrollStatus.Paid,
                    CreatedOn = DateTime.UtcNow
                },
                new PayrollRecord
                {
                    Id = "pay-001-feb-lower",
                    EmployeeId = "emp-001",
                    PayPeriodStart = new DateTime(2026, 2, 1, 0, 0, 0, DateTimeKind.Utc),
                    PayPeriodEnd = new DateTime(2026, 2, 28, 0, 0, 0, DateTimeKind.Utc),
                    BasicPay = 50000,
                    HRA = 20000,
                    Allowances = 15000,
                    GrossPay = 85000,
                    PF = 6000,
                    IncomeTax = 8000,
                    ESI = 1000,
                    Deductions = 15000,
                    NetPay = 70000,
                    Status = PayrollStatus.Paid,
                    CreatedOn = DateTime.UtcNow
                },
                new PayrollRecord
                {
                    Id = "pay-002",
                    EmployeeId = "EMP-002",
                    PayPeriodStart = new DateTime(2026, 5, 1, 0, 0, 0, DateTimeKind.Utc),
                    PayPeriodEnd = new DateTime(2026, 5, 31, 0, 0, 0, DateTimeKind.Utc),
                    BasicPay = 45000,
                    HRA = 18000,
                    Allowances = 12000,
                    GrossPay = 75000,
                    PF = 5400,
                    IncomeTax = 6000,
                    ESI = 1000,
                    Deductions = 12400,
                    NetPay = 62600,
                    Status = PayrollStatus.Paid,
                    CreatedOn = DateTime.UtcNow
                }
            };

            modelBuilder.Entity<PayrollRecord>().HasData(payrollRecords);
        }
    }
}

// Made with Bob
