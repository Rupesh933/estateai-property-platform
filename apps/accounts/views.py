from django.shortcuts import render
from django.contrib.auth.models import User
from .serializers import RegisterSerializer
from rest_framework import generics, permissions

class RegisterView(generics.CreateAPIView):
    """
    API view to handle user registration. It uses the RegisterSerializer to validate and create new users.
    """
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny] # Allow any user (authenticated or not) to access this view for registration.