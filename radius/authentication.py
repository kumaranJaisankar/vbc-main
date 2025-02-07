from django.contrib.auth import get_user_model
from rest_framework import authentication
from rest_framework import exceptions
from .permissions import get_cache_permissions
User = get_user_model()
 
class CacheAuthentication(authentication.BaseAuthentication):
   def authenticate(self, request):
       token = request.headers.get('Authorization')
       if not token:
           return None
       cache_data = get_cache_permissions(token)
       if not cache_data:
           raise exceptions.AuthenticationFailed('In-valid token. Please login again')
 
       try:
           user, _ = User.objects.get_or_create(username=cache_data['user_id'])
       except User.DoesNotExist:
           raise exceptions.AuthenticationFailed('No such user')
 
       return (user, None)