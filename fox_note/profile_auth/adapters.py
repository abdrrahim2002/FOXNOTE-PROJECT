

from allauth.account.adapter import DefaultAccountAdapter
from django.urls import reverse

class CustomAccountAdapter(DefaultAccountAdapter):
    def get_login_redirect_url(self, request):
        # Get the username of the logged-in user
        username = request.user.username
        # Return the desired redirect URL
        return reverse('note_account', kwargs={'username': username})
