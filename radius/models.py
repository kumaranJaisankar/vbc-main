from django.db import models
import uuid
from django.db.models.signals import post_save 
import requests
from django.contrib.auth.models import AbstractUser
 
class User(AbstractUser):
    pass

def order_no():
    return uuid.uuid4().node

# Create your models here.
'''class for a source of a lead '''
class Source(models.Model):

    DELETE_CHOICES=(('0','False'),('1','True'),('2','Restricted'))
    name=models.CharField(max_length=30,unique=True)
    created_by=models.IntegerField()
    updated_by=models.IntegerField(null=True,blank=True)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    deleted = models.CharField(max_length=1,choices=DELETE_CHOICES,default='0')
    deleted_by = models.IntegerField(null=True, blank=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    class Meta:
        ordering=['-id']

    def __str__(self):
        return self.name
'''class for type of the lead'''
class Type(models.Model):

    DELETE_CHOICES=(('0','False'),('1','True'),('2','Restricted'))
    name=models.CharField(max_length=30,unique=True)
    created_by=models.IntegerField()
    updated_by=models.IntegerField(null=True,blank=True)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    deleted = models.CharField(max_length=1,choices=DELETE_CHOICES,default='0')
    deleted_by = models.IntegerField(null=True, blank=True)
    deleted_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        ordering=['-id']

    def __str__(self):
        return self.name
'''class for creating a lead'''
class Lead(models.Model):

    DELETE_CHOICES=(('0','False'),('1','True'),('2','Restricted'))
    STATUS_CHOICES=(('OPEN','Open Lead'),('QL','Feasible Lead'),('UQL','Non Feasible Lead'),('CBNC','Closed But Not Converted'),('CNC','Closed And Converted'),('LC','Lead Conversion'))
    LEAD_CHOICES=(('CC','Call Center'),('WEB','Website'),('JD','Just Dial'),('SE','Sales Executive'),('CR','Customer Referral'),('OTH','Other Lead'))
    LEAD_TYPE_CHOICES=(('HOM','Home'),('LL','Leased Line'),('BUS','Business'),('COR','Corporate'),('GOV','Government'))
    ASSIGN_CHOICES=(('NOW','Assign Now'),('LAT','Assign Later'))
    FRANCHISE_CHOICES=(('GSR','GOLI SAMBASIVA RAO'),('KAK','KAKINADA'),('SP','SAI PRASAD'),('VOF','VBC ON FIBER'),('VR','VBC Rajahmundry'),('VM','VBCMDP'))
    DEPARTMENT_CHOICES=(('ADMIN','Admin Department'),('SUP','Support Department'))
    FREQUENCY_CHOICES = (('DAILY', 'Daily'), ('WEEK', 'Weekly'), ('MONTH', 'Monthly'))

    type=models.ForeignKey(Type,on_delete=models.CASCADE)
    status=models.CharField(max_length=5,choices=STATUS_CHOICES)##Choice field 
    lead_source=models.ForeignKey(Source,on_delete=models.CASCADE)


    first_name=models.CharField(max_length=70)
    last_name=models.CharField(max_length=70,default="N/A")
    mobile_no=models.CharField(max_length=20)
    alternate_mobile_no=models.CharField(max_length=20,default="N/A")
    email=models.EmailField(null=True,blank=True)
    
    house_no=models.CharField(max_length=50)
    landmark=models.CharField(max_length=50,default="N/A")
    street=models.CharField(max_length=50)
    city=models.CharField(max_length=50)
    pincode=models.CharField(max_length=10)
    district=models.CharField(max_length=50)
    state=models.CharField(max_length=50)
    country=models.CharField(max_length=50)
    area=models.IntegerField()
    notes=models.TextField()
    
    assign=models.CharField(max_length=3,choices=ASSIGN_CHOICES,default='LAT',null=True,blank=True)
    department=models.IntegerField(null=True,blank=True)
    assigned_to=models.IntegerField(null=True,blank=True)

    created_by=models.IntegerField()
    updated_by=models.IntegerField(null=True,blank=True)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    onboarded_on = models.DateField(null=True,blank=True)
    frequency = models.CharField(max_length=5, choices=FREQUENCY_CHOICES, null=True, blank=True)
    follow_up = models.DateTimeField(null=True, blank=True)

    customer_id=models.IntegerField(null=True,blank=True)
    deleted = models.CharField(max_length=1,choices=DELETE_CHOICES,default='0')
    deleted_by = models.IntegerField(null=True, blank=True)
    deleted_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        ordering=['-created_at']

    def __str__(self):
        return self.first_name

'''creating a ticket with created lead '''

def create_ticket(sender,instance, **kwargs):
    if instance.assign=='NOW':
        url='https://dev.vbc.cloudtaru.com:7004/create/ticket'
        data={
                "opened_by":1,
                "customer_notes":instance.notes,
                "status": "ASN",
                "assigned_date": instance.created_at,
                "open_for": instance.assigned_to,
                "notes": instance.notes,
                "ticket_category": 14,
                "priority_sla": 7,
                "sub_category": 10,
                "watchlists": [5],
                "work_notes": [5]
                }
        response=requests.post(url,data=data)
        print(response.text)


post_save.connect(create_ticket,sender=Lead)


class PushNotifications(models.Model):
    DELETE_CHOICES=(('0','False'),('1','True'),('2','Restricted'))
    TASK_CHOICES = (('DAILY', 'Daily'), ('WEEK', 'Weekly'), ('MONTH', 'Monthly'),('ONE-TIME-TASK','ONE-TIME-TASK'))
    title = models.CharField(max_length=255)
    body = models.TextField()
    image = models.TextField(null=True, blank=True)#for now we kept as null=true. later we will add cloudanaryImage field
    topic = models.CharField(max_length=255)
    # user = models.IntegerField(max_length=255)
    scheduled_date = models.DateTimeField(null=True,blank=True)
    isSent = models.BooleanField(default=False)
    task_type = models.CharField(max_length=20,choices=TASK_CHOICES,null=True,blank=True)
    
    created_by=models.IntegerField()
    updated_by=models.IntegerField(null=True,blank=True)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)

    deleted = models.CharField(max_length=1,choices=DELETE_CHOICES,default='0')
    deleted_by = models.IntegerField(null=True, blank=True)
    deleted_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        ordering=['-id']