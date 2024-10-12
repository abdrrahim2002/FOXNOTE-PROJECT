from django.urls import path
from . import views

urlpatterns = [
    #path('accounts/email-confirmation-sent/', views.email_confirmation_sent, name='email_confirmation_sent'),
    path('delete-profile/', views.delete_profile, name='delete_profile'),
]
