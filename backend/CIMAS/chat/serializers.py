from rest_framework import serializers
from .models import Message

class MessageSerializer(serializers.ModelSerializer):
    sender_email = serializers.CharField(source='sender.email', read_only=True)
    sender_name = serializers.SerializerMethodField(read_only=True)
    receiver_email = serializers.CharField(source='receiver.email', read_only=True)
    receiver_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'sender', 'sender_email', 'sender_name', 'receiver', 
                  'receiver_email', 'receiver_name', 'content', 'is_broadcast', 
                  'broadcast_type', 'timestamp', 'delivered', 'read']
        read_only_fields = ['sender', 'timestamp', 'delivered', 'read']
    
    def get_sender_name(self, obj):
        return f"{obj.sender.first_name} {obj.sender.last_name}" if obj.sender else None
    
    def get_receiver_name(self, obj):
        return f"{obj.receiver.first_name} {obj.receiver.last_name}" if obj.receiver else None
