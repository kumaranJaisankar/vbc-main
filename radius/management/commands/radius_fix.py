from radius.utility_2 import task_radius_fix
from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = 'Compare radius(acctstoptime) and module(monthly_date) databases. If radius time less than out db time. disconnect him'

    def add_arguments(self, parser):
        parser.add_argument('command', nargs='?', type=str, default='check')

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS(f"Customers who are online and acctstarttime < monthly_date {'are going to disconnect(pod)' if options['command']=='fix' else ''}"))
        task_radius_fix(options['command'])
        task_radius_fix(options['command'], expire=True)

