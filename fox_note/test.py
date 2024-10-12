

from note.models import note, tags, colors
from profile_auth.models import Profile
#to get all the notes how was created by specific profile

profile_target = Profile.objects.get(id='user id') #get the profile id
notes = note.objects.filter(profile= profile_target.id) #filter all the ralated notes to this profile


#to get the tag 
#in this example we will pretend that we have just one note related to the profile
profile_note = note.objects.get(profile=profile_target.id)#her we use the get because we have just one note related to a profile for example
note_tag = profile_note.tag.all()#the tag is ManyToManyField relation so it will be a list then i have to loop throu that list to get her items 'tags'

#to get the color
#the color is oneToMany relation so i there is one color for each note and don't forget to convet it to string using str()
note_color= profile_note.color

