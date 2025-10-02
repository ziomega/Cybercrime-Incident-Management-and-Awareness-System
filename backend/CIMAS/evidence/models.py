from django.db import models
from incidents.models import Incidents
from django.conf import settings
from django.utils import timezone


class Evidence(models.Model):
    evidence_id = models.AutoField(primary_key=True)
    incident = models.ForeignKey(
        Incidents,
        on_delete=models.CASCADE,   # better than DO_NOTHING to avoid orphan records
        related_name="evidences"
    )
    submitted_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        db_column='submitted_by'
    )
    file_path = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    submitted_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'evidence'

    def __str__(self):
        return f"Evidence {self.evidence_id} for Incident {self.incident_id}"
