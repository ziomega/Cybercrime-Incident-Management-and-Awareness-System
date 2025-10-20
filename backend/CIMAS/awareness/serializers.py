from rest_framework import serializers
from .models import Flair, AwarenessResource


class FlairSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flair
        fields = ['id', 'name']


class AwarenessListSerializer(serializers.ModelSerializer):
    author = serializers.CharField(source="author.username", read_only=True)
    flair = FlairSerializer(many=True, read_only=True)  # ✅ many=True for M2M

    class Meta:
        model = AwarenessResource
        fields = ["id", "title", "synopsis", "author", "flair"]


class AwarenessDetailSerializer(serializers.ModelSerializer):
    author = serializers.CharField(source="author.username", read_only=True)
    flair = FlairSerializer(many=True, read_only=True)
    flair_id = serializers.PrimaryKeyRelatedField(
        queryset=Flair.objects.all(),
        many=True,
        source='flair',
        write_only=True
    )

    class Meta:
        model = AwarenessResource
        fields = [
            "id", "title", "author", "synopsis", "content", "image",
            "flair", "flair_id", "created_at", "updated_at"
        ]
        read_only_fields = ["author", "created_at", "updated_at"]
