using EmployeeFeature.Domain.Enums;

namespace HRMS.Shared.Application.Authorization
{
    public interface IRBACService
    {
        bool CanAccessResource(EmployeeRole userRole, string resourceType, string action);
        bool CanAccessEmployeeData(EmployeeRole userRole, string requestingUserId, string targetUserId);
        bool CanApproveLeave(EmployeeRole userRole);
        bool CanApproveExpense(EmployeeRole userRole);
        bool CanManageRecruitment(EmployeeRole userRole);
        bool CanVerifyDocuments(EmployeeRole userRole);
        bool CanPostAnnouncements(EmployeeRole userRole);
        bool CanViewAnalytics(EmployeeRole userRole);
    }

    public class RBACService : IRBACService
    {
        // RBAC Capability Matrix
        private readonly Dictionary<EmployeeRole, HashSet<string>> _rolePermissions = new()
        {
            {
                EmployeeRole.Admin,
                new HashSet<string>
                {
                    "employee:read", "employee:write", "employee:delete",
                    "attendance:read", "attendance:write",
                    "leave:read", "leave:write", "leave:approve",
                    "payroll:read", "payroll:write",
                    "document:read", "document:write", "document:verify",
                    "expense:read", "expense:write", "expense:approve",
                    "performance:read", "performance:write",
                    "training:read", "training:write",
                    "recruitment:read", "recruitment:write",
                    "announcement:read", "announcement:write",
                    "analytics:read",
                    "copilot:use"
                }
            },
            {
                EmployeeRole.HR,
                new HashSet<string>
                {
                    "employee:read", "employee:write",
                    "attendance:read",
                    "leave:read", "leave:approve",
                    "payroll:read",
                    "document:read", "document:verify",
                    "expense:read",
                    "performance:read",
                    "training:read", "training:write",
                    "recruitment:read", "recruitment:write",
                    "announcement:read", "announcement:write",
                    "analytics:read",
                    "copilot:use"
                }
            },
            {
                EmployeeRole.Manager,
                new HashSet<string>
                {
                    "employee:read",
                    "attendance:read",
                    "leave:read", "leave:approve",
                    "expense:read", "expense:approve",
                    "performance:read", "performance:write",
                    "training:read",
                    "announcement:read",
                    "analytics:read",
                    "copilot:use"
                }
            },
            {
                EmployeeRole.Employee,
                new HashSet<string>
                {
                    "attendance:read:own",
                    "leave:read:own", "leave:write:own",
                    "document:read:own", "document:write:own",
                    "expense:read:own", "expense:write:own",
                    "performance:read:own",
                    "training:read",
                    "announcement:read",
                    "copilot:use"
                }
            }
        };

        public bool CanAccessResource(EmployeeRole userRole, string resourceType, string action)
        {
            var permission = $"{resourceType}:{action}";
            
            if (_rolePermissions.TryGetValue(userRole, out var permissions))
            {
                return permissions.Contains(permission) || permissions.Contains($"{resourceType}:{action}:own");
            }

            return false;
        }

        public bool CanAccessEmployeeData(EmployeeRole userRole, string requestingUserId, string targetUserId)
        {
            // Admin and HR can access all employee data
            if (userRole == EmployeeRole.Admin || userRole == EmployeeRole.HR)
            {
                return true;
            }

            // Managers can access their team members' data (simplified - in real app, check team membership)
            if (userRole == EmployeeRole.Manager)
            {
                return true; // In production, verify team membership
            }

            // Employees can only access their own data
            return requestingUserId == targetUserId;
        }

        public bool CanApproveLeave(EmployeeRole userRole)
        {
            return userRole == EmployeeRole.Admin || 
                   userRole == EmployeeRole.HR || 
                   userRole == EmployeeRole.Manager;
        }

        public bool CanApproveExpense(EmployeeRole userRole)
        {
            return userRole == EmployeeRole.Admin || 
                   userRole == EmployeeRole.Manager;
        }

        public bool CanManageRecruitment(EmployeeRole userRole)
        {
            return userRole == EmployeeRole.Admin || 
                   userRole == EmployeeRole.HR;
        }

        public bool CanVerifyDocuments(EmployeeRole userRole)
        {
            return userRole == EmployeeRole.Admin || 
                   userRole == EmployeeRole.HR;
        }

        public bool CanPostAnnouncements(EmployeeRole userRole)
        {
            return userRole == EmployeeRole.Admin || 
                   userRole == EmployeeRole.HR;
        }

        public bool CanViewAnalytics(EmployeeRole userRole)
        {
            return userRole == EmployeeRole.Admin || 
                   userRole == EmployeeRole.HR || 
                   userRole == EmployeeRole.Manager;
        }
    }
}

// Made with Bob
