from django.contrib import admin
from .models import Incidents, IncidentAssignments,Locations
# Register your models here.
admin.site.register(Incidents)
admin.site.register(IncidentAssignments)
admin.site.register(Locations)
