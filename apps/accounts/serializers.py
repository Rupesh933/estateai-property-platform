from rest_framework import serializers
from django.contrib.auth.models import User

class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration. It handles the creation of new users and ensures that the password is write-only
    """

    password = serializers.CharField(write_only=True, required=True, min_length=8, style={"input_type": "password"})

    class Meta:
        model = User
        fields = ("id", "username", "email", "password")


    def create(self, validated_data):
        """
        Create a new user instance with the provided validated data. The password is hashed before saving.
        """
        user = User.objects.create_user(
            username = validated_data['username'],
            email = validated_data["email"],
            password = validated_data["password"]
        )

        return user