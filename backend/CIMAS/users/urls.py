from django.urls import path
from . import views

urlpatterns = [
	path('api/auth/register', views.register, name='register'),
	path('api/auth/login', views.login, name='login'),
	path('api/auth/logout', views.logout, name='logout'),
	path('api/users/me', views.get_me, name='get_me'),
	path('api/users/me', views.update_me, name='update_me'),
	path('api/users', views.get_users, name='get_users'),
	path('api/users/<int:id>', views.get_user, name='get_user'),
	path('api/users/<int:id>', views.update_user, name='update_user'),
	path('api/users/<int:id>', views.delete_user, name='delete_user'),
]
