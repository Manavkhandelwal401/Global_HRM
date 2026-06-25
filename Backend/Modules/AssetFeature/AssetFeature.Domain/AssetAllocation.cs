using HRMS.Shared.Domain;
using HRMS.Core.Postgres.Common;
using AssetFeature.Domain.Enums;

namespace AssetFeature.Domain;

public class AssetAllocation : BaseEntity
{
    public string AssetId { get; set; } = string.Empty;
    public string EmployeeId { get; set; } = string.Empty;
    public DateTime AllocatedOn { get; set; } = DateTime.UtcNow;
    public DateTime? ReturnedOn { get; set; }
    public string? ReturnReason { get; set; }
    public AssetCondition? ConditionOnReturn { get; set; }
    
    // Navigation properties
    public Asset? Asset { get; set; }
}

// Made with Bob