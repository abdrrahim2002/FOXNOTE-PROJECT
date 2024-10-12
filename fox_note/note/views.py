from django.shortcuts import render, redirect, HttpResponse, get_object_or_404
from profile_auth.models import Profile
from .models import note, tags 
from .forms import noteForm, TagFormSet
from django.contrib import messages
from django.contrib.auth import get_user_model, logout
from django.contrib.auth.decorators import login_required
from django.http import Http404
from django.core.exceptions import PermissionDenied
from django.views.decorators.http import require_GET
from django.http import JsonResponse, HttpResponseForbidden
import json 
from django.db import IntegrityError
from datetime import datetime
from allauth.socialaccount.models import SocialAccount




User = get_user_model()

@login_required
def index(request, username):
  try:
    profile=request.user.id
    user = User.objects.get(username=username)
    note_form = noteForm(profile=profile)
    tag_formset = TagFormSet(queryset=tags.objects.none())
  except User.DoesNotExist:
    raise Http404('user does not exist')
  
  if request.user.username != username:
    raise PermissionDenied
  
  return render(request, 'note/index.html', {
    'user':user,
    'note_form':note_form,
    'tag_formset':tag_formset
  })

##################################################################################################


#using AJAX to get the profile notes
@login_required
@require_GET
def get_profile_notes(request):

  if request.headers.get('X-Requested-with') != 'XMLHttpRequest':
    return HttpResponseForbidden('Forbidden: only AJAX request are allowed')
  
  user_id = request.user.id #get the user id
  profile_notes = note.objects.filter(profile=user_id).order_by('-creation_date')[:5] #get the related notes to the user id
  has_more = note.objects.filter(profile=request.user.id).count() > 3
  
  #create a list for the AJAX
  notes_data = []
  for profile_note in profile_notes:
    tags = [tag.tag for tag in profile_note.tag.all()] #the tags are manytomany relation so we must loop throu them
    notes_data.append({
      'id':profile_note.id,
      'title':profile_note.title,
      'tag':tags,
      'content':profile_note.content,
      'creation_date':profile_note.creation_date,
    })

   
  return JsonResponse({'notes':notes_data, 'has_more':has_more, 'status':'success'}, safe= False)

##################################################################################################
#function  to load more notes
@login_required
def load_more_notes (request):
  if request.method == 'GET':
    offset = int(request.GET.get('offset', 0))
    print(f'offset = {offset}')
    limit = 3
    profile_notes = note.objects.filter(profile=request.user.id).order_by('-creation_date')[offset:offset + limit]
    has_more = note.objects.filter(profile=request.user.id).count() > offset + limit

    
    #create a list for the AJAX
    notes_data = []
    for profile_note in profile_notes:
      tags = [tag.tag for tag in profile_note.tag.all()] #the tags are manytomany relation so we must loop throu them
      notes_data.append({
        'note_id':profile_note.id,
        'note_title':profile_note.title,
        'note_tags':tags,
        'note_content':profile_note.content,
        'creation_date':profile_note.creation_date,
        
      })


    return JsonResponse({'notes': notes_data, 'has_more': has_more, 'status':'success'}, safe=False)



##################################################################################################
#AJAX request to update the note
@login_required
def update_note(request, note_id):
  if request.method == 'PUT':
    try:
      data = json.loads(request.body)
      content = data.get('content','')
      title = data.get('title', '')
      #fetch the note
      note_target = get_object_or_404(note, id=note_id)

      #update the note content
      note_target.content = content
      note_target.title = title
      note_target.save()

      #return the json response message
      return JsonResponse({'message': 'profile updated successfuly', 'content':content})
    
    except Exception:
      return JsonResponse({'error':str(Exception)}, status=400)
    

  return JsonResponse({'error': 'invalid request method'}, status=400)


##################################################################################################
@login_required
def deleteNote(request, note_id):
  if request.method == 'DELETE':
    try:
      data = json.loads(request.body)
      note_id = data.get('note_id', '')

      #fetch note
      note_target = get_object_or_404(note, id=note_id)
      
      note_target.delete()

      return JsonResponse({'message':'delete the note complete'})
    
    except Exception:
      return JsonResponse({'error': str(Exception)}, status=400)
  
  return JsonResponse({'error': 'invalid request method'}, status=400)

##################################################################################################
@login_required
def createNote(request):
  if request.method == 'POST':
    form = noteForm(request.POST)

    if form.is_valid():
      new_note = form.save(commit=False)

      #set the data
      tags_list = request.POST.getlist('tag')
      new_note.profile_id = request.user.id
      new_note.content = request.POST.get('note_content')

      new_note.save()
      new_note.tag.set(tags_list)

      #print(request.POST.get('note_content'))
      #print(tags_list)
      
      #tag dictionnary to store the tagID and the tagName
      tag_dic = {}

      #get all the tags who was created by the user
      tag_database = tags.objects.filter(profile=request.user.id)

      #loop throw the tag list that the user selected and store theme in the tag_dic to send it with the JSON
      for tag in tags_list :
        tag_name = tag_database.get(id=tag)#get the name of the tag by query the database
        tag_dic[tag]= str(tag_name)

      print(f'tag dic = {tag_dic}')

      #json respons
      return JsonResponse({
        'status':'success',
        'message':'note add successfullt',
        'note_id':new_note.id,
        'note_title':new_note.title,
        'note_tags':tag_dic,
        'note_content':new_note.content,
        'creation_date': new_note.creation_date}, status=200)
      '''
      return JsonResponse({
        'status':'success',
        'message':'note add successfully',
        'note_title':note.title,
        'note_tags':note.tag,
        'note_content':note.content
      }, status=200)
      '''
      
    else:
      print(f'error : {form.errors}')
      return JsonResponse({'status': 'error', 'message': 'faild'}, status=400)
  
  # If not an AJAX request or not a POST request
  else:
    return JsonResponse({'status': 'error', 'message': 'Invalid request'}, status=400)







##################################################################################################
@login_required
def createTag(request):
  if request.method == 'POST':
    form = TagFormSet(request.POST)

    if form.is_valid():
      #try if we can store the new data cuz we can't do a duplicate tag from the same user
      try:
        new_tag = form.save(commit=False)#get the tag name from the from
        tag = tags(tag=str(new_tag[0]), profile_id=request.user.id)#create new tag with the new tag name and the user profile id
        tag.save()#save the new tag
        
      
        # Return success response
        return JsonResponse({
          'status': 'success', 
          'message': 'Tag added successfully',
          'new_tag_id':tag.id,# Include the new tag's ID
          'new_tag_name':tag.tag # Include the new tag's name
          }, status=200)
      
      #if the tag nor created succesfully because of duplication in the user who create the same tag twice i will helndel it by this exception
      except IntegrityError:
        # Return error response for duplicate entry
        return JsonResponse({'status': 'error', 'message': 'Tag already exists for this profile'}, status=400)


        
    else:
      # Return error response
      return JsonResponse({'status': 'error', 'message': 'Form data is not valid'}, status=400)
    
  else:
    # If not an AJAX request or not a POST request
    return JsonResponse({'status': 'error', 'message': 'Invalid request'}, status=400)



##################################################################################################

#function to handle the deleted checkboxes 
@login_required
def delete_checkbox(request):
  if request.method == 'POST':
    try:
      data = json.loads(request.body)
      print(data)

      for note_id in data :
        note_target = get_object_or_404(note, id=int(note_id), profile=request.user.id)
        note_target.delete()
      #fetch note
      #note_target = get_object_or_404(note, id=note_id)
      
      #note_target.delete()

      return JsonResponse({'message':'delete the note complete'}, status=200)
      
    except Exception:
      return JsonResponse({'error': str(Exception)}, status=400)
    
  return JsonResponse({'error': 'invalid request method'}, status=400)



##################################################################################################
#function to handel the search note
@login_required
def search_notes(request):
  title = request.GET.get('title', None) # strip() for removes any leading or trailing whitespace.
  tag = request.GET.get('tag', None) # strip() for removes any leading or trailing whitespace.

  
  # Start with all notes that belong to the logged-in user
  notes = note.objects.all().filter(profile=request.user.id)
  


  
  if title and tag==None:
    searched = notes.filter(title__icontains=title).order_by('-creation_date')

  elif title== None and tag:
    # Find tags that match the query (case-insensitive, partial match)
    matching_tags = tags.objects.filter(tag__icontains=tag)

    # Find notes that have any of the matching tags
    searched = note.objects.filter(tag__in=matching_tags).distinct().order_by('-creation_date')

  elif title and tag:
    # Find tags that match the query (case-insensitive, partial match)
    matching_tags = tags.objects.filter(tag__icontains=tag)
    searched = notes.filter(title__icontains=title, tag__in=matching_tags).distinct().order_by('-creation_date')
    


  print(f'searcher : {searched}')

  #create a list for the AJAX
  notes_data = []
  for profile_note in searched:
    note_tags = [tag.tag for tag in profile_note.tag.all()] #the tags are manytomany relation so we must loop throu them
    notes_data.append({
      'note_id':profile_note.id,
      'note_title':profile_note.title,
      'note_tags':note_tags,
      'note_content':profile_note.content,
      'creation_date':profile_note.creation_date,
      
    })




  return JsonResponse({'notes': notes_data, 'status':'success'}, safe=False)













##################################################################################################




##################################################################################################

@login_required
def delete_profile(request):
  if request.method == 'POST':
    user = request.user
    user.delete()
    logout(request)# Log out the user after deleting their account
    messages.success(request, "Your profile has been successfully deleted.")
    return redirect('home')# Redirect to the home page or another appropriate page
  
  return render(request, 'account/delete_profile.html')





##################################################################################################


@login_required
def profile_management(request, username):
  user = User.objects.get(id = request.user.id)

  #calculate the user age
  today = datetime.today().date()

  # get the user birthday
  birthdate = user.birthday

  # Calculate age
  if user.birthday:
      birthdate = user.birthday
      user_age = today.year - birthdate.year - ((today.month, today.day) < (birthdate.month, birthdate.day))
  else:
      user_age = None  # or handle it appropriately


  #calculate the notes number
  notes_number = note.objects.filter(profile = request.user.id).count() #count the number of notes that created by the user

  #calculate the tags number
  tags_number = tags.objects.filter(profile = request.user.id).count()

  #check if the user is linked his account with third party app like google in this case
  social_accounts = SocialAccount.objects.filter(user=request.user)  # Get all linked social accounts for the user

  print(user.gender)

  return render(request,'note/profile-management.html', {
    'user': user,
    'user_age': user_age,
    'notes_number': notes_number,
    'tags_number':tags_number,
    'social_accounts': social_accounts
  })