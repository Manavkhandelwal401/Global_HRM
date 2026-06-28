using EmployeeFeature.Application.DTOs;
using EmployeeFeature.Application.Services;
using EmployeeFeature.Domain.Enums;
using HotChocolate;
using HotChocolate.Types;
using HRMS.Shared.Application.GraphQL;

namespace EmployeeFeature.GraphQL
{
    [ExtendObjectType(typeof(Mutation))]
    public class AuthMutation
    {
        public async Task<LoginResponse> Login(
            LoginRequest request,
            [Service] IAuthService authService)
        {
            return await authService.LoginAsync(request);
        }

        public async Task<LoginResponse> SwitchDemoRole(
            string userId,
            EmployeeRole newRole,
            [Service] IAuthService authService)
        {
            return await authService.SwitchDemoRoleAsync(userId, newRole);
        }
    }
}

// Made with Bob
