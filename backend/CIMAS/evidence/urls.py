from django.urls import path
from . import views

urlpatterns = [
	path('api/incidents/<int:id>/evidence', views.add_evidence, name='add_evidence'),
	path('api/incidents/<int:id>/evidence', views.get_incident_evidence, name='get_incident_evidence'),
	path('api/evidence/<int:eid>', views.get_evidence, name='get_evidence'),
	path('api/evidence/<int:eid>', views.update_evidence, name='update_evidence'),
	path('api/evidence/<int:eid>', views.delete_evidence, name='delete_evidence'),
]
