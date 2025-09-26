from django.db import models
from django.conf import settings
from django.utils import timezone

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
    STATUS_CHOICES = [
        ("in_progress", "In Progress"),
        ("assigned", "Assigned"),
        ("resolved", "Resolved"),
        
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  
    description = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="in_progress")
    reported_at = models.DateTimeField(default=timezone.now)
    location = models.ForeignKey(Locations, on_delete=models.SET_NULL, null=True, blank=True)
    crime_type = models.ForeignKey('awareness.CrimeTypes', on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        db_table = 'incidents'

    def __str__(self):
        return f"Incident {self.id} - {self.status}"

class IncidentAssignments(models.Model):
    STATUS_CHOICES = [
        ("in_progress", "In Progress"),
        ("assigned", "Assigned"),
        ("resolved", "Resolved"),
        
    ]
    incident = models.ForeignKey(Incidents, on_delete=models.CASCADE)
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,  # allow null for existing rows
        blank=True
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="assigned")
    assigned_at = models.DateTimeField(default=timezone.now,null=True)
  # ✅ proper default

    def __str__(self):
        return f"{self.incident} assigned at {self.assigned_at}"


