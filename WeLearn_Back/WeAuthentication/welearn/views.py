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

from django.db.models import Q


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
def peer(request):
    known_lang = request.data.get('known_lang', None)
    desired_lang = request.data.get('desired_lang', None)
    last_time_pinged = request.data.get('last_time_pinged', None)

    existing_peer = Peer.objects.filter(
        (Q(known_lang=desired_lang,
           desired_lang=known_lang)),
        last_time_pinged__gte=last_time_pinged,
        in_call=False).first()

    if existing_peer:
        existing_peer_serializers = PeerSerializer(existing_peer)
        existing_peer.in_call = True
        existing_peer.save()
        return Response(existing_peer_serializers.data, status=status.HTTP_200_OK)
    else:
        peer_serializer = PeerSerializer(data=request.data)
        if peer_serializer.is_valid():
            peer_serializer.save()
            return Response(peer_serializer.data, status=status.HTTP_201_CREATED)
          
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


# Next call
@api_view(['POST'])
def close_peer(request, id):
    try:
        peer = Peer.objects.get(id=id)
    except Peer.DoesNotExist:
        return Response({"detail": "Peer not found"}, status=status.HTTP_404_NOT_FOUND)
      
    peer.in_call = False
    peer.last_time_pinged = timezone.now()
    peer.save()
    return Response({"detail": "Peer closed successfully"}, status=status.HTTP_200_OK)


# Exit call
@api_view(['DELETE'])
def delete_peer(request, id):
    try:
        peer = Peer.objects.get(id=id)
    except Peer.DoesNotExist:
        return Response({"detail": "Peer not found"}, status=status.HTTP_404_NOT_FOUND)

    peer.delete()
    return Response({"detail": "Peer deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


# debug purposes
@api_view(['GET'])
def peer_info(request, id):
    try:
        peer = Peer.objects.get(id=id)
    except Peer.DoesNotExist:
        return Response({"detail": "Peer not found"}, status=status.HTTP_404_NOT_FOUND)

    peer_serializer = PeerSerializer(peer)
    return Response(peer_serializer.data, status=status.HTTP_200_OK)
    peer.last_time_pinged = timezone.now()
    peer.save()
    return Response({"detail": "Peer pinged successfully"}, status=status.HTTP_200_OK)


@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def test_token(request):
    return Response("passed!")
