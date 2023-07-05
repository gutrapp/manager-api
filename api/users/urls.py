from django.urls import path
from . import views

urlpatterns = [
    path('auth/user', views.UseSession.as_view()),
    path('auth/register', views.RegisterView.as_view()),
    path('auth/login', views.LoginView.as_view()),
    path('auth/logout', views.LogoutView.as_view()),
    path('auth/csrf', views.GetCSRFToken.as_view()),
    path('auth/authenticated', views.CheckAuthenticatedView.as_view()),

    path('developer/', views.developer_list),
    path('developer/<int:id>', views.developer_detail),
    path('developer/tasks/<int:id>', views.developer_relations_tasks),
    path('developer/projects/<int:id>', views.developer_relations_projects),
    path('developer/bugs/<int:id>', views.developer_relations_bugs),
    path('developer/search/<str:query>', views.search_developers_name),

    path('project/', views.project_list),
    path('project/<int:id>', views.project_detail),
    path('project/tasks/<int:id>', views.project_relations_tasks),
    path('project/developers/<int:id>', views.project_relations_developers),
    path('project/bugs/<int:id>', views.project_relations_bugs),
    path('project/search/name/<str:query>', views.search_projects_name),
    path('project/search/description/<str:query>', views.search_projects_description),

    path('task/', views.task_list),
    path('task/complete', views.get_complete_tasks),
    path('task/uncomplete', views.get_uncomplete_tasks),
    path('task/<int:id>', views.task_detail),
    path('task/bugs/<int:id>', views.task_relations_bugs),
    path('task/developers/<int:id>', views.task_relations_developers),
    path('task/project/<int:id>', views.task_relations_project),
    path('task/search/title/<str:query>', views.search_tasks_title),
    path('task/search/description/<str:query>', views.search_tasks_description),

    path('bug/', views.bug_list),
    path('bug/solved', views.get_solved_bugs),
    path('bug/unsolved', views.get_unsolved_bugs),
    path('bug/<int:id>', views.bug_detail),
    path('bug/task/<int:id>', views.bug_relations_task),
    path('bug/developer/<int:id>', views.bug_relations_developer),
    path('bug/project/<int:id>', views.bug_relations_project),
    path('bug/search/title/<str:query>', views.search_bugs_title),
    path('bug/search/description/<str:query>', views.search_bugs_description),
]