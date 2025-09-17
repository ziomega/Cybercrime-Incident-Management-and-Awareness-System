from django.db import models
from incidents.models import Incidents
from users.models import Users

class Evidence(models.Model):
    evidence_id = models.AutoField(primary_key=True)
    incident = models.ForeignKey(Incidents, models.DO_NOTHING)
    submitted_by = models.ForeignKey(Users, models.DO_NOTHING, db_column='submitted_by')
    file_path = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    submitted_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'evidence'