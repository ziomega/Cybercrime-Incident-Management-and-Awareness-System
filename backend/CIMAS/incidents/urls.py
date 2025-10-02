from django.urls import path
from . import views

urlpatterns = [
    path('api/incidents', views.incidents_list, name='incidents_list'),  # GET + POST
    path('api/incidents/<int:id>', views.incident_detail, name='incident_detail'),  # GET + PUT + DELETE
    path('api/incidents/user/<int:id>', views.get_user_incidents, name='get_user_incidents'),
]