# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS builder

WORKDIR /src

# Copy solution and restore (layer cache)
COPY HRMSBoilerPlate.slnx ./
COPY Directory.Build.props ./

# Copy all project files first for restore caching
COPY API/HRMS.API/HRMS.API.csproj API/HRMS.API/
COPY Modules/TodoFeature/TodoFeature.Application/TodoFeature.Application.csproj Modules/TodoFeature/TodoFeature.Application/
COPY Modules/TodoFeature/TodoFeature.Domain/TodoFeature.Domain.csproj Modules/TodoFeature/TodoFeature.Domain/
COPY Modules/TodoFeature/TodoFeature.GraphQL/TodoFeature.GraphQL.csproj Modules/TodoFeature/TodoFeature.GraphQL/
COPY Modules/TodoFeature/TodoFeature.Infrastructure/TodoFeature.Infrastructure.csproj Modules/TodoFeature/TodoFeature.Infrastructure/
COPY Modules/EmployeeFeature/EmployeeFeature.Application/EmployeeFeature.Application.csproj Modules/EmployeeFeature/EmployeeFeature.Application/ 2>/dev/null || true
COPY Modules/EmployeeFeature/EmployeeFeature.Domain/EmployeeFeature.Domain.csproj Modules/EmployeeFeature/EmployeeFeature.Domain/ 2>/dev/null || true
COPY Modules/EmployeeFeature/EmployeeFeature.GraphQL/EmployeeFeature.GraphQL.csproj Modules/EmployeeFeature/EmployeeFeature.GraphQL/ 2>/dev/null || true
COPY Modules/EmployeeFeature/EmployeeFeature.Infrastructure/EmployeeFeature.Infrastructure.csproj Modules/EmployeeFeature/EmployeeFeature.Infrastructure/ 2>/dev/null || true
COPY Modules/AttendanceFeature/AttendanceFeature.GraphQL/AttendanceFeature.GraphQL.csproj Modules/AttendanceFeature/AttendanceFeature.GraphQL/ 2>/dev/null || true
COPY Modules/AttendanceFeature/AttendanceFeature.Infrastructure/AttendanceFeature.Infrastructure.csproj Modules/AttendanceFeature/AttendanceFeature.Infrastructure/ 2>/dev/null || true
COPY Modules/LeaveFeature/LeaveFeature.GraphQL/LeaveFeature.GraphQL.csproj Modules/LeaveFeature/LeaveFeature.GraphQL/ 2>/dev/null || true
COPY Modules/LeaveFeature/LeaveFeature.Infrastructure/LeaveFeature.Infrastructure.csproj Modules/LeaveFeature/LeaveFeature.Infrastructure/ 2>/dev/null || true
COPY Modules/PayrollFeature/PayrollFeature.GraphQL/PayrollFeature.GraphQL.csproj Modules/PayrollFeature/PayrollFeature.GraphQL/ 2>/dev/null || true
COPY Modules/PayrollFeature/PayrollFeature.Infrastructure/PayrollFeature.Infrastructure.csproj Modules/PayrollFeature/PayrollFeature.Infrastructure/ 2>/dev/null || true
COPY Modules/DocumentFeature/DocumentFeature.GraphQL/DocumentFeature.GraphQL.csproj Modules/DocumentFeature/DocumentFeature.GraphQL/ 2>/dev/null || true
COPY Modules/DocumentFeature/DocumentFeature.Infrastructure/DocumentFeature.Infrastructure.csproj Modules/DocumentFeature/DocumentFeature.Infrastructure/ 2>/dev/null || true
COPY Modules/ExpenseFeature/ExpenseFeature.GraphQL/ExpenseFeature.GraphQL.csproj Modules/ExpenseFeature/ExpenseFeature.GraphQL/ 2>/dev/null || true
COPY Modules/ExpenseFeature/ExpenseFeature.Infrastructure/ExpenseFeature.Infrastructure.csproj Modules/ExpenseFeature/ExpenseFeature.Infrastructure/ 2>/dev/null || true
COPY Modules/PerformanceFeature/PerformanceFeature.GraphQL/PerformanceFeature.GraphQL.csproj Modules/PerformanceFeature/PerformanceFeature.GraphQL/ 2>/dev/null || true
COPY Modules/PerformanceFeature/PerformanceFeature.Infrastructure/PerformanceFeature.Infrastructure.csproj Modules/PerformanceFeature/PerformanceFeature.Infrastructure/ 2>/dev/null || true
COPY Modules/TrainingFeature/TrainingFeature.GraphQL/TrainingFeature.GraphQL.csproj Modules/TrainingFeature/TrainingFeature.GraphQL/ 2>/dev/null || true
COPY Modules/TrainingFeature/TrainingFeature.Infrastructure/TrainingFeature.Infrastructure.csproj Modules/TrainingFeature/TrainingFeature.Infrastructure/ 2>/dev/null || true
COPY Modules/RecruitmentFeature/RecruitmentFeature.GraphQL/RecruitmentFeature.GraphQL.csproj Modules/RecruitmentFeature/RecruitmentFeature.GraphQL/ 2>/dev/null || true
COPY Modules/RecruitmentFeature/RecruitmentFeature.Infrastructure/RecruitmentFeature.Infrastructure.csproj Modules/RecruitmentFeature/RecruitmentFeature.Infrastructure/ 2>/dev/null || true
COPY Modules/AnnouncementFeature/AnnouncementFeature.GraphQL/AnnouncementFeature.GraphQL.csproj Modules/AnnouncementFeature/AnnouncementFeature.GraphQL/ 2>/dev/null || true
COPY Modules/AnnouncementFeature/AnnouncementFeature.Infrastructure/AnnouncementFeature.Infrastructure.csproj Modules/AnnouncementFeature/AnnouncementFeature.Infrastructure/ 2>/dev/null || true
COPY Modules/AnalyticsFeature/AnalyticsFeature.GraphQL/AnalyticsFeature.GraphQL.csproj Modules/AnalyticsFeature/AnalyticsFeature.GraphQL/ 2>/dev/null || true
COPY Modules/AnalyticsFeature/AnalyticsFeature.Infrastructure/AnalyticsFeature.Infrastructure.csproj Modules/AnalyticsFeature/AnalyticsFeature.Infrastructure/ 2>/dev/null || true
COPY Modules/CopilotFeature/CopilotFeature.GraphQL/CopilotFeature.GraphQL.csproj Modules/CopilotFeature/CopilotFeature.GraphQL/ 2>/dev/null || true
COPY Modules/CopilotFeature/CopilotFeature.Infrastructure/CopilotFeature.Infrastructure.csproj Modules/CopilotFeature/CopilotFeature.Infrastructure/ 2>/dev/null || true
COPY Modules/OffboardingFeature/OffboardingFeature.GraphQL/OffboardingFeature.GraphQL.csproj Modules/OffboardingFeature/OffboardingFeature.GraphQL/ 2>/dev/null || true
COPY Modules/OffboardingFeature/OffboardingFeature.Infrastructure/OffboardingFeature.Infrastructure.csproj Modules/OffboardingFeature/OffboardingFeature.Infrastructure/ 2>/dev/null || true
COPY Modules/AssetFeature/AssetFeature.GraphQL/AssetFeature.GraphQL.csproj Modules/AssetFeature/AssetFeature.GraphQL/ 2>/dev/null || true
COPY Modules/AssetFeature/AssetFeature.Infrastructure/AssetFeature.Infrastructure.csproj Modules/AssetFeature/AssetFeature.Infrastructure/ 2>/dev/null || true
COPY Modules/ServiceRequestFeature/ServiceRequestFeature.GraphQL/ServiceRequestFeature.GraphQL.csproj Modules/ServiceRequestFeature/ServiceRequestFeature.GraphQL/ 2>/dev/null || true
COPY Modules/ServiceRequestFeature/ServiceRequestFeature.Infrastructure/ServiceRequestFeature.Infrastructure.csproj Modules/ServiceRequestFeature/ServiceRequestFeature.Infrastructure/ 2>/dev/null || true
COPY Modules/TeamFeature/TeamFeature.GraphQL/TeamFeature.GraphQL.csproj Modules/TeamFeature/TeamFeature.GraphQL/ 2>/dev/null || true
COPY Modules/TeamFeature/TeamFeature.Infrastructure/TeamFeature.Infrastructure.csproj Modules/TeamFeature/TeamFeature.Infrastructure/ 2>/dev/null || true
COPY Modules/RecognitionFeature/RecognitionFeature.GraphQL/RecognitionFeature.GraphQL.csproj Modules/RecognitionFeature/RecognitionFeature.GraphQL/ 2>/dev/null || true
COPY Modules/RecognitionFeature/RecognitionFeature.Infrastructure/RecognitionFeature.Infrastructure.csproj Modules/RecognitionFeature/RecognitionFeature.Infrastructure/ 2>/dev/null || true
COPY Shared/HRMS.Shared.Application/HRMS.Shared.Application.csproj Shared/HRMS.Shared.Application/
COPY Shared/HRMS.Shared.Domain/HRMS.Shared.Domain.csproj Shared/HRMS.Shared.Domain/
COPY Shared/HRMS.Shared.Infrastructure/HRMS.Shared.Infrastructure.csproj Shared/HRMS.Shared.Infrastructure/

# Restore all dependencies
RUN dotnet restore API/HRMS.API/HRMS.API.csproj

# Copy all source files
COPY . .

# Publish the API project
RUN dotnet publish API/HRMS.API/HRMS.API.csproj \
    -c Release \
    -o /app/publish \
    --no-restore

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime

WORKDIR /app

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN groupadd --system --gid 1001 dotnet && \
    useradd --system --uid 1001 --gid dotnet dotnet

COPY --from=builder --chown=dotnet:dotnet /app/publish .

USER dotnet

# Cloud Run uses PORT env var (default 8080)
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production
ENV SKIP_KEYVAULT=true
ENV PORT=8080

EXPOSE 8080

ENTRYPOINT ["dotnet", "HRMS.API.dll"]
