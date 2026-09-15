from rest_framework import generics, permissions

from .models import User
from .serializers import RegisterSerializer


class RegisterView(generics.CreateAPIView):

    queryset = User.objects.all()

    serializer_class = RegisterSerializer

    permission_classes = [permissions.AllowAny]

class RegisterView(generics.RetrieveUpdateAPIView):
    """
    API view to retrieve and update the authenticated user's details.
    """
    serializer_class = RegisterSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user