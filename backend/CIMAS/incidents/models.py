from django.db import models
from users.models import Users
from awareness.models import CrimeTypes
# from locations.models import Locations   # if you later split locations

class Incidents(models.Model):
    incident_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(Users, models.DO_NOTHING)
    # location = models.ForeignKey(Locations, models.DO_NOTHING)
    crime_type = models.ForeignKey(CrimeTypes, models.DO_NOTHING)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=50, blank=True, null=True)
    reported_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'incidents'


class IncidentAssignments(models.Model):
    assignment_id = models.AutoField(primary_key=True)
    incident = models.ForeignKey(Incidents, models.DO_NOTHING)
    investigator = models.ForeignKey('users.Investigators', models.DO_NOTHING)
    assigned_at = models.DateTimeField(blank=True, null=True)
    status = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'incident_assignments'
