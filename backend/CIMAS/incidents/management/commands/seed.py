import os
import django
import random
from django.utils import timezone
from faker import Faker

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'CIMAS.CIMAS.settings')
django.setup()

from users.models import CustomUser, Investigators
from incidents.models import Locations, Incidents
from awareness.models import CrimeTypes, Solutions
from activity_logs.models import ActivityLog
from evidence.models import Evidence

fake = Faker()

# Seed CustomUser (20 users)
roles = ['victim', 'investigator', 'admin', 'superadmin']
user_objs = []
for i in range(20):
    role = random.choice(roles)
    email = f"{role}{i}@example.com"
    user, created = CustomUser.objects.get_or_create(email=email, defaults={
        'role': role,
        'first_name': fake.first_name(),
        'last_name': fake.last_name()
    })
    if created:
        user.set_password('password123')
        user.save()
    user_objs.append(user)

# Seed Investigators (for all investigators)
for user in user_objs:
    if user.role == 'investigator':
        Investigators.objects.get_or_create(user=user, defaults={'department': fake.word().capitalize() + " Department"})

# Seed Locations (20 locations)
location_objs = []
for i in range(20):
    loc = {
        'address': fake.street_address(),
        'city': fake.city(),
        'state': fake.state(),
        'country': fake.country(),
        'zip_code': fake.zipcode()
    }
    location = Locations.objects.get_or_create(**loc)[0]
    location_objs.append(location)

# Seed CrimeTypes (20 types)
crime_type_objs = []
for i in range(20):
    crime_type_name = fake.word().capitalize() + " Crime"
    ct = CrimeTypes.objects.get_or_create(crime_type_name=crime_type_name)[0]
    crime_type_objs.append(ct)

# Seed Solutions (one for each crime type)
for ct in crime_type_objs:
    Solutions.objects.get_or_create(crime_type=ct, defaults={
        'recommended_actions': f"Recommended actions for {ct.crime_type_name}",
        'awareness_level': random.choice(['Low', 'Medium', 'High'])
    })

# Seed Incidents (20 incidents)
incident_objs = []
for i in range(20):
    incident = Incidents.objects.get_or_create(
        user=random.choice(user_objs),
        location=random.choice(location_objs),
        crime_type=random.choice(crime_type_objs),
        title=fake.sentence(nb_words=6),
        description=fake.paragraph(nb_sentences=3),
        status=random.choice(['OPEN', 'CLOSED', 'IN_PROGRESS']),
        reported_at=timezone.now() - timezone.timedelta(days=random.randint(0, 365))
    )[0]
    incident_objs.append(incident)

# Seed ActivityLog (20 logs)
for i in range(20):
    ActivityLog.objects.get_or_create(
        user=random.choice(user_objs),
        action=random.choice(['Report', 'Update', 'Close']),
        timestamp=timezone.now() - timezone.timedelta(days=random.randint(0, 365)),
        target_table=random.choice(['incidents', 'evidence', 'users']),
        target_id=random.randint(1, 20)
    )

# Seed Evidence (20 evidence records)
for i in range(20):
    incident = random.choice(incident_objs)
    Evidence.objects.get_or_create(
        incident=incident,
        submitted_by=random.choice(user_objs),
        file_path=f"/files/evidence_{i+1}.jpg",
        description=fake.sentence(nb_words=10),
        submitted_at=timezone.now() - timezone.timedelta(days=random.randint(0, 365))
    )

print("Database seeded successfully with 20 records per table.")
