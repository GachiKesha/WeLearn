from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from django.shortcuts import get_object_or_404
from .models import User
from rest_framework.authtoken.models import Token
from .services import PeerService
from .serializers import UserSerializer


@api_view(['POST'])
def login(request):
    user = get_object_or_404(User, email=request.data['email'])
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
            return Response({"email": "User with this email already exists"}, 
                            status=status.HTTP_400_BAD_REQUEST)

        user = serializer.save()
        token = Token.objects.create(user=user)
        return Response({"token": token.key, "user": serializer.data})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def peer(request):
    result = PeerService.find_or_queue_peer(request)
    if result:
        return Response(result[0], status=result[1])
    else:
        return Response("Something went wrong", status=500)


@api_view(['POST'])
def ping_peer(request, peer_id):
    result = PeerService.delete_peer(peer_id) if request.data.get('delete') \
        else PeerService.ping_peer(peer_id)
    if result:
        return Response(result[0], status=result[1])
    else:
        return Response("Something went wrong", status=500)


@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def test_token(request):
    print(request.user)
    return Response("passed!")
