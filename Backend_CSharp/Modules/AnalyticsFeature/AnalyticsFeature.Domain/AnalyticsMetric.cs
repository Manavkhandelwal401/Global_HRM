using HRMS.Core.Postgres.Common;

namespace AnalyticsFeature.Domain
{
    public class AnalyticsMetric : BaseEntity
    {
        public string MetricName { get; set; } = string.Empty;
        public string MetricType { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
        public DateTime RecordedAt { get; set; }
        public string? Department { get; set; }
        public string? Category { get; set; }
    }
}

// Made with Bob
