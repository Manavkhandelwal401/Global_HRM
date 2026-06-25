using HRMS.Shared.Domain;
using HRMS.Core.Postgres.Common;
using AssetFeature.Domain.Enums;

namespace AssetFeature.Domain;

public class Asset : BaseEntity
{
    public string SerialNumber { get; set; } = string.Empty;
    public string AssetName { get; set; } = string.Empty;
    public AssetCategory Category { get; set; } = AssetCategory.Laptop;
    public AssetCondition Condition { get; set; } = AssetCondition.New;
    public AssetStatus Status { get; set; } = AssetStatus.Available;
}

// Made with Bob