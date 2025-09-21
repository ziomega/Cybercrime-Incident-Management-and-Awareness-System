from django.urls import path
from . import views

urlpatterns = [
	path('api/awareness/resources', views.create_resource, name='create_resource'),
	path('api/awareness/resources', views.get_resources, name='get_resources'),
	path('api/awareness/resources/<int:id>', views.get_resource, name='get_resource'),
	path('api/awareness/resources/<int:id>', views.update_resource, name='update_resource'),
	path('api/awareness/resources/<int:id>', views.delete_resource, name='delete_resource'),
]
