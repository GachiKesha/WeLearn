from rest_framework import serializers
from .models import User, Languages, Peer


class LanguagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Languages
        fields = ['known_language', 'desired_language']


class UserSerializer(serializers.ModelSerializer):
    languages = LanguagesSerializer()

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email', 'languages']

    def create(self, validated_data):
        user = User.objects.create(username=validated_data['username'],
                                   email=validated_data['email'])
        user.set_password(validated_data['password'])
        user.save()
        language_data = validated_data['languages']
        Languages.objects.create(user=user, **language_data)

        return user


class PeerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Peer
        fields = ['id', 'peer_id']

    def create(self, validated_data):
        return Peer.objects.create(**validated_data)








