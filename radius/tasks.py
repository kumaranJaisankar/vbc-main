from celery import Celery
import socket
from celery.signals import task_failure
from django.core.mail import mail_admins
from .utility_2 import alert, buffer_check, consumption_check, expire_users, plan_monthly_reset, task_radius_fix,deleting_staticip_after_renewal_time,scheduled_push_notification
from django.conf import settings

app = Celery()

@app.task(name='DailyTask')
def daily_task():
    plan_monthly_reset()

@app.task(name='PeriodicWork')
def MyTask():
    alert(0)
    alert(1)
    alert(2)
    # alert(3)
    consumption_check()
    buffer_check()

@app.task(name='expirytask')
def ExpiryTask():
    expire_users()
    scheduled_push_notification()

@app.task(name='RadiusFix')
def radius_fix():
    task_radius_fix(command='fix')
    task_radius_fix(command='fix', expire=True)

@app.task(name='DeletingstaticIp')
def Deleting_staticIp():
    deleting_staticip_after_renewal_time()

@app.task(name='PendingPaymentsUpdation')
def Pending_Payments_Updation():
    updationpayments()

@task_failure.connect()
def celery_task_failure_email(**kwargs):
    if not settings.DEBUG:
        subject = u"[Django][{queue_name}@{host}] Error: Task {sender.name} ({task_id}): {exception}".format(
            queue_name='radius',
            host=socket.gethostname(),
            **kwargs
        )

        message = u"""Task {sender.name} with id {task_id} raised exception:
{exception!r}
Task was called with args: {args} kwargs: {kwargs}.
Error traceback was:
{einfo}""".format(**kwargs)

        mail_admins(subject, message)




