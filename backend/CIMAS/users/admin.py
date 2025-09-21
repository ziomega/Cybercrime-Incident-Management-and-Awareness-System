from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from .models import CustomUser, Investigators

class CustomUserAdmin(BaseUserAdmin):
    # The forms to add and change user instances are optional; you can use default

    model = CustomUser
    list_display = ('email', 'first_name', 'last_name', 'role', 'is_staff', 'is_superuser', 'is_active')
    list_filter = ('role', 'is_staff', 'is_superuser', 'is_active')
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name', 'role')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'role', 'password1', 'password2', 'is_staff', 'is_superuser', 'is_active')}
        ),
    )

    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email',)

# Register models
admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Investigators)
