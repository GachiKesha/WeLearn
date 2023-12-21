from datetime import datetime, timedelta
from django.utils import timezone
from .models import Peer
from .serializers import PeerSerializer
from rest_framework.authtoken.models import Token


class PeerService:
    @classmethod
    def find_or_queue_peer(cls, request):
        existing_peer = Peer.objects.filter(
            user__languages__known_language=request.user.languages.desired_language,
            user__languages__desired_language=request.user.languages.known_language,
            last_time_pinged__gte=timezone.now() - timedelta(minutes=1),
            in_call=False
        ).first()

        if existing_peer:
            return cls.update_or_create_peer(request.user, request.data, existing_peer=existing_peer)
        else:
            return cls.update_or_create_peer(request.user, request.data)

    @classmethod
    def update_or_create_peer(cls, user, serializer_data, existing_peer=None):
        user_peer = Peer.objects.filter(user=user).first()
        if not user_peer:  # Update existing peer
            peer_serializer = PeerSerializer(data=serializer_data)
        else:  # Create new peer
            peer_serializer = PeerSerializer(instance=user_peer, data=serializer_data, partial=True)

        if existing_peer:
            existing_peer_id = existing_peer.peer_id
        else:
            existing_peer_id = None
        if peer_serializer.is_valid():
            peer_serializer.save(user=user, last_time_pinged=timezone.now())
            return cls.success_response(existing_peer is not None, existing_peer_id=existing_peer_id)
        else:
            return peer_serializer.errors, 400

    @staticmethod
    def success_response(in_call, existing_peer_id=None):
        return existing_peer_id or "You are in the queue for a companion...", 200 if in_call else 201

    @staticmethod
    def update_peer(peer_id, in_call):
        peer = Peer.objects.filter(peer_id=peer_id).first()
        if peer:
            peer.in_call = in_call
            peer.save()
            return "OK.", 200
        else:
            return "No such peer", 404

    @staticmethod
    def get_name(peer_id):
        peer = Peer.objects.filter(peer_id=peer_id).first()
        if peer:
            return peer.user.username, 200
        else:
            return "No such peer", 404

    @classmethod
    def check_disconnected_peers(cls):
        # Get a list of disconnected peers
        disconnected_peers = Peer.objects.filter(
            last_time_pinged__lte=timezone.now() - timedelta(minutes=1),
            in_call=True
        )

        # Update the status of disconnected peers
        for peer in disconnected_peers:
            peer.in_call = False
            peer.save()

    @staticmethod
    def delete_peer(cls, peer_id):
        peer = Peer.objects.filter(peer_id=peer_id).first()
        if peer:
            peer.delete()
            return "Peer deleted successfully", 205
        else:
            return "Peer not found", 404

    @staticmethod
    def ping_peer(cls, peer_id):
        peer = Peer.objects.filter(peer_id=peer_id).first()
        if peer:
            peer.last_time_pinged = timezone.now()
            peer.save()
            return "Peer pinged successfully", 200
        else:
            return "Peer not found", 404

