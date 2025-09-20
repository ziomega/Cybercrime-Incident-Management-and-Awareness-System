from django.db import models
from incidents.models import Incidents
from django.conf import settings

class Evidence(models.Model):
    evidence_id = models.AutoField(primary_key=True)
    incident = models.ForeignKey(Incidents, models.DO_NOTHING)
    submitted_by = models.ForeignKey(settings.AUTH_USER_MODEL, models.DO_NOTHING, db_column='submitted_by')
    file_path = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    submitted_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = 'evidence'