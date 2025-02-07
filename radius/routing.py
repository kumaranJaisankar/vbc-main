from django.urls import re_path, path

from .consumers import *

websocket_urlpatterns = [
    path(r'ws/userlist/<str:roomid>', UserListConsumer.as_asgi()),
]