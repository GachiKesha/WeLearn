from django.urls import path
from welearn.views import login, signup,  test_token, peer, ping_peer

urlpatterns = [
    path('login/', login),
    path('signup/', signup),
    # path('get_user/<int:id>/', get_user),
    path('test_token/', test_token),
    path('peer/', peer),
    path('ping_peer/<str:peer_id>/', ping_peer, name='ping_peer'),
    # path('close_peer/<int:id>/', close_peer),
    # path('delete_peer/<int:id>/', delete_peer),
    # path('peer_info/<int:id>/', peer_info),
]
