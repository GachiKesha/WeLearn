from django.urls import path
from welearn.views import *

urlpatterns = [
    path('login/', login),
    path('signup/', signup),
    path('test_token/', test_token),
    path('peer/', peer),
    path('ping_peer/<str:peer_id>/', ping_peer),
    path('update_peer/<str:peer_id>/', in_call_func),
    path('get_name/<str:peer_id>/', in_call_func),
]
