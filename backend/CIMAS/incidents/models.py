from django.db import models
from django.conf import settings
from django.utils import timezone

class Incidents(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("assigned", "Assigned"),
        ("resolved", "Resolved"),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  
    description = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    reported_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Incident {self.id} - {self.status}"

class IncidentAssignments(models.Model):
    incident = models.ForeignKey(Incidents, on_delete=models.CASCADE)
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,  # allow null for existing rows
        blank=True
    )
    assigned_at = models.DateTimeField(default=timezone.now,null=True)
  # ✅ proper default

    def __str__(self):
        return f"{self.incident} assigned at {self.assigned_at}"


