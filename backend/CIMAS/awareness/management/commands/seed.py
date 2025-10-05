from django.core.management.base import BaseCommand #base for writing seed commands
from django.contrib.auth import get_user_model #to get the user model
from awareness.models import CrimeTypes, Solutions, AwarenessResource

class Command(BaseCommand): #every custom command must inherit the command class from base command 
    help = "Seed the database with initial test data" #short desc of command 

    def handle(self, *args, **kwargs): #entry point; main function if u run the seed file 
        User = get_user_model()

        # 1️⃣ Create a default user (author for AwarenessResource)
        user, created = User.objects.get_or_create(
            email="testuser@example.com", #looks for this user if not found creates it
            defaults={ "first_name": "Test",
        "last_name": "User"}

        ) #details of user provided here
        if created:
            user.set_password("password123")
            user.save()
            self.stdout.write(self.style.SUCCESS("Created default user: testuser@example.com / password123"))

        

        # 2️⃣ Create Crime Types ; 3 rows in crimetypes table 
        phishing = CrimeTypes.objects.create(crime_type_name="Phishing")
        malware = CrimeTypes.objects.create(crime_type_name="Malware")
        fraud = CrimeTypes.objects.create(crime_type_name="Online Fraud")

        self.stdout.write(self.style.SUCCESS("Crime types created.")) #prints success message 

        # 3️⃣ Create custom Solutions to each crime types ; 3 rows in solutions table
        Solutions.objects.create(
            crime_type=phishing,
            recommended_actions="Never click suspicious links, verify sender identity.",
            awareness_level="High"
        )
        Solutions.objects.create(
            crime_type=malware,
            recommended_actions="Use antivirus software and keep your system updated.",
            awareness_level="Medium"
        )
        Solutions.objects.create(
            crime_type=fraud,
            recommended_actions="Avoid sharing personal info online, check website authenticity.",
            awareness_level="Low"
        )

        self.stdout.write(self.style.SUCCESS("Solutions created.")) #another update statement 

        # 4️⃣ Create Awareness Resources
        AwarenessResource.objects.create(
            title="How to Spot Phishing Emails",
            synopsis="Tips to identify phishing attempts via email.",
            content="Phishing emails often look legitimate but have subtle signs like spelling mistakes, urgent messages, or suspicious links.",
            author=user #links to test created earlier 
        )

        AwarenessResource.objects.create(
            title="Protecting Your PC from Malware",
            synopsis="Guide to keeping your computer safe.",
            content="Install antivirus, avoid downloading from untrusted sites, and update your OS regularly.",
            author=user
        )

        AwarenessResource.objects.create(
            title="Recognizing Online Fraud",
            synopsis="Learn to identify and avoid fraud.",
            content="Be cautious when giving financial info, always verify websites before transactions.",
            author=user
        )

        self.stdout.write(self.style.SUCCESS("Awareness resources created.")) #confirmation of addition of resources 

        self.stdout.write(self.style.SUCCESS("✅ Database seeding completed!")) #Last message after whole seeding is done 
