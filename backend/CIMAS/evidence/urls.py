from django.urls import path
from . import views

urlpatterns = [
	path('api/incidents/<int:id>/evidence', views.incident_evidence, name='incident_evidence'),
	path('api/evidence/<int:eid>', views.evidence_detail, name='evidence_detail'),
]
