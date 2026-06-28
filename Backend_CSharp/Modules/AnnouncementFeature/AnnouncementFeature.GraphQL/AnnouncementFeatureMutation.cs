using HotChocolate;
using HotChocolate.Types;
using HRMS.Shared.Application.GraphQL;
using AnnouncementFeature.Application.Services;
using AnnouncementFeature.Application.DTOs;
using AnnouncementFeature.Domain.Enums;

namespace AnnouncementFeature.GraphQL
{
    [ExtendObjectType(typeof(Mutation))]
    public class AnnouncementFeatureMutation
    {
        [GraphQLName("createAnnouncement")]
        public async Task<AnnouncementDto?> CreateAnnouncementAsync(
            [Service] IAnnouncementService announcementService,
            string title,
            AnnouncementCategory category,
            string content,
            AnnouncementPriority priority,
            VisibilityScope scope,
            string createdBy,
            DateTime? expiryDate = null)
        {
            return await announcementService.CreateAnnouncementAsync(
                title, category, content, priority, scope, createdBy, expiryDate);
        }

        [GraphQLName("acknowledgeAnnouncement")]
        public async Task<AnnouncementDto?> AcknowledgeAnnouncementAsync(
            [Service] IAnnouncementService announcementService,
            string announcementId,
            string employeeId)
        {
            return await announcementService.AcknowledgeAnnouncementAsync(announcementId, employeeId);
        }
    }
}

// Made with Bob
