from django.apps import AppConfig


class WelearnConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'welearn'

    def ready(self):
        from .models import Peer
        Peer.objects.all().delete()  # Auto-clear peers, for now
