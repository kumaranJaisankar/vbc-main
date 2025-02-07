from .models import *
from rest_framework import serializers
from drf_writable_nested import WritableNestedModelSerializer
from .utility_2 import *

def getCrByUpBy(instance,data):
    '''
    Returns CreatedBy,UpdatedBy by performing raw sql queries when integers are provided
    '''
    created_by_query="SELECT username FROM accounts_user WHERE id={}".format(instance.created_by)
    data['created_by']=select(created_by_query,'admin')[0]['username']
    if instance.updated_by!=None:
        updated_by_query="SELECT username FROM accounts_user WHERE id={}".format(instance.updated_by)
        data['updated_by']=select(updated_by_query,'admin')[0]['username']
    else:
        data['updated_by']=None

def MergeAdminData(data):
    lead_id = data['id']
    query = f"""
        SELECT rl.id as lead_id, rl.department, d.name as dept_name, rl.assigned_to, concat(au.first_name," " ,au.last_name) as assigned_name,
        rl.created_by, concat(au1.first_name," " ,au1.last_name) as created_name, rl.updated_by, concat(au2.first_name," " ,au2.last_name) as updated_name,rl.area as area_id,
        aa.name as area
        from lead.radius_lead rl
        left outer join admin.accounts_department d
        on rl.department = d.id
        left outer join admin.accounts_user au
        on rl.assigned_to = au.id
        left outer join admin.accounts_user au1
        on rl.created_by = au1.id
        left outer join admin.accounts_user au2
        on rl.updated_by = au2.id
        left outer join admin.accounts_area aa
        on rl.area = aa.id
        where rl.id = {lead_id};
    """
    admin_data = select(query,database='default')[0]
    data['department'] = admin_data['dept_name']
    data['assigned_to'] = admin_data['assigned_name']
    data['created_by'] = admin_data['created_name']
    data['updated_by'] = admin_data['updated_name']
    data['area'] = admin_data['area']

    return data

class LeadSourceSerializer(serializers.ModelSerializer):
    class Meta:
        model=Source
        exclude=['created_by','updated_by']

    def to_representation(self, instance):
        context = super().to_representation(instance)
        getCrByUpBy(instance,context)
        return context

class LeadTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model=Type
        exclude=['created_by','updated_by']
        
    def to_representation(self, instance):
        context = super().to_representation(instance)
        getCrByUpBy(instance,context)
        return context

class LeadSerializer(serializers.ModelSerializer):
    class Meta:
        model=Lead
        fields="__all__"

# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model=User
#         fields=['id','username']
from rest_framework.validators import ValidationError
class LeadCreateSerializer(serializers.ModelSerializer):
    type=LeadTypeSerializer(read_only=True)
    lead_source=LeadSourceSerializer(read_only=True)
    class Meta:
        model=Lead
        exclude=['created_by','updated_by']

    def to_representation(self, instance):
        context=super().to_representation(instance)
        area_query="SELECT name FROM accounts_area WHERE id={}".format(context.pop('area'))
        try:
            context['area']=select(area_query,'admin')[0]["name"]
        except IndexError:
            raise ValidationError({
                'name': ['Area for lead : {} does not exist'.format(instance.id)]
            })
        getCrByUpBy(instance,context)
        if instance.department!=None:
            department_query="SELECT name FROM accounts_department WHERE id={}".format(context.pop('department'))
            try :
                context['department']=select(department_query,'admin')[0]["name"]
            except IndexError:
                raise ValidationError({
                    'department' : ['Department Assigned to Lead : {} does not exist'.format(instance.id)]
                })
        if instance.assigned_to!=None:
            assigned_to_query="SELECT username FROM accounts_user WHERE id={}".format(context.pop('assigned_to'))
            try:
                context["assigned_to"]=select(assigned_to_query,'admin')[0]["username"]
            except IndexError:
                raise ValidationError({
                    'assigned_to' : ['User Assigned to Lead : {} does not exist'.format(instance.id)]
                })
        return context

class LeadUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model=Lead
        exclude=['created_by','updated_by']

    def to_representation(self, instance):
        context=super().to_representation(instance)
        area_query="SELECT name FROM accounts_area WHERE id={}".format(context.pop('area'))
        context['area']=select(area_query,'admin')[0]["name"]
        getCrByUpBy(instance,context)
        if instance.department!=None:
            department_query="SELECT name FROM accounts_department WHERE id={}".format(context.pop('department'))
            context['department']=select(department_query,'admin')[0]["name"]
        if instance.assigned_to!=None:
            assigned_to_query="SELECT username FROM accounts_user WHERE id={}".format(context.pop('assigned_to'))
            context["assigned_to"]=select(assigned_to_query,'admin')[0]["username"]
        return context

class LeadSourceV2Serializer(serializers.ModelSerializer):
    class Meta :
        model = Source
        fields = ['id','name']

class LeadTypeV2Serializer(serializers.ModelSerializer):
    class Meta :
        model = Type
        fields = ['id','name']

class LeadV2Serializer(serializers.ModelSerializer):
    type=LeadTypeV2Serializer(read_only=True)
    lead_source=LeadSourceV2Serializer(read_only=True)
    class Meta:
        model = Lead
        fields = '__all__'
    
    def to_representation(self, instance):
        context = super().to_representation(instance)
        data = MergeAdminData(context)
        return data
    
import json, secrets, uuid, os, requests, random, string
from base64 import decodebytes

# from minio.error import ResponseError

BUCKET = settings.BUCKET
client = settings.CLIENT
# client = CLIENT

import tempfile
import uuid
import base64

def image_upload_into_minio(base64_string_data):
    # Strip the data type prefix if present (e.g., 'data:image/jpeg;base64,')
    if base64_string_data.startswith('data:image/jpeg;base64,'):
        base64_string_data = base64_string_data[len('data:image/jpeg;base64,'):]

    # Add padding if necessary for base64 decoding
    padding_needed = len(base64_string_data) % 4
    if padding_needed > 0:
        base64_string_data += '=' * (4 - padding_needed)

    # Decode base64 data
    try:
        image_data = base64.b64decode(base64_string_data)
    except Exception as e:
        print(f"Error decoding base64 string: {str(e)}")
        return None

    # Create a temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_file:
        temp_file.write(image_data)
        uploaded_file_path = temp_file.name

    # Generating unique filename
    test = str(uuid.uuid4().hex[:6])
    file_name = f'Promotions_{test}.jpg'

    # Upload to MinIO storage
    try:
        client.fput_object(BUCKET, f'Promotions/{file_name}', uploaded_file_path)
    except Exception as e:
        print(f"Error uploading file to MinIO: {str(e)}")
        return None

    # Generating absolute path in MinIO storage
    path = f'{BUCKET}%Promotions/{file_name}'

    return path


class PushNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PushNotifications
        fields = '__all__'

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user.username
        return PushNotifications.objects.create(**validated_data)
    def to_representation(self, instance):
        context = super().to_representation(instance)
        try:
            image_obj = str(instance.image)
            bucket = image_obj.rsplit('%', -1)[0]
            obj_name = image_obj.rsplit('%', 1)[1]
            
            image_preview_url = client.get_presigned_url("GET",f"{bucket}", f"{obj_name}",  
                                response_headers={"response-content-type": "application/jpg"},)
            context['image_preview'] = image_preview_url
        except:
            context['image_preview'] = None
        return context
