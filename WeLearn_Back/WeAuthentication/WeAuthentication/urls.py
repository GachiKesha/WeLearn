from django.urls import path
from welearn.views import login, signup, test_token, peer, ping_peer, close_peer, delete_peer, peer_info

urlpatterns = [
    path('login/', login),
    path('signup/', signup),
    path('test_token/', test_token),
    path('peer/', peer),
    path('ping_peer/<int:id>/', ping_peer),
    path('close_peer/<int:id>/', close_peer),
    path('delete_peer/<int:id>/', delete_peer),
    path('peer_info/<int:id>/', peer_info),
]
