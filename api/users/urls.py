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
    path('developer/info', views.GetDeveloperInfo.as_view()),
    path('developer/filter/projects/<str:name>/<str:description>', views.GetDeveloperProjectsFilter.as_view()),
    path('developer/filter/bugs/<str:name>/<str:description>', views.GetDeveloperBugsFilter.as_view()),
    path('developer/filter/tasks/<str:name>/<str:description>', views.GetDeveloperTasksFilter.as_view()),

    path('project/<int:id>', views.BasicProjectViews.as_view()),
    path('project', views.ProjectDefaultViews.as_view()),

    path('task/<int:id>', views.BasicTaskViews.as_view()),
    path('task', views.TaskDefaultViews.as_view()),

    path('bug/<int:id>', views.BasicBugViews.as_view()),
    path('bug', views.BugDefaultViews.as_view()),
]
