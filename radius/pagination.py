from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
    
class StandardResultSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param ='limit'
    max_page_size = 30

    def get_paginated_response(self, data,context):
        response = sorted(data, key=lambda k: (k['id']))
        final_response = {
            'count': context,
            'results': reversed(response),
            'next': self.get_next_link(),
            'previous':self.get_previous_link(),
            'page':int(self.request.GET.get('page',1)),
            # 'status_counts':context,
            # 'reports_count':reports_count
        }
        return Response(final_response)