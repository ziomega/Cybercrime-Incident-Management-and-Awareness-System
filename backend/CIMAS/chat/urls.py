from django.urls import path
from .views import MessageListCreateView, AvailableUsersView, MessageDetailView, AdminPanelBroadcastsView

urlpatterns = [
    path('api/chat/messages/', MessageListCreateView.as_view(), name='message-list-create'),
    path('api/chat/messages/<int:pk>/', MessageDetailView.as_view(), name='message-detail'),
    path('api/chat/available-users/', AvailableUsersView.as_view(), name='available-users'),
    path('api/chat/admin-panel-broadcasts/', AdminPanelBroadcastsView.as_view(), name='admin-panel-broadcasts'),
]
