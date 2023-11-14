from rest_framework import serializers
from .models import User, Languages

class LanguagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Languages
        fields = ['known_language', 'desired_language']

class UserSerializer(serializers.ModelSerializer):
    languages = LanguagesSerializer(many=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email', 'languages']

    def create(self, validated_data):
        user = User.objects.create(username=validated_data['username'])
        user.set_password(validated_data['password'])
        user.save()

        language_data = validated_data['languages']
        Languages.objects.create(user=user, **language_data)

        return user
