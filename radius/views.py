from ossaudiodev import SOUND_MIXER_MONITOR
from django.utils import timezone
from html5lib import serialize
from rest_framework.serializers import Serializer
# from radius.tasks import limit_check
import paramiko
from rest_framework import generics,status
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from datetime import datetime
from rest_framework.permissions import IsAuthenticated
from django.conf import settings

from radius.filters import LeadFilter,LeadV2Filter

from .models import Lead
from .utility_2 import select, update, packet_of_disconnect
from rest_framework.decorators import permission_classes
import requests
# from django.contrib.auth.models import User
from .serializers import *
from .permissions import *
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from radius import permissions
from django.forms.models import model_to_dict
import requests
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry
from .utility import publish_message
import datetime
from .utility_2 import select,getZonalmanagerAreas,getStaffAreas
from .pagination import *
from django.db.models import Count,F

'''Displaying leads as per the log-in user'''
class LeadList(generics.ListAPIView):
    permission_classes = [CommonPermission]

    def __init__(self):
        self.allowed_permissions_get = [PAGE_LEAD]
    queryset = Lead.objects.all()
    serializer_class = LeadCreateSerializer

    def get_queryset(self):
        user = self.request.user.username
        token = self.request.headers.get('Authorization')
        leads=Lead.objects.filter(deleted='0')

        if (ADMIN in get_cache_permissions(token)['permissions']) or (SUPER_ADMIN in get_cache_permissions(token)['permissions']):
            return leads
        
        elif (BRANCH_OWNER in get_cache_permissions(token)['permissions']):
            areas = getBranchAreas(user)
            return leads.filter(area__in = areas)

        elif (FRANCHISE_OWNER in get_cache_permissions(token)['permissions']):
            areas = getFranchiseAreas(user)
            return leads.filter(area__in = areas)

        elif (ZONAL_MANAGER in get_cache_permissions(token)['permissions']):
            areas=getZonalmanagerAreas(user)
            return Lead.objects.filter(deleted='0').filter(area__in = areas) 
        elif (STAFF in get_cache_permissions(token)['permissions']) or (HELPDESK in get_cache_permissions(token)['permissions']):
            areas=getStaffAreas(user)
            return Lead.objects.filter(deleted='0').filter(area__in = areas) 
        else :
            return []
                
def create_ticket(request,data):
    from datetime import datetime
    import json
    lead_id=data["id"]
    open_for='L'+str(lead_id)
    if data["status"]=="QL":
        sub_category=2
    else:
        sub_category=1
    # print(data['updated_by'] is None)
    if data['updated_by'] is None:
        user=data['created_by']
    else:
        user=data['updated_by']=Lead.objects.get(id=data['id']).updated_by
    assigned_to = Lead.objects.get(id = lead_id).assigned_to
    url="{}:7004/enh/create".format(settings.DOMAIN)
    # post_data={'watchlists':[{"user":user}],'work_notes':[],'opened_by':request.user.username,'status':'OPN','ticket_category':1,'priority_sla':1,
    # 'sub_category':sub_category,"customer_notes": "Created Ticket for a Lead","open_for":open_for,"created_by":request.user.username}
    # if data['assigned_to'] is not None:
    #     post_data['assigned_to']=Lead.objects.get(id=lead_id).assigned_to
    #     post_data['assigned_date']=datetime.now()
    #     post_data['status']='ASN'
    
    # json_data=json.dumps(post_data,indent=4, sort_keys=True, default=str)
    # print(json_data)
    data = {
    "customer_notes": "Created Ticket for a Lead",
    "open_for": open_for,
    "watchlists": [],
    "notes": "Hi",
    "status": "ASN",
    "ticket_category": "1",
    "priority_sla": "1",
    "sub_category": f"{sub_category}",
    "work_notes": [],
    "opened_by": request.user.username,
    "open_date": "",
    "assigned_to": assigned_to,
    "department": "",
    "branch": "",
    "created_by": request.user.username
}

    headers = {"content-type": "application/json; charset=UTF-8",
               'Authorization': request.headers.get('Authorization')}

    # publish_message(data=json_data,to_addresses=['miscer-helpdesk'])
    response=requests.request("POST",url=url,headers=headers,data=json.dumps(data))
    print('reeeeee',url,headers,data,response)

def getAvailablePlans():
    query="SELECT package_name,upload_speed,download_speed,fup_limit,package_data_type,total_plan_cost FROM plans_servicepackage;"
    data=select(query,database='service')
    for i in data:
        i['total_plan_cost']=float(i['total_plan_cost'])
        if i['package_data_type']=='ULT':
            i['fup_limit']='UNLIMITED'
    return data
'''sending a mail to  lead which contains list of available plans that currently providing'''
def send_email(leaddata):
    # data=getAvailablePlans()
    # context={"data":data}
    context={"lead_name":leaddata['first_name']+' '+leaddata['last_name']}
    # print(context)
    html_content = render_to_string('new_mail.html', context)
    text_content = strip_tags(html_content)
    email=EmailMultiAlternatives(
        "Thank You for Your Interest",
        text_content,
        settings.EMAIL_HOST_USER,
        [leaddata['email']]
    )
    email.attach_alternative(html_content,"text/html")
    email.send()

'''if lead is already exists '''
def ifLeadExists(request,user,lead,data):
    from datetime import datetime
    if lead.deleted=='0':
        '''if lead is not a deleted one we are throwing an error '''
        created=False
        return Response("A mobile number with that record already exists",status=status.HTTP_400_BAD_REQUEST),created,None
    else:
        ''' if lead is not a deleted lead then we are overriding the previous object with new request data'''
        data['lead_source']=data['lead_source']['id']
        data['type']=data['type']['id']
        serializer=LeadCreateSerializer(lead,data=data)
        if serializer.is_valid():
            serializer.save()
            lead.deleted,lead.created_by,lead.created_at='0',user,datetime.now()
            lead.updated_by=lead.updated_at=lead.deleted_by=lead.deleted_at=lead.customer_id=None
            if 'assigned_to' not in data:
                lead.assigned_to=None
            if 'department' not in data:
                lead.department=None
            if 'frequency' not in data:
                lead.frequency=None
            if 'follow_up' not in data:
                lead.follow_up=None
            lead.save()
            response_data=LeadCreateSerializer(lead).data
            created=True
            if serializer.data['status']=='QL' or serializer.data['status']=='LC':
                '''we have to create a ticket when lead is created, depending on the qulalified lead or lead conversion'''
                create_ticket(request,serializer.data)
            '''sending a mail to  lead which contains list of available plans that currently providing'''
            send_email([lead.email])
            return Response(response_data),created,response_data
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST),False

def createNewLeadRecord(request,user,data):
    data['created_by']=user
    data['lead_source']=data['lead_source']['id']
    data['type']=data['type']['id']
    serializer=LeadCreateSerializer(data=data)
    if serializer.is_valid(raise_exception=ValueError):
        lead_source=Source.objects.get(id=data.pop('lead_source'))
        type=Type.objects.get(id=data.pop('type'))
        lead_instance=Lead.objects.create(**data,lead_source=lead_source,type=type)
        created=True
        lead_dict=LeadCreateSerializer(lead_instance).data
        if data['status']=="QL" or data['status']=="LC":
            '''we have to create a ticket when lead is created, depending on the qulalified lead or lead conversion'''
            create_ticket(request,lead_dict)
        try:
            send_email(lead_dict)
        except Exception as e:
            print("Error occured while sending email",e)
        return Response(lead_dict,status=status.HTTP_201_CREATED),created,lead_dict

    return Response(serializer.error_messages,status=status.HTTP_400_BAD_REQUEST),False

class LeadPartialCreate(APIView):
    permission_classes = [CommonPermission]
    def __init__(self):
        self.allowed_permissions_post = [LEAD_CREATE]

    def post(self,request):
        user=self.request.user.username
        lead=Lead.objects.filter(mobile_no=request.data['mobile_no']) ##Checking If a lead with that record exists
        if lead.exists():
            lead=lead[0]
            response,_,created_record=ifLeadExists(request,user,lead,request.data)
            '''lead exists then check for deleted or existing lead'''
        else:
            response,_,created_record=createNewLeadRecord(request,user,request.data)
            '''if there is no record with that lead we are creating a lead'''
        return response

def getAreaId(area):
    area_query="SELECT id FROM accounts_area WHERE name='{}'".format(area)
    area_id=select(area_query,'admin')[0]["id"]
    return area_id
''' we can insert multiple records at once by iterating the list of records'''
class PartialFileUpload(APIView):
    permission_classes = [CommonPermission]
    def __init__(self):
        self.allowed_permissions_post = [LEAD_IMPORT]
        
    def post(self,request):
        uncreated_records=[]
        created_records=[]
        user=self.request.user.username
        json_data=request.data
        for i in json_data:
            i['lead_source']={'id':Source.objects.get(name=i['lead_source']).id,'name':i['lead_source']}
            i['type']={'id':Type.objects.get(name=i['type']).id, 'name':i['type']}
            i['area']=getAreaId(i['area'])
            i['status'],i['assign']='OPEN','LAT'
            lead=Lead.objects.filter(mobile_no=i['mobile_no']) ##Checking If a lead with that record exists
            if lead.exists():
                response,created,new_record=ifLeadExists(request,user,lead[0],i)
                if created==False:
                    uncreated_records.append(i)
                else:
                    created_records.append(new_record)
            else:
                response,created,new_record=createNewLeadRecord(request,user,i)
                if created==False:
                    uncreated_records.append(i)
                else:
                    created_records.append(new_record)
        new_ids=[i['id'] for i in created_records]
        emails=list(Lead.objects.filter(id__in=new_ids).values_list('email',flat=True))
        send_email(emails)
        final_response={'duplicate':uncreated_records,'created':created_records}
        '''sending the created and not created records from the multiple records'''
        return Response(final_response)   

class LeadCreate(APIView):
    permission_classes = [CommonPermission]
    def __init__(self):
        self.allowed_permissions_post = [LEAD_CREATE]

    def post(self,request):

        lead_test=Lead.objects.filter(mobile_no=request.data['mobile_no']) ##Checking If a lead with that record exists
        if lead_test.exists():
            lead_hidden=lead_test[0]
            if lead_hidden.deleted=='0':
                return Response("A mobile number with that record already exists")
            else:
                lead=lead_hidden
                data=request.data
                serializer=LeadCreateSerializer(lead,data=data)
                if serializer.is_valid():
                    serializer.save()
                    lead.deleted,lead.created_by,lead.created_at='0',self.request.user.username,datetime.now()
                    lead.updated_by=lead.updated_at=lead.deleted_by=lead.deleted_at=None
                    lead.save()
                    if serializer.data['status']=='QL' or serializer.data['status']=='LC':
                        create_ticket(request,serializer.data)
                    return Response(serializer.data)
                return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

        '''If lead with a that mobile number doesnt exist below code block is excecuted'''
        created_by=self.request.user.username
        print('created_by')
        request.data['created_by']=created_by
        serializer=LeadCreateSerializer(data=request.data)
        if serializer.is_valid(raise_exception=ValueError):
            print("hola")
            lead_source=Source.objects.get(id=request.data.pop('lead_source'))
            type=Type.objects.get(id=request.data.pop('type'))
            lead_instance=Lead.objects.create(**request.data,lead_source=lead_source,type=type)
            lead_dict=model_to_dict(lead_instance)
            lead_dict['lead_source'],lead_dict['type']=model_to_dict(Source.objects.get(id=lead_dict.pop('lead_source'))),model_to_dict(Type.objects.get(id=lead_dict.pop('type')))
            zone_query="SELECT name FROM accounts_zone WHERE id={}".format(lead_dict.pop('zone'))
            lead_dict['zone']=select(zone_query,'admin')[0]["name"]
            if request.data['status']=="QL" or request.data['status']=="LC":
                create_ticket(request,lead_dict)
            send_email([lead_dict['email']])
            return Response(lead_dict,status=status.HTTP_201_CREATED)

        return Response(serializer.error_messages,status=status.HTTP_400_BAD_REQUEST)


class LeadDelete(generics.DestroyAPIView):
    permission_classes = [CommonPermission]
    def __init__(self):
        self.allowed_permissions_delete = [LEAD_DELETE]

    queryset=Lead.objects.all()
    serializer_class=LeadSerializer

class LeadRud(generics.RetrieveUpdateDestroyAPIView):
    queryset=Lead.objects.all()
    serializer_class=LeadSerializer#update

    permission_classes = [CommonPermission]
    def __init__(self):
        self.allowed_permissions_get = [LEAD_READ]
        self.allowed_permissions_delete=[LEAD_DELETE]
        self.allowed_permissions_update=[LEAD_UPDATE]
        
class LeadUpdate(APIView):
    permission_classes = [CommonPermission]
    def __init__(self):
        self.allowed_permissions_update = [LEAD_UPDATE]
        
    def put(self,request,pk,format=None):
        lead=Lead.objects.get(id=pk)
        previous_mail=lead.email
        data=request.data
        data['type']=data.pop('type')['id']
        data['lead_source']=data.pop('lead_source')['id']
        serializer=LeadUpdateSerializer(lead,data=data)
        if serializer.is_valid():
            serializer.save()
            lead.updated_by=self.request.user.username
            lead.save()
            if serializer.data['status']=='QL' or serializer.data['status']=='LC':
                create_ticket(request,serializer.data)
            if lead.email!=previous_mail:
                send_email([lead.email])
            return Response(serializer.data)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

class AddCustomerId(generics.UpdateAPIView):
    # permission_classes = [CommonPermission]
    # def __init__(self):
    #     self.allowed_permissions_update = [LEAD_UPDATE]
        
    queryset=Lead.objects.all()
    serializer_class=LeadCreateSerializer
    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user.username)

class LeadClosed(APIView):
    def post(self,request):
        lead=Lead.objects.get(customer_id=request.data['id'])
        lead.status='CNC'
        lead.save()
        return Response("Lead status Converted to 'CNC'")

class LeadTransition(generics.RetrieveAPIView):
    permission_classes = [CommonPermission]
    def __init__(self):
        self.allowed_permissions_get = [PAGE_LEAD]
        
    def get(self, request):
        leads=Lead.objects.filter(customer_id__isnull=False).values()
        for i in leads:
            query="SELECT account_status FROM customers_customer WHERE id={}".format(i['customer_id'])
            i['conversion_status']=select(query,database='customer')[0]['account_status']
        return Response(leads)

class LeadRetrieve(generics.RetrieveAPIView):
    permission_classes = [CommonPermission]
    def __init__(self):
        self.allowed_permissions_get = [LEAD_READ]
        
    queryset=Lead.objects.all()
    serializer_class=LeadCreateSerializer

class DeleteMultipleLeads(APIView):
    permission_classes = [CommonPermission]
    def __init__(self):
        self.allowed_permissions_delete = [LEAD_DELETE]
        
    def delete(self,request):
        # Lead.objects.filter(pk__in=request.data['ids']).delete()
        deleted_leads=Lead.objects.filter(pk__in=request.data['ids'])
        print(self.request.user.username)
        deleted_leads.update(deleted='1',deleted_by=self.request.user.username,deleted_at=timezone.now())
        for i in deleted_leads:
            i.save()
        return Response('Deleted Successfully !!!')
        #{"ids":[1,2,3]}

class FileUpload(APIView):
    permission_classes = [CommonPermission]
    def __init__(self):
        self.allowed_permissions_post = [LEAD_IMPORT]
        
    def post(self,request):
        created_by=self.request.user.username
        before=Lead.objects.latest('id').id
        json_data=request.data

        data=[]
        for i,j in enumerate(json_data):
             status='OPEN'
             temp_lead=Lead(first_name=json_data[i]['first_name'],last_name=json_data[i]['last_name'],mobile_no=json_data[i]
             ['mobile_no'],alternate_mobile_no=json_data[i]['alternate_mobile_no'],email=json_data[i]['email'],
             type=Type.objects.get(name=json_data[i]['type']),house_no=json_data[i]['house_no'],street=json_data[i]['street'],
             city=json_data[i]['city'],district=json_data[i]['district'],pincode=json_data[i]['pincode'],
             status=status,landmark=json_data[i]['landmark'],country=json_data[i]['country'],notes=json_data[i]['notes'],
             assign='LAT',lead_source=Source.objects.get(name=json_data[i]['lead_source']),created_by=created_by,
             state=json_data[i]['state'],zone=json_data[i]['zone'])
             data.append(temp_lead)
        Lead.objects.bulk_create(data)

        after=Lead.objects.latest('id').id
        count=after-before
        new_ids=[i+1 for i in range(before,after)]
        emails=list(Lead.objects.filter(id__in=new_ids).values_list('email',flat=True))
        send_email(emails)
        return Response(LeadCreateSerializer(Lead.objects.filter(id__in=new_ids),many=True).data)

class LeadOptions(APIView):
    permission_classes = [IsAuthenticated]
        
    def get(self,request):
        return Response({
            'lead_source':LeadSourceSerializer(Source.objects.all(),many=True).data,
            'type':LeadTypeSerializer(Type.objects.all(),many=True).data,
        })
    
class CreateSource(APIView):
    permission_classes = [CommonPermission]
    def __init__(self):
        self.allowed_permissions_post = [LEAD_SOURCE_CREATE]

    def post(self,request):
        source,created=Source.objects.get_or_create(name=request.data["name"],defaults={'created_by':self.request.user.username})
        '''if created is true then the source of deleting choice is switches to false '''
        if not created:
            '''if created is false then the source is created'''
            source.deleted,source.created_by,source.created_at='0',self.request.user.username,datetime.now()
            source.updated_by=source.updated_at=source.deleted_by=source.deleted_at=None
            source.save()
        return Response(LeadSourceSerializer(source).data)


class DeleteSource(APIView):
    permission_classes = [CommonPermission]
    def __init__(self):
        self.allowed_permissions_delete = [LEAD_SOURCE_DELETE]
        
    def delete(self,request):
        # Source.objects.filter(pk__in=request.data['ids']).delete()
        deleted_sources=Source.objects.filter(pk__in=request.data['ids'])
        deleted_sources.update(deleted='1',deleted_by=self.request.user.username,deleted_at=timezone.now())
        for i in deleted_sources:
            i.save()
        return Response('Deleted Successfully !!')

class ListSource(generics.ListAPIView):
    # for authentication
    permission_classes = [CommonPermission]
    def __init__(self):
        self.allowed_permissions_get = [PAGE_ADMIN_LEAD_LEADSOURCE]
        
    queryset = Source.objects.all()
    serializer_class = LeadSourceSerializer
    def get_queryset(self):
        '''displaying the sources whose delete is set to false'''
        return Source.objects.filter(deleted='0')


class UpdateSource(generics.UpdateAPIView):
    permission_classes = [CommonPermission]
    def __init__(self):
        self.allowed_permissions_update = [LEAD_SOURCE_UPDATE]
        
    queryset=Source.objects.all()
    serializer_class=LeadSourceSerializer
    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user.username)

class CreateType(generics.CreateAPIView):
    permission_classes = [CommonPermission]
    def __init__(self):
        self.allowed_permissions_post = [LEAD_TYPE_CREATE]

    def post(self,request):
        type,created=Type.objects.get_or_create(name=request.data["name"],defaults={'created_by':self.request.user.username})
        if not created:
            type.deleted,type.created_by,type.created_at='0',self.request.user.username,datetime.now()
            type.updated_by=type.updated_at=type.deleted_by=type.deleted_at=None
            type.save()
        return Response(LeadTypeSerializer(type).data)
        

class DeleteType(generics.DestroyAPIView):
    permission_classes = [CommonPermission]
    def __init__(self):
        self.allowed_permissions_delete = [LEAD_TYPE_DELETE]
        
    def delete(self,request):
        # Type.objects.filter(pk__in=request.data['ids']).delete()
        deleted_types=Type.objects.filter(pk__in=request.data['ids'])
        deleted_types.update(deleted='1',deleted_by=self.request.user.username,deleted_at=timezone.now())
        for i in deleted_types:
            i.save()
        return Response('Deleted Successfully !!')

class ListType(generics.ListAPIView):
    permission_classes = [CommonPermission]
    def __init__(self):
        self.allowed_permissions_get = [PAGE_ADMIN_LEAD_LEADTYPE]
        
    queryset=Type.objects.all()
    serializer_class=LeadTypeSerializer
    def get_queryset(self):
        return Type.objects.filter(deleted='0')

class UpdateType(generics.UpdateAPIView):
    permission_classes = [CommonPermission]
    def __init__(self):
        self.allowed_permissions_update = [LEAD_TYPE_UPDATE]
        
    queryset=Type.objects.all()
    serializer_class=LeadTypeSerializer
    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user.username)


def getCountOfLeadByStatus(qs):
    statuses=Lead.STATUS_CHOICES
    op=[]
    for i in statuses:
        leads=qs.filter(status=i[0])
        count=leads.count()
        # count=len(Lead.objects.filter(status=i[0]))
        count_by_status=getCountOfLeadBySource(leads)
        count_by_types=getCountOfLeadByType(leads)
        op.append({'status':i[1],'count':count,'count_by_status':count_by_status,'count_by_types':count_by_types})
    return op

def getCountOfLeadBySource(queryset):
    sources=Source.objects.all()
    op=[]
    for i in sources:
        count=queryset.filter(lead_source=i).count()
        op.append({'source':i.name,'count':count})
    return op

def getCountOfLeadByType(queryset):
    types=Type.objects.all()
    op=[]
    for i in types:
        count=queryset.filter(type=i).count()
        op.append({'type':i.name,'count':count})
    return op

class LeadDashBoard(APIView):
    permission_classes = [CommonPermission]

    def __init__(self):
        self.allowed_permissions_get = [PAGE_DASHBOARD_LEAD]

    def get(self,request):
        token = request.headers.get('Authorization')
        user = self.request.user.username
        qs = Lead.objects.filter(deleted='0')

        if (ADMIN in get_cache_permissions(token)['permissions']) or (SUPER_ADMIN in get_cache_permissions(token)['permissions']):
            pass 
        
        elif (BRANCH_OWNER in get_cache_permissions(token)['permissions']):
            areas = getBranchAreas(user)
            qs = qs.filter(area__in = areas)

        elif (FRANCHISE_OWNER in get_cache_permissions(token)['permissions']):
            areas = getFranchiseAreas(user)
            qs = qs.filter(area__in = areas)
        
        else :
            return Response(None)

        data={}
        data['total_lead_count']=qs.count()
        today=datetime.date.today()
        months=['January','February','March','April','May','June','July','August','September','October','November','December']
        lead_generated_by_month={}
        leads_converted_by_month={}
        for (i,j) in enumerate(months):
            lead_generated_by_month[j]=getCountOfLeadBySource(qs.filter(created_at__year=today.year,created_at__month=i+1))
            leads_converted_by_month[j]=qs.filter(created_at__year=today.year,created_at__month=i+1).filter(status='LC').count()
        data['leads_generated_by_source']=lead_generated_by_month
        data['leads_converted_by_month']=leads_converted_by_month

        converted_leads= LeadCreateSerializer(qs.filter(status='LC'), many=True).data
        data['converted_leads']=converted_leads

        data['leads_by_status']=getCountOfLeadByStatus(qs)
        grouped_by_status = qs.values('status').annotate(count=Count('status')).order_by()
        data['status_count_dict'] = {i['status']:i['count'] for i in grouped_by_status}

        return Response(data)
                    
from django.db.models import Count
class  LeadV2List(generics.ListAPIView):

    permission_classes = [CommonPermission]
    # queryset = Lead.objects.all()    
    serializer_class = LeadV2Serializer
    filter_backends = (LeadFilter,)
    pagination_class = StandardResultSetPagination

    def __init__(self):
        self.allowed_permissions_get = [PAGE_LEAD]

    def get_queryset(self):
        token = self.request.headers.get('Authorization')
        leads = getLeadQS(token,self.request.user.username)
        return leads
    
    def get_counts(self, queryset):
        counts = {i[0].lower():queryset.filter(status=i[0]).count() for i in Lead.STATUS_CHOICES}
        counts['f_ups'] = queryset.filter(follow_up__date=datetime.datetime.today()).count()
        counts['all'] = queryset.count()
        return counts

    def list(self,request):
        queryset = self.get_queryset()
        if queryset:
            f = LeadFilter(request.GET,queryset=queryset)
            page = self.paginate_queryset(f.qs)
            if page is not None:
                count=len(f.qs)
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data,count)
            serializer = self.get_serializer(page, many=True)
            response = serializer.data
            return Response(response)
        return Response([])
    def get_paginated_response(self, data, extra_data):
        assert self.paginator is not None
        return self.paginator.get_paginated_response(data, extra_data)

    
    # for 
class LeadExport(generics.ListAPIView):
    permission_classes = [CommonPermission]
    serializer_class = LeadV2Serializer
    filterset_class = LeadFilter

    def get_queryset(self):
        token = self.request.headers.get('Authorization')
        leads = getLeadQS(token,self.request.user.username)
        return leads

    def __init__(self):
        self.allowed_permissions_get = [LEAD_EXPORT]

'''showing up the leads of different status in Ui'''
class UnConvertedLeads(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = LeadSerializer
    queryset = Lead.objects.filter(customer_id__isnull=True)

''' information in dashboard like count of leads and count of new registrations'''
class DashBoardV2(APIView):
    original_qs = Lead.objects.filter(deleted = '0')
    def get(self,request):
        response = {}
        params = {key:request.GET[key] for key in request.GET}
        leads = LeadV2Filter(params, queryset=self.original_qs)
        qs = leads.qs
        lead_datewise_count = qs.values('created_at__date').annotate(count = Count('id')).values('created_at__date','count').order_by('created_at__date')
        # lead_datewise_count = {str(rec["created_at__date"]):rec["count"] for rec in lead_datewise_count}
        response["leads"] = lead_datewise_count
        params["modified"],params["modified_end"],params["is_customer"] = params.pop("created"),params.pop("created_end"),True
        registered_leads = LeadV2Filter(params,queryset=self.original_qs)
        reg_qs = registered_leads.qs
        reg_lead_datewise_count = reg_qs.values('onboarded_on').annotate(count = Count('id')).values('onboarded_on','count').order_by('onboarded_on')
        # reg_lead_datewise_count = {str(rec["onboarded_on"]):rec["count"] for rec in reg_lead_datewise_count}
        response["registered_leads"] = reg_lead_datewise_count
        response["count"] = qs.count()
        # print(qs.count(),reg_qs.count())
        return Response(response)

   
class CheckUsers(APIView):
    print("hi")
    def get(self, request):
        scheduled_push_notification()
        return Response("None")

class ExpiryAlerts(APIView):
     def get(self, request):
        # deleting_staticip_after_renewal_time()
        scheduled_push_notification()
        return Response({"status":"done"})



class BotLeadCreate(APIView):
    def post(self,request):
        user=19521
        lead=Lead.objects.filter(mobile_no=request.data['mobile_no']) ##Checking If a lead with that record exists
        if lead.exists():
            lead=lead[0]
            response,_,created_record=ifLeadExists(request,user,lead,request.data)
            '''lead exists then check for deleted or existing lead'''
        else:
            response,_,created_record=createNewLeadRecord(request,user,request.data)
            '''if there is no record with that lead we are creating a lead'''
        return response


class ExpiryUsersTesting(APIView):
     def get(self, request):
        expire_users()
        return Response({"status":"done"})
     


class LeadReports(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    # queryset = Lead.objects.all()    
    serializer_class = LeadCreateSerializer
    filter_backends = (LeadFilter,)
    pagination_class = StandardResultSetPagination

    def filter_queryset(self, queryset):
        """
        Here we are filtering queryset based on params(fields)
        that are not directly avaialble in Customer Model
        """
        # filtered_queryset = super().filter_queryset(queryset)
        # if 'username' in self.request.GET:
        #     queryset = queryset.filter(
        #         user__in = list(AccountsUser.objects.filter(
        #             username__icontains = f"{self.request.GET['username']}"
        #         )))
        
        if 'area' in self.request.GET:
            areas = [int(id) for id in self.request.GET['area'].split(',')]
            return queryset.filter(area__in = areas)

        if 'zone' in self.request.GET:
            zones = [int(id) for id in self.request.GET['zone'].split(',')]
            zones=str(zones).replace('[',"(").replace(']',')')
            query=f"""select aa.id as area from admin.accounts_zone az 
                    join admin.accounts_area aa 
                    on aa.zone_id = az.id
                    where az.id in  {zones}"""
            areas=[i['area'] for i in  select3(query)]
            return queryset.filter(area__in = list(areas))

        if 'franchise' in self.request.GET:
            franchises =  [int(id) for id in self.request.GET['franchise'].split(',')]
            franchises=str(franchises).replace('[',"(").replace(']',')')
            query=f"""select aa.id as area from admin.franchise_metazone fm 
                join admin.accounts_area aa
                on aa.meta_zone_id = fm.id      
                where fm.franchise_id in {franchises}"""
            areas=[i['area'] for i in  select3(query)]
            return queryset.filter(area__in = list(areas))

        if 'branch' in self.request.GET:
            branches = [int(id) for id in self.request.GET['branch'].split(',')]
            branches=str(branches).replace('[',"(").replace(']',')')
            query=f"""select aa.id as area from admin.accounts_zone az
            join admin.accounts_area aa 
            on aa.zone_id =az.id 
			where az.branch_id in {branches}"""
            areas=[i['area'] for i in  select3(query)]
            return queryset.filter(area__in = list(areas))
        
        return queryset


    def get_queryset(self):
        token = self.request.headers.get('Authorization')
        leads = getLeadQS(token,self.request.user.username)
        return leads
    
    def get_counts(self, queryset):
        counts = {i[0].lower():queryset.filter(status=i[0]).count() for i in Lead.STATUS_CHOICES}
        counts['f_ups'] = queryset.filter(follow_up__date=datetime.datetime.today()).count()
        counts['all'] = queryset.count()
        return counts

    def list(self,request):
        params = request.GET  
        if ('area' in list(params.keys()) or 'zone' in list(params.keys()) or 'franchise' in list(params.keys()) or 'branch' in list(params.keys())):
            queryset = self.filter_queryset(self.get_queryset())
        else:
            queryset = self.get_queryset()
        
        f = LeadFilter(request.GET,queryset=queryset)
        if params.get('export')=='true':
            serializer = self.get_serializer(f.qs, many=True)
            response = serializer.data
        else:
            page = self.paginate_queryset(f.qs)
            if page is not None:
                count=len(f.qs)
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data,count)
            serializer = self.get_serializer(page, many=True)
            response = serializer.data
        return Response(response)
        
    def get_paginated_response(self, data, extra_data):
        assert self.paginator is not None
        return self.paginator.get_paginated_response(data, extra_data)


class PushNotificationScheduler(generics.ListCreateAPIView):
    serializer_class = PushNotificationSerializer  
    permission_classes = [IsAuthenticated] 

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if request.data['image']:
            file_path=image_upload_into_minio(request.data['image'])
            request.data['image']=file_path
        else:
            request.data['image']=None
        request.data['created_by']=request.user.username
        serializer.is_valid(raise_exception=True)
        serializer.save(created_by=request.user.username)
        return Response(serializer.data)
    
    def get(self, request, *args, **kwargs):
        queryset = PushNotifications.objects.all()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

        


    