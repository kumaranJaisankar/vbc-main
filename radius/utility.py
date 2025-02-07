from django.core.cache import cache
from django.conf import settings
from kafka import KafkaProducer
import requests
from django.contrib.auth import get_user_model
import json


User = get_user_model()

broker=settings.KAFKA_BROKER
def get_producer():
    producer = KafkaProducer(bootstrap_servers=[broker], value_serializer=lambda m: json.dumps(m).encode('ascii'))
    return producer

def publish_message(data, to_addresses=[]):
    producer = get_producer()
    for address in to_addresses:
        producer.send(address, data)
 
def get_cache(token):
   user_id = cache.get(token)
   if user_id:
       permissions = cache.get(user_id)
       if permissions:
           return permissions
   return
 
def set_cache(token, user_id, response):
   cache.set(token, user_id, settings.CACHE_TTL)
   cache.set(user_id, response, settings.CACHE_TTL)
 
def get_cache_permissions(token):
   permissions = get_cache(token)
   if not permissions:
       print(settings.DOMAIN)
       if token:
           response = requests.get(f"{settings.DOMAIN}:7001/accounts/verify/me", headers={
               'Authorization': token
           })
           if response.status_code==200:
               response = response.json()
               set_cache(token, response['user_id'], response)
               User.objects.get_or_create(username=response['user_id'])    # must be async
               # await update_user_record(response['user_id'])
               print('apihit <<<')
               return response
   print('cache >>>')
   return permissions


    