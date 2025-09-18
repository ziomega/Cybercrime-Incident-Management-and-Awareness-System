from django.urls import path
from . import views

urlpatterns = [
	path('api/analytics/summary', views.analytics_summary, name='analytics_summary'),
	path('api/analytics/trends', views.analytics_trends, name='analytics_trends'),
	path('api/analytics/hotspots', views.analytics_hotspots, name='analytics_hotspots'),
	path('api/analytics/categories', views.analytics_categories, name='analytics_categories'),
]
