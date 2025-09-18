from django.urls import path
from . import views

urlpatterns = [
	path('api/logs', views.get_logs, name='get_logs'),
	path('api/logs/<int:id>', views.get_log, name='get_log'),
	path('api/logs/user/<int:userId>', views.get_user_logs, name='get_user_logs'),
	path('api/logs/incidents/<int:incidentId>', views.get_incident_logs, name='get_incident_logs'),
]
