from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, NotFound
from rest_framework.views import APIView
from django.db.models import Q
from django.contrib.auth import get_user_model
from .models import Message
from .serializers import MessageSerializer
from incidents.models import Incidents, IncidentAssignments

User = get_user_model()

# System user email for Admin Panel
ADMIN_PANEL_EMAIL = 'admin.panel@system.internal'


def get_admin_panel_user():
    """Get or create the Admin Panel system user"""
    user, created = User.objects.get_or_create(
        email=ADMIN_PANEL_EMAIL,
        defaults={
            'first_name': 'Admin',
            'last_name': 'Panel',
            'role': 'admin',
            'is_active': False,
            'is_staff': False,
        }
    )
    if created:
        user.set_unusable_password()
        user.save()
    return user


class MessageDetailView(generics.RetrieveUpdateAPIView):
    """
    GET/PATCH: /api/chat/messages/<id>/
    Allows retrieving and updating a specific message (e.g., marking as read)
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MessageSerializer
    queryset = Message.objects.all()

    def get_object(self):
        message = super().get_object()
        user = self.request.user
        
        # User can only access messages they sent or received
        if message.sender != user and message.receiver != user and not message.is_broadcast:
            raise PermissionDenied("You don't have permission to access this message")
        
        return message

    def perform_update(self, serializer):
        # Only allow updating 'read' and 'delivered' fields
        message = self.get_object()
        user = self.request.user
        
        # Only the receiver can mark a message as read
        if message.receiver != user and not message.is_broadcast:
            raise PermissionDenied("Only the receiver can update this message")
        
        # Only allow updating read/delivered status
        allowed_fields = {'read', 'delivered'}
        update_fields = {k: v for k, v in self.request.data.items() if k in allowed_fields}
        serializer.save(**update_fields)


class MessageListCreateView(generics.ListCreateAPIView):
    """
    GET: /api/messages/?chat_with=<user_id>  -> gets conversation between current user and chat_with,
         plus broadcasts (for non-chat list calls you may want separate endpoints).
    POST: create message. Body: { receiver: <id|null>, content: "...", is_broadcast: bool (admin only) }
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MessageSerializer

    def get_queryset(self):
        user = self.request.user
        role = user.role
        chat_with = self.request.query_params.get('chat_with')

        # If admin asks conversation with someone
        if chat_with:
            try:
                other = User.objects.get(id=chat_with)
            except User.DoesNotExist:
                raise NotFound("User not found")

            # Special case: If chat_with is Admin Panel, return filtered broadcasts based on user role
            if other.email == ADMIN_PANEL_EMAIL:
                broadcasts = Message.objects.filter(
                    is_broadcast=True
                ).order_by('timestamp')
                
                # Filter based on user role and broadcast_type
                if role == 'admin' or role == 'superadmin':
                    # Admins can see all broadcasts
                    pass
                elif role == 'investigator':
                    # Investigators can only see broadcasts for 'all' or 'investigators'
                    broadcasts = broadcasts.filter(
                        Q(broadcast_type='all') | Q(broadcast_type='investigators')
                    )
                elif role == 'victim':
                    # Victims can only see broadcasts for 'all' or 'victims'
                    broadcasts = broadcasts.filter(
                        Q(broadcast_type='all') | Q(broadcast_type='victims')
                    )
                else:
                    # Unknown role, show only 'all' broadcasts
                    broadcasts = broadcasts.filter(broadcast_type='all')
                
                return broadcasts

            # enforce that the current user can view this conversation
            if role == 'admin':
                # admin can view any
                pass
            elif role == 'investigator':
                # investigator can view if other is admin who messaged them OR is one of their assigned victims
                if other == user:
                    pass
                elif getattr(other, 'role', None) in ['admin', 'superadmin']:
                    # Check if admin has messaged the investigator
                    admin_has_messaged = Message.objects.filter(
                        sender=other,
                        receiver=user
                    ).exists()
                    if not admin_has_messaged:
                        raise PermissionDenied("Not allowed to view this conversation")
                else:
                    # check if the investigator is assigned to any incident reported by the victim
                    linked = IncidentAssignments.objects.filter(
                        assigned_to=user,
                        incident__user=other
                    ).exists()
                    if not linked:
                        raise PermissionDenied("Not allowed to view this conversation")
            elif role == 'victim':
                # victim can only view conversations with their assigned investigators
                if other == user:
                    pass
                elif getattr(other, 'role', None) == 'investigator':
                    # check if the other user is an investigator assigned to the victim's incidents
                    linked = IncidentAssignments.objects.filter(
                        incident__user=user,
                        assigned_to=other
                    ).exists()
                    if not linked:
                        raise PermissionDenied("Not allowed to view this conversation")
                else:
                    # Victims cannot view conversations with admins or other roles
                    raise PermissionDenied("Not allowed to view this conversation")
            else:
                raise PermissionDenied("Invalid role")

            return Message.objects.filter(
                Q(sender=user, receiver=other) | Q(sender=other, receiver=user)
            ).order_by('timestamp')

        # If no chat_with param, maybe return messages relevant to user (inbox + broadcasts)
        # Admin: all messages (or only broadcasts and those sent to admin)
        if role == 'admin':
            return Message.objects.filter(
                Q(receiver=user) | Q(sender=user) |
                Q(is_broadcast=True)  # Admins see all broadcasts
            ).order_by('timestamp')
        # Investigator: their messages + broadcasts for all and investigators
        elif role == 'investigator':
            return Message.objects.filter(
                Q(receiver=user) | Q(sender=user) |
                Q(is_broadcast=True, broadcast_type__in=['all', 'investigators'])
            ).order_by('timestamp')
        # Victim: their messages + broadcasts for all and victims
        elif role == 'victim':
            return Message.objects.filter(
                Q(receiver=user) | Q(sender=user) |
                Q(is_broadcast=True, broadcast_type__in=['all', 'victims'])
            ).order_by('timestamp')
        # Default: only direct messages + broadcasts for all
        return Message.objects.filter(
            Q(receiver=user) | Q(sender=user) |
            Q(is_broadcast=True, broadcast_type='all')
        ).order_by('timestamp')

    def perform_create(self, serializer):
        user = self.request.user
        role = user.role

        receiver_id = self.request.data.get('receiver')
        content = self.request.data.get('content', '').strip()
        is_broadcast = bool(self.request.data.get('is_broadcast', False))
        broadcast_type = self.request.data.get('broadcast_type', 'all')

        if not content:
            raise PermissionDenied("Message content required.")

        # ADMIN
        if role == 'admin':
            if is_broadcast:
                # Save the broadcast message
                serializer.save(sender=user, is_broadcast=True, receiver=None, broadcast_type=broadcast_type)
                return
            # admin may send to anyone: receiver must exist
            if not receiver_id:
                raise PermissionDenied("Receiver required for non-broadcast message.")
            try:
                receiver = User.objects.get(id=receiver_id)
            except User.DoesNotExist:
                raise NotFound("Receiver not found.")
            serializer.save(sender=user, receiver=receiver)
            return

        # INVESTIGATOR
        if role == 'investigator':
            if not receiver_id:
                raise PermissionDenied("Receiver required.")
            try:
                receiver = User.objects.get(id=receiver_id)
            except User.DoesNotExist:
                raise NotFound("Receiver not found.")

            # investigators can message admin who have messaged them or their assigned victims
            if getattr(receiver, 'role', None) in ['admin', 'superadmin']:
                # Check if the admin has messaged this investigator before
                admin_has_messaged = Message.objects.filter(
                    sender=receiver,
                    receiver=user
                ).exists()
                if not admin_has_messaged:
                    raise PermissionDenied("Investigator can only message admins who have contacted them first.")
                serializer.save(sender=user, receiver=receiver)
                return

            # check if investigator is assigned to any incident reported by the victim
            assigned = IncidentAssignments.objects.filter(
                assigned_to=user,
                incident__user=receiver
            ).exists()
            if not assigned:
                raise PermissionDenied("Investigator can only message assigned victims or admins who contacted them.")
            serializer.save(sender=user, receiver=receiver)
            return

        # VICTIM
        if role == 'victim':
            if not receiver_id:
                raise PermissionDenied("Receiver required.")
            try:
                receiver = User.objects.get(id=receiver_id)
            except User.DoesNotExist:
                raise NotFound("Receiver not found.")

            # victims can only message investigators assigned to their incidents
            if getattr(receiver, 'role', None) == 'investigator':
                # check if the receiver is an investigator assigned to the victim's incidents
                assigned = IncidentAssignments.objects.filter(
                    incident__user=user,
                    assigned_to=receiver
                ).exists()
                if not assigned:
                    raise PermissionDenied("Victim can only message investigators assigned to their cases.")
                serializer.save(sender=user, receiver=receiver)
                return
            
            # Victims cannot message admins or other roles
            raise PermissionDenied("Victim can only message investigators assigned to their cases.")

        raise PermissionDenied("Cannot send message - invalid role.")


class AvailableUsersView(APIView):
    """
    GET: /api/chat/available-users/
    Returns list of users the current user can chat with based on their role.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        role = getattr(user, 'role', None)

        available_users = []

        if role == 'admin' or role == 'superadmin':
            # Admin can chat with everyone (except themselves and Admin Panel)
            users = User.objects.exclude(id=user.id).exclude(email=ADMIN_PANEL_EMAIL).values(
                'id', 'email', 'first_name', 'last_name', 'role'
            )
            available_users = list(users)

        elif role == 'investigator':
            # Investigators can chat with:
            # 1. Admins who have messaged them (exclude Admin Panel)
            admin_ids_who_messaged = Message.objects.filter(
                receiver=user,
                sender__role__in=['admin', 'superadmin']
            ).exclude(sender__email=ADMIN_PANEL_EMAIL).values_list('sender_id', flat=True).distinct()
            
            admins = User.objects.filter(
                id__in=admin_ids_who_messaged
            ).values('id', 'email', 'first_name', 'last_name', 'role')
            
            # 2. Victims whose incidents they're assigned to
            assigned_victim_ids = IncidentAssignments.objects.filter(
                assigned_to=user
            ).values_list('incident__user_id', flat=True).distinct()
            
            victims = User.objects.filter(
                id__in=assigned_victim_ids
            ).values('id', 'email', 'first_name', 'last_name', 'role')

            available_users = list(admins) + list(victims)

        elif role == 'victim':
            # Victims can only chat with investigators assigned to their incidents
            assigned_investigator_ids = IncidentAssignments.objects.filter(
                incident__user=user
            ).values_list('assigned_to_id', flat=True).distinct()
            
            investigators = User.objects.filter(
                id__in=assigned_investigator_ids
            ).values('id', 'email', 'first_name', 'last_name', 'role')

            available_users = list(investigators)

        # Remove duplicates and add status (you can enhance this with real-time status)
        seen = set()
        unique_users = []
        for u in available_users:
            if u['id'] not in seen:
                seen.add(u['id'])
                u['status'] = 'online'  # Default status, can be enhanced
                u['avatar'] = f"{u['first_name'][0]}{u['last_name'][0]}".upper() if u['first_name'] and u['last_name'] else 'U'
                unique_users.append(u)

        # Add Admin Panel as a special user visible to everyone
        try:
            admin_panel = User.objects.get(email=ADMIN_PANEL_EMAIL)
            admin_panel_data = {
                'id': admin_panel.id,
                'email': admin_panel.email,
                'first_name': admin_panel.first_name,
                'last_name': admin_panel.last_name,
                'role': 'admin_panel',  # Special role identifier
                'status': 'online',
                'avatar': 'AP',  # Admin Panel
                'is_system_user': True,
            }
            # Add Admin Panel at the top of the list
            unique_users.insert(0, admin_panel_data)
        except User.DoesNotExist:
            # Admin Panel user doesn't exist yet, skip
            pass

        return Response(unique_users, status=status.HTTP_200_OK)


class AdminPanelBroadcastsView(APIView):
    """
    GET: /api/chat/admin-panel-broadcasts/
    Returns all broadcast messages sent by admins (visible to everyone).
    This provides a central location to view all admin announcements.
    Filters broadcasts based on user role and broadcast_type.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        role = getattr(user, 'role', None)
        
        # Get the Admin Panel system user
        try:
            admin_panel_user = User.objects.get(email=ADMIN_PANEL_EMAIL)
        except User.DoesNotExist:
            # If Admin Panel user doesn't exist, create it
            admin_panel_user = get_admin_panel_user()
        
        # Get all broadcast messages (the original broadcasts, not copies)
        broadcasts = Message.objects.filter(
            is_broadcast=True
        ).select_related('sender').order_by('-timestamp')
        
        # Filter based on user role and broadcast_type
        if role == 'admin' or role == 'superadmin':
            # Admins can see all broadcasts
            pass
        elif role == 'investigator':
            # Investigators can only see broadcasts for 'all' or 'investigators'
            broadcasts = broadcasts.filter(
                Q(broadcast_type='all') | Q(broadcast_type='investigators')
            )
        elif role == 'victim':
            # Victims can only see broadcasts for 'all' or 'victims'
            broadcasts = broadcasts.filter(
                Q(broadcast_type='all') | Q(broadcast_type='victims')
            )
        else:
            # Unknown role, show only 'all' broadcasts
            broadcasts = broadcasts.filter(broadcast_type='all')
        
        # Serialize and return
        serializer = MessageSerializer(broadcasts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

