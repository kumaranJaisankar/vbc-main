from django.urls import path
from . import views
from rest_framework_simplejwt import views as jwt_views


urlpatterns=[

    path('lead/display',views.LeadList.as_view(),name='display_leads'),## display all leads
    path('lead/create',views.LeadCreate.as_view(),name='create_lead'),##create lead
    # path('lead/filter',views.LeadFilterList.as_view(),name="filtered_leads"),##filter leads
    path('lead/<int:pk>/delete',views.LeadDelete.as_view(),name='delete_leads'),##delete lead
    path('lead/<int:pk>/rud',views.LeadUpdate.as_view(),name='update leads'),##update lead
    path('lead/<int:pk>/read',views.LeadRetrieve.as_view(),name="view a lead"),
    path('lead/delete/multiple',views.DeleteMultipleLeads.as_view(),name='delete_multiple_leads'),
    path('lead/uploadcsv', views.FileUpload.as_view(), name='upload_csv'),
    path('lead/options',views.LeadOptions.as_view(),name='display options for dropdowns'),

    path('lead/dashboard',views.LeadDashBoard.as_view(),name="displays dashboard related data"),

    path('source/create',views.CreateSource.as_view(),name='create new lead source'),
    path('source/delete',views.DeleteSource.as_view(),name='delete lead source'),
    path('source/display',views.ListSource.as_view(),name='list all lead sources'),
    path('source/<int:pk>/edit',views.UpdateSource.as_view(),name='edit lead source'),

    path('type/create',views.CreateType.as_view(),name='create new lead type'),
    path('type/delete',views.DeleteType.as_view(),name='delete lead type'), 
    path('type/display',views.ListType.as_view(),name='list all lead types '),
    path('type/<int:pk>/edit',views.UpdateType.as_view(),name='edit lead type'),

    path('updateto/customer/<int:pk>',views.AddCustomerId.as_view()),
    path('customer/conversion',views.LeadTransition.as_view()),
    path('lead/create/partial',views.LeadPartialCreate.as_view()),
    path('lead/uploadcsv/partial',views.PartialFileUpload.as_view()),
    path('lead/closed',views.LeadClosed.as_view()),
    path('v2/lead/display',views.LeadV2List.as_view(),name='display_leads_v2'),
    path('lead/export',views.LeadExport.as_view()),
    path('lead/unconverted',views.UnConvertedLeads.as_view()),
    path('lead/dashboard/v2',views.DashBoardV2.as_view()),
    path('dummy',views.CheckUsers.as_view()),

    path('expiry/alrets',views.ExpiryAlerts.as_view()),
    path('bot/lead/create',views.BotLeadCreate.as_view()),
    path('expiryuserstesting',views.ExpiryUsersTesting.as_view()),

    path('lead/reports',views.LeadReports.as_view()),
    
    path('push/notification/schedule/create',views.PushNotificationScheduler.as_view())
    
]