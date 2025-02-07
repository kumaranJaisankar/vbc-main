from .utility import get_cache_permissions
from rest_framework.permissions import BasePermission
 
LEAD_CREATE = 1
LEAD_READ = 2
LEAD_UPDATE = 3
LEAD_DELETE = 4
LEAD_LIST = 5
LEAD_SOURCE_CREATE = 61
LEAD_SOURCE_READ = 62
LEAD_SOURCE_UPDATE = 63
LEAD_SOURCE_DELETE = 64
LEAD_SOURCE_LIST = 65
LEAD_TYPE_CREATE = 66
LEAD_TYPE_READ = 67
LEAD_TYPE_UPDATE = 68
LEAD_TYPE_DELETE = 69
LEAD_TYPE_LIST = 70
PAGE_DASHBOARD_LEAD  = 276
SUPER_ADMIN = 313
ADMIN = 314
HELPDESK = 453
FRANCHISE_OWNER = 315
BRANCH_OWNER = 316
ZONAL_MANAGER = 452
STAFF = 317
PAGE_LEAD = 349
LEAD_IMPORT = 301
LEAD_EXPORT = 302
LEAD_FILTERS = 303
PAGE_ADMIN_LEAD = 399
PAGE_ADMIN_LEAD_LEADSOURCE = 400
PAGE_ADMIN_LEAD_LEADTYPE = 401

class CommonPermission(BasePermission):
    """
    Request will be served when any one permission is satisfied
    """
    message = "INSUFFICIENT_PERMISSIONS"
    def has_permission(self, request, view):
        if request.user.is_superuser or request.user.is_staff:
            return True
        token = request.headers.get('Authorization')
        user_permissions = get_cache_permissions(token)['permissions']
        allowed_permissions = []
        if request.method in ["GET"]:
            try:
                allowed_permissions = view.allowed_permissions_get
            except AttributeError:
                allowed_permissions = []
        elif request.method in ["PATCH", "PUT"]:
            try:
                allowed_permissions = view.allowed_permissions_update
            except AttributeError:
                allowed_permissions = []
        elif request.method in ["DELETE"]:
            try:
                allowed_permissions = view.allowed_permissions_delete
            except AttributeError:
                allowed_permissions = []
        elif request.method in ["POST"]:
            try:
                allowed_permissions = view.allowed_permissions_post
            except AttributeError:
                allowed_permissions = []
        for action_id in allowed_permissions:
            if action_id in user_permissions:
                return True
        return False

class StrictPermission(BasePermission):
    """
    Must satisfy all the permissions, then only the request will be served
    """
    message = "INSUFFICIENT_PERMISSIONS"
    def has_permission(self, request, view):
        if request.user.is_superuser or request.user.is_staff:
            return True
        token = request.headers.get('Authorization')
        user_permissions = get_cache_permissions(token)['permissions']
        allowed_permissions = []
        if request.method in ["GET"]:
            try:
                allowed_permissions = view.allowed_permissions_get
            except AttributeError:
                allowed_permissions = []
        elif request.method in ["PATCH", "PUT"]:
            try:
                allowed_permissions = view.allowed_permissions_update
            except AttributeError:
                allowed_permissions = []
        elif request.method in ["DELETE"]:
            try:
                allowed_permissions = view.allowed_permissions_delete
            except AttributeError:
                allowed_permissions = []
        elif request.method in ["POST"]:
            try:
                allowed_permissions = view.allowed_permissions_post
            except AttributeError:
                allowed_permissions = []
        for action_id in allowed_permissions:
            if action_id not in user_permissions:
                return False
        return True