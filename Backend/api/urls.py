from django.urls import path
from strawberry.django.views import GraphQLView
from api.schema import schema
from api.auth_views import login_view, signup_view, refresh_view

urlpatterns = [
    path('graphql', GraphQLView.as_view(schema=schema)),
    path('auth/login', login_view, name='login'),
    path('auth/signup', signup_view, name='signup'),
    path('auth/refresh', refresh_view, name='refresh'),
]
