from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from incidents.models import IncidentAssignments, Incidents
from rest_framework.permissions import IsAuthenticated,IsAdminUser

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def assign_case(request, id, userId):
	try:
		incident = Incidents.objects.get(id=id)
	except Incidents.DoesNotExist:
		return Response({"error": "Incident not found"}, status=status.HTTP_404_NOT_FOUND)

	if incident.status == 'resolved':
		return Response({"error": "Incident is not open for assignment"}, status=status.HTTP_400_BAD_REQUEST)

	if IncidentAssignments.objects.filter(incident=incident).exists():
		return Response({"error": "Incident is already assigned"}, status=status.HTTP_400_BAD_REQUEST)

	try:
		from users.models import CustomUser
		user = CustomUser.objects.get(id=userId)
	except CustomUser.DoesNotExist:
		return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

	assignment = IncidentAssignments.objects.create(incident=incident, assigned_to=user)
	incident.status = 'Assigned'
	incident.save()

	return Response({
		"assignment_id": assignment.id,
		"case_id": incident.id,
		"case_description": incident.description,
		"assigned_to": user.first_name + " " + user.last_name,
	}, status=status.HTTP_201_CREATED)
	

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_assigned_cases_me(request):
	userId = request.user.id
	assigned_cases = IncidentAssignments.objects.filter(assigned_to__id=userId)
	data = [{
		"assignment_id": ac.id,
		"case_id": ac.incident.id,
		"case_description": ac.incident.description,
		"assigned_to": ac.assigned_to.first_name + " " + ac.assigned_to.last_name,
	} for ac in assigned_cases]
	return Response(data) 

@api_view(['POST'])
def reassign_case(request, id, userId):
	try:
		incident = Incidents.objects.get(id=id)
	except Incidents.DoesNotExist:
		return Response({"error": "Incident not found"}, status=status.HTTP_404_NOT_FOUND)

	if incident.status == 'resolved' and incident.status != 'Assigned':
		return Response({"error": "Incident is not open for reassignment"}, status=status.HTTP_400_BAD_REQUEST)

	try:
		from users.models import CustomUser
		user = CustomUser.objects.get(id=userId)
	except CustomUser.DoesNotExist:
		return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

	try:
		assignment = IncidentAssignments.objects.get(incident=incident)
		assignment.assigned_to = user
		assignment.save()
	except IncidentAssignments.DoesNotExist:
		assignment = IncidentAssignments.objects.create(incident=incident, assigned_to=user)

	incident.status = 'Assigned'
	incident.save()

	return Response({
		"assignment_id": assignment.id,
		"case_id": incident.id,
		"case_description": incident.description,
		"assigned_to": user.first_name + " " + user.last_name,
	}, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_unassigned_cases(request):
	unassigned_cases = (Incidents.objects.exclude(status="resolved")).exclude(id__in=IncidentAssignments.objects.values_list('incident_id', flat=True))
	
	data = [{
		"case_id": uc.id,
		"case_description": uc.description,
		"reported_at": uc.reported_at,
	} for uc in unassigned_cases]
	return Response(data)
	
