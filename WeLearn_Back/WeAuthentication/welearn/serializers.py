from rest_framework import serializers
from .models import User, Languages

class LanguagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Languages
        fields = ['known_language', 'desired_language']

class UserSerializer(serializers.ModelSerializer):
    languages = LanguagesSerializer(many=False, read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email', 'languages']

    def create(self, validated_data):
        languages_data = validated_data.pop('languages', [])
        user = User.objects.create(**validated_data)
        for language_data in languages_data:
            Languages.objects.create(user=user, **language_data)
        return user
