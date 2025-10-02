from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.utils.timezone import now
import json

from .models import Evidence
from incidents.models import Incidents
from django.contrib.auth import get_user_model

User = get_user_model()


# -------------------------------
# GET all evidence for incident
# POST add new evidence to incident
# -------------------------------
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def incident_evidence(request, id):
    if request.method == 'POST':
        data = json.loads(request.body)
        incident = get_object_or_404(Incidents, pk=id)

        evidence = Evidence.objects.create(
            incident=incident,
            submitted_by=request.user,   # authenticated user
            file_path=data.get("file_path"),
            description=data.get("description", ""),
            submitted_at=now()
        )
        return JsonResponse(
            {
                "message": "Evidence added",
                "evidence_id": evidence.evidence_id,
                "incident_id": evidence.incident_id,
                "submitted_by": request.user.email,
            },
            status=201
        )

    elif request.method == 'GET':
        evidences = Evidence.objects.filter(incident_id=id)
        data = [{
            "evidence_id": ev.evidence_id,
            "incident_id": ev.incident_id,
            "submitted_by": ev.submitted_by.email if ev.submitted_by else None,
            "file_path": ev.file_path,
            "description": ev.description,
            "submitted_at": ev.submitted_at,
        } for ev in evidences]
        return JsonResponse(data, safe=False)


# -------------------------------
# GET single evidence
# PUT update evidence
# DELETE remove evidence
# -------------------------------
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def evidence_detail(request, eid):
    evidence = get_object_or_404(Evidence, pk=eid)

    # anyone can see if they belong to same incident OR admin
    if request.method == 'GET':
        return JsonResponse({
            "evidence_id": evidence.evidence_id,
            "incident_id": evidence.incident_id,
            "submitted_by": evidence.submitted_by.email if evidence.submitted_by else None,
            "file_path": evidence.file_path,
            "description": evidence.description,
            "submitted_at": evidence.submitted_at,
        })

    # only submitter or admin can update
    elif request.method == 'PUT':
        if request.user != evidence.submitted_by and getattr(request.user, "role", None) != "admin"and not request.user.is_superuser:
            return JsonResponse({"error": "Not allowed"}, status=403)

        data = json.loads(request.body)
        evidence.file_path = data.get("file_path", evidence.file_path)
        evidence.description = data.get("description", evidence.description)
        evidence.save()
        return JsonResponse({"message": "Evidence updated"})

    # only admin can delete
    elif request.method == 'DELETE':
        if getattr(request.user, "role", None) != "admin" and not request.user.is_superuser:
            return JsonResponse({"error": "Only admin can delete"}, status=403)

        evidence.delete()
        return JsonResponse({"message": "Evidence deleted"})
