from django.urls import path
from . import views

urlpatterns = [
    path('account/<str:username>', views.index, name='note_account'),
    path('account/<str:username>/profile', views.profile_management, name='profile-management'),
    path('get-profile-notes', views.get_profile_notes, name='get-profile-notes'),
    path('account/update-note/<int:note_id>', views.update_note, name='update-note'),
    path('account/delete-note/<int:note_id>', views.deleteNote, name='delete-note'),
    path('add-tag', views.createTag, name='add-tag'),
    path('add-note', views.createNote, name='add-note'),
    path('delete-selected-notes', views.delete_checkbox, name='delete-selected-notes'),
    path('load-more-notes/', views.load_more_notes, name='load-more-notes'),
    path('search-notes/', views.search_notes, name='search-notes'),
]
