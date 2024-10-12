from django import forms 
from .models import note, tags
from django.forms import modelformset_factory


class tagsForm(forms.ModelForm):
    
  class Meta:
    model = tags
    fields = ('tag',)
    labels = {
      'tag': 'New tag',
    }

    widgets = {
    'tag': forms.TextInput(attrs={'required': 'required'}),
    }




class noteForm(forms.ModelForm):
  
  class Meta:
    model = note
    fields = ('title', 'tag')

    widgets = {
    'title': forms.TextInput(attrs={'required': 'required'}),
    }

    

  def __init__(self, *args, **kwargs):
    profile = kwargs.pop('profile', None)  # Get the profile from kwargs
    print(f"Profile in form: {profile}")  # Debugging line to check profile
    super().__init__(*args, **kwargs)

    # Make the tag field optional (not required)
    self.fields['tag'].required = False
    
    # Filter tags by the user's profile
    if profile:
      self.fields['tag'].queryset = tags.objects.filter(profile=profile).order_by('tag')


TagFormSet = modelformset_factory(tags, form=tagsForm, extra=1)