from datetime import datetime, timedelta
from django.utils import timezone
from .models import Peer
from .serializers import PeerSerializer
from rest_framework.authtoken.models import Token


class PeerService:
    @classmethod
    def find_or_queue_peer(cls, request):
        cls.delete_peer(request.data.get('previous'))
        existing_peer = Peer.objects.filter(
            user__languages__known_language=request.user.languages.desired_language,
            user__languages__desired_language=request.user.languages.known_language,
            last_time_pinged__gte=timezone.now() - timedelta(minutes=1),
            target_peer_id=None
        ).first()

        if existing_peer:
            existing_peer.target_peer_id = request.data.get('peer_id')
            existing_peer.save()
            return cls.update_or_create_peer(request.user, request.data, existing_peer=existing_peer)

        return cls.update_or_create_peer(request.user, request.data)

    @classmethod
    def update_or_create_peer(cls, user, serializer_data, existing_peer=None):
        user_peer = Peer.objects.filter(user=user).first()
        serializer_data['target_peer_id'] = None if not existing_peer else existing_peer.peer_id
        if not user_peer:  # Update existing peer
            peer_serializer = PeerSerializer(data=serializer_data)
        else:  # Create new peer
            peer_serializer = PeerSerializer(instance=user_peer, data=serializer_data, partial=True)

        if existing_peer:
            existing_peer_data = PeerSerializer(existing_peer).data
            existing_peer_data['token'] = Token.objects.filter(user=user).first().key
        else:
            existing_peer_data = None
        if peer_serializer.is_valid():
            peer_serializer.save(user=user, last_time_pinged=timezone.now())

            return cls.success_response(True if existing_peer is not None else False,
                                        existing_peer_data=existing_peer_data if existing_peer else None)
        else:
            return peer_serializer.errors, 400

    @staticmethod
    def success_response(in_call, existing_peer_data=None):
        return existing_peer_data or "You are in the queue for a companion...", 201 if not in_call else 200

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

    @classmethod
    def delete_peer(cls, peer_id):
        print('deleting...')
        peer = Peer.objects.filter(peer_id=peer_id).first()
        connected_peer = Peer.objects.filter(target_peer_id=peer_id).first()

        if peer:
            if connected_peer:
                print('changing ' + str(connected_peer.target_peer_id))
                connected_peer.target_peer_id = None
                connected_peer.save()
            print('deleting ' + str(peer.peer_id))
            peer.delete()
            return "Peer deleted successfully", 205
        else:
            return "Peer not found", 404

    @classmethod
    def ping_peer(cls, peer_id):
        peer = Peer.objects.filter(peer_id=peer_id).first()
        if peer:
            peer.last_time_pinged = timezone.now()
            peer.save()
            return "Peer pinged successfully", 200
        else:
            return "Peer not found", 404

