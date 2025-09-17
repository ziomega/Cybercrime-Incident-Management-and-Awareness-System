from django.db import models

class CrimeTypes(models.Model):
    crime_type_id = models.AutoField(primary_key=True)
    crime_type_name = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'crime_types'


class Solutions(models.Model):
    solutions_id = models.AutoField(primary_key=True)
    crime_type = models.ForeignKey(CrimeTypes, models.DO_NOTHING)
    recommended_actions = models.TextField(blank=True, null=True)
    awareness_level = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'solutions'