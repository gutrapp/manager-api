from django.db import models
from django.contrib.auth.models import User


class Developer(models.Model):
    first_name = models.CharField(max_length=40)
    last_name = models.CharField(max_length=40)
    email = models.CharField(max_length=70)
    age = models.IntegerField()
    session = models.OneToOneField(User, on_delete=models.CASCADE)

class Project(models.Model):
    name = models.CharField(max_length=20)
    description = models.CharField(max_length=200)
    developers = models.ManyToManyField(Developer)

class Task(models.Model):
    title = models.CharField(max_length=20)
    description = models.CharField(max_length=200)
    complete = models.BooleanField(default=False)
    developers = models.ManyToManyField(Developer)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)

class Bug(models.Model):
    title = models.CharField(max_length=20)
    description = models.CharField(max_length=200)
    solved = models.BooleanField(default=False)
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    developer = models.ForeignKey(Developer, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)