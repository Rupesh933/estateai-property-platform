from rest_framework import serializers
from .models import Property, PropertyImage

class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ['id', 'image']

class PropertyListSerializer(serializers.ModelSerializer):

    thumbnail = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = [
            'id',
            'title',
            'slug',
            'property_type',
            'listing_type',
            'price',
            'city',
            'bedrooms',
            'bathrooms',
            'is_available',
            'thumbnail'
        ]

    def get_thumbnail(self, obj):
        first_image = obj.images.first()

        if first_image:
            request = self.context.get('request')

            if request:
                return request.build_absolute_uri(first_image.image.url)

            return first_image.image.url

        return None

class PropertyDetailSerializer(serializers.ModelSerializer):
    """
    Detailed serializer for a single property. It includes all fields and related images.
    """
    images = PropertyImageSerializer(many=True, read_only=True)
    owner_username = serializers.CharField(source='owner.username', read_only=True)  # Get the username attribute from the owner object, not directly from the property model.

    class Meta:
        model = Property
        fields = [
            'id', 'title', 'slug', 'description', 'property_type', 'listing_type',
            'price', 'area_sqft', 'bedrooms', 'bathrooms',
            'city', 'address', 'owner_username', 'images',
            'is_available', 'created_at', 'updated_at'
        ]

class PropertyCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating and updating properties. It includes all fields except for the owner, which is set automatically.
    """
    class Meta:
        model = Property
        fields = [
            "title", "description", "property_type", "listing_type",
            "price", "area_sqft", "bedrooms", "bathrooms",
            "city", "address", "is_available"
        ]


# PropertyImageSerializer and this class is same used case but for naming we create two serializer
class PropertyImageUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ["id", "image"]