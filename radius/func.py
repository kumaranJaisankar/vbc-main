from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.template.loader import get_template
from django.utils.html import strip_tags

def email_noify_plan_expiry_alert(to_email, alert_msg):
    # alert_msg="Your plan will expire in 3 days. Please recharge before expiry"

    html_content = render_to_string('plan_expiry.html',{ "alert_msg": alert_msg}) 
    text_content = strip_tags(html_content)  
       
    subject = "Your plan is going to expiry"  
    msg = ""  
    from_email = settings.EMAIL_HOST_USER
    msg = EmailMultiAlternatives(subject, text_content, from_email, [to_email])
    msg.attach_alternative(html_content, "text/html")
    
    msg.send()


def email_noify_data_usage_alert(to_email, alert_msg):
    html_content = render_to_string('data_usage_90.html',{ "alert_msg": alert_msg}) 
    text_content = strip_tags(html_content)  
       
    subject = "Your data usage alert"  
    msg = ""  
    from_email = settings.EMAIL_HOST_USER
    msg = EmailMultiAlternatives(subject, text_content, from_email, [to_email])
    msg.attach_alternative(html_content, "text/html")
    
    msg.send()


def email_noify_plan_expiried_alert(to_email, alert_msg):
    html_content = render_to_string('plan_expired.html',{ "alert_msg": alert_msg}) 
    text_content = strip_tags(html_content)  
       
    subject = "Your plan is expired"  
    msg = ""  
    from_email = settings.EMAIL_HOST_USER
    msg = EmailMultiAlternatives(subject, text_content, from_email, [to_email])
    msg.attach_alternative(html_content, "text/html")
    
    msg.send()