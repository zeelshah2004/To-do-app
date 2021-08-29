from django.contrib import admin
from django.urls import path, include
from User import urls as user_urls
from TodoBackend import urls as todo_urls


urlpatterns = [
    path('admin/', admin.site.urls),
    path('task/', include(todo_urls)),
    path('user/', include(user_urls))
]
