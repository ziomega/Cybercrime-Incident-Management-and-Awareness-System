from django.urls import path
from .views import AwarenessResourceListCreateView, AwarenessResourceDetailView

urlpatterns = [
    # List all resources OR create a new one
    path("api/awareness/resources/", AwarenessResourceListCreateView.as_view(), name="resource_list_create"), 
	#this path is for both listing and creating resources
    #when the request matches this path, it invokes the respective view 
    #names igves this route a name uesd for reversing urls 
    
    # Get details of one resource / update it / delete it
    path("api/awareness/resources/<int:pk>/", AwarenessResourceDetailView.as_view(), name="resource_detail"),
    #this path is for getting details of one resource, updating it or deleting it
	#here <int:pk? captures a segment of url and passes it as primary key 
	#rest details same as above 
]	
#FIX NO 1 DONE REMOVED FULL PATH OF THE URL 


#urlpatterns is the standard variable Django looks inside in a urls.py file 
# it is a list of URL pattern objects 

