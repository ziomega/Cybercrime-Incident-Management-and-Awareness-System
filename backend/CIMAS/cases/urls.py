from django.urls import path
from . import views

urlpatterns = [
	path('api/cases/<int:id>/assign', views.assign_case, name='assign_case'),
	path('api/cases/assigned/<int:userId>', views.get_assigned_cases, name='get_assigned_cases'),
	path('api/cases/<int:id>/reassign', views.reassign_case, name='reassign_case'),
	path('api/cases/unassigned', views.get_unassigned_cases, name='get_unassigned_cases'),
]
