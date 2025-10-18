from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import ActivityLog


# -------------------------------
# Helper: Get user role safely
# -------------------------------
def get_user_role(user):
    if getattr(user, "is_superuser", False):
        return "admin"
    return getattr(user, "role", "user")  # defaults to 'user' if no role field


# -------------------------------
# GET all logs (admins see all)
# -------------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_logs(request):
    role = get_user_role(request.user)

    if role == "admin":
        logs = ActivityLog.objects.all()
    elif role == "investigator":
        # investigators can see incident-related logs
        logs = ActivityLog.objects.filter(target_table="incidents")
    else:
        # normal users see only their own logs
        logs = ActivityLog.objects.filter(user=request.user)

    data = [
        {
            "log_id": log.log_id,
            "user": log.user.email if hasattr(log.user, "email") else log.user.username,
            "action": log.action,
            "timestamp": log.timestamp,
            "target_table": log.target_table,
            "target_id": log.target_id,
        }
        for log in logs
    ]
    return Response(data)


# -------------------------------
# GET single log by ID
# -------------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_log(request, id):
    log = get_object_or_404(ActivityLog, log_id=id)
    role = get_user_role(request.user)

    if role == "admin" or log.user == request.user:
        return Response({
            "log_id": log.log_id,
            "user": log.user.email if hasattr(log.user, "email") else log.user.username,
            "action": log.action,
            "timestamp": log.timestamp,
            "target_table": log.target_table,
            "target_id": log.target_id,
        })
    else:
        return Response({"error": "You do not have permission to view this log."}, status=403)


# -------------------------------
# GET logs for a specific user
# -------------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_logs(request, userId):
    role = get_user_role(request.user)

    if role == "admin" or request.user.id == userId:
        logs = ActivityLog.objects.filter(user_id=userId)
    elif role == "investigator" and request.user.id == userId:
        logs = ActivityLog.objects.filter(user_id=userId)
    else:
        return Response({"error": "Access denied."}, status=403)

    return Response(list(logs.values()))


# -------------------------------
# GET logs for a specific incident
# -------------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_incident_logs(request, incidentId):
    role = get_user_role(request.user)

    if role in ["admin", "investigator"]:
        logs = ActivityLog.objects.filter(target_id=incidentId, target_table="incidents")
        return Response(list(logs.values()))
    else:
        return Response({"error": "Access denied."}, status=403)
