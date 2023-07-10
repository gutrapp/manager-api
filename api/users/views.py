from django.utils.decorators import method_decorator
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from .models import Project, Developer, Bug, Task
from .serializer import DeveloperSerializer, ProjectSerializer, BugSerializer, TaskSerializer, UserSerializer
from rest_framework.response import Response
from rest_framework import status, permissions
from django.middleware.csrf import get_token
from django.contrib import auth
from django.contrib.auth.models import User
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect

# +==============================================================================================================================+
# |                                                          AUTH VIEWS                                                          |
# +==============================================================================================================================+

class CheckAuthenticatedView(APIView):
    def get(self, request, format=None):
        is_auth = User.is_authenticated

        if not is_auth:
            return Response({'auth': False}, status=status.HTTP_401_UNAUTHORIZED)
        user = request.user
        developer = user.developer

        return Response({'auth': True, 'id': developer.id}, status=status.HTTP_200_OK)

@method_decorator(csrf_protect, name='dispatch')
class RegisterView(APIView):
    permission_classes = (permissions.AllowAny, )

    def post(self, request, format=None):
        data = self.request.data
        username = data['username']
        password = data['password']

        try:
            if User.objects.filter(username=username).exists():
                return Response(status=status.HTTP_208_ALREADY_REPORTED)
            else:
                user = User.objects.create_user(username=username, password=password)

                user = User.objects.get(id=user.id)

                developer = Developer.objects.create(session=user, first_name='', last_name='', age=0, email='')

                developer.save()

                return Response(status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@method_decorator(csrf_protect, name='dispatch')
class LoginView(APIView):
    permission_classes = (permissions.AllowAny, )

    def post(self, request, format=None):
        data = self.request.data
        username = data['username']
        password = data['password']

        user = auth.authenticate(username=username, password=password)

        if user is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        
        try:
            auth.login(request, user)
            return Response(status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
class LogoutView(APIView):
    def delete(self, request, format=None):
        try:
            auth.logout(request)
            return Response(status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@method_decorator(ensure_csrf_cookie, name='dispatch')
class GetCSRFToken(APIView):
    permission_classes = (permissions.AllowAny, )
    
    def get(self, request, format=None):
        return Response({ 'csrftoken': True })

# +==============================================================================================================================+
# |                                                          DEVELOPER VIEWS                                                     |
# +==============================================================================================================================+

class UpdateDeveloper(APIView):
    def put(self, request, id, format=None):
        try:
            developer = Developer.objects.get(id=id)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)
    
        serializer = DeveloperSerializer(data=self.request.data, instance=developer)
        if serializer.is_valid():
            serializer.save

        return Response(status=status.HTTP_200_OK)

class GetDeveloperBugs(APIView):
    def get(self, request, format=None):
        user = request.user
        developer = user.developer
        serializer = BugSerializer(developer.bug_set.all(), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    
class GetDeveloperTasks(APIView):
    def get(self, request, format=None):
        user = request.user
        developer = user.developer
        serializer = TaskSerializer(developer.task_set.all(), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class GetDeveloperProjects(APIView):
    def get(self, request, format=None):
        user = request.user
        developer = user.developer
        serializer = ProjectSerializer(developer.project_set.all(), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class GetSessionDeveloper(APIView):
    def get(self, request, format=None):
        user = request.user
        user_serializer = UserSerializer(user)
        developer_serializer = DeveloperSerializer(user.developer)
        return Response({'user': user_serializer.data, 'developer': developer_serializer.data})

# +==============================================================================================================================+
# |                                                          PROJECT VIEWS                                                       |
# +==============================================================================================================================+

class ProjectDefaultViews(APIView):
    def post(self, request, format=None):
        serializer = ProjectSerializer(data=self.request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_422_UNPROCESSABLE_ENTITY)

class BasicProjectViews(APIView):
    def delete(self, request, id, format=None):
        try:
            project = Project.objects.get(id=id)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)
        user = request.user
        developer = user.developer

        if project.creator_id == developer.id:
            project.delete()
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_401_UNAUTHORIZED)


class ProjectFilterName(APIView):
    def get(self, request, name, format=None):
        serializer = ProjectSerializer(Project.objects.all().filter(name__icontains=name), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class ProjectFilterDescription(APIView):
    def get(self, request, description, format=None):
        serializer = ProjectSerializer(Project.objects.all().filter(description__icontains=description), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ProjectFilterNameAndDescription(APIView):
    def get(self, request, description, name, format=None):
        serializer = ProjectSerializer(Project.objects.all().filter(description__icontains=description, name__icontains=name), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

# +==============================================================================================================================+
# |                                                          TASK VIEWS                                                          |
# +==============================================================================================================================+

class TaskDefaultViews(APIView):
    def post(self, request, format=None):
        serializer = TaskSerializer(data=self.request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_422_UNPROCESSABLE_ENTITY)

class BasicTaskViews(APIView):
    def delete(self, request, id, format=None):
        try:
            task = Task.objects.get(id=id)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)
        user = request.user
        developer = user.developer

        if task.creator_id == developer.id:
            task.delete()
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    
    def put(self, request, id, format=None):
        try:
            task = Task.objects.get(id=id)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        user = request.user
        developer = user.developer

        if task.creator_id == developer.id:
            serializer = TaskSerializer(data=self.request.data, instance=task)
            if not serializer.is_valid():
                return Response(status=status.HTTP_422_UNPROCESSABLE_ENTITY)
            
            serializer.save
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_401_UNAUTHORIZED)

class TaskFilterTitle(APIView):
    def get(self, request, title, format=None):
        serializer = TaskSerializer(Task.objects.all().filter(title__icontains=title), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class TaskFilterDescription(APIView):
    def get(self, request, description, format=None):
        serializer = TaskSerializer(Task.objects.all().filter(description__icontains=description), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class TaskFilterTitleAndDescription(APIView):
    def get(self, request, description, title, format=None):
        serializer = TaskSerializer(Task.objects.all().filter(description__icontains=description, title__icontains=title), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

# +==============================================================================================================================+
# |                                                          BUGS VIEWS                                                          |
# +==============================================================================================================================+

class BugDefaultViews(APIView):
    def post(self, request, format=None):
        serializer = BugSerializer(data=self.request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_422_UNPROCESSABLE_ENTITY)

class BasicBugViews(APIView):
    def delete(self, request, id, format=None):
        try:
            bug = Bug.objects.get(id=id)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        user = request.user
        developer = user.developer

        if bug.developer == developer:
            bug.delete()
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    
    def put(self, request, id, format=None):
        try:
            bug = Bug.objects.get(id=id)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        user = request.user
        developer = user.developer

        if bug.developer == developer:
            serializer = BugSerializer(data=self.request.data, instance=bug)
            if not serializer.is_valid():
                return Response(status=status.HTTP_422_UNPROCESSABLE_ENTITY)
            
            serializer.save
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    
class BugFilterTitle(APIView):
    def get(self, request, title, format=None):
        serializer = BugSerializer(Bug.objects.all().filter(title__icontains=title), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class BugFilterDescription(APIView):
    def get(self, request, description, format=None):
        serializer = BugSerializer(Bug.objects.all().filter(description__icontains=description), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class BugFilterTitleAndDescription(APIView):
    def get(self, request, description, title, format=None):
        serializer = BugSerializer(Bug.objects.all().filter(description__icontains=description, title__icontains=title), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)