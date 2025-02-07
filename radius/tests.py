from django.test import TestCase
from radius.utility_2 import packet_of_disconnect

class PODTestCase(TestCase):
    def test_pod(self):
        self.assertEqual(packet_of_disconnect('KKD0000001'), """
        hello there
        """)