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
    id = models.AutoField(primary_key=True, default=1, editable=False)






    def __str__(self):
        return str(self.user.username)