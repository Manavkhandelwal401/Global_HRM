namespace AnalyticsFeature.Domain
{
    public class HRAnalyticsSummary
    {
        public AttritionMetrics Attrition { get; set; } = new();
        public DiversityMetrics Diversity { get; set; } = new();
        public TrainingMetrics Training { get; set; } = new();
        public LeaveMetrics Leave { get; set; } = new();
    }

    public class AttritionMetrics
    {
        public decimal RiskPercentage { get; set; }
        public string TrendDirection { get; set; } = "stable"; // up, down, stable
        public int HighRiskEmployees { get; set; }
    }

    public class DiversityMetrics
    {
        public Dictionary<string, decimal> ByDepartment { get; set; } = new();
        public decimal OverallDiversityScore { get; set; }
    }

    public class TrainingMetrics
    {
        public decimal CompletionPercentage { get; set; }
        public int TotalCourses { get; set; }
        public int CompletedCourses { get; set; }
    }

    public class LeaveMetrics
    {
        public Dictionary<string, int> PatternsByMonth { get; set; } = new();
        public decimal AverageLeavePerEmployee { get; set; }
    }
}

// Made with Bob