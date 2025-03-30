from django.contrib import admin

# Register your models here.

from .models import UserResult

@admin.register(UserResult)
class UserResultAdmin(admin.ModelAdmin):
    list_display = ('user', 'score', 'created_at')
    search_fields = ('user__username',)
    list_filter = ('created_at', 'model')
    ordering = ('-created_at',)
    list_per_page = 20