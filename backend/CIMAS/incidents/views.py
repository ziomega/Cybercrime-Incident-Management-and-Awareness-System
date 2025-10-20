# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.permissions import IsAuthenticated, IsAdminUser
# from django.http import JsonResponse
# from django.shortcuts import get_object_or_404
# import json
# from .models import Incidents as Incident

# @api_view(['POST'])
# @permission_classes([IsAuthenticated])  # any logged-in user can create
# def create_incident(request):
    
#     data = json.loads(request.body)
#     description = data.get("description")

#     if not description:
#         return JsonResponse({"error": "Description required"}, status=400)

#     incident = Incident.objects.create(
#         user=request.user,
#         description=description,
#         status="pending"
#     )
#     return JsonResponse({"message": "Incident created", "id": incident.id}, status=201)
    


# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def get_incidents(request):
#     # Admins see all, users only see their own
#     if request.user.role == "admin":
#         incidents = Incident.objects.all()
#     else:
#         incidents = Incident.objects.filter(user=request.user)

#     data = [{
#         "id": inc.id,
#         "user": inc.user.email,
#         "description": inc.description,
#         "status": inc.status,
#         "reported_at": inc.reported_at
#     } for inc in incidents]

#     return JsonResponse(data, safe=False)


# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def get_incident(request, id):
#     incident = get_object_or_404(Incident, id=id)

#     if request.user != incident.user and request.user.role != "admin":
#         return JsonResponse({"error": "Not allowed"}, status=403)

#     return JsonResponse({
#         "id": incident.id,
#         "user": incident.user.email,
#         "description": incident.description,
#         "status": incident.status,
#         "reported_at": incident.reported_at
#     })


# @api_view(['PUT'])
# @permission_classes([IsAuthenticated])
# def update_incident(request, id):
#     incident = get_object_or_404(Incident, id=id)

#     # Only owner or admin can update
#     if request.user != incident.user and request.user.role != "admin":
#         return JsonResponse({"error": "Not allowed"}, status=403)

#     data = json.loads(request.body)
#     incident.description = data.get("description", incident.description)
#     incident.status = data.get("status", incident.status)
#     incident.save()

#     return JsonResponse({"message": "Incident updated"})


# @api_view(['DELETE'])
# @permission_classes([IsAuthenticated, IsAdminUser])  # only admin
# def delete_incident(request, id):
#     incident = get_object_or_404(Incident, id=id)
#     incident.delete()
#     return JsonResponse({"message": "Incident deleted"})

# def get_user_incidents(request, userId):
# 	data=Incident.objects.filter(user__id=userId)
# 	return JsonResponse({"data":list(data.values())},safe=False)

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
import json
from .models import Incidents as Incident,IncidentAssignments
from .models import Locations
from evidence.models import Evidence
from awareness.models import CrimeTypes


# -------------------------------
# GET all incidents (admin sees all, user sees own)
# POST create new incident
# -------------------------------
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def incidents_list(request):
    if request.method == 'POST':
        # Handle FormData
        title = request.POST.get("title") or request.data.get("title")
        description = request.POST.get("description") or request.data.get("description")
        crime_type_name = request.POST.get("crime_type") or request.data.get("crime_type")
        date_occurred = request.POST.get("date_occurred") or request.data.get("date_occurred")
        
        # Get location fields
        location_address = request.POST.get("location_address") or request.data.get("location_address")
        location_city = request.POST.get("location_city") or request.data.get("location_city")
        location_state = request.POST.get("location_state") or request.data.get("location_state")
        location_country = request.POST.get("location_country") or request.data.get("location_country")
        location_zip_code = request.POST.get("location_zip_code") or request.data.get("location_zip_code")

        if not description:
            return JsonResponse({"error": "Description required"}, status=400)

        # Check if location already exists, otherwise create new one
        location = None
        if location_address:
            # Try to find existing location with same address, city, state, and country
            location = Locations.objects.filter(
                address=location_address,
                city=location_city or "Unknown",
                state=location_state or "Unknown",
                country=location_country or "Unknown"
            ).first()
            
            # If not found, create new location
            if not location:
                location = Locations.objects.create(
                    address=location_address,
                    city=location_city or "Unknown",
                    state=location_state or "Unknown",
                    country=location_country or "Unknown",
                    zip_code=location_zip_code or ""
                )

        # Handle crime type - check if exists, otherwise create new
        crime_type = None
        if crime_type_name:
            try:
                # Try to parse as integer ID
                crime_type_id = int(crime_type_name)
                crime_type = get_object_or_404(CrimeTypes, id=crime_type_id)
            except (ValueError, TypeError):
                # It's a string name, find by name (case-insensitive)
                crime_type = CrimeTypes.objects.filter(crime_type_name__iexact=crime_type_name).first()
                
                # If not found, create new crime type
                if not crime_type:
                    crime_type = CrimeTypes.objects.create(
                        crime_type_name=crime_type_name,
                        description=f"Auto-created for {crime_type_name}"
                    )

        # Create incident
        incident = Incident.objects.create(
            user=request.user,
            title=title,
            description=description,
            status="in_progress",
            location=location,
            crime_type=crime_type
        )

        # Handle evidence file uploads
        evidence_files = []
        for key in request.FILES:
            if key.startswith('evidence_'):
                file = request.FILES[key]
                evidence = Evidence.objects.create(
                    incident=incident,
                    submitted_by=request.user,
                    file=file,
                    description=f"Evidence file: {file.name}"
                )
                evidence_files.append(evidence.evidence_id)

        return JsonResponse(
            {
                "message": "Incident created",
                "id": incident.id,
                "incident_id": f"INC-{incident.reported_at.year}-{str(incident.id).zfill(3)}",
                "title": title,
                "location": location.address if location else None,
                "crime_type": crime_type.crime_type_name if crime_type else None,
                "evidence_count": len(evidence_files)
            },
            status=201
        )

    elif request.method == 'GET':
        from django.utils import timezone
        
        if getattr(request.user, "role", None) == "admin":
            incidents = Incident.objects.all()
        else:
            incidents = Incident.objects.filter(user=request.user)

        data = []
        for idx, inc in enumerate(incidents):
            # Get assignment details
            assignment = IncidentAssignments.objects.filter(incident=inc).first()
            
            # Get evidence submissions
            evidences = Evidence.objects.filter(incident=inc).order_by('submitted_at')
            evidence_count = evidences.count()
            
            # Build timeline dynamically
            timeline = []
            
            # 1. Case reported
            timeline.append({
                "date": inc.reported_at.strftime('%Y-%m-%d'),
                "event": f"Incident reported: {inc.title or 'Untitled'}",
                "type": "report"
            })
            
            # 2. Case assigned (if exists)
            if assignment and assignment.assigned_to:
                assigned_date = assignment.assigned_at if assignment.assigned_at else inc.reported_at
                investigator_name = f"{assignment.assigned_to.first_name} {assignment.assigned_to.last_name}".strip()
                if not investigator_name:
                    investigator_name = assignment.assigned_to.email
                timeline.append({
                    "date": assigned_date.strftime('%Y-%m-%d'),
                    "event": f"Case assigned to {investigator_name}",
                    "type": "assign"
                })
            
            # 3. Evidence uploaded (for each evidence)
            for evidence in evidences:
                timeline.append({
                    "date": evidence.submitted_at.strftime('%Y-%m-%d'),
                    "event": f"Evidence uploaded: {evidence.title or evidence.file.name if evidence.file else 'Document'}",
                    "type": "evidence"
                })
            
            # 4. Case resolved (if resolved)
            if inc.status == "resolved":
                resolved_date = assignment.resolved_at if assignment and assignment.resolved_at else timezone.now()
                timeline.append({
                    "date": resolved_date.strftime('%Y-%m-%d'),
                    "event": "Case resolved",
                    "type": "resolved"
                })
            
            # Calculate progress based on timeline and status
            if inc.status == "resolved":
                progress = 100
            elif assignment and assignment.assigned_to:
                progress = 50 + (evidence_count * 10 if evidence_count > 0 else 0)
                progress = min(progress, 95)  # Cap at 95% until resolved
            elif evidence_count > 0:
                progress = 30 + (evidence_count * 5)
                progress = min(progress, 45)
            else:
                progress = 10
            
            # Format status for display
            status_map = {
                "in_progress": "In Progress",
                "assigned": "Assigned",
                "resolved": "Resolved"
            }
            display_status = status_map.get(inc.status, inc.status)
            
            # Calculate last update time
            time_diff = timezone.now() - inc.reported_at
            if time_diff.days == 0:
                if time_diff.seconds < 3600:
                    last_update = f"{time_diff.seconds // 60} minutes ago" if time_diff.seconds >= 60 else "Just now"
                elif time_diff.seconds < 7200:
                    last_update = "1 hour ago"
                else:
                    last_update = f"{time_diff.seconds // 3600} hours ago"
            elif time_diff.days == 1:
                last_update = "1 day ago"
            elif time_diff.days < 7:
                last_update = f"{time_diff.days} days ago"
            elif time_diff.days < 14:
                last_update = "1 week ago"
            else:
                last_update = f"{time_diff.days // 7} weeks ago"
            
            incident_data = {
                "id": f"INC-{inc.reported_at.year}-{str(inc.id).zfill(3)}",
                "caseId": f"CASE-{inc.reported_at.year}-{str(inc.id).zfill(3)}",
                "title": inc.title or "Untitled Incident",
                "type": inc.crime_type.crime_type_name if inc.crime_type else "Unknown",
                "status": display_status,
                "reportedBy": f"{inc.user.first_name} {inc.user.last_name}".strip() or inc.user.email,
                "priority": assignment.priority if assignment else "medium",
                "reportedDate": inc.reported_at.strftime('%Y-%m-%d'),
                "investigator": f"{assignment.assigned_to.first_name} {assignment.assigned_to.last_name}".strip() if assignment and assignment.assigned_to else None,
                "description": inc.description or "No description provided",
                "location": inc.location.address if inc.location else "Not specified",
                "evidenceCount": evidence_count,
                "lastUpdate": last_update,
                "progress": progress,
                "timeline": timeline
            }
            
            # Add resolution if resolved
            if inc.status == "resolved":
                incident_data["resolution"] = "Case resolved successfully"
            
            data.append(incident_data)

        return JsonResponse(data, safe=False)


# -------------------------------
# GET single incident
# PUT update incident
# DELETE remove incident
# -------------------------------
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def incident_detail(request, id):
    incident = get_object_or_404(Incident, id=id)

    if request.method == 'GET':
        if request.user != incident.user and getattr(request.user, "role", None) != "admin":
            return JsonResponse({"error": "Not allowed"}, status=403)

        return JsonResponse({
            "id": incident.id,
            "user": incident.user.email,
            "description": incident.description,
            "status": incident.status,
            "reported_at": incident.reported_at,
            "case_location": incident.location.address if incident.location else None,
            "crime_type": incident.crime_type.crime_type_name if incident.crime_type else None,
        })

    elif request.method == 'PUT':
        if request.user != incident.user and getattr(request.user, "role", None) != "admin":
            return JsonResponse({"error": "Not allowed"}, status=403)

        data = json.loads(request.body)
        incident.description = data.get("description", incident.description)
        incident.status = data.get("status", incident.status)
        incident.save()
        return JsonResponse({"message": "Incident updated"})

    elif request.method == 'DELETE':
        if getattr(request.user, "role", None) != "admin":
            return JsonResponse({"error": "Only admin can delete"}, status=403)

        incident.delete()
        return JsonResponse({"message": "Incident deleted"})


# -------------------------------
# GET incidents for a specific user
# -------------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_incidents(request, id):
    if getattr(request.user, "role", None) != "admin" and request.user.id != id:
        return JsonResponse({"error": "Not allowed"}, status=403)

    data = Incident.objects.filter(user__id=id).values()
    return JsonResponse(list(data), safe=False)

