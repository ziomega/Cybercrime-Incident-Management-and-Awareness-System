from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()


class Command(BaseCommand):
    help = 'Creates or updates the default Admin Panel user for viewing broadcast messages'

    def handle(self, *args, **options):
        email = 'admin.panel@system.internal'
        
        # Check if the user already exists
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'first_name': 'Admin',
                'last_name': 'Panel',
                'role': 'admin',
                'is_active': False,  # This is a system user, not for login
                'is_staff': False,
            }
        )
        
        if created:
            # Set an unusable password for security
            user.set_unusable_password()
            user.save()
            self.stdout.write(
                self.style.SUCCESS(f'Successfully created Admin Panel user: {email}')
            )
        else:
            self.stdout.write(
                self.style.WARNING(f'Admin Panel user already exists: {email}')
            )
