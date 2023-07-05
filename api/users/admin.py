from django.contrib import admin
from .models import Developer, Task, Project, Bug

admin.site.register(Developer)
admin.site.register(Project)
admin.site.register(Task)
admin.site.register(Bug)
