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
from .models import Incidents as Incident
from .models import Locations
from awareness.models import CrimeTypes


# -------------------------------
# GET all incidents (admin sees all, user sees own)
# POST create new incident
# -------------------------------
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def incidents_list(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        description = data.get("description")
        location_id = data.get("location")   # expecting integer ID
        crime_type_id = data.get("crime_type")

        if not description:
            return JsonResponse({"error": "Description required"}, status=400)

        # fetch related objects if IDs provided
        location = None
        crime_type = None
        if location_id:
            location = get_object_or_404(Locations, id=location_id)
        if crime_type_id:
            crime_type = get_object_or_404(CrimeTypes, id=crime_type_id)

        incident = Incident.objects.create(
            user=request.user,
            description=description,
            status="in_progress",  # ✅ use this instead of "pending"
            location=location,
            crime_type=crime_type
        )

        return JsonResponse(
            {
                "message": "Incident created",
                "id": incident.id,
                "location": location.address if location else None,
                "crime_type": crime_type.crime_type_name if crime_type else None,
            },
            status=201
        )

    elif request.method == 'GET':
        if getattr(request.user, "role", None) == "admin":
            incidents = Incident.objects.all()
        else:
            incidents = Incident.objects.filter(user=request.user)

        data = [{
            "id": inc.id,
            "user": inc.user.email,
            "description": inc.description,
            "status": inc.status,
            "reported_at": inc.reported_at.isoformat(),
            "location": inc.location.address if inc.location else None,
            "crime_type": inc.crime_type.crime_type_name if inc.crime_type else None,
        } for inc in incidents]

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

