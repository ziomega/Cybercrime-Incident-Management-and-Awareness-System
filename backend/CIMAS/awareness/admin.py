from django.contrib import admin

from .models import CrimeTypes, Solutions,AwarenessResource

# Register your models here.
admin.site.register(CrimeTypes)
admin.site.register(Solutions)
admin.site.register(AwarenessResource)