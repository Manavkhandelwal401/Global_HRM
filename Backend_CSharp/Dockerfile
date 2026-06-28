# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS builder

WORKDIR /src

# Copy everything at once (simpler and avoids COPY issues)
COPY . .

# Restore and publish
RUN dotnet restore API/HRMS.API/HRMS.API.csproj

RUN dotnet publish API/HRMS.API/HRMS.API.csproj \
    -c Release \
    -o /app/publish \
    --no-restore

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime

WORKDIR /app

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/publish .

# Cloud Run uses PORT env var (default 8080)
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production
ENV SKIP_KEYVAULT=true
ENV PORT=8080

EXPOSE 8080

ENTRYPOINT ["dotnet", "HRMS.API.dll"]
