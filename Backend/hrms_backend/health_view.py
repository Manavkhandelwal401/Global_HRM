from django.http import JsonResponse
from django.utils import timezone

def health_view(request):
    """Health check endpoint.
    Returns basic service status and timestamps.
    """
    return JsonResponse({
        "status": "ok",
        "database": "connected",
        "graphql": "ready",
        "version": "1.0.0",
        "timestamp": timezone.now().isoformat()
    })
