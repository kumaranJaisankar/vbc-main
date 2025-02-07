from django.db import connections
import paramiko
from django.conf import settings
from datetime import datetime, timedelta
from django.utils import timezone
from django.utils import timezone as tz
import secrets
from dateutil import relativedelta
from radius.emails import email_noify_data_usage_alert, email_noify_plan_expiried_alert, email_noify_plan_expiry_alert
from .permissions import *
from radius.models import Lead ,PushNotifications
from kafka import KafkaProducer
import json
import pandas as pd
import requests
import random
import pytz
ist_tz = pytz.timezone('Asia/Kolkata')
from radius.messages import sms_flag ,send_sms_notify,Whatsapp_notify,whatsapp_flag_check,push_notifications
# import datetime
import traceback
import logging
logger = logging.getLogger(__name__)

broker = settings.KAFKA_BROKER
BUCKET = settings.BUCKET
client = settings.CLIENT

customer_expiry_alert  = settings.CUSTOMER_EXPIRY_ALERT
percentage_data_usage_alerts = settings.DATA_CONSUMPTION_ALERT

customer_expiry_alert_message = settings.CUSTOMER_EXPIRY_ALERT_MESSAGE
complete_data_consumption_alert_message = settings.COMPLETE_DATA_CONSUMPTION_ALERT_MESSAGE
percent90_data_consumption_alert_message=settings.PERCENT90_DATA_CONSUMPTION_ALERT_MESSAGE
expiry_alert_in_days=settings.CUSTOMER_EXPIRY_ALERT_DAYS_MESSAGE


def tuplefetchall(cursor):
    return [row for row in cursor.fetchall()]

def dictfetchall(cursor):
    columns = [col[0] for col in cursor.description]
    return [
        dict(zip(columns, row))
        for row in cursor.fetchall()
    ]

def select(query, database='radius', format='dict'):
    with connections[database].cursor() as cursor:
        cursor.execute(query)
        if format=='list':
            return tuplefetchall(cursor)
        return dictfetchall(cursor)
        
def update(query, database='radius'):
    with connections[database].cursor() as cursor:
        cursor.execute(query)

def update2(query, database='customer'):
    with connections[database].cursor() as cursor:
        cursor.execute(query)


hostname = settings.POD_RADIUS_CLUSTER_HOSTNAME
username = settings.POD_RADIUS_CLUSTER_USERNAME
password = settings.POD_RADIUS_CLUSTER_PASSWORD
port = settings.POD_RADIUS_CLUSTER_PORT

def select3(query):
    with connections['admin'].cursor() as cursor:
        cursor.execute(query)
        return dictfetchall(cursor)

def select4(query):
   try:
    with connections['customer'].cursor() as cursor:
        cursor.execute(query)
        return dictfetchall(cursor)
   except Exception as e:
    print(f"error in select4 function with {query} : {e}")


def get_franchise_address_details(id):
    query = "select ff.name as name, fa.house_no , fa.street, fa.landmark, fa.city, fa.district, fa.state, fa.country, fa.pincode from admin.franchise_franchise ff join admin.franchise_franchiseareas ffa on ff.id = ffa.franchise_id join admin.franchise_address fa on ff.address_id = fa.id where ffa.area_id ={}".format(id)
    try:
        franchise_data = select3(query)[0]

        data = {
            'name': franchise_data['name'],
            'house_no' : franchise_data['house_no'],
            'street': franchise_data['street'],
            'landmark': franchise_data['landmark'],
            'city': franchise_data['city'],
            'district': franchise_data['district'],
            'state': franchise_data['state'],
            'country': franchise_data['country'],
            'pincode': franchise_data['pincode']
        }
        return data
    except:
       
        return None


def get_branch_address_details(id):
    query = "select ab.name as name, aa.house_no , aa.street, aa.landmark, aa.city, aa.district, aa.state, aa.country, aa.pincode from admin.accounts_area aaa join admin.accounts_zone az on aaa.zone_id = az.id join admin.accounts_branch ab on az.branch_id = ab.id join admin.accounts_address aa on ab.address_id = aa.id where aaa.id = {}".format(id)
    branch_data = select3(query)[0]
    
    data = {
            'name': branch_data['name'],
            'house_no' : branch_data['house_no'],
            'street': branch_data['street'],
            'landmark': branch_data['landmark'],
            'city': branch_data['city'],
            'district': branch_data['district'],
            'state': branch_data['state'],
            'country': branch_data['country'],
            'pincode': branch_data['pincode']
        }
    return data

def get_random_password():
    chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    return ''.join(secrets.choice(chars) for i in range(6))

def change_password(user):
    query = f"update radcheck set value='{get_random_password()}' where username='{user}';"
    update(query)

def delete_user(user):
    # query = f"delete from radcheck where username='{user}';"
    # update(query)
    # ippool_del_query = f"delete from radreply where username='{user}';"
    # update(ippool_del_query)
    # radusergroup_del_query = f"delete from radusergroup where username='{user}';"
    # update(radusergroup_del_query)
    password = ''.join(random.choice('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ') for i in range(16))
    query = f"update radcheck set value = '{password}' where username='{user}' and attribute = 'Cleartext-Password';"
    update(query)

def plan_period_backup(user):
    '''
    Storing Billing Period , Plan Name of Expired Customer
    '''
    date = user['plan_updated']
    print(user)
    start_date = f"{date.year}-{date.month}-{date.day}"
    date = user['expiry_date']
    end_date = f"{date.year}-{date.month}-{date.day}"
    query = f"select static_ip_bind from customer.customers_customer cc join customer.customers_radiusinfo cr on cc.radius_info_id = cr.id where user_id = {user['user']};"
    data = select(query,'customer')
    if data:
        if data[0]['static_ip_bind'] != None:
            static_ip_address = f"'{data[0]['static_ip_bind']}'"
        else:
            static_ip_address = "NULL"
    else:
        static_ip_address = "NULL"
    radacct_backup_query = f"""
    SELECT r.username , r.nasipaddress ,ROUND( SUM(r.acctinputoctets)/1024/1024/1024, 2) as upload,
    ROUND( SUM(r.acctoutputoctets)/1024/1024/1024 , 2) as download,
    ROUND( (SUM(r.acctinputoctets)/1024/1024/1024)+(SUM(r.acctoutputoctets)/1024/1024/1024), 2) as total_consumption from radius.radacct r
    where r.username = '{user['username']}' and date(r.acctstarttime) BETWEEN  "{start_date}" AND UTC_TIMESTAMP;
    """
    radius_data = select(radacct_backup_query)
    if radius_data:
        radius_data = radius_data[0]
        upload = radius_data['upload'] if radius_data['upload'] is not None else 0
        download = radius_data['download'] if radius_data['download'] is not None else 0
        total_consumption = radius_data['total_consumption'] if radius_data['total_consumption'] is not None else 0
        insert_query = f"""
                        INSERT INTO customers_planperiod 
                        (service_plan_id, service_plan_name, start_date, end_date, type, customer_id,static_ip_address,download,upload,total_consumption)
                        VALUES ({user['service_plan_id']},'{user['package_name']}','{start_date}','{end_date}','ACT',{user['id']},{static_ip_address},{download},{upload},{total_consumption});
                        """
        update(insert_query,'customer')
        radacct_delete_query = f"delete from radacct where username = '{radius_data['username']}' and date(acctstoptime) < {start_date};"
        update(radacct_delete_query)

    
def user_consumption_backup(user):
    '''
    Squashing Previous Billing Cycle Radacct sessions
    into a single session and inserting it as a backup
    in customers_userconsumption table
    '''
    date = user['plan_updated']
    start_date = f"{date.year}-{date.month}-{date.day}"
    radacct_backup_query = f"""
    SELECT r.username , r.nasipaddress ,ROUND( SUM(r.acctinputoctets)/1024/1024/1024, 2) as upload,
    ROUND( SUM(r.acctoutputoctets)/1024/1024/1024 , 2) as download,
    ROUND( (SUM(r.acctinputoctets)/1024/1024/1024)+(SUM(r.acctoutputoctets)/1024/1024/1024), 2) as total_consumption from radius.radacct r
    where r.username = '{user['username']}' and date(r.acctstarttime) BETWEEN  "{start_date}" AND UTC_TIMESTAMP;
    """
    radius_data = select(radacct_backup_query)
    if radius_data:
        radius_data = radius_data[0]
        upload = radius_data['upload'] if radius_data['upload'] is not None else 0
        download = radius_data['download'] if radius_data['download'] is not None else 0
        total_consumption = radius_data['total_consumption'] if radius_data['total_consumption'] is not None else 0
        insert_query = f"""
                insert into customers_userconsumption 
                (start_date,end_date,username,upload,download,total) 
                values ('{start_date}',UTC_TIMESTAMP,'{radius_data['username']}',{upload},{download},{total_consumption});
        """
        print('hhhhh',insert_query)
        update(insert_query,"customer")
        # radacct_delete_query = f"delete from radacct where username = '{radius_data['username']}';"
        # update(radacct_delete_query)

def update_radius_info(user):
    radius_info_query = f"""
            select cri.static_ip_bind,cri.id as radius_info_id,cc.user_id,cc.id as customer_id 
            from customers_radiusinfo cri 
            join customers_customer cc 
            on cc.radius_info_id = cri.id 
            where cc.user_id = {user};
        """
    data = select(radius_info_query, "customer")
    if data:
        radius_info_id = data[0]["radius_info_id"]
        update_query = f"""
            update customers_radiusinfo 
            set static_ip_bind = NULL, static_ip_cost = NULL, ippool_id = NULL 
            where id = {radius_info_id};
            """
        update(update_query, "customer")

def frame_pod_q(attributes,cust_id,stdout):
    query=f"""INSERT INTO customers_podexecution 
    (acct_session_id, nas_ip, framed_ip, pod_response, customer_id) VALUES 
    ('{attributes[0]['acctsessionid']}','{attributes[0]['nasipaddress']}',NULL,'{stdout}',{cust_id});"""
    return query

####POD
    
def packet_of_disconnect(user):
    # query='SELECT acctsessionid,nasipaddress,username,framedipaddress FROM radacct where username="{}" order by radacctid desc limit 1'.format(user)
    query = f"""
                select n.nasname,n.shortname,rc.username,rc.acctsessionid,rc.nasipaddress,rc.framedipaddress from nas n  
                inner join radacct rc 
                on rc.nasipaddress = n.nasname  
                where rc.username = '{user}' order by rc.radacctid desc limit 1;
                """
    attributes=select(query)
    if attributes:
        try:
            cstmr_id_query =  f"""select cc.id as id,cc.mac_auth as mac_auth from admin.accounts_user au 
                    join customer.customers_customer cc 
                    on cc.user_id =au.id where au.username ='{attributes[0]['username']}'"""
            print(">>>>>>",cstmr_id_query)
            cstmr_data = select4(cstmr_id_query)[0]
        except Exception as e:
            print("query checking in POD",cstmr_id_query)
    if attributes:
        # print(user, attributes)
        nas_type = select(f"""SELECT name,nas_type FROM network_nas WHERE ip_address = '{attributes[0]['nasname']}';""", 'network')[0]['nas_type']
        query = f"""SELECT secret FROM nas WHERE nasname='{attributes[0]['nasipaddress']}'"""
        secret_key = select(query)
        if secret_key:
            if nas_type == 'MKT':
                if cstmr_data["mac_auth"]:
                    cmd='echo  "User-Name={},Framed-IP-Address={},NAS-IP-Address={}" | /usr/bin/sudo /usr/bin/radclient {}:1700 disconnect "{}"'.format(
                    attributes[0]['username'],attributes[0]['framedipaddress'],attributes[0]['nasipaddress'],attributes[0]['nasipaddress'],secret_key[0]['secret'])
                    commands=f"{cmd}"
                    # print(cmd)
                else:
                    cmd='echo "Acct-Session-Id={},User-Name={},NAS-IP-Address={}" | radclient -r 1 {}:1700 disconnect "{}"'.format(attributes[0]['acctsessionid'],attributes[0]['username'],attributes[0]['nasipaddress'],attributes[0]['nasipaddress'], secret_key[0]['secret'])
                    commands=f"{cmd}"
                    # print(cmd)
            elif nas_type == 'HUW':
                cmd='echo  "User-Name={},Framed-IP-Address={},NAS-IP-Address={}" | /usr/bin/sudo /usr/bin/radclient {}:1813 disconnect "{}"'.format(
                    attributes[0]['username'],attributes[0]['framedipaddress'],attributes[0]['nasipaddress'],attributes[0]['nasipaddress'],secret_key[0]['secret']
                )
                commands=f"{cmd}"
                # print(cmd)
            else:
                cmd = 'echo "Acct-Session-Id={}, Framed-IP-Address={}" | radclient {}:3799 disconnect "{}"'.format(attributes[0]['acctsessionid'],attributes[0]['framedipaddress'],attributes[0]['nasipaddress'],secret_key[0]['secret'])
                commands=f"{cmd}"
                # print(cmd)
            # f = open('pod.txt','a')
            # f.write(f'{datetime.now(ist_tz)}  ')
            logging.basicConfig(filename='radius_server.log', level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

            try:
                
                # Establish SSH connection
                client = paramiko.SSHClient()
                client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
                client.connect(hostname, username=username, password=password, port=port)
                
                # Execute command
                stdin, stdout, stderr = client.exec_command(commands)
                
                # Log command execution
                logging.info(f"Executed command: {commands}")
                
                # Log command response
                for line in stdout:
                    logging.info(f"Command response: {line.strip()}")
                
                # Your existing code
                
            except Exception as error:
                logging.error(f"Error occurred: {error}")
                print("Error occurred:", error)
            finally:
                client.close()

def fup_reset(fup_plan, user):
    query = f"UPDATE radusergroup SET groupname='{fup_plan}' WHERE username='{user}';"
    update(query, 'radius')

def get_nas_type(area=10001):
    query = f"select * from franchise_franchiseareas where area_id = {area};"
    franchise_area=select(query, 'admin')
    if franchise_area is not None:
        franchise=franchise_area[0]['franchise_id']
        query = f"select * from franchise_franchise where id = {franchise};"
        nas_type = select(query,'admin')[0]['nas_type']
    return nas_type   

def fup_reset_based_on_nas_type(nas_type, user):
    fup_plan = str(nas_type).upper()+'_'+"FUP"
    query = f"UPDATE radusergroup SET groupname='{fup_plan}' WHERE username='{user}';"
    update(query, 'radius')

def publish_message(data, to_addresses=[]):
    producer = KafkaProducer(bootstrap_servers=[broker], value_serializer=lambda m: json.dumps(m).encode('ascii'))
    for address in to_addresses:
        producer.send(address, data)
    producer.flush()

def payment_link_generator(customer_data, request):
    data = {
    "customer": {
        "name":  f"{customer_data['first_name']} {customer_data['last_name']}",
        "email": customer_data['registered_email'],
        "contact": customer_data['register_mobile'],
    },
    'amount': float(customer_data['total_plan_cost']),
    }
    url = settings.DOMAIN+':7006/payment/'

    headers = {
                    'Content-Type': 'application/json; charset=utf-8', 'Authorization': request.headers.get('Authorization')
                }

    payload = json.dumps(data)
    response = requests.request(
        "POST", url, headers=headers, data=payload)
    
    res=response.json()
    return res['next']

def send_payment_link(customer_data, message):
    payment_data = {
        'event': 'system_payment',
        'userid': customer_data['user_id'],
        'amount': float(customer_data['total_plan_cost']),
        'customer': {
            'name': f"{customer_data['first_name']} {customer_data['last_name']}",
            'email': customer_data['registered_email'],
            'contact': customer_data['register_mobile'],
        },
        'message': message
    }
    publish_message(payment_data, [settings.KAFKA_TOPIC_BILLING])
    print('payment link sent...')


def plan_monthly_reset():
    # query for fetching customers whose expiry time is less than the current UTC i.e.., who are not expired
    query = """
    select cc.user_id as user,au.username,cc.first_name, cc.last_name, cc.register_mobile,cc.registered_email, cc.monthly_date, cc.expiry_date,cc.plan_updated,
    cc.threshold_alerted, cc.limit_alerted, cc.expiry_alerted,cc.tomorrowexpire_alerted, cc.day_2_expire_alerted,
    cc.day_3_expire_alerted,cc.last_renewal,cc.buffer_alerted, cc.account_status,
    cc.service_plan_id,cc.nas_type ,psp.package_name, psp.fup_limit,psp.package_data_type,psp.time_unit,psp.unit_type,psp.renewal_expiry_day, psp.total_plan_cost
    from customers_customer cc
    join services.plans_servicepackage psp
    on cc.service_plan_id=psp.id
    join admin.accounts_user au
    on cc.user_id=au.id
    where Date(cc.monthly_date) = DATE(DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 1 MONTH)) and account_status='ACT'
    """
    users = select(query,'customer') 
    for user in users:
        logger.info(f"{datetime.now(ist_tz)} Updating monthly date in customer table  for {user['username']}, current one is {user['monthly_date']}")   
        if user['unit_type']=='mon':
            cdt = user['monthly_date']
            next_expire_date = cdt.date()+relativedelta.relativedelta(months=1)
            monthly_date = datetime(year=next_expire_date.year, month=next_expire_date.month, day=next_expire_date.day, hour=cdt.hour, minute=cdt.minute, second=cdt.second)
            flag = False
            try:
                query = f"UPDATE customers_customer SET monthly_date='{monthly_date}', threshold_alerted={flag}, limit_alerted={flag} WHERE user_id={user['user']};"
                update(query, 'customer')  
                logger.info(f"{datetime.now(ist_tz)} Updated monthly date in customer table  for {user['username']} is {monthly_date}")    
            except Exception as e:
                  logger.info(f"{datetime.now(ist_tz)} Updating monthly date in customer table {user['username']}",str(e))    
            try:
                if user['nas_type'] is not None:
                    fallback_reset_query = f"UPDATE radusergroup SET groupname='{user['nas_type'] +'_'+ user['package_name']}' WHERE username='{user['username']}';"
                else:
                    fallback_reset_query = f"UPDATE radusergroup SET groupname='{user['package_name']}' WHERE username='{user['username']}';"
                update(fallback_reset_query, 'radius')
            except Exception as e:
                  logger.info(f"{datetime.now(ist_tz)} Updating monthly date in radius database table {user['username']}",str(e))    
            try:
                packet_of_disconnect(user['username'])
            except Exception as e:
                print(f"Error occured while executing POD {user['username']}",e)
                logger.info(f"{datetime.now(ist_tz)} Error occured while executing POD {user['username']}",str(e))

def expire_users():
    query = """
    select cc.id, cc.user_id as user,au.username, cc.first_name, cc.last_name, cc.register_mobile, cc.registered_email, cc.area_id as area ,cc.expiry_date, cc.plan_updated,
    cc.threshold_alerted, cc.limit_alerted, cc.expiry_alerted, cc.tomorrowexpire_alerted, cc.day_2_expire_alerted,
    cc.day_3_expire_alerted, cc.last_renewal, cc.buffer_alerted, cc.account_status,cc.whatsapp_flag ,cc.area_id as area,
    cc.service_plan_id, psp.package_name, psp.fup_limit, psp.package_data_type, psp.time_unit, psp.unit_type, psp.renewal_expiry_day, psp.total_plan_cost
    from customers_customer cc
    join services.plans_servicepackage psp
    on cc.service_plan_id=psp.id
    join admin.accounts_user au
    on cc.user_id=au.id
    where expiry_date<UTC_TIMESTAMP() and account_status='ACT'
    """
    expired_users = select(query,'customer')
    # print('hhhhhhhhh',expired_users)
    for user in expired_users:
        date = (datetime.utcnow()).date()
        # if not user['last_renewal']:
        if user:
            flag = True
            query = f"UPDATE customers_customer SET expiry_alerted={flag}, payment_status='UPD', account_status='EXP' WHERE user_id={user['user']};"
            # packet_of_disconnect(user['username'])
            delete_user(user['username'])
            packet_of_disconnect(user['username'])

            # office_details = get_franchise_address_details(user['area'])
            # if office_details == None:
            #     office_details = get_branch_address_details(user['area'])
            # alert_msg = "Your plan is expired. Please recharge now for uninterrupted services"
            # email_noify_plan_expiried_alert(user['registered_email'], alert_msg, user['username'], f"{user['first_name']} {user['last_name']}", office_details)
            # send_payment_link(user, f"{user['first_name']} {user['last_name']} - Renew plan")
            update(query, 'customer')
            # update_radius_info(user['user'])
            user_consumption_backup(user)
            plan_period_backup(user)
            # msg =f"{user['username']} Your account going to expiry . Please call to our customer care for renew your account:{support_no} VBC ON FIBER"
            today = 'Today' + ' (' + str(date.strftime("%d-%m-%Y")) + ')'
            msg=str(customer_expiry_alert_message).replace('cstmr_username',str(user['username'])).replace('Today',today)
            flag=sms_flag(user['username'])
            if flag == True:
                send_sms_notify(msg, user['register_mobile'], tid=customer_expiry_alert)
            print(f"Plan is expired and disconnected {user['username']}")
            title_msg='Expired alert'
            body=f'Your plan is expired,please renew'
            push_notifications(user['username'],title_msg,body)

            # try:
            #     body_values = [str(user['first_name'] + user['last_name'])]
            #     flag=whatsapp_flag_check(user['whatsapp_flag'],user['area'])
            #     if flag==True:
            #         Whatsapp_notify(user['register_mobile'],"new_expired",body_values) 
            #     else:
            #         print(f"Whatspp message is not sent for customer {body_values}")
            # except:
            #     print(f"Whatspp message is not sent for customer {body_values}")

def expiry_alert(alert_days):
    query = f"""
    select cc.user_id as user,au.username,cc.first_name, cc.last_name, cc.register_mobile,cc.registered_email,cc.expiry_date,cc.plan_updated,
    cc.threshold_alerted, cc.limit_alerted, cc.expiry_alerted,cc.tomorrowexpire_alerted, cc.day_2_expire_alerted,
    cc.day_3_expire_alerted,cc.last_renewal,cc.buffer_alerted,cc.whatsapp_flag ,cc.area_id as area,
    cc.service_plan_id, psp.package_name, psp.fup_limit,psp.package_data_type,psp.time_unit,psp.unit_type,psp.renewal_expiry_day,psp.total_plan_cost
    from customer.customers_customer cc
    join services.plans_servicepackage psp
    on cc.service_plan_id = psp.id
    join admin.accounts_user au
    on cc.user_id = au.id
    where date(expiry_date)=date(UTC_TIMESTAMP()+INTERVAL {alert_days} DAY) and account_status='ACT' 
    """
    
    return select(query, 'customer')

def alert(alert_days):
    users = expiry_alert(alert_days)
    # do not execute this block if expiry_date within 23 hours
    if alert_days==0:
        try:
            for user in users:
                if user['expiry_alerted']==0 and not (tz.make_aware(user['expiry_date'], tz.get_default_timezone())<=(tz.now())):
                    flag = True
                    query = f"UPDATE customers_customer SET expiry_alerted={flag} WHERE user_id={user['user']};"
                    date = (datetime.utcnow()).date()
                    try:
                        email_noify_plan_expiry_alert(user['registered_email'], f"Your plan is going to  expire today {date.strftime('%d-%m-%Y')}. Please recharge before expiry", user['username'], f"{user['first_name']} {user['last_name']}")    
                    except Exception as e:
                       print("Error occured while excuting emial notify",e)
                    

                    today = 'Today' + ' (' + str(date.strftime("%d-%m-%Y")) + ')'
                    msg=str(customer_expiry_alert_message).replace('cstmr_username',str(user['username'])).replace('Today',today)
                    
                    try:
                        flag =sms_flag(user['username'])
                        logger.info(f"{datetime.now(ist_tz)} Sms flags alert(0) for user {user['username']} is  >> {flag}")  
                        if flag == True:
                            res=send_sms_notify(msg, user['register_mobile'], tid=customer_expiry_alert)  
                            update(query, 'customer')
                            if res==True:
                                logger.info(f"{datetime.now(ist_tz)} sent the alert(0) message for {user['username']} is success >> {res}")    
                            else:
                                logger.info(f"{datetime.now(ist_tz)} sending the alert(0) message for {user['username']} is failed >> {res}")   
                        title_msg='Expired alert'
                        body=f'Your plan is expired,please renew'
                        push_notifications(user['username'],title_msg,body)
 
                    except Exception as e:
                        print("Error occured while sending sms notify",e)
                        logger.info(f"{datetime.now(ist_tz)} sent the alert message for {user['username']} is failed",e)    
                        
                    try:
                        flag=whatsapp_flag_check(user['whatsapp_flag'],user['area'])
                        if flag==True:
                            body_values = [str(user['first_name'] + user['last_name']),str(user['username']),str(float(user['total_plan_cost'])),str(today)]
                            Whatsapp_notify(user['register_mobile'],"expiry_alert_1_day_new",body_values) 
                            logger.info(f"{datetime.now(ist_tz)} sent the whatsapp message for {user['username']} is success")    
                        else:
                            print(f"Whatspp message is not sent for customer {user['username']}")
                            logger.info(f"{datetime.now(ist_tz)} sent the whatsapp message for {user['username']} is failed")    
                    except Exception as e:
                        print(f"Whatspp message is not sent for customer {user['username']}")
                        logger.info(f"{datetime.now(ist_tz)} sent the whatsapp message for {user['username']} is failed",e)    
                    print('ALERT: expires today')
        except Exception as e:
            print("Error occure while excuting alert(0)",e)        
    elif alert_days==1:
        try:
            for user in users:
                if user['tomorrowexpire_alerted']==0:
                    print(">>>>>")
                    flag = True
                    query = f"UPDATE customers_customer SET tomorrowexpire_alerted={flag} WHERE user_id={user['user']};"
                    date = (datetime.utcnow()+timedelta(days=1)).date()
                    try:
                        email_noify_plan_expiry_alert(user['registered_email'], f"Your plan will expire tomorrow {date.strftime('%d-%m-%Y')}. Please recharge before expiry", user['username'], f"{user['first_name']} {user['last_name']}")
                        
                    except Exception as e:
                        print("Error occured while sending email notify",e)
                    
                    
                    # msg =f"{user['username']} Your account going to expiry {date.strftime('%d-%m-%Y')}. Please call to our customer care for renew your account:{support_no} VBC ON FIBER"
                    day= '1 day' + ' (' + str(date.strftime("%d-%m-%Y")) + ')'
                    msg=str(expiry_alert_in_days).replace('cstmr_username',str(user['username'])).replace('days',str(day))
                    try:
                        flag =sms_flag(user['username'])
                        logger.info(f"{datetime.now(ist_tz)} Sms flags for alert(1) user {user['username']} is  >> {flag}")  
                        if flag == True:
                            res=send_sms_notify(msg, user['register_mobile'], tid=customer_expiry_alert)
                            update(query, 'customer')
                            if res==True:
                                logger.info(f"{datetime.now(ist_tz)} sent the alert(1) message for {user['username']} is success >> {res}")    
                            else:
                                logger.info(f"{datetime.now(ist_tz)} sending the alert(1) message for {user['username']} is failed >> {res}")    
                        title_msg='Expiring in one day'
                        body=f'Your plan is going to expiry in one day,please renew'
                        push_notifications(user['username'],title_msg,body)
                    except Exception as e:
                        print("Error occured while sending sms notify",e)
                        logger.info(f"{datetime.now(ist_tz)} sent the alert message for {user['username']} is failed",e)    
                    try:
                        flag=whatsapp_flag_check(user['whatsapp_flag'],user['area'])
                        if flag==True:
                            body_values = [str(user['first_name'] + user['last_name']),str(user['username']),str(float(user['total_plan_cost'])),str('tomorrow' + ' (' + str(date.strftime("%d-%m-%Y")) + ')')]
                            Whatsapp_notify(user['register_mobile'],"expiry_alert_1_day_new",body_values) 
                            logger.info(f"{datetime.now(ist_tz)} sent the whatsapp message for {user['username']} is success")    
                        else:
                                print(f"Whatspp message is not sent for customer {user['username']}")
                                logger.info(f"{datetime.now(ist_tz)} sent the whatsapp message for {user['username']} is failed") 
                    except Exception as e:
                        print(f"Whatspp message is not sent for customer {user['username']}")
                        logger.info(f"{datetime.now(ist_tz)} sent the whatsapp message for {user['username']} is failed",e)    
                    print('ALERT: expires tomorrow')
        except Exception as e:
            print("Error occure while excuting alert(1)",e)   

    elif alert_days==2:
        try:
            for user in users:
                if user['day_2_expire_alerted']==0 and not (tz.make_aware(user['expiry_date'], tz.get_default_timezone())<=(tz.now()+timedelta(hours=23))):
                    flag = True
                    query = f"UPDATE customers_customer SET day_2_expire_alerted={flag} WHERE user_id={user['user']};"
                    date = (datetime.utcnow()+timedelta(days=2)).date()
                
                    try:
                        email_noify_plan_expiry_alert(user['registered_email'], f"Your plan will expires in 2 days {date.strftime('%d-%m-%Y')}. Please recharge before expiry", user['username'], f"{user['first_name']} {user['last_name']}")
                    except Exception as e:
                        print("Error occured while sending email notify",e)
                    
                    # msg =f"{user['username']} Your account going to expiry {date.strftime('%d-%m-%Y')}. Please call to our customer care for renew your account: {support_no} VBC ON FIBER"
                    day= '2 days' + ' (' + str(date.strftime("%d-%m-%Y")) + ')'
                    msg=str(expiry_alert_in_days).replace('cstmr_username',str(user['username'])).replace('days',str(day))
                    try:
                        flag =sms_flag(user['username'])
                        logger.info(f"{datetime.now(ist_tz)} Sms flags for alert(2) user {user['username']} is  >> {flag}")  
                        if flag == True:
                            res=send_sms_notify(msg, user['register_mobile'], tid=customer_expiry_alert)
                            update(query, 'customer')
                            if res==True:
                                logger.info(f"{datetime.now(ist_tz)} sent the alert(2) message for {user['username']} is success >> {res}")    
                            else:
                                logger.info(f"{datetime.now(ist_tz)} sending the alert(2) message for {user['username']} is failed >> {res}")    
                        title_msg='Expiring in 2 days'
                        body=f'Your plan is going to expiry in 2 days,please renew'
                        push_notifications(user['username'],title_msg,body)                                
                    except Exception as e:
                        print("Error occured while sending sms notify",e)
                        logger.info(f"{datetime.now(ist_tz)} sent the alert message for {user['username']} is failed",e)    
                    print('ALERT: expires in 2 days')
        except Exception as e:
            print("Error occure while excuting alert(2)",e)   
    elif alert_days==3:
        try:
            for user in users:
                if user['day_3_expire_alerted']==0 and not (tz.make_aware(user['expiry_date'], tz.get_default_timezone())<=(tz.now()+timedelta(hours=23))):
                    flag = True
                    query = f"UPDATE customers_customer SET day_3_expire_alerted={flag} WHERE user_id={user['user']};"
                    date = (datetime.utcnow()+timedelta(days=3)).date()
                    try:
                        email_noify_plan_expiry_alert(user['registered_email'], f"Your plan will expires in 3 days {date.strftime('%d-%m-%Y')}. Please recharge before expiry", user['username'], f"{user['first_name']} {user['last_name']}")
                    except Exception as e:
                        print("Error occured while sending email notify",e)
                    
                    # msg =f"{user['username']} Your account going to expiry {date.strftime('%d-%m-%Y')}. Please call to our customer care for renew your account: {support_no} VBC ON FIBER"
                    day= '3 days' + ' (' + str(date.strftime("%d-%m-%Y")) + ')'
                    msg=str(expiry_alert_in_days).replace('cstmr_username',str(user['username'])).replace('days',str(day))
                    try:
                        flag =sms_flag(user['username'])
                        logger.info(f"{datetime.now(ist_tz)} Sms flags  alert(3) for user {user['username']} is  >> {flag}")  
                        if flag == True:
                            res=send_sms_notify(msg, user['register_mobile'], tid=customer_expiry_alert)
                            update(query, 'customer')
                            if res==True:
                                logger.info(f"{datetime.now(ist_tz)} sent the alert(3) message for {user['username']} is success >> {res}")    
                            else:
                                logger.info(f"{datetime.now(ist_tz)} sending the alert(3) message for {user['username']} is failed >> {res}")    
                    except Exception as e:
                        print("Error occured while sending sms notify",e)
                        logger.info(f"{datetime.now(ist_tz)} sent the alert message for {user['username']} is failed")    
                    print('ALERT: expires in 3 days')
        except Exception as e:
            print("Error occure while excuting alert(3)",e)   

def createRadLog(user):
    query = f"""
        select * 
        from radacct
        where username = '{user['username']}' and  acctstarttime between '{user['monthly_date']}' and UTC_TIMESTAMP()
    """
    # print(query)
    rad_logs = select(query,'radius')
    df = pd.DataFrame.from_dict(rad_logs)
    file_path = "/home/sparkadmin/VBCLEAD/"+user['username']+".xlsx"
    df.to_excel(file_path)

def consumption_check():
    #query for getting all active customers who are not subscribed to UnLimited Plans
    query = """
    select cc.user_id as user,au.username,cc.first_name, cc.last_name, cc.register_mobile,cc.registered_email,cc.expiry_date,cc.plan_updated,
    cc.threshold_alerted, cc.limit_alerted, cc.expiry_alerted,cc.tomorrowexpire_alerted, cc.day_2_expire_alerted,cc.area_id as area,
    cc.day_3_expire_alerted,cc.last_renewal,cc.buffer_alerted, cc.service_plan_id, cc.monthly_date, cc.nas_type,
    psp.package_name, psp.fup_limit,psp.package_data_type,psp.time_unit,psp.unit_type,psp.renewal_expiry_day
    from customer.customers_customer cc
    join admin.accounts_user au
    on cc.user_id = au.id
    join services.plans_servicepackage psp
    on cc.service_plan_id = psp.id
    where cc.account_status = 'ACT' and psp.fup_limit <> 5000
    """
    customers = select(query, 'customer')

    for user in customers:
        if user['nas_type'] == 'HUW':
            if settings.RADIUS_CLUSTER_TZ=='IST':
                query = f"""
                select ract.username, (sum(acctinputoctets)/1024/1024/1024 + sum(acctoutputoctets)/1024/1024/1024) as total_gb,
                rgp.groupname, rgpc.value, ((sum(acctinputoctets))/1024/1024/1024)*100/rgpc.value as percentage
                from radacct ract
                join radusergroup rgp
                on ract.username = rgp.username
                join radgroupcheck rgpc
                on rgp.groupname = rgpc.groupname
                where ract.username = '{user["username"]}' and acctstarttime between '{user['monthly_date']+timedelta(hours=5, minutes=30)}' and NOW() and rgpc.`attribute` = 'Acct-Input-Gigawords'
                group by ract.username;
                """
            else:
                query = f"""
                select ract.username, (sum(acctinputoctets)/1024/1024/1024 + sum(acctoutputoctets)/1024/1024/1024) as total_gb,
                rgp.groupname, rgpc.value, ((sum(acctinputoctets))/1024/1024/1024)*100/rgpc.value as percentage
                from radacct ract
                join radusergroup rgp
                on ract.username = rgp.username
                join radgroupcheck rgpc
                on rgp.groupname = rgpc.groupname
                where ract.username = '{user["username"]}' and acctstarttime between '{user['monthly_date']}' and UTC_TIMESTAMP() and rgpc.`attribute` = 'Acct-Input-Gigawords'
                group by ract.username;
                """
        else:
            if settings.RADIUS_CLUSTER_TZ=='IST':
                query = f"""
                select ract.username, (sum(acctinputoctets)/1024/1024/1024 + sum(acctoutputoctets)/1024/1024/1024) as total_gb,
                rgp.groupname, rgpc.value, ((sum(acctinputoctets+acctoutputoctets))/1024/1024/1024)*100/rgpc.value as percentage
                from radacct ract
                join radusergroup rgp
                on ract.username = rgp.username
                join radgroupcheck rgpc
                on rgp.groupname = rgpc.groupname
                where ract.username = '{user["username"]}' and acctstarttime between '{user['monthly_date']+timedelta(hours=5, minutes=30)}' and NOW() and rgpc.`attribute` = 'Mikrotik-Recv-Limit-Gigawords'
                group by ract.username;
                """
            else:
                query = f"""
                select ract.username, (sum(acctinputoctets)/1024/1024/1024 + sum(acctoutputoctets)/1024/1024/1024) as total_gb,
                rgp.groupname, rgpc.value, ((sum(acctinputoctets+acctoutputoctets))/1024/1024/1024)*100/rgpc.value as percentage
                from radacct ract
                join radusergroup rgp
                on ract.username = rgp.username
                join radgroupcheck rgpc
                on rgp.groupname = rgpc.groupname
                where ract.username = '{user["username"]}' and acctstarttime between '{user['monthly_date']}' and UTC_TIMESTAMP() and rgpc.`attribute` = 'Mikrotik-Recv-Limit-Gigawords'
                group by ract.username;
                """
        radius_user = select(query, 'radius')
        # print("---",query)
        if radius_user:
            if float(radius_user[0]['percentage'])>90 and user['threshold_alerted']==0:
                # with open("/home/sparkadmin/VBCLEAD/consumption_check.txt","a") as f: ##server path 
                #     f.write(user["username"]+"  "+str(float(radius_user[0]['percentage']))+"  "+str(user['plan_updated'])+"  "+ str(user['monthly_date'])+"  "+str(datetime.utcnow())+"  "+str(user['threshold_alerted'])+"  "+str(user['limit_alerted'])+"  "+"90 percent consumption"+"\n")
                flag = True
                query = f"UPDATE customers_customer SET threshold_alerted={flag} WHERE user_id={user['user']};"
                try:
                    email_noify_data_usage_alert(user['registered_email'], "Alert: 90% data usage. Total consumption for this month is about to finish. Please recharge before disconnection, Try to boost your data before completion of full data.", user['username'], f"{user['first_name']} {user['last_name']}")
                except:
                    pass
                update(query, 'customer')
                msg =f"Your Account: {user['username']} Data usage alert: You have consumed 90% of the data usage limit on your account.VBC ON FIBER"
                try:
                    username=user["username"]
                    flag = sms_flag(username)
                    if flag == True:
                        send_sms_notify(msg, user['register_mobile'], tid=percentage_data_usage_alerts)
                except:
                    pass
                print("Plan 90% crossed")
                title_msg='Data usage alert '
                body=f'You have consumed 90% of the data'
                push_notifications(user['username'],title_msg,body)

            elif float(radius_user[0]['percentage'])>100 and user['limit_alerted']==0:
                # with open("/home/sparkadmin/VBCLEAD/consumption_check.txt","a") as f: ##server path 
                #     f.write(user["username"]+"  "+str(float(radius_user[0]['percentage']))+"  "+str(user['plan_updated'])+"  "+ str(user['monthly_date'])+"  "+str(datetime.utcnow())+"  "+str(user['threshold_alerted'])+"  "+str(user['limit_alerted'])+"  "+"100 percent consumption"+"\n")

                # insert fallback plan based on service_plan d=fallback type
                # fup_reset(user['fall_back_type'], user['username'])

                # Inserting fallback plan based on customer nas_type
                flag = True
                query = f"UPDATE customers_customer SET limit_alerted={flag} WHERE user_id={user['user']};"
                print("FUP QUERY>>>>",query)
                update(query, 'customer')
                fup_reset_based_on_nas_type(get_nas_type(user['area']), user['username'])
                packet_of_disconnect(user['username'])
                try:
                    email_noify_data_usage_alert(user['registered_email'], "Alert: 100% data usage. Total consumption for this month is over. Please recharge now", user['username'], f"{user['first_name']} {user['last_name']}")
                except:
                    pass
                msg =f"Your Account: {user['username']} Data usage alert: You have consumed 100% of the data usage limit on your account.VBC ON FIBER"
                try:
                    flag = sms_flag(user["username"])
                    if flag == True:
                        send_sms_notify(msg, user['register_mobile'], tid=percentage_data_usage_alerts)
                except:
                    pass
                print("Plan exceeded and disconnected")
                title_msg='Data usage alert '
                body=f'You have consumed 100% of the data'
                push_notifications(user['username'],title_msg,body)

def buffer_check():
    query = """
        select cc.user_id as user, au.username, cc.last_renewal, cc.buffer_alerted, cc.account_status,
        cc.temporary_renewal_date
        from customers_customer cc
        join services.plans_servicepackage psp
        on cc.service_plan_id=psp.id
        join admin.accounts_user au
        on cc.user_id=au.id
        where temporary_renewal_date<UTC_TIMESTAMP() and account_status='ACT'
    """
    users = select(query,'customer')
    for user in users:
        if user['temporary_renewal_date'] and user['buffer_alerted']==0 and user['temporary_renewal_date']+ timedelta(days=2)<datetime.now():
            flag = True

            query = f"UPDATE customers_customer SET buffer_alerted={flag}, account_status='SPD' WHERE user_id={user['user']};"
            update(query, 'customer')
            packet_of_disconnect(user['username'])
            delete_user(user['username'])
            packet_of_disconnect(user['username'])
            print(f"Buffer is over for {user['username']}-{user['user']}")

def getAreasBasedOnUser(user):
    query = "SELECT user_type FROM accounts_user WHERE id={}".format(user)
    role = select(query,database='admin')[0]['user_type']

    if role == 'FRONR':
        query="SELECT id FROM franchise_franchise WHERE user_id={}".format(user)
        franchises=select(query,database='admin')
        franchises=','.join([str(i['id']) for i in franchises])
        if franchises:
            areas_query="SELECT area_id FROM franchise_franchiseareas WHERE franchise_id in ({});".format(franchises)
            areas=select(areas_query,database='admin')
            area_ids=[i['area_id'] for i in areas]
            return area_ids
        else :
            return []

    elif role == 'BRONR' :
        branch_query = "SELECT id FROM accounts_branch WHERE owner_id={};".format(user)
        branches=select(branch_query,database='admin')
        if branches:
            branch_ids=','.join([str(i['id']) for i in branches])
            zone_query="SELECT id FROM accounts_zone WHERE branch_id in ({});".format(branch_ids)
            zones=select(zone_query,database='admin')
            if zones:
                zone_ids=','.join([str(i['id']) for i in zones])
                area_query="SELECT id FROM accounts_area WHERE zone_id in ({});".format(zone_ids)
                areas=select(area_query,database='admin')
                area_ids=[i['id'] for i in areas]
                return area_ids
            else :
                return []
        else:
            return []

    elif  role == 'ADMIN' or role=='SPADN':
        area_query="SELECT id FROM accounts_area ;"
        areas=select(area_query,database='admin')
        area_ids=[i['id'] for i in areas]
        return area_ids

def getBranchAreas(user):
    branch_query = "SELECT id FROM accounts_branch WHERE owner_id={};".format(user)
    branches=select(branch_query,database='admin')
    if branches:
        branch_ids=','.join([str(i['id']) for i in branches])
        zone_query="SELECT id FROM accounts_zone WHERE branch_id in ({});".format(branch_ids)
        zones=select(zone_query,database='admin')
        if zones:
            zone_ids=','.join([str(i['id']) for i in zones])
            area_query="SELECT id FROM accounts_area WHERE zone_id in ({});".format(zone_ids)
            areas=select(area_query,database='admin')
            area_ids=[i['id'] for i in areas]
            return area_ids
        else :
            return []
    else:
        return []

def getFranchiseAreas(user):
    query="SELECT id FROM franchise_franchise WHERE user_id={}".format(user)
    franchises=select(query,database='admin')
    franchises=','.join([str(i['id']) for i in franchises])
    if franchises:
        areas_query="SELECT area_id FROM franchise_franchiseareas WHERE franchise_id in ({});".format(franchises)
        areas=select(areas_query,database='admin')
        area_ids=[i['area_id'] for i in areas]
        print('hola')
        return area_ids
    else :
        return []

def getZonalmanagerAreas(user):
    query="select * from franchise_metazone  WHERE manager_id={}".format(user)
    metazone=select(query,database='admin')
    metazones=','.join([str(i['id']) for i in metazone])
    if metazone:
        areas_query="select id from accounts_area where meta_zone_id in ({});".format(metazones)
        areas=select(areas_query,database='admin')
        area_ids=[i['id'] for i in areas]
        return area_ids
    else:
        query="select * from accounts_zone  WHERE manager_id={}".format(user)
        zone=select(query,database='admin')
        zones=','.join([str(i['id']) for i in zone])
        if zone:
            areas_query="select id from accounts_area where zone_id in ({}) and meta_zone_id is null;".format(zones)
            areas=select(areas_query,database='admin')
            area_ids=[i['id'] for i in areas]
            return area_ids
        else:
            return []

def getStaffAreas(user):
    query = f"SELECT * FROM franchise_staff WHERE user_id = {user};"
    staff_exists = select(query,database='admin')
    if staff_exists:
        staff = staff_exists[0]
        if staff['franchise_id'] is not None:
            franchise = staff['id']
            area_qs = f"select area_id from accounts_areastaff where staff_id = {franchise}"
            area_qs = select(area_qs,database='admin')
            area_ids=[i["area_id"] for i in area_qs]
            return area_ids
        else:
            branch = staff['branch_id']
            zone_query="SELECT id FROM accounts_zone WHERE branch_id = {};".format(branch)
            zones=select(zone_query,database='admin')
            if zones:
                zone_ids=','.join([str(i['id']) for i in zones])
                area_query="SELECT id FROM accounts_area WHERE zone_id in ({});".format(zone_ids)
                areas=select(area_query,database='admin')
                area_ids=[i['id'] for i in areas]
                return area_ids
            else :
                return []
    else:
        return []

def getLeadQS(token,username):
    from radius.permissions import SUPER_ADMIN,ADMIN,BRANCH_OWNER,FRANCHISE_OWNER
    user_permissions = get_cache_permissions(token)['permissions']
    
    if (ADMIN in user_permissions) or (SUPER_ADMIN in user_permissions):
        return Lead.objects.filter(deleted='0')
    elif BRANCH_OWNER in user_permissions :
        area_query = f"""
        SELECT aa.id,aa.name FROM accounts_area aa 
        INNER JOIN accounts_zone az 
        ON aa.zone_id = az.id 
        INNER JOIN accounts_branch ab 
        ON az.branch_id = ab.id 
        INNER JOIN accounts_user au 
        ON ab.owner_id = au.id  
        WHERE au.id = {username};
        """
        area_list_dict = select(area_query,database='admin')
        if area_list_dict :
            area_ids = [i['id'] for i in area_list_dict]
            return Lead.objects.filter(deleted='0').filter(area__in = area_ids) 
        else :
            return []
    
    elif FRANCHISE_OWNER in user_permissions :
        area_query = f"""
        SELECT area_id FROM franchise_franchiseareas fa
        INNER JOIN franchise_franchise ff 
        ON ff.id = fa.franchise_id 
        INNER JOIN accounts_user au 
        ON ff.user_id = au.id
        WHERE au.id = {username};
        """
        area_list_dict = select(area_query,database='admin')
        if area_list_dict :
            area_ids = [i['area_id'] for i in area_list_dict]
            return Lead.objects.filter(deleted='0').filter(area__in = area_ids)
        else :
            return []
        
    elif ZONAL_MANAGER in user_permissions:
        areas=getZonalmanagerAreas(username)
        if areas:
            return Lead.objects.filter(deleted='0').filter(area__in = areas)
        else:
            return []
    
    elif STAFF in user_permissions or HELPDESK in user_permissions:
        # 
        areas=getStaffAreas(username)
        if areas:
            return Lead.objects.filter(deleted='0').filter(area__in = areas) 
        else:
            return []
    else:
        pass


def task_radius_fix(command='check', expire=False):
    query = f"""SELECT au.username, cc.user_id as user, cc.monthly_date, cc.account_status, cc.expiry_date
        FROM customers_customer cc
        join admin.accounts_user au 
        on cc.user_id = au.id {"where cc.expiry_date<utc_timestamp()" if expire else ""}"""
    customers = select(query, 'customer', 'list')
    customers = {i[0]: {'id': i[1], 'monthly_date': i[2], 'account_status': i[3], 'expiry_date': i[4]} for i in customers}
    query = f"""select r.username, r.acctstarttime
        from radacct r 
        inner join ( select max(radacctid) as id, username
        from radacct 
        group by username ) rt
        on r.radacctid = rt.id
        where r.username in ('{"', '".join(customers.keys())}') and acctstoptime is null"""
    radius_users = select(query)
    customer_usernames = customers.keys()
    if expire and command=='fix':
        for i in radius_users:
            packet_of_disconnect(i['username'])
            print('expire fix ==>', i['username'])
    else:
        for i in radius_users:
            if i['username'] in customer_usernames:
                if i['acctstarttime']<customers[i['username']]['monthly_date']:
                    print(i['username'], customers[i['username']]['account_status'])
                    if command=='fix':
                        packet_of_disconnect(i['username'])

from dateutil import parser

def deleting_cstmr_static_ip_in_radreply(username):
    try:
        delete_query=f'DELETE FROM radius.radreply WHERE username="{username}"'
        result=select(delete_query)
        logger.info(f"{datetime.now(ist_tz)} deleted staticip record for {username} from radreply table ")
    except Exception as e:
        logger.info(f"{datetime.now(ist_tz)} Error occured while deleting staticip record for {username} from radreply table",e)




def deleting_staticip_after_renewal_time():
    query = f"""SELECT au.username,cc.previous_expiry_date  from customer.customers_customer cc 
                join customer.customers_radiusinfo cr 
                on cc.radius_info_id =cr.id 
                join admin.accounts_user au 
                on au.id = cc.user_id 
                where cr.static_ip_bind is null"""
    result=select4(query)
    if result:
        for i in result:
            parsed_date = parser.parse(str(i['previous_expiry_date']))
            if datetime.now().date()== parsed_date.date() or datetime.now().date()>parsed_date.date():
                try:
                    deleting_cstmr_static_ip_in_radreply(i['username'])
                except Exception as e:
                    logger.info(f"{datetime.now(ist_tz)} Error occured>>>",e)

    query2=f"""select au.username,cr.id  as radius_info_id from customers_customer cc 
                join customer.customers_radiusinfo cr
                on cc.radius_info_id =cr.id 
                join admin.accounts_user au 
                on au.id = cc.user_id 
                where cc.account_status in ('EXP','SPD') and  cr.static_ip_bind is not null 
                and date(expiry_date)<date(UTC_TIMESTAMP()-INTERVAL 10 DAY)"""
    result2=select4(query2)
    if result2:
        for i in result2:
            try:
                deleting_cstmr_static_ip_in_radreply(i['username'])
                radius_info_update_query =f"""UPDATE customer.customers_radiusinfo
                SET  static_ip_bind=NULL 
                WHERE id = {i['radius_info_id']}"""
                result2=update2(radius_info_update_query)
            except Exception as e:
                logger.info(f"{datetime.now(ist_tz)} Error occured>>>",e)


def scheduled_push_notification():
    now = timezone.now()
    today_tasks = PushNotifications.objects.filter(scheduled_date__date=now.date(),isSent=False).values()
    past_tasks = PushNotifications.objects.filter(scheduled_date__lt=now).values()
    # print(today_tasks)
    for i in today_tasks:
        # if i['task_type']=='DAILY':
        print(">>>>>>>>>>>>>>>.....",i['image'],len(i['image']))
        if i['image']:
            image_obj = str(i['image'])
            bucket = image_obj.rsplit('%', -1)[0]
            obj_name = image_obj.rsplit('%', 1)[1]
            
            image_preview_url = client.get_presigned_url("GET",f"{bucket}", f"{obj_name}",  
                                    response_headers={"response-content-type": "application/jpg"},)
        else:
            image_preview_url=None
        payload={
        "to": f"/topics/{i['topic']}",
        "data": {
                "title":f"{i['title']}",
                "body": f"{i['body']}",
                "image":image_preview_url
                },
        'priority':'high'
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
        if response:
            today_tasks.update(isSent=True)


        
