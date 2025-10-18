from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
	TokenObtainPairView,
	TokenRefreshView,
)

urlpatterns = [
	path('api/auth/register', views.register, name='register'),
	path('api/auth/login', views.login, name='login'),
	path('api/auth/logout', views.logout, name='logout'),
	path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
	path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
	path('api/users/me', views.get_me__update_me, name='get_me'),
	path('api/users/me', views.get_me__update_me, name='update_me'),
	path('api/users', views.get_users, name='get_users'),
	path('api/users/<int:id>', views.manage_user, name='get_user'),
	path('api/users/<int:id>', views.manage_user, name='update_user'),
	path('api/users/<int:id>', views.manage_user, name='delete_user'),
]
