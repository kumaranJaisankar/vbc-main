from django.conf import settings
import json
from django.db import connections
import requests
from radius.utility_2 import *

sms_api_id = settings.SMS_API_ID
sms_api_password = settings.SMS_API_PASSWORD
sender = settings.SMS_API_SENDER

def dictfetchall(cursor):
    columns = [col[0] for col in cursor.description]
    return [
        dict(zip(columns, row))
        for row in cursor.fetchall()
    ]

def select(query, database='customer'):
    with connections[database].cursor() as cursor:
        cursor.execute(query)
        return dictfetchall(cursor)

def select2(query, database='admin'):
    with connections[database].cursor() as cursor:
        cursor.execute(query)
        return dictfetchall(cursor)   

def push_notifications(username,title_message,body):
    payload={
    "to": f"/topics/{username}",
    "data": {
            "title":f"{title_message}",
            "body": f"{body}"
            }
    }
    url = "https://fcm.googleapis.com/fcm/send"
    headers = {
        "Content-Type": "application/json",
        "Authorization": "key=AAAAYmmXuqo:APA91bG4NescgH_Od_y2bYajzmf8_O2Zn6UB9k7tF7oXG8Q5AKCgrW7cOkaNo4nRK2AZm8de-A0xpWiQnuabqKvsE0kUG2wUR5FRPa5v7amPaYzEXauF1yyg2Ip6Lk-WavjlnHNSWSp8"
    }
    payload_json = json.dumps(payload)
    response = requests.request(
        "POST", url, headers=headers, data=payload_json)
    print(response)
    print(response.content)         
        
 
support_no = "(0891) 6677-123, 6677-124"
def send_sms_notify(msg, mobile, tid):
    payload={
    "api_id":sms_api_id,
    "api_password":sms_api_password,
    "sms_type":"Transactional",
    "sms_encoding":"text",
    "sender":sender,
    "number":mobile,
    "message":msg,
    "template_id":tid}

    url = "https://www.bulksmsplans.com/api/send_sms"

    headers = {
                    'Content-Type': 'application/json; charset=utf-8'
                }

    payload_json = json.dumps(payload)
    try:
        response = requests.request(
            "POST", url, headers=headers, data=payload_json)
        # print("response of sending sms",response.content)
        response_content_decoded = response.content.decode('utf-8')
        response_json = json.loads(response_content_decoded)
        code = response_json['code']
        if code == 200:
            return True
        else:
            return response_json
    except Exception as e:
        print("Error occured while sending sms",e)






def sms_flag(cstmr_username):
    flags_query=f"""select cc.sms_flag cstmr_flag,ff2.sms franchise_flag from admin.accounts_user au 
    join customer.customers_customer cc 
    on cc.user_id =au.id 
    join admin.franchise_franchiseareas ff 
    on ff.area_id =cc.area_id 
    join admin.franchise_franchise ff2 
    on ff2.id =ff.franchise_id 
    where au.username ='{cstmr_username}'"""
    # print(">>>>flag_query",flags_query)
    flags=select(flags_query,database='customer')[0]
    branch_flag_query =f"""select cc.sms_flag cstmr_flag,ab.sms  branch_flag from admin.accounts_user au 
    join customer.customers_customer cc 
    on cc.user_id =au.id 
    join admin.accounts_area aa 
    on aa.id = cc.area_id 
    join admin.accounts_zone az 
    on az.id = aa.zone_id 
    join admin.accounts_branch ab 
    on ab.id = az.branch_id 
    where au.username ='{cstmr_username}'"""
   
    # print(">>>>>>branch>>>",branch_flag_query)
    branch_flags=select(branch_flag_query,database='customer')[0]
    if flags['cstmr_flag']==1:
       if flags['franchise_flag'] == 1:
            return True
    elif branch_flags['cstmr_flag'] == 1 and branch_flags['branch_flag'] ==1:
        return True
    else:
        return False


    # url = f"https://www.bulksmsplans.com/api/send_sms?api_id={sms_api_id}&api_password={sms_api_password}&sms_type=Transactional&sms_encoding=text&sender={sender}&number={mobile}&message={msg}&template_id={tid}"
  
    # # url = f"http://message.iconwavetech.com/API/SendMsg.aspx?uname={settings.UNAME}&pass={settings.PASS}&send={settings.SEND}&dest={mobile}&msg={msg}&TEID={tid}&priority=1&PEID=1001568140000027001"
    # print(url)
    # r = requests.get(url).text
    # print(r)

def whatsapp_flag_check(flag,area):
    # customer=Customer.objects.get(id=customer_id).area
    # print("customer",customer.area)
    # print("customer",customer.area_id)
    query=f"""select ff.whatsapp_flag  franchise_flag, ab.whatsapp_flag branch_flag 
            from admin.accounts_branch ab 
            join admin.franchise_franchise ff 
            on ff.branch_id =ab.id 
            join admin.franchise_franchiseareas ff2 
            on ff2.franchise_id =ff.id
            where ff2.area_id ={area}"""
    flags = select2(query)
    if flags:
        branch_flag = flags[0]['branch_flag']
        franchise_flag = flags[0]['franchise_flag']
        if branch_flag == True and franchise_flag == True and flag== True:
            return True
        else:
            return False
        
    else:
        return False

def Whatsapp_notify(mobile,template,body_values):
    try:
        payload={
            "countryCode": "+91",
            "phoneNumber": mobile,
            "callbackData": "Test Message",
            "type": "Template",
            "template": {
                "name": template,
                "languageCode": "en",
                "bodyValues": body_values
            }
        }
        url = "https://api.interakt.ai/v1/public/message/"
        headers = {
                    'Content-Type': 'application/json;',
                    'Authorization': 'Basic a21DSkFFa0NJMmQ2WGJlQTg4QVU4MnE2UEJoUUZMSDhpNEQyQ3hWaXNXUTo='
                    }
        payload_json = json.dumps(payload)
        response = requests.request(
            "POST", url, headers=headers, data=payload_json)
        print("response of sending whatsapp",response.content)
    except:
        print("whatsapp sending failed")
