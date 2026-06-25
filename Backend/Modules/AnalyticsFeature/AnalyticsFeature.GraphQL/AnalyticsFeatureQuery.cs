using HotChocolate;
using HotChocolate.Types;
using HRMS.Shared.Application.GraphQL;
using AnalyticsFeature.Application.Services;
using AnalyticsFeature.Domain;

namespace AnalyticsFeature.GraphQL
{
    [ExtendObjectType(typeof(Query))]
    public class AnalyticsFeatureQuery
    {
        [GraphQLName("getHRMetrics")]
        public async Task<HRAnalyticsSummary> GetHRMetricsAsync(
            [Service] IAnalyticsService analyticsService)
        {
            return await analyticsService.GetHRMetricsAsync();
        }
    }
}
