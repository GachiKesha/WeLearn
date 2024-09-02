from datetime import timedelta
from django.utils import timezone
from .models import Peer
from .serializers import PeerSerializer
from rest_framework.authtoken.models import Token
from rest_framework import status


class PeerService:            
    @classmethod
    def find_or_queue_peer(cls, request) -> tuple[dict | str, int]:
        """
        Returns target data if target exist, else puts in queue
        """

        user = request.user
        data = request.data      
           
        user_peer = Peer.objects.filter(user=user).first()
                
        if not user_peer:  # Create new or update peer
            peer_serializer = PeerSerializer(data=data)            
        else:  
            connected_peer = Peer.objects.filter(target_peer_id=user_peer.peer_id).first() 
            if connected_peer:
                connected_peer.target_peer_id = None
                connected_peer.save()          
        
            peer_serializer = PeerSerializer(instance=user_peer, data=data, partial=True)
            
        target_peer = Peer.objects.filter(
            user__languages__known_language=user.languages.desired_language,
            user__languages__desired_language=user.languages.known_language,
            last_time_pinged__gte=timezone.now() - timedelta(minutes=1),
            target_peer_id=None
        ).first()

        if target_peer:
            target_peer.target_peer_id = data.get('peer_id')
            target_peer_id = target_peer.peer_id
            target_peer.save()
            return_data = PeerSerializer(target_peer).data
            return_data['username'] = target_peer.user.username
        else:
            target_peer_id = None
            return_data = "You are in the queue for a companion..."
             
        if peer_serializer.is_valid():
            peer_serializer.save(user=user, 
                                 last_time_pinged=timezone.now(), 
                                 target_peer_id=target_peer_id)
            return return_data, status.HTTP_200_OK if target_peer else status.HTTP_201_CREATED
        else:            
            return peer_serializer.errors, status.HTTP_400_BAD_REQUEST
      
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
    def delete_peer(cls, peer_id) -> tuple[str | None, int]:
        """
        Deletes peer and disconnects connected peer if there is any
        """

        peer = Peer.objects.filter(peer_id=peer_id).first()
        connected_peer = Peer.objects.filter(target_peer_id=peer_id).first()

        if peer:
            if connected_peer:
                connected_peer.target_peer_id = None
                connected_peer.save()
            peer.delete()
            """
            with connection.cursor() as cursor:
                cursor.execute("SELECT id, peer_id, user_id, target_peer_id FROM welearn_peer")
                column_names = [description[0] for description in cursor.description]
                cls.log_to_file(' | '.join(column_names))
                for row in cursor.fetchall():
                    cls.log_to_file(f'{row}\n')
            """
            return None, status.HTTP_205_RESET_CONTENT
        else:
            return "Peer not found", status.HTTP_404_NOT_FOUND

    @classmethod
    def ping_peer(cls, peer_id):
        peer = Peer.objects.filter(peer_id=peer_id).first()
        if peer:
            peer.last_time_pinged = timezone.now()
            peer.save()
            return PeerSerializer(peer).data, 200
        else:
            return "Peer not found", 404

    @staticmethod
    def log_to_file(message, filename='messages.log'):
        with open(filename, 'a') as file:
            file.write(f'{message}\n')
