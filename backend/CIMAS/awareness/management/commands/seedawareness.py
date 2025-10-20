from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from awareness.models import CrimeTypes, Solutions, AwarenessResource, Flair


class Command(BaseCommand):
    help = "Seed the database with initial test data including flairs"

    def handle(self, *args, **kwargs):
        User = get_user_model()

        # 1️⃣ Create a default user
        user, created = User.objects.get_or_create(
            email="testuser@example.com",
            defaults={"first_name": "Test", "last_name": "User"}
        )
        if created:
            user.set_password("password123")
            user.save()
            self.stdout.write(self.style.SUCCESS("Created default user: testuser@example.com / password123"))

        # 2️⃣ Create Crime Types
        phishing, _ = CrimeTypes.objects.get_or_create(crime_type_name="Phishing")
        malware, _ = CrimeTypes.objects.get_or_create(crime_type_name="Malware")
        fraud, _ = CrimeTypes.objects.get_or_create(crime_type_name="Online Fraud")
        self.stdout.write(self.style.SUCCESS("Crime types created."))

        # 3️⃣ Create Solutions (safe version to avoid duplicates)
        def safe_create_solution(crime_type, recommended_actions, awareness_level):
            existing = Solutions.objects.filter(
                crime_type=crime_type,
                recommended_actions=recommended_actions,
                awareness_level=awareness_level
            ).first()
            if not existing:
                Solutions.objects.create(
                    crime_type=crime_type,
                    recommended_actions=recommended_actions,
                    awareness_level=awareness_level
                )

        safe_create_solution(
            crime_type=phishing,
            recommended_actions="Never click suspicious links, verify sender identity.",
            awareness_level="High"
        )

        safe_create_solution(
            crime_type=malware,
            recommended_actions="Use antivirus software and keep your system updated.",
            awareness_level="Medium"
        )

        safe_create_solution(
            crime_type=fraud,
            recommended_actions="Avoid sharing personal info online, check website authenticity.",
            awareness_level="Low"
        )

        self.stdout.write(self.style.SUCCESS("Solutions created."))

        # 4️⃣ Create Flairs
        cyber_safety, _ = Flair.objects.get_or_create(name="Cyber Safety")
        scams, _ = Flair.objects.get_or_create(name="Scams")
        security, _ = Flair.objects.get_or_create(name="Security")
        awareness, _ = Flair.objects.get_or_create(name="Awareness")
        data_protection, _ = Flair.objects.get_or_create(name="Data Protection")
        self.stdout.write(self.style.SUCCESS("Flairs created."))

        # 5️⃣ Create Awareness Resources and link flairs
        res1, _ = AwarenessResource.objects.get_or_create(
            title="How to Spot Phishing Emails",
            synopsis="Tips to identify phishing attempts via email.",
            content="Phishing emails often look legitimate but have subtle signs like spelling mistakes, urgent messages, or suspicious links.",
            author=user
        )
        res1.flair.set([cyber_safety, scams])

        res2, _ = AwarenessResource.objects.get_or_create(
            title="Protecting Your PC from Malware",
            synopsis="Guide to keeping your computer safe.",
            content="Install antivirus, avoid downloading from untrusted sites, and update your OS regularly.",
            author=user
        )
        res2.flair.set([security, data_protection])

        res3, _ = AwarenessResource.objects.get_or_create(
            title="Recognizing Online Fraud",
            synopsis="Learn to identify and avoid fraud.",
            content="Be cautious when giving financial info, always verify websites before transactions.",
            author=user
        )
        res3.flair.set([awareness, scams])

        self.stdout.write(self.style.SUCCESS("Awareness resources created and linked with flairs."))
        self.stdout.write(self.style.SUCCESS("✅ Database seeding completed!"))
