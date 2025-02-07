"""src URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path, include
from django.conf.urls import url
from django.views.generic import TemplateView
from rest_framework.schemas import get_schema_view
from django.views.generic import TemplateView
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('radius/',include('radius.urls')),
    path('api-sheet', TemplateView.as_view(template_name='swagger-ui.html', extra_context={'schema_url':'openapi-schema'}), name='swagger-ui'),
    path('redoc', TemplateView.as_view(template_name='redoc.html', extra_context={'schema_url':'openapi-schema'}), name='redoc'),
    path('openapi', get_schema_view(title="VBC-Main Project", description="Lead & VBC-main", version="1.0.0"), name='openapi-schema'),
    re_path('', TemplateView.as_view(template_name='index.html'), name='index'),
]
if settings.DEBUG:
    from django.conf.urls.static import static
    from django.contrib.staticfiles.urls import staticfiles_urlpatterns

    # serve static and media files from development server
    # urlpatterns += staticfiles_urlpatterns()
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
