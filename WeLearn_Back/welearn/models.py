from django.contrib.auth.models import User
from django.db import models


class Languages(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.PROTECT,
        related_name="languages"
    )
    known_language = models.CharField(max_length=50)
    desired_language = models.CharField(max_length=50)

    def __str__(self):
        return str(self.user.username)


class Peer(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="peer"
    )
    peer_id = models.CharField(max_length=50)
    last_time_pinged = models.DateTimeField(auto_now=True)
    in_call = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username}'s Peer"



