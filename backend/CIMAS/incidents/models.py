from django.db import models
from django.conf import settings
from awareness.models import CrimeTypes
from users.models import Investigators

class Locations(models.Model):
    location_id = models.AutoField(primary_key=True)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        db_table = 'locations'

class Incidents(models.Model):
    incident_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, models.DO_NOTHING)
    location = models.ForeignKey(Locations, models.DO_NOTHING)
    crime_type = models.ForeignKey(CrimeTypes, models.DO_NOTHING)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    class Status(models.TextChoices):
        OPEN = 'OPEN', 'Open'
        IN_PROGRESS = 'IN_PROGRESS', 'In Progress'
        CLOSED = 'CLOSED', 'Closed'
        REJECTED = 'REJECTED', 'Rejected'

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.OPEN,
        blank=True,
        null=True
    )
    reported_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = 'incidents'


class IncidentAssignments(models.Model):
    assignment_id = models.AutoField(primary_key=True)
    incident = models.ForeignKey(Incidents, models.DO_NOTHING)
    investigator = models.ForeignKey(Investigators, models.DO_NOTHING)
    assigned_at = models.DateTimeField(blank=True, null=True)
    class Status(models.TextChoices):
        ASSIGNED = 'ASSIGNED', 'Assigned'
        IN_PROGRESS = 'IN_PROGRESS', 'In Progress'
        COMPLETED = 'COMPLETED', 'Completed'
        CANCELLED = 'CANCELLED', 'Cancelled'

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ASSIGNED,
        blank=True,
        null=True
    )

    class Meta:
        db_table = 'incident_assignments'

