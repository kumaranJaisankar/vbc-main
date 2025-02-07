from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.template.loader import get_template
from django.utils.html import strip_tags

def email_noify_plan_expiry_alert(to_email, alert_msg, username, full_name):
    html_content = render_to_string('plan_expiry.html',{ "alert_msg": alert_msg, "username": username, "full_name": full_name})
    text_content = strip_tags(html_content)

    subject = "VBC-Plan Expire Alert"
    msg = ""
    from_email = settings.EMAIL_HOST_USER
    msg = EmailMultiAlternatives(subject, text_content, from_email, [to_email])
    msg.attach_alternative(html_content, "text/html")

    msg.send()

def email_noify_data_usage_alert(to_email, alert_msg, username, full_name):
    html_content = render_to_string('data_usage_90.html',{ "alert_msg": alert_msg, "username": username, "full_name": full_name}) 
    text_content = strip_tags(html_content)

    subject = "VBC-90% Usage Alert"
    msg = ""  
    from_email = settings.EMAIL_HOST_USER
    msg = EmailMultiAlternatives(subject, text_content, from_email, [to_email])
    msg.attach_alternative(html_content, "text/html")
    
    msg.send()


def email_noify_plan_expiried_alert(to_email, alert_msg, username, full_name, office_details):
    html_content = render_to_string('customer_plan_expired.html',{ "alert_msg": alert_msg, "username": username, "full_name": full_name, 'office_data': office_details}) 
    text_content = strip_tags(html_content)  

    subject = "VBC-Plan Expired"
    msg = ""  
    from_email = settings.EMAIL_HOST_USER
    msg = EmailMultiAlternatives(subject, text_content, from_email, [to_email])
    msg.attach_alternative(html_content, "text/html")
    
    msg.send()
