import random
from django.core.management.base import BaseCommand
from django.utils import timezone
from faker import Faker

from users.models import CustomUser, Investigators
from incidents.models import Locations, Incidents, IncidentAssignments
from awareness.models import CrimeTypes, Solutions
from activity_logs.models import ActivityLog
from evidence.models import Evidence

fake = Faker()


class Command(BaseCommand):
    help = "Seed the database with sample data"

    def handle(self, *args, **kwargs):
        # Seed CustomUser (20 users)
        roles = ["victim", "investigator", "admin", "superadmin"]
        user_objs = []
        for i in range(20):
            role = random.choice(roles)
            email = f"{role}{i}@example.com"
            user, created = CustomUser.objects.get_or_create(
                email=email,
                defaults={
                    "role": role,
                    "first_name": fake.first_name(),
                    "last_name": fake.last_name(),
                },
            )
            if created:
                user.set_password("password123")
                user.save()
            user_objs.append(user)

        # Seed Investigators
        for user in user_objs:
            if user.role == "investigator":
                Investigators.objects.get_or_create(
                    user=user,
                    defaults={"department": fake.word().capitalize() + " Department"},
                )

        # Seed Locations
        location_objs = []
        for i in range(20):
            loc = {
                "address": fake.street_address(),
                "city": fake.city(),
                "state": fake.state(),
                "country": fake.country(),
                "zip_code": fake.zipcode(),
            }
            location = Locations.objects.get_or_create(**loc)[0]
            location_objs.append(location)

        # Seed CrimeTypes
        crime_type_objs = []
        for i in range(20):
            crime_type_name = fake.word().capitalize() + " Crime"
            ct = CrimeTypes.objects.get_or_create(crime_type_name=crime_type_name)[0]
            crime_type_objs.append(ct)

        # Seed Solutions (1 per crime type)
        for ct in crime_type_objs:
            Solutions.objects.get_or_create(
                crime_type=ct,
                defaults={
                    "recommended_actions": f"Recommended actions for {ct.crime_type_name}",
                    "awareness_level": random.choice(["Low", "Medium", "High"]),
                },
            )

        # Seed Incidents
        incident_objs = []
        for i in range(20):
            incident = Incidents.objects.get_or_create(
                user=random.choice(user_objs),
                location=random.choice(location_objs),
                crime_type=random.choice(crime_type_objs),
                description=fake.paragraph(nb_sentences=3),
                status=random.choice(["in_progress", "assigned", "resolved"]),
                reported_at=timezone.now()
                - timezone.timedelta(days=random.randint(0, 365)),
            )[0]
            incident_objs.append(incident)

        # Seed IncidentAssignments
        for incident in incident_objs:
            IncidentAssignments.objects.get_or_create(
                incident=incident,
                defaults={
                    "assigned_to": random.choice(user_objs),
                    "assigned_at": timezone.now()
                    - timezone.timedelta(days=random.randint(0, 365)),
                    "status": random.choice(["in_progress", "assigned", "resolved"]),
                },
            )

        # Seed ActivityLog
        for i in range(20):
            ActivityLog.objects.get_or_create(
                user=random.choice(user_objs),
                action=random.choice(["Report", "Update", "Close"]),
                timestamp=timezone.now()
                - timezone.timedelta(days=random.randint(0, 365)),
                target_table=random.choice(["incidents", "evidence", "users"]),
                target_id=random.randint(1, 20),
            )

        # Seed Evidence
        for i in range(20):
            incident = random.choice(incident_objs)
            Evidence.objects.get_or_create(
                incident=incident,
                submitted_by=random.choice(user_objs),
                file_path=f"/files/evidence_{i+1}.jpg",
                defaults={
                    "description": fake.sentence(nb_words=10),
                    "submitted_at": timezone.now()
                    - timezone.timedelta(days=random.randint(0, 365)),
                },
            )

        self.stdout.write(self.style.SUCCESS("✅ Database seeded successfully!"))
