from django.db import models


class CustomUser(models.Model):
    username = models.CharField(unique=True, max_length=30)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=100)
    known_languages = models.CharField(max_length=100, blank=True, null=True)
    desired_language = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.username


