from django.contrib import admin
from .models import tags, note
# Register your models here.

class noteAdmin(admin.ModelAdmin):
  list_filter = ('profile',)
  list_display = ('profile', 'title','id')

class tagAdmin(admin.ModelAdmin):
  list_filter = ('profile',)
  list_display = ('profile', 'tag',)

admin.site.register(tags, tagAdmin)
admin.site.register(note, noteAdmin)

