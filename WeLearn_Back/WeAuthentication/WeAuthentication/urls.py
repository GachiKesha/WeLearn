from django.urls import path
from welearn.views import login, signup, test_token, peer, ping_peer

urlpatterns = [
    path('login/', login),
    path('signup/', signup),
    path('test_token/', test_token),
    path('peer/', peer),
   path('ping_peer/<int:id>/', ping_peer),
]
