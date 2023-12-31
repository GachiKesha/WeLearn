# Generated by Django 4.2.7 on 2023-11-10 12:51

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('welearn', '0003_languages_user_email_user_password_delete_profile'),
    ]

    operations = [
        migrations.AlterField(
            model_name='languages',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.PROTECT, primary_key=True, serialize=False, to=settings.AUTH_USER_MODEL),
        ),
        migrations.DeleteModel(
            name='User',
        ),
    ]
