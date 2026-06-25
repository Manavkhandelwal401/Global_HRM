using EmployeeFeature.Application.DTOs;
using EmployeeFeature.Application.Services;
using HotChocolate;
using HotChocolate.Types;
using HRMS.Shared.Application.GraphQL;

namespace EmployeeFeature.GraphQL
{
    [ExtendObjectType(typeof(Query))]
    public class AuthQuery
    {
        public async Task<UserProfile?> GetCurrentUser(
            string userId,
            [Service] IAuthService authService)
        {
            return await authService.GetCurrentUserAsync(userId);
        }
    }
}

// Made with Bob
