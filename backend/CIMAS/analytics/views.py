from datetime import datetime
from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from incidents.models import IncidentAssignments,Incidents

@permission_classes([IsAuthenticated])
@api_view(['GET'])
def analytics_summary(request):
	role = request.user.role
	print("User role:", role)
	if role == "investigator":
		total_cases = IncidentAssignments.objects.filter(assigned_to=request.user).count()
		in_progress_cases = IncidentAssignments.objects.filter(assigned_to=request.user, incident__status__in=['in_progress', 'assigned']).count()
		resolved_cases = IncidentAssignments.objects.filter(assigned_to=request.user, incident__status='resolved').count()
		success_rate = (resolved_cases / total_cases * 100) if total_cases > 0 else 0
		cases_this_month = IncidentAssignments.objects.filter(assigned_to=request.user, assigned_at__month=datetime.now().month).count()
		upcoming_deadlines = IncidentAssignments.objects.filter(assigned_to=request.user, assigned_deadline__gte=datetime.now()).order_by('assigned_deadline')[:3]
		return Response({
			"total_assigned_cases": total_cases,
			"in_progress_cases": in_progress_cases,
			"resolved_cases": resolved_cases,
			"success_rate": success_rate,
			"cases_this_month": cases_this_month,
			"upcoming_deadlines": [{
				"title": assignment.incident.title,
				"priority": assignment.priority,
				"deadline": assignment.assigned_deadline,
				"assigned_at": assignment.assigned_at
			} for assignment in upcoming_deadlines]

		})
	return Response({"error": "You do not have permission to view this."}, status=403)

def analytics_trends(request):
	pass

def analytics_hotspots(request):
	pass

def analytics_categories(request):
	pass
