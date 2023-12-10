from datetime import timedelta, datetime

from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone

from django.shortcuts import get_object_or_404
from welearn.models import User, Peer
from rest_framework.authtoken.models import Token

from welearn.serializers import UserSerializer, PeerSerializer




@api_view(['POST'])
def login(request):
    user = get_object_or_404(User, email=request.data['username'])
    if not user.check_password(request.data['password']):
        return Response({"Unable to find email and password"}, status=status.HTTP_401_UNAUTHORIZED)
    token, created = Token.objects.get_or_create(user=user)
    serializer = UserSerializer(instance=user)
    return Response({"token": token.key, "user": serializer.data})
  
  
@api_view(['POST'])
def signup(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        existing_user = User.objects.filter(email=request.data['email']).first()
        if existing_user:
            return Response({"detail": "User with this email already exists"}, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.save()
        token = Token.objects.create(user=user)
        return Response({"token": token.key, "user": serializer.data})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Debug purposes
@api_view(['GET'])
def get_user(request, id):
    try:
        user = User.objects.get(id=id)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = UserSerializer(user)
    return Response(serializer.data)


@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def peer(request):
    existing_peer = Peer.objects.filter(
        known_lang=request.user.languages.desired_language,
        desired_lang=request.user.languages.known_language,
        last_time_pinged__gte=datetime.now() - timedelta(minutes=1),
        in_call=False).first()

    if existing_peer:
        existing_peer_serializers = PeerSerializer(existing_peer)
        existing_peer.in_call = True
        existing_peer.save()
        return Response(existing_peer_serializers.data, status=status.HTTP_200_OK)
    else:
        peer_serializer = PeerSerializer(data=request.data)
        if peer_serializer.is_valid():
            peer_serializer.save(user=request.user, last_time_pinged__gte=datetime.now(), in_call=False)
            return Response(peer_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(peer_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def ping_peer(request, id):
    try:
        peer = Peer.objects.get(id=id)
    except Peer.DoesNotExist:
        return Response({"detail": "Peer not found"}, status=status.HTTP_404_NOT_FOUND)
      
    peer.last_time_pinged = timezone.now()
    peer.save()
    return Response({"detail": "Peer pinged successfully"}, status=status.HTTP_200_OK)



@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def test_token(request):
    print(request.user)
    return Response("passed!")
