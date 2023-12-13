from datetime import timedelta, datetime

from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone

from django.shortcuts import get_object_or_404
from .models import User, Peer
from rest_framework.authtoken.models import Token
from .services import PeerService
from .serializers import UserSerializer, PeerSerializer


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


@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def peer(request):
    result = PeerService.find_or_queue_peer(request.user)
    if result:
        return Response(result[0], status=result[1])
    else:
        return Response({"error": "Something went wrong"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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
