from django.shortcuts import render
from django.core.exceptions import PermissionDenied

from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from .filters import PropertyFilter

from .models import Property, PropertyImage
from .serializers import PropertyImageSerializer, PropertyListSerializer, PropertyDetailSerializer, PropertyCreateUpdateSerializer, PropertyImageUploadSerializer

class PropertyListView(generics.ListAPIView):
    """
    API view to list all properties. It uses a lightweight serializer to reduce payload size.
    """
    # queryset = Property.objects.all()
    queryset = Property.objects.filter(is_available=True)  # Only list properties that are available
    serializer_class = PropertyListSerializer
    permission_classes = [permissions.AllowAny]  # Allow any user to access this view
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = PropertyFilter
    ordering_fields = ["price", "created_at", "area_sqft"]

class PropertyDetailView(generics.RetrieveAPIView):
    """
    API view to retrieve a single property by its ID. It uses a detailed serializer to provide comprehensive information.
    """
    queryset = Property.objects.all()
    serializer_class = PropertyDetailSerializer
    permission_classes = [permissions.AllowAny]  # Allow any user to access this view without login
    lookup_field = 'slug'  # Use slug for lookup instead of the default 'pk'

class PropertyCreateView(generics.CreateAPIView):
    """
    API view to create a new property. It uses a serializer that includes all necessary fields for property creation.
    """
    queryset = Property.objects.all()
    serializer_class = PropertyCreateUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]  # Only authenticated users can create properties

    def perform_create(self, serializer):
        # Automatically set the owner of the property to the currently logged-in user
        serializer.save(owner=self.request.user)

class PropertyUpdateView(generics.UpdateAPIView):
    """
    API view to update an existing property. It uses a serializer that includes all necessary fields for property updates.
    """
    queryset = Property.objects.all()
    serializer_class = PropertyCreateUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]  # Only authenticated users can update properties
    lookup_field = "slug"  # Use slug for lookup instead of the default 'pk'

    def perform_update(self, serializer):
        # Ensure that the owner of the property is the currently logged-in user before allowing updates
        if self.request.user != serializer.instance.owner:
            raise PermissionDenied("You do not have permission to edit this property.")
        serializer.save()

class PropertyImageUploadView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, slug):
        try:
            property_obj = Property.objects.get(slug=slug)
            print("property_obj: ", property_obj)
            print("property_obj.owner: ", property_obj.owner)

        except Property.DoesNotExist:
            return Response({"error": "Property Not Found"}, status=status.HTTP_404_NOT_FOUND)

        # Only owner can upload image
        if property_obj.owner != request.user:
            return Response(
                {"error": "You are not owner of this property"},
                status=status.HTTP_403_FORBIDDEN
            )

        # Accept the plural key for multiple files and the singular key for one file.
        images = request.FILES.getlist("images") or request.FILES.getlist("image")
        if not images:
            return Response({
                "error": "No image was sent. Use multipart/form-data with a file field named 'image' or 'images'."
            },
            status=status.HTTP_400_BAD_REQUEST
            )

        created_images = []
        print(created_images)
        for img in images:
            property_image = PropertyImage.objects.create(property=property_obj, image=img)
            created_images.append(property_image)

        serializer = PropertyImageUploadSerializer(created_images, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class PropertyDeleteView(generics.DestroyAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertyDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = "slug"

    def perform_destroy(self, instance):
        if instance.owner != self.request.user:
            raise permissions.PermissionDenied("You are the owner of theis Property")
        instance.delete()

# owner can see his all property even owner is inactive or unavailable/sold
class MyPropertiesListView(generics.ListAPIView):
    serializer_class = PropertyListSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = PropertyFilter
    ordering_fields = ["price", "created_at", "area_sqft"]

    def get_queryset(self):
        return Property.objects.filter(owner=self.request.user)
    