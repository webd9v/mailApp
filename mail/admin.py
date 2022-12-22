from django.contrib import admin
from .models import Email,User
# Register your models here.
class EmailAdmin(admin.ModelAdmin):
    list_display=("id","user","sender","subject")
    filter_horizontal=("recipients",)

class UserAdmin(admin.ModelAdmin):
    list_display=("id","username","email")

admin.site.register(User,UserAdmin)
admin.site.register(Email,EmailAdmin)