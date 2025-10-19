import random
from django.core.management.base import BaseCommand
from django.utils import timezone
from faker import Faker

from users.models import CustomUser, Investigators
from incidents.models import Incidents, IncidentAssignments, Locations
from awareness.models import CrimeTypes, Solutions, AwarenessResource
from activity_logs.models import ActivityLog
from evidence.models import Evidence
from chat.models import Message

fake = Faker()


class Command(BaseCommand):
    help = "Seed the database with sample data maintaining all relationships"

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.WARNING("🌱 Starting database seeding..."))
        
        # Clear existing data (optional - comment out if you want to keep existing data)
        self.stdout.write("Clearing existing data...")
        ActivityLog.objects.all().delete()
        Message.objects.all().delete()
        Evidence.objects.all().delete()
        IncidentAssignments.objects.all().delete()
        Incidents.objects.all().delete()
        AwarenessResource.objects.all().delete()
        Solutions.objects.all().delete()
        CrimeTypes.objects.all().delete()
        Investigators.objects.all().delete()
        Locations.objects.all().delete()
        CustomUser.objects.filter(is_superuser=False).delete()  # Keep superusers
        
        # Seed CustomUser (30 users)
        self.stdout.write("Creating users...")
        roles = ["victim", "investigator", "admin"]
        user_objs = []
        investigator_objs = []
        
        for i in range(30):
            role = random.choice(roles)
            email = f"{role}{i}@example.com"
            user, created = CustomUser.objects.get_or_create(
                email=email,
                defaults={
                    "role": role,
                    "first_name": fake.first_name(),
                    "last_name": fake.last_name(),
                    "bio": fake.paragraph(nb_sentences=2) if random.random() > 0.5 else None,
                    "phone": fake.phone_number()[:15] if random.random() > 0.3 else None,
                    "is_staff": role in ["admin", "investigator"],
                    "is_active": True,
                },
            )
            if created:
                user.set_password("password123")
                user.save()
            user_objs.append(user)
            
            # Create Investigators entry for investigator users
            if user.role == "investigator":
                investigator, inv_created = Investigators.objects.get_or_create(
                    user=user,
                    defaults={
                        "department": random.choice([
                            "Cyber Forensics",
                            "Fraud Investigation",
                            "Digital Evidence",
                            "Cyber Crime Unit",
                            "Financial Crimes"
                        ])
                    }
                )
                if inv_created:
                    investigator_objs.append(investigator)
        
        # Seed Locations (20 locations for incidents)
        self.stdout.write("Creating locations...")
        location_objs = []
        for i in range(20):
            location, created = Locations.objects.get_or_create(
                address=fake.street_address(),
                city=fake.city(),
                state=fake.state(),
                country=fake.country(),
                defaults={
                    "zip_code": fake.postcode() if random.random() > 0.3 else None,
                }
            )
            location_objs.append(location)

        
        # Seed CrimeTypes (fixed list of common cybercrime types)
        self.stdout.write("Creating crime types and solutions...")
        crime_types = [
            "Phishing",
            "Ransomware",
            "Identity Theft",
            "Account Takeover",
            "E-commerce Fraud",
            "Data Breach",
            "Cryptocurrency Theft",
            "Cyberbullying",
            "BEC Attack",
            "Malware",
            "DDoS Attack",
            "Social Engineering",
            "Credit Card Fraud",
            "Spyware",
            "Online Harassment",
        ]
        crime_type_objs = []
        for crime_name in crime_types:
            ct, created = CrimeTypes.objects.get_or_create(crime_type_name=crime_name)
            crime_type_objs.append(ct)
            
            # Create solution for each crime type (maintaining 1-to-1 or 1-to-many relationship)
            if created or not Solutions.objects.filter(crime_type=ct).exists():
                Solutions.objects.create(
                    crime_type=ct,
                    recommended_actions=f"1. Report the {crime_name} incident immediately\n2. Preserve all evidence\n3. Change your passwords\n4. Monitor your accounts for suspicious activity\n5. Contact your bank/service provider if financial data is involved",
                    awareness_level=random.choice(["Low", "Medium", "High"]),
                )


        # Seed Incidents (50 incidents) - maintaining relationship with users, crime_types, and locations
        self.stdout.write("Creating incidents...")
        incident_objs = []
        statuses = ["in_progress", "assigned", "resolved"]
        victims = [u for u in user_objs if u.role == "victim"]
        
        # Ensure we have victims
        if not victims:
            victims = user_objs[:10]  # Use first 10 users if no victims
        
        for i in range(50):
            # Create incident with proper relationships
            reporter = random.choice(victims)
            crime_type = random.choice(crime_type_objs)
            status = random.choice(statuses)
            reported_at = timezone.now() - timezone.timedelta(days=random.randint(1, 365))
            
            incident = Incidents.objects.create(
                user=reporter,  # Foreign key to CustomUser
                crime_type=crime_type,  # Foreign key to CrimeTypes
                title=f"{crime_type.crime_type_name} Incident - {fake.catch_phrase()}",
                description=fake.paragraph(nb_sentences=random.randint(3, 7)),
                status=status,
                reported_at=reported_at,
                location=random.choice(location_objs) if random.random() > 0.3 else None,  # Foreign key to Locations (optional)
            )
            incident_objs.append(incident)


        # Seed IncidentAssignments (maintaining relationship with incidents and investigators)
        self.stdout.write("Creating incident assignments...")
        investigators = [u for u in user_objs if u.role == "investigator"]
        
        if not investigators:
            self.stdout.write(self.style.WARNING("⚠ No investigators found, skipping assignments"))
        else:
            assignment_count = 0
            for incident in incident_objs:
                if incident.status in ["assigned", "resolved"]:
                    assigned_at = incident.reported_at + timezone.timedelta(hours=random.randint(1, 48))
                    resolved_at = None
                    
                    if incident.status == "resolved":
                        resolved_at = assigned_at + timezone.timedelta(days=random.randint(1, 30))
                    
                    # Create assignment with proper foreign keys
                    IncidentAssignments.objects.create(
                        incident=incident,  # Foreign key to Incidents
                        assigned_to=random.choice(investigators),  # Foreign key to CustomUser (investigator)
                        assigned_at=assigned_at,
                        assigned_deadline=assigned_at + timezone.timedelta(days=random.randint(7, 30)),
                        priority=random.choice(["low", "medium", "high"]),
                        resolved_at=resolved_at,
                    )
                    assignment_count += 1


        # Seed ActivityLog (maintaining relationship with users and tracking all activities)
        self.stdout.write("Creating activity logs...")
        actions = ["CREATE", "UPDATE", "DELETE", "ASSIGN", "RESOLVE", "SUBMIT", "VIEW", "COMMENT", "UPLOAD"]
        target_tables = ["incidents", "evidence", "users", "assignments", "awareness_resources"]
        
        activity_count = 0
        # Create logs for actual activities
        for incident in incident_objs:
            # Log incident creation
            ActivityLog.objects.create(
                user=incident.user,
                action="CREATE",
                timestamp=incident.reported_at,
                target_table="incidents",
                target_id=incident.id,
            )
            activity_count += 1
            
            # Log assignment if exists
            try:
                assignment = IncidentAssignments.objects.get(incident=incident)
                if assignment.assigned_to:
                    ActivityLog.objects.create(
                        user=assignment.assigned_to,
                        action="ASSIGN",
                        timestamp=assignment.assigned_at,
                        target_table="assignments",
                        target_id=incident.id,
                    )
                    activity_count += 1
                    
                    if assignment.resolved_at:
                        ActivityLog.objects.create(
                            user=assignment.assigned_to,
                            action="RESOLVE",
                            timestamp=assignment.resolved_at,
                            target_table="incidents",
                            target_id=incident.id,
                        )
                        activity_count += 1
            except IncidentAssignments.DoesNotExist:
                pass
        
        # Add some random additional activity logs
        for i in range(50):
            ActivityLog.objects.create(
                user=random.choice(user_objs),
                action=random.choice(actions),
                timestamp=timezone.now() - timezone.timedelta(days=random.randint(0, 365)),
                target_table=random.choice(target_tables),
                target_id=random.randint(1, 50),
            )
            activity_count += 1


        # Seed Evidence (maintaining relationship with incidents and users)
        self.stdout.write("Creating evidence records...")
        evidence_types = ["screenshot", "document", "log_file", "email", "photo", "video", "chat_history", "transaction_record"]
        evidence_count = 0
        
        for incident in incident_objs:
            # Each incident gets 1-4 pieces of evidence
            num_evidence = random.randint(1, 4)
            for j in range(num_evidence):
                # Evidence can be submitted by the reporter or other users involved
                potential_submitters = [incident.user] + random.sample(user_objs, min(3, len(user_objs)))
                submitter = random.choice(potential_submitters)
                
                Evidence.objects.create(
                    incident=incident,  # Foreign key to Incidents
                    submitted_by=submitter,  # Foreign key to CustomUser
                    title=f"{random.choice(evidence_types).replace('_', ' ').title()} - {fake.word()}",
                    description=fake.sentence(nb_words=random.randint(8, 20)),
                    submitted_at=incident.reported_at + timezone.timedelta(hours=random.randint(0, 72)),
                    file=f"evidences/evidence_{evidence_count+1}.{random.choice(['jpg', 'pdf', 'png', 'txt', 'doc', 'mp4'])}",
                    tags=",".join(fake.words(nb=random.randint(2, 5))),
                )
                evidence_count += 1


        # Seed AwarenessResource (maintaining relationship with authors)
        self.stdout.write("Creating awareness resources...")
        awareness_topics = [
            ("Protecting Yourself from Phishing Attacks", "Learn how to identify and avoid phishing scams that target your personal information"),
            ("Ransomware Prevention Guide", "Best practices to protect your data and systems against ransomware attacks"),
            ("Identity Theft Protection", "Comprehensive steps to safeguard your personal information online"),
            ("Safe Online Shopping Tips", "How to shop online securely and avoid e-commerce fraud"),
            ("Password Security Best Practices", "Creating and managing strong passwords to protect your accounts"),
            ("Social Media Privacy Settings", "Protecting your privacy and personal data on social platforms"),
            ("Recognizing Online Scams", "Common online scams and warning signs to watch out for"),
            ("Cyberbullying Awareness", "Understanding and combating cyberbullying in digital spaces"),
            ("Two-Factor Authentication Guide", "Enhancing account security with multi-factor authentication"),
            ("Data Breach Response", "What to do when your personal data is compromised"),
            ("Cryptocurrency Security", "Protecting your digital assets from theft and fraud"),
            ("Email Security Tips", "How to secure your email and avoid email-based attacks"),
            ("Mobile Device Security", "Best practices for securing your smartphone and tablet"),
            ("Social Engineering Awareness", "Understanding manipulation tactics used by cybercriminals"),
            ("Safe Banking Online", "Protecting your financial information during online transactions"),
        ]
        
        authors = [u for u in user_objs if u.role in ["admin", "investigator"]]
        
        if not authors:
            authors = user_objs[:5]  # Use first 5 users if no admins/investigators
        
        for i, (title, synopsis) in enumerate(awareness_topics):
            AwarenessResource.objects.create(
                title=title,
                synopsis=synopsis,
                content=f"{fake.paragraph(nb_sentences=3)}\n\n{fake.paragraph(nb_sentences=5)}\n\n{fake.paragraph(nb_sentences=4)}\n\nKey Takeaways:\n- {fake.sentence()}\n- {fake.sentence()}\n- {fake.sentence()}",
                author=random.choice(authors),  # Foreign key to CustomUser
                image=f"awareness/image_{i+1}.jpg" if random.random() > 0.3 else None,
                created_at=timezone.now() - timezone.timedelta(days=random.randint(1, 180)),
                updated_at=timezone.now() - timezone.timedelta(days=random.randint(0, 30)),
            )

        # Print summary
        # Seed Chat Messages (maintaining relationship with users)
        self.stdout.write("Creating chat messages...")
        message_count = 0
        if user_objs:
            # Create some broadcast messages
            broadcasters = [u for u in user_objs if u.role in ["admin", "investigator"]]
            if not broadcasters:
                broadcasters = user_objs[:3]

            for _ in range(10):
                sender = random.choice(broadcasters)
                Message.objects.create(
                    sender=sender,
                    receiver=None,
                    content=fake.sentence(nb_words=random.randint(6, 20)),
                    is_broadcast=True,
                    broadcast_type=random.choice(["all", "investigators", "victims"]),
                    delivered=True,
                    read=bool(random.getrandbits(1)),
                )
                message_count += 1

            # Create some 1-1 direct messages
            for _ in range(40):
                sender = random.choice(user_objs)
                # Ensure receiver is different from sender
                receiver_choices = [u for u in user_objs if u.id != sender.id]
                receiver = random.choice(receiver_choices) if receiver_choices else None
                Message.objects.create(
                    sender=sender,
                    receiver=receiver,
                    content=fake.sentence(nb_words=random.randint(6, 24)),
                    is_broadcast=False,
                    delivered=bool(random.getrandbits(1)),
                    read=bool(random.getrandbits(1)),
                )
                message_count += 1

        # Print summary
        self.stdout.write(self.style.SUCCESS("\n" + "="*60))
        self.stdout.write(self.style.SUCCESS("✅ Database seeded successfully!"))
        self.stdout.write(self.style.SUCCESS("="*60))
        self.stdout.write(self.style.SUCCESS(f"   👥 Users: {len(user_objs)}"))
        self.stdout.write(self.style.SUCCESS(f"   🔍 Investigators: {len(investigator_objs)}"))
        self.stdout.write(self.style.SUCCESS(f"   📍 Locations: {len(location_objs)}"))
        self.stdout.write(self.style.SUCCESS(f"   🚨 Crime Types: {len(crime_type_objs)}"))
        self.stdout.write(self.style.SUCCESS(f"   💡 Solutions: {len(crime_type_objs)}"))
        self.stdout.write(self.style.SUCCESS(f"   📋 Incidents: {len(incident_objs)}"))
        self.stdout.write(self.style.SUCCESS(f"   📌 Assignments: {assignment_count if investigators else 0}"))
        self.stdout.write(self.style.SUCCESS(f"   📎 Evidence Items: {evidence_count}"))
        self.stdout.write(self.style.SUCCESS(f"   📝 Activity Logs: {activity_count}"))
        self.stdout.write(self.style.SUCCESS(f"   📚 Awareness Resources: {len(awareness_topics)}"))
        self.stdout.write(self.style.SUCCESS(f"   💬 Chat Messages: {message_count}"))
        self.stdout.write(self.style.SUCCESS("="*60))
        self.stdout.write(self.style.SUCCESS("\n🔗 All relationships properly maintained!"))
        self.stdout.write(self.style.SUCCESS("   - Users ↔ Incidents"))
        self.stdout.write(self.style.SUCCESS("   - Users ↔ Investigators (One-to-One)"))
        self.stdout.write(self.style.SUCCESS("   - Incidents ↔ Crime Types"))
        self.stdout.write(self.style.SUCCESS("   - Incidents ↔ Locations"))
        self.stdout.write(self.style.SUCCESS("   - Incidents ↔ Assignments ↔ Investigators"))
        self.stdout.write(self.style.SUCCESS("   - Incidents ↔ Evidence ↔ Users"))
        self.stdout.write(self.style.SUCCESS("   - Crime Types ↔ Solutions"))
        self.stdout.write(self.style.SUCCESS("   - Awareness Resources ↔ Authors (Users)"))
        self.stdout.write(self.style.SUCCESS("   - Chat Messages ↔ Users"))
        self.stdout.write(self.style.SUCCESS("   - Activity Logs ↔ Users"))
        self.stdout.write(self.style.SUCCESS("="*60 + "\n"))
