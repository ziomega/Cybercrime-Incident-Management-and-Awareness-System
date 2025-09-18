from django.urls import path
from . import views

urlpatterns = [
	path('api/incidents', views.create_incident, name='create_incident'),
	path('api/incidents', views.get_incidents, name='get_incidents'),
	path('api/incidents/<int:id>', views.get_incident, name='get_incident'),
	path('api/incidents/<int:id>', views.update_incident, name='update_incident'),
	path('api/incidents/<int:id>', views.delete_incident, name='delete_incident'),
	path('api/incidents/user/<int:id>', views.get_user_incidents, name='get_user_incidents'),
]
