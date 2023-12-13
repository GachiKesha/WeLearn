from django.apps import AppConfig
from django.db import connection


class WelearnConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'welearn'

    def ready(self):
        with connection.cursor() as cursor:
            cursor.execute("DELETE FROM sqlite_sequence WHERE name = 'welearn_peer'")