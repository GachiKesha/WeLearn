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
    user = get_object_or_404(User, username=request.data['username'])
    if not user.check_password(request.data['password']):
        return Response({"detail":"Not found."},status=status.HTTP_404_NOT_FOUND)
    token, created = Token.objects.get_or_create(user=user)
    serializer = UserSerializer(instance=user)
    return Response({"token": token.key, "user": serializer.data})

@api_view(['POST'])
def signup(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token = Token.objects.create(user=user)
        return Response({"token": token.key, "user": serializer.data})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def peer(request):
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



@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def test_token(request):
    return Response("passed!")