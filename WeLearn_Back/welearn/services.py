from datetime import datetime, timedelta
from django.utils import timezone
from .models import Peer
from .serializers import PeerSerializer
from rest_framework.authtoken.models import Token
import json

from django.db import connection


class PeerService:
    @staticmethod
    def log_to_file(message, filename='messages.log'):
        with open(filename, 'a') as file:
            file.write(f'{message}\n')
            
    @classmethod
    def find_or_queue_peer(cls, request):
        """
        Returns target data if target exist, else puts in queue
        """

        user = request.user
        data = request.data

        with connection.cursor() as cursor:
            cursor.execute("SELECT id, peer_id, user_id, target_peer_id FROM welearn_peer")
            column_names = [description[0] for description in cursor.description]
            cls.log_to_file(' | '.join(column_names))
            for row in cursor.fetchall():
                cls.log_to_file(f'{row}\n')
        #cls.log_to_file(f'content - {json.dumps(data)}')
        
        connected_peer = Peer.objects.filter(target_peer_id=data['previous']).first() 
        print(connected_peer)       
        #cls.log_to_file(f'connected - {json.dumps(PeerSerializer(connected_peer).data, indent=4) if connected_peer else None}')
        
        if connected_peer:
            connected_peer.target_peer_id = None
            connected_peer.save()    

        target_peer = Peer.objects.filter(
            user__languages__known_language=request.user.languages.desired_language,
            user__languages__desired_language=request.user.languages.known_language,
            last_time_pinged__gte=timezone.now() - timedelta(minutes=1),
            target_peer_id=None
        ).first()

        serializer_data = data
        if target_peer:
            target_peer.target_peer_id = data.get('peer_id')
            serializer_data['target_peer_id'] = target_peer.peer_id
            target_peer.save()
        else: 
            serializer_data['target_peer_id'] = None
             
        user_peer = Peer.objects.filter(user=user).first()
        #cls.log_to_file(f'user peer = {user_peer}')
        if not user_peer:  # Create new peer
            peer_serializer = PeerSerializer(data=serializer_data)            
        else:  # Update existing peer
            peer_serializer = PeerSerializer(instance=user_peer, data=serializer_data, partial=True)         
        
        if target_peer:
            return_data = PeerSerializer(target_peer).data
            return_data['username'] = target_peer.user.username
        else:
            return_data = "You are in the queue for a companion..."

        if peer_serializer.is_valid():
            peer_serializer.save(user=user, last_time_pinged=timezone.now())
            
            #cls.log_to_file(f'user - {json.dumps(peer_serializer.data, indent=4)},\n---------------------------------------\ntarget - {json.dumps(return_data, indent=4)}')
            return return_data, 200 if target_peer else 201
        else:
            #cls.log_to_file(f'{peer_serializer.errors}, user = {user}')
            return peer_serializer.errors, 400
      
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
            return None, 205
        else:
            return "Peer not found", 404

    @classmethod
    def ping_peer(cls, peer_id):
        peer = Peer.objects.filter(peer_id=peer_id).first()
        if peer:
            peer.last_time_pinged = timezone.now()
            peer.save()
            return PeerSerializer(peer).data, 200
        else:
            return "Peer not found", 404

