from rest_framework import serializers  #used to convert JSON to models 
from .models import AwarenessResource #import the table/model we created

class AwarenessListSerializer(serializers.ModelSerializer):# for listing everything, inherits from ModelSerializer
    author = serializers.CharField(source="author.username", read_only=True) #instead of returning author id, show username

    class Meta: #tells what model to base this serializer on 
        model = AwarenessResource
        fields = ["id", "title", "synopsis", "author"] #shows only this much stuff in the list view


class AwarenessDetailSerializer(serializers.ModelSerializer): #same but for detailed view of each article 
    author = serializers.CharField(source="author.username", read_only=True)

    class Meta:
        model = AwarenessResource
        fields = ["id", "title", "author", "content", "image", "created_at", "updated_at"] #includes more stuff comp to list view
