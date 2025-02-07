from django.core.management.base import BaseCommand
from django.conf import settings
from kafka import KafkaConsumer
import json
from django.core.cache import cache
from radius.utility_2 import packet_of_disconnect
 
subtopic = settings.KAFKA_TOPIC
broker = settings.KAFKA_BROKER
consumer = KafkaConsumer(subtopic, bootstrap_servers=broker, value_deserializer=lambda m: json.loads(m.decode('ascii')))
 
class Command(BaseCommand):
    help = 'Kafka: Communication with other microservices'
    def handle(self, *args, **kwargs):
        for message in consumer:
            data = message.value
            print(data)
            event = data.pop('event')
            if event=='permission_update':
                self.permission_update(data)
            elif event=='packet_of_disconnect':
                packet_of_disconnect(data['username'])

    def permission_update(self, users_data):
        for data in users_data['response']:
            cache.set(data['user_id'], data, data.get('ttl') if data.get('ttl') else settings.CACHE_TTL)



