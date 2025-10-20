from django.urls import path
from .views import (
    AwarenessResourceListCreateView,
    AwarenessResourceDetailView,
    FlairListView,   # ✅ NEW: import the Flair view
)

urlpatterns = [
    # List all resources OR create a new one
    path("api/awareness/resources/", AwarenessResourceListCreateView.as_view(), name="resource_list_create"),

    # Get details of one resource / update it / delete it
    path("api/awareness/resources/<int:pk>/", AwarenessResourceDetailView.as_view(), name="resource_detail"),

    # ✅ NEW: list all available flairs (for frontend dropdown/filtering)
    path("api/awareness/flairs/", FlairListView.as_view(), name="flair_list"),
]
