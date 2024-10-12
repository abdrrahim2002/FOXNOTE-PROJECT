from django.shortcuts import redirect
from django.shortcuts import render
#if visiting the domain name if the user is new it will redirect him to the home page else if he have account it will redirect hime to his account
def redirect_view(request):
  return redirect('/home/')


def custom_404(request, exception):
    return render(request, '404.html', status=404)