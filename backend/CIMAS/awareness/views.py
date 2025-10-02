from django.shortcuts import render

def create_resource(request):
	pass

def get_resources(request):
	pass

def get_resource(request, id):
	pass

def update_resource(request, id):
	pass

def delete_resource(request, id):
	pass

from rest_framework import generics, permissions
from .models import AwarenessResource
from .serializers import AwarenessListSerializer, AwarenessDetailSerializer
from rest_framework.exceptions import PermissionDenied #imports permission denied exception 

# ✅ View class for both List and Create operations
class AwarenessResourceListCreateView(generics.ListCreateAPIView):
    queryset = AwarenessResource.objects.all().order_by("-created_at")
    #sorts the items in descending order acc to date created
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    #permission policy to allow only authenticated users to create, but anyone can read

    def get_serializer_class(self):#chooses serializer based on request method
        if self.request.method == "GET":
            return AwarenessListSerializer #for listing return this 
        return AwarenessDetailSerializer #else for creating return the detailed serializer 

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)  # logged-in user becomes author
		#for create already logged user set as author 

# ✅View Class  Retrieve, Update and Delete
class AwarenessResourceDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = AwarenessResource.objects.all()
    #looks up objects by primary key
    serializer_class = AwarenessDetailSerializer
    #list serializer is not req here 
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    #same permission policy as above

    def perform_update(self, serializer):
        if self.request.user == serializer.instance.author or self.request.user.is_staff:
            serializer.save()
        else:
            raise PermissionDenied("You are not allowed to update this resource.")
	#the function checks if the user making the request is the author of the resource or a staff member.
     # if not it denies it by HHTP 403 Forbidden response
    def perform_destroy(self, instance):
        if self.request.user == instance.author or self.request.user.is_staff:
            instance.delete()
        else:
            raise PermissionDenied("You are not allowed to delete this resource.")
	#similar to update but for delete