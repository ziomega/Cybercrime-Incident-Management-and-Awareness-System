from django.db import models
from django.contrib.auth.models import User
from django.conf import settings  # use this for user references



class CrimeTypes(models.Model): #table called crime types detailing type of crime   
    crime_type_id = models.AutoField(primary_key=True) #autoincrementing primary key
    crime_type_name = models.CharField(max_length=100,unique=True) #stores the crime type name as a string

    class Meta:
        db_table = 'crime_types' #names the database table as such 


class Solutions(models.Model):
    solutions_id = models.AutoField(primary_key=True) #same autoincrementing primary key
    crime_type = models.ForeignKey(CrimeTypes, on_delete=models.CASCADE)
    recommended_actions = models.TextField(blank=True, null=True)# text field to store recommended actions for the problem 
    awareness_level = models.CharField(max_length=50, blank=True, null=True)# short string field to store awareness level like low medium high 

    class Meta:
        db_table = 'solutions' #names the database table as such

class Flair(models.Model):
    name = models.CharField(max_length=50, unique=True)

    class Meta:
        db_table = 'flairs'

    def __str__(self):
        return self.name


class AwarenessResource(models.Model):
    title = models.CharField(max_length=255)
    synopsis = models.TextField(blank=True, null=True)
    content = models.TextField()
    image = models.ImageField(upload_to="awareness/", blank=True, null=True)

    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="resources"
    )

    # CHANGE THIS:
    flair = models.ManyToManyField(Flair, blank=True, related_name="resources")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'awareness_resources'

    def __str__(self):
        return self.title
