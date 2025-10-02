from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
	path('api/incidents/<int:id>/evidence', views.incident_evidence, name='incident_evidence'),
	path('api/evidence/<int:eid>', views.evidence_detail, name='evidence_detail'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)