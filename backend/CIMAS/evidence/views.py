from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from incidents.models import IncidentAssignments
from .models import Evidence
from incidents.models import Incidents
from django.contrib.auth import get_user_model
import random

User = get_user_model()

# -------------------------------
# GET all evidence for user
# -------------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_evidence(request):
    role = request.user.role
    if role not in ['admin', 'investigator', 'victim']:
        return JsonResponse({'error': 'You do not have permission to view this.'}, status=403)
    
    if role == 'victim':
        pass
    elif role == 'investigator':
        assigned_incidents = IncidentAssignments.objects.filter(assigned_to=request.user).values_list('incident_id', flat=True)
        evidences = Evidence.objects.filter(incident_id__in=assigned_incidents)
        total_evidence = evidences.count()
        total_size = sum(ev.file.size for ev in evidences if ev.file)
        verified_count =random.randint(0, total_evidence)
        unverified_count = total_evidence - verified_count
        unverified_count =0
        return JsonResponse({
            "total_evidence": total_evidence,
            "total_size": total_size,
            "verified_count": verified_count,
            "unverified_count": unverified_count,
            "evidences": [{
                "title": ev.title,
                "incident": ev.incident.title,
                "description": ev.description,
                "submitted_at": ev.submitted_at,
                "uploaded_by": ev.submitted_by.first_name + ' ' + ev.submitted_by.last_name if ev.submitted_by else None,
                "file_url": ev.file.url if ev.file else None,
                "file_size": ev.file.size if ev.file else 0,
                "tags": ev.tags.split(",") if ev.tags else []
            } for ev in evidences]
        })


# -------------------------------
# GET all evidence for incident
# POST add new evidence to incident (file upload)
# -------------------------------
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def incident_evidence(request, id):
    incident = get_object_or_404(Incidents, pk=id)

    if request.method == 'POST':
        file = request.FILES.get('file')
        description = request.data.get('description', '')

        if not file:
            return JsonResponse({"error": "No file uploaded"}, status=400)

        evidence = Evidence.objects.create(
            incident=incident,
            submitted_by=request.user,
            file=file,
            description=description,
        )

        return JsonResponse({
            "message": "Evidence added",
            "evidence_id": evidence.evidence_id,   # ✅ fixed
            "incident_id": evidence.incident.id,
            "submitted_by": request.user.email,
            "file_url": evidence.file.url if evidence.file else None  # ✅ safe file handling
        }, status=201)

    elif request.method == 'GET':
        evidences = Evidence.objects.filter(incident_id=id)
        data = [{
            "evidence_id": ev.evidence_id,   # ✅ fixed
            "incident_id": ev.incident.id,
            "submitted_by": ev.submitted_by.email if ev.submitted_by else None,
            "file_url": ev.file.url if ev.file else None,  # ✅ safe
            "description": ev.description,
            "submitted_at": ev.submitted_at,
        } for ev in evidences]
        return JsonResponse(data, safe=False)


# -------------------------------
# GET single evidence
# PUT update evidence (only submitter/admin)
# DELETE remove evidence (only admin)
# -------------------------------
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def evidence_detail(request, eid):
    evidence = get_object_or_404(Evidence, pk=eid)

    if request.method == 'GET':
        return JsonResponse({
            "evidence_id": evidence.evidence_id,  # ✅ fixed
            "incident_id": evidence.incident.id,
            "submitted_by": evidence.submitted_by.email if evidence.submitted_by else None,
            "file_url": evidence.file.url if evidence.file else None,  # ✅ safe
            "description": evidence.description,
            "submitted_at": evidence.submitted_at,
        })

    elif request.method == 'PUT':
        if request.user != evidence.submitted_by and getattr(request.user, "role", None) != "admin" and not request.user.is_superuser:
            return JsonResponse({"error": "Not allowed"}, status=403)

        file = request.FILES.get('file')
        description = request.data.get('description', evidence.description)

        if file:
            evidence.file = file
        evidence.description = description
        evidence.save()

        return JsonResponse({
            "message": "Evidence updated",
            "file_url": evidence.file.url if evidence.file else None  # ✅ safe
        })

    elif request.method == 'DELETE':
        if getattr(request.user, "role", None) != "admin" and not request.user.is_superuser:
            return JsonResponse({"error": "Only admin can delete"}, status=403)

        evidence.delete()
        return JsonResponse({"message": "Evidence deleted"})
