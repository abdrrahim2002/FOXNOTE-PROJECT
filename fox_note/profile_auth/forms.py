from django import forms
from allauth.account.forms import SignupForm

class customSignupForm(SignupForm):
  def __init__(self, *args, **kwargs):
    super(customSignupForm, self).__init__(*args, **kwargs)
    self.fields['email']=forms.EmailField(required=True)
    self.fields['username']=forms.CharField(required=True)
    self.fields['birthday']=forms.DateField(required=True, widget=forms.DateInput(attrs={'type':'date'}))
    self.fields['gender']=forms.ChoiceField(required=True, choices=(('', 'Select Gender'), ('M','Male'), ('F', 'Female')))

  def save(self, request):
    user = super().save(request)
    user.email = self.cleaned_data['email']
    user.username = self.cleaned_data['username']
    user.birthday = self.cleaned_data['birthday']
    user.gender = self.cleaned_data['gender']
    user.save()
    return user