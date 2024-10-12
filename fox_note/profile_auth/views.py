from django.shortcuts import render, redirect
from profile_auth.models import Profile
from django.contrib import messages
from django.contrib.auth import get_user_model, authenticate, logout
from django.contrib.auth.decorators import login_required
from django.http import Http404
from django.core.exceptions import PermissionDenied
from allauth.account.views import LogoutView
# Create your views here.
'''
def email_confirmation_sent(request):
    return render(request, 'account/verification_sent.html')
'''


@login_required
def delete_profile(request):
  if request.method == 'POST':
    user = request.user
    user.delete()
    logout(request)# Log out the user after deleting their account
    messages.success(request, "Your profile has been successfully deleted.")
    return redirect('home')# Redirect to the home page or another appropriate page
  
  return render(request, 'account/delete_profile.html')