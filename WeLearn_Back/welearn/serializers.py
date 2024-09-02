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
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()
        language_data = validated_data['languages']
        Languages.objects.create(user=user, **language_data)

        return user
    
    def update(self, instance, validated_data):        
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        if 'password' in validated_data:
            instance.set_password(validated_data['password'])
        instance.save()

        return instance


class PeerSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True) 

    class Meta:
        model = Peer
        fields = ['id','user', 'peer_id', 'last_time_pinged', 'target_peer_id']
        read_only_fields = ['user']

    def create(self, validated_data):
        return Peer.objects.create(**validated_data)

    def delete(self, instance):
        # Add your custom delete logic here
        return instance.delete()





