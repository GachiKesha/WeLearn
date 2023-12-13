from datetime import datetime, timedelta
from django.utils import timezone
from .models import Peer
from .serializers import PeerSerializer


class PeerService:
    @classmethod
    def find_or_queue_peer(cls, request):
        # Delete existing peers of user
        Peer.objects.filter(user=request.user).delete()
        # Filter to find companion
        existing_peer = Peer.objects.filter(
            user__languages__known_language=request.user.languages.desired_language,
            user__languages__desired_language=request.user.languages.known_language,
            # delete comment symbol after working ping
            # last_time_pinged__gte=datetime.now() - timedelta(minutes=1),
            in_call=False
        ).first()
        # Check if filter returned non-empty queryset (partner)
        if existing_peer:  # Found.
            existing_peer_serializers = PeerSerializer(existing_peer)
            existing_peer.in_call = True
            existing_peer.save()

            peer_serializer = PeerSerializer(data=request.data)
            if peer_serializer.is_valid():
                peer_serializer.save(user=request.user, last_time_pinged=timezone.now(), in_call=True)
                return existing_peer_serializers.data, 200
            else:
                return peer_serializer.errors, 400

        else:
            peer_serializer = PeerSerializer(data=request.data)
            if peer_serializer.is_valid():
                peer_serializer.save(user=request.user, last_time_pinged=timezone.now(), in_call=False)
                return {"detail": "You are in the queue for a companion..."}, 201
            else:
                return peer_serializer.errors, 400
