from django.conf import settings
from django.db import models

User = settings.AUTH_USER_MODEL


class Message(models.Model):
    """
    A single chat message. receiver is null for broadcasts (is_broadcast=True).
    """
    BROADCAST_TYPES = [
        ('all', 'All Users'),
        ('investigators', 'All Investigators'),
        ('victims', 'All Victims'),
    ]
    
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages', null=True, blank=True)
    content = models.TextField()
    is_broadcast = models.BooleanField(default=False)
    broadcast_type = models.CharField(max_length=20, choices=BROADCAST_TYPES, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    delivered = models.BooleanField(default=False)  # optional flag
    read = models.BooleanField(default=False)       # optional flag

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        if self.is_broadcast:
            return f"[Broadcast {self.broadcast_type}] {self.sender} : {self.content[:30]}"
        return f"{self.sender} -> {self.receiver}: {self.content[:30]}"
