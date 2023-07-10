from django.urls import path
from . import views

urlpatterns = [
    path('auth/register', views.RegisterView.as_view()),
    path('auth/login', views.LoginView.as_view()),
    path('auth/logout', views.LogoutView.as_view()),
    path('auth/csrf', views.GetCSRFToken.as_view()),
    path('auth/authenticated', views.CheckAuthenticatedView.as_view()),

    path('developer/<int:id>', views.UpdateDeveloper.as_view()),
    path('developer/session', views.GetSessionDeveloper.as_view()),
    path('developer/tasks', views.GetDeveloperTasks.as_view()),
    path('developer/bugs', views.GetDeveloperBugs.as_view()),
    path('developer/projects', views.GetDeveloperProjects.as_view()),

    path('project/filter/<str:name>/<str:description>', views.ProjectFilterNameAndDescription.as_view()),
    path('project/filter/<str:name>', views.ProjectFilterName.as_view()),
    path('project/filter/<str:description>', views.ProjectFilterDescription.as_view()),
    path('project/<int:id>', views.BasicProjectViews.as_view()),
    path('project', views.ProjectDefaultViews.as_view()),

    path('task/<int:id>', views.BasicTaskViews.as_view()),
    path('task/filter/<str:name>/<str:description>', views.TaskFilterTitleAndDescription.as_view()),
    path('task/filter/<str:name>', views.TaskFilterTitle.as_view()),
    path('task/filter/<str:description>', views.TaskFilterDescription.as_view()),
    path('task', views.TaskDefaultViews.as_view()),

    path('bug/<int:id>', views.BasicBugViews.as_view()),
    path('bug/filter/<str:name>/<str:description>', views.BugFilterTitleAndDescription.as_view()),
    path('bug/filter/<str:name>', views.BugFilterTitle.as_view()),
    path('bug/filter/<str:description>', views.BugFilterDescription.as_view()),
    path('bug', views.BugDefaultViews.as_view()),
]
