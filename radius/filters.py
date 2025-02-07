from django_filters import rest_framework as filters
from .models import Lead

class LeadFilter(filters.FilterSet):
    status = filters.CharFilter(field_name='status',lookup_expr='exact')
    follow_up = filters.CharFilter(field_name='follow_up',lookup_expr='date__exact')
    first_name = filters.CharFilter(field_name='first_name',lookup_expr='icontains')
    last_name = filters.CharFilter(field_name='last_name',lookup_expr='icontains')
    mobile_no = filters.CharFilter(field_name='mobile_no',lookup_expr='icontains')
    lead_source = filters.CharFilter(field_name = 'lead_source__name',lookup_expr='exact')
    type = filters.CharFilter(field_name='type__name',lookup_expr='exact')
    created = filters.DateTimeFilter(field_name='created_at', lookup_expr='date__gte')
    created_end = filters.DateTimeFilter(field_name='created_at', lookup_expr='date__lte')
    assigned_to=filters.NumberFilter(field_name='assigned_to', label="Search")

    class Meta:
        model = Lead
        fields = ['status', 'follow_up','first_name','last_name','lead_source','created_at','type','mobile_no','assigned_to']

class LeadV2Filter(filters.FilterSet):
    created = filters.DateTimeFilter(field_name='created_at',lookup_expr='date__gte') #start_date
    created_end = filters.DateTimeFilter(field_name='created_at',lookup_expr='date__lte') #end_date
    status = filters.CharFilter(field_name='status',lookup_expr='exact')
    is_customer = filters.BooleanFilter(field_name = 'onboarded_on', lookup_expr = 'isnull', exclude = True)
    modified = filters.DateFilter(field_name='onboarded_on',lookup_expr='gte') #start_date
    modified_end = filters.DateFilter(field_name='onboarded_on',lookup_expr='lte') #end_date
    class Meta:
        model = Lead
        fields = ['created_at','status','onboarded_on']