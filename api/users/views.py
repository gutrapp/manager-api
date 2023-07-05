from django.utils.decorators import method_decorator
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from .models import Project, Developer, Bug, Task
from .serializer import DeveloperSerializer, ProjectSerializer, BugSerializer, TaskSerializer, UserSerializer
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib import auth
from django.contrib.auth.models import User
import json
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect

# +==============================================================================================================================+
# |                                                          AUTH VIEWS                                                          |
# +==============================================================================================================================+

class UseSession(APIView):
    def get(self, request, format=None):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CheckAuthenticatedView(APIView):
    def get(self, request, format=None):
        is_auth = User.is_authenticated

        if not is_auth:
            return Response({'message': 'No current user'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response({'message': 'Authorized'}, status=status.HTTP_200_OK)

@method_decorator(csrf_protect, name='dispatch')
class RegisterView(APIView):
    permission_classes = (permissions.AllowAny, )

    def post(self, request, format=None):
        data = self.request.data
        username = data['username']
        password = data['password']

        try:
            if User.objects.filter(username=username).exists():
                return Response({'message': 'Username already exists'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                user = User.objects.create_user(username=username, password=password)
                user = User.objects.get(id=user.id)
                developer = Developer.objects.create(session=user, first_name='', last_name='', age=0, email='')
                developer.save()

                return Response({'message': 'User created successfully'}, status=status.HTTP_200_OK)
        except:
            return Response({'message': 'Something went wrong when registering account'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@method_decorator(csrf_protect, name='dispatch')
class LoginView(APIView):
    permission_classes = (permissions.AllowAny, )

    def post(self, request, format=None):
        data = self.request.data
        username = data['username']
        password = data['password']

        user = auth.authenticate(username=username, password=password)

        if user is None:
            return Response({ 'message': 'Error authenticating' }, status=status.HTTP_401_UNAUTHORIZED)
        
        try:
            auth.login(request, user)
            return Response({ 'message': 'User logged' })
        except:
            return Response({ 'message': 'Something went wrong when logging in' }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
class LogoutView(APIView):
    def delete(self, request, format=None):
        try:
            auth.logout(request)
            return Response({ 'message': 'Logged out' })
        except:
            return Response({ 'message': 'Eror loggin out' })


@method_decorator(ensure_csrf_cookie, name='dispatch')
class GetCSRFToken(APIView):
    permission_classes = (permissions.AllowAny, )

    def get(self, request, format=None):
        Response().set_cookie("csrftoken")
        return Response({'message': 'CSRF cookie set'})

# +==============================================================================================================================+
# |                                                          DEVELOPER VIEWS                                                     |
# +==============================================================================================================================+

@api_view(['GET'])
def developer_list(request):
    developers = Developer.objects.all()
    serializer = DeveloperSerializer(developers, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET', 'PUT', 'DELETE'])
def developer_detail(request, id):
    try:
        developer = Developer.objects.get(id=id)
    except:
        return Response({"message": "Developer of id {} doesn't exist".format(id)}, status=status.HTTP_204_NO_CONTENT)

    if request.method == 'GET':
        serializer = DeveloperSerializer(developer)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    if request.method == 'DELETE':
        developer.delete()
        return Response({"message": "Developer deleted successfuly"}, status=status.HTTP_200_OK)
    
    if request.method == 'PUT':
        serializer = DeveloperSerializer(data=request.data, instance=developer)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Developer updated successfuly"}, status=status.HTTP_200_OK)
        return Response({"message": "Data provided is invalid"}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)

@api_view(['GET'])
def developer_relations_bugs(request, id):
    try:
        developer = Developer.objects.get(id=id)
    except:
        return Response({"message": "Task of id {} doesn't exist".format(id)}, status=status.HTTP_204_NO_CONTENT)
    
    if request.method == 'GET':
        serializer = BugSerializer(developer.bug_set.all(), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def developer_relations_tasks(request, id):
    try:
        developer = Developer.objects.get(id=id)
    except:
        return Response({"message": "Task of id {} doesn't exist".format(id)}, status=status.HTTP_204_NO_CONTENT)
    
    if request.method == 'GET':
        serializer = TaskSerializer(developer.task_set.all(), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def developer_relations_projects(request, id):
    try:
        developer = Developer.objects.get(id=id)
    except:
        return Response({"message": "Task of id {} doesn't exist".format(id)}, status=status.HTTP_204_NO_CONTENT)
    
    if request.method == 'GET':
        serializer = ProjectSerializer(developer.project_set.all(), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
@api_view(['GET'])
def search_developers_name(request, query):
    serializer = DeveloperSerializer(Developer.objects.all().filter(name__icontains=query), many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


# +==============================================================================================================================+
# |                                                          PROJECT VIEWS                                                       |
# +==============================================================================================================================+

@api_view(['GET', 'POST'])
def project_list(request):
    if request.method == 'GET':
        projects = Project.objects.all()
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == 'POST':
        serializer = ProjectSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Project created successfuly"}, status=status.HTTP_200_OK)
        return Response({"message": "Data provided is invalid"}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)

@api_view(['GET', 'PUT', 'DELETE'])
def project_detail(request, id):
    try:
        project = Project.objects.get(id=id)
    except:
        return Response({"message": "Project of id {} doesn't exist".format(id)}, status=status.HTTP_204_NO_CONTENT)

    if request.method == 'GET':
        serializer = ProjectSerializer(project)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    if request.method == 'DELETE':
        project.delete()
        return Response({"message": "Project deleted successfuly"}, status=status.HTTP_200_OK)
    
    if request.method == 'PUT':
        serializer = ProjectSerializer(data=request.data, instance=project)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Project updated successfuly"}, status=status.HTTP_200_OK)
        return Response({"message": "Data provided is invalid"}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
    
@api_view(['GET'])
def project_relations_tasks(request, id):
    try:
        project = Project.objects.get(id=id)
    except:
        return Response({"message": "Task of id {} doesn't exist".format(id)}, status=status.HTTP_204_NO_CONTENT)
    
    if request.method == 'GET':
        serializer = TaskSerializer(project.task_set.all(), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def project_relations_developers(request, id):
    try:
        project = Project.objects.get(id=id)
    except:
        return Response({"message": "Task of id {} doesn't exist".format(id)}, status=status.HTTP_204_NO_CONTENT)
    
    if request.method == 'GET':
        serializer = DeveloperSerializer(project.developers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
@api_view(['GET'])
def project_relations_bugs(request, id):
    try:
        project = Project.objects.get(id=id)
    except:
        return Response({"message": "Task of id {} doesn't exist".format(id)}, status=status.HTTP_204_NO_CONTENT)
    
    if request.method == 'GET':
        serializer = BugSerializer(project.bug_set.all(), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

@api_view(['GET'])
def search_projects_name(request, query):
    serializer = ProjectSerializer(Project.objects.all().filter(name__icontains=query), many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def search_projects_description(request, query):
    serializer = ProjectSerializer(Project.objects.all().filter(description__icontains=query), many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

# +==============================================================================================================================+
# |                                                          TASK VIEWS                                                          |
# +==============================================================================================================================+

@api_view(['GET', 'POST'])
def task_list(request):
    if request.method == 'GET':
        tasks = Developer.objects.all()
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == 'POST':
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Developer created successfuly"}, status=status.HTTP_200_OK)
        return Response({"message": "Data provided is invalid"}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)

@api_view(['GET', 'PUT', 'DELETE'])
def task_detail(request, id):
    try:
        task = Task.objects.get(id=id)
    except:
        return Response({"message": "Task of id {} doesn't exist".format(id)}, status=status.HTTP_204_NO_CONTENT)

    if request.method == 'GET':
        serializer = TaskSerializer(task)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    if request.method == 'DELETE':
        task.delete()
        return Response({"message": "Task deleted successfuly"}, status=status.HTTP_200_OK)
    
    if request.method == 'PUT':
        serializer = TaskSerializer(data=request.data, instance=task)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Task updated successfuly"}, status=status.HTTP_200_OK)
        return Response({"message": "Data provided is invalid"}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
    
@api_view(['GET'])
def task_relations_project(request, id):
    try:
        task = Task.objects.get(id=id)
    except:
        return Response({"message": "Task of id {} doesn't exist".format(id)}, status=status.HTTP_204_NO_CONTENT)
    
    if request.method == 'GET':
        serializer = ProjectSerializer(task.project)
        return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def task_relations_bugs(request, id):
    try:
        task = Task.objects.get(id=id)
    except:
        return Response({"message": "Task of id {} doesn't exist".format(id)}, status=status.HTTP_204_NO_CONTENT)
    
    if request.method == 'GET':
        serializer = BugSerializer(task.bug_set.all(), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def task_relations_developers(request, id):
    try:
        task = Task.objects.get(id=id)
    except:
        return Response({"message": "Task of id {} doesn't exist".format(id)}, status=status.HTTP_204_NO_CONTENT)
    
    if request.method == 'GET':
        serializer = DeveloperSerializer(task.developers.all(), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
@api_view(['GET'])
def get_complete_tasks(request):
    serializer = TaskSerializer(Task.objects.all().filter(complete=True), many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_uncomplete_tasks(request):
    serializer = TaskSerializer(Task.objects.all().filter(complete=False), many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def search_tasks_title(request, query):
    serializer = TaskSerializer(Task.objects.all().filter(title__icontains=query), many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def search_tasks_description(request, query):
    serializer = TaskSerializer(Task.objects.all().filter(description__icontains=query), many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

# +==============================================================================================================================+
# |                                                          BUGS VIEWS                                                          |
# +==============================================================================================================================+

@api_view(['GET', 'POST'])
def bug_list(request):
    if request.method == 'GET':
        bugs = Bug.objects.all()
        serializer = BugSerializer(bugs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == 'POST':
        serializer = BugSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Bug created successfuly"}, status=status.HTTP_200_OK)
        return Response({"message": "Data provided is invalid"}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)

@api_view(['GET', 'PUT', 'DELETE'])
def bug_detail(request, id):
    try:
        bug = Bug.objects.get(id=id)
    except:
        return Response({"message": "Bug of id {} doesn't exist".format(id)}, status=status.HTTP_204_NO_CONTENT)
        
    if request.method == 'GET':
        serializer = BugSerializer(bug)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    if request.method == 'DELETE':
        bug.delete()
        return Response({"message": "Bug deleted successfuly"}, status=status.HTTP_200_OK)
    
    if request.method == 'PUT':
        serializer = BugSerializer(data=request.data, instance=bug)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Bug updated successfuly"}, status=status.HTTP_200_OK)
        return Response({"message": "Data provided is invalid"}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)

@api_view(['GET'])
def bug_relations_task(request, id):
    try:
        bug = Bug.objects.get(id=id)
    except:
        return Response({"message": "Task of id {} doesn't exist".format(id)}, status=status.HTTP_204_NO_CONTENT)
    
    if request.method == 'GET':
        serializer = TaskSerializer(bug.task)
        return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def bug_relations_developer(request, id):
    try:
        bug = Bug.objects.get(id=id)
    except:
        return Response({"message": "Task of id {} doesn't exist".format(id)}, status=status.HTTP_204_NO_CONTENT)
    
    if request.method == 'GET':
        serializer = DeveloperSerializer(bug.developer)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
@api_view(['GET'])
def bug_relations_project(request, id):
    try:
        bug = Bug.objects.get(id=id)
    except:
        return Response({"message": "Task of id {} doesn't exist".format(id)}, status=status.HTTP_204_NO_CONTENT)
    
    if request.method == 'GET':
        serializer = ProjectSerializer(bug.project)
        return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_solved_bugs(request):
    serializer = BugSerializer(Bug.objects.all().filter(solved=True), many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_unsolved_bugs(request):
    serializer = BugSerializer(Bug.objects.all().filter(solved=False), many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def search_bugs_title(request, query):
    serializer = BugSerializer(Bug.objects.all().filter(title__icontains=query), many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def search_bugs_description(request, query):
    serializer = BugSerializer(Bug.objects.all().filter(description__icontains=query), many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)