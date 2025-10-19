from django.urls import path
from . import views

urlpatterns = [
	path('api/cases/<int:id>/assign/<int:userId>', views.assign_case, name='assign_case'),
	path('api/cases/assigned/', views.get_assigned_cases_me, name='get_my_assigned_cases'),
	path('api/cases/<int:id>/reassign/<int:userId>', views.reassign_case, name='reassign_case'),
	path('api/cases/unassigned', views.get_unassigned_cases, name='get_unassigned_cases'),
    #edited changes below
    path('api/cases/<int:id>/', views.get_case_details, name='get_case_details'),
    path('api/cases/<int:id>/update/', views.update_case, name='update_case'),


]
