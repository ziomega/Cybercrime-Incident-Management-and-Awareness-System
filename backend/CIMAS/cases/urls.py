from django.urls import path
from . import views

urlpatterns = [
	path('api/cases/<int:id>/assign/<int:userId>', views.assign_case, name='assign_case'),
	path('api/cases/assigned/', views.get_assigned_cases_me, name='get_my_assigned_cases'),
	path('api/cases/<int:id>/reassign/<int:userId>', views.reassign_case, name='reassign_case'),
	path('api/cases/unassigned', views.get_unassigned_cases, name='get_unassigned_cases'),
]
