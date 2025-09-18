from django.contrib import admin

from .models import CrimeTypes, Solutions

# Register your models here.
admin.site.register(CrimeTypes)
admin.site.register(Solutions)