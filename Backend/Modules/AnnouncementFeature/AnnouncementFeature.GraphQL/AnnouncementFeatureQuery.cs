using HotChocolate;
using HotChocolate.Types;
using HRMS.Shared.Application.GraphQL;
using AnnouncementFeature.Application.Services;
using AnnouncementFeature.Application.DTOs;

namespace AnnouncementFeature.GraphQL
{
    [ExtendObjectType(typeof(Query))]
    public class AnnouncementFeatureQuery
    {
        [GraphQLName("getAnnouncements")]
        public async Task<IEnumerable<AnnouncementDto>> GetAnnouncementsAsync(
            [Service] IAnnouncementService announcementService)
        {
            return await announcementService.GetAnnouncementsAsync();
        }
    }
}

// Made with Bob
