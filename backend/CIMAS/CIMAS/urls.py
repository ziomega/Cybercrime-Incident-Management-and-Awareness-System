"""
URL configuration for CIMAS project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
) #change made here for JWT auth


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('users.urls')), #'' means mounted at root
    path('', include('incidents.urls')),
    path('', include('evidence.urls')),
    path('', include('cases.urls')),
    path('', include('activity_logs.urls')),
    path('', include('analytics.urls')),
    path('', include('awareness.urls')),
]


#looks for this exact variable name to know how to route urls
# urlpatterns = [
#     path("admin/", admin.site.urls),
#     path("api/users/", include("users.urls")),

#      #  CHANGE made 2  JWT authentication endpoints
#     path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
#     path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

#     path("api/incidents/", include("incidents.urls")),
#     path("api/evidence/", include("evidence.urls")),
#     path("api/cases/", include("cases.urls")),
#     path("api/logs/", include("activity_logs.urls")),
#     path("api/analytics/", include("analytics.urls")),
#     path("api/awareness/", include("awareness.urls")),  # Awareness app routes
# ]
# path("url in browser:", include(detailed url patterns in that app))

