from django.db import models

class Users(models.Model):
    user_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    email = models.CharField(unique=True, max_length=150)
    role = models.CharField(max_length=50, blank=True, null=True)
    password_hash = models.CharField(max_length=255)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'users'


class Investigators(models.Model):
    investigator_id = models.AutoField(primary_key=True)
    user = models.OneToOneField(Users, models.DO_NOTHING)
    department = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'investigators'