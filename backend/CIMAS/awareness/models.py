from django.db import models
from django.contrib.auth.models import User
from django.conf import settings  # use this for user references



class CrimeTypes(models.Model): #table called crime types detailing type of crime   
    crime_type_id = models.AutoField(primary_key=True) #autoincrementing primary key
    crime_type_name = models.CharField(max_length=100) #stores the crime type name as a string

    class Meta:
        db_table = 'crime_types' #names the database table as such 


class Solutions(models.Model):
    solutions_id = models.AutoField(primary_key=True) #same autoincrementing primary key
    crime_type = models.ForeignKey(CrimeTypes, models.DO_NOTHING)# foreign key to link to crime types table
    recommended_actions = models.TextField(blank=True, null=True)# text field to store recommended actions for the problem 
    awareness_level = models.CharField(max_length=50, blank=True, null=True)# short string field to store awareness level like low medium high 

    class Meta:
        db_table = 'solutions' #names the database table as such
    

class AwarenessResource(models.Model): #new database for awarenness resources like articles
    title = models.CharField(max_length=255)  # article name
    synopsis = models.TextField(blank=True, null=True)  # brief summary paragraph optional in forms and database 
    content = models.TextField()  # full article content full paragraph 
    
    image = models.ImageField(upload_to="awareness/", blank=True, null=True)  #uploaded images stored in awareness folder
    #got an issue for this but installed Pillow for image fields and it works now 

    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,  # correct way to reference User
        on_delete=models.CASCADE,
        related_name="resources"
    )
    # had an issue with the user model but resolved by using the settings.AUTH_USER_MODEL with a custom model that is 
    #stored in the settings file which was imported 
    created_at = models.DateTimeField(auto_now_add=True)  # auto set when created
    updated_at = models.DateTimeField(auto_now=True)  # auto update when modified

    def __str__(self):
        return self.title
