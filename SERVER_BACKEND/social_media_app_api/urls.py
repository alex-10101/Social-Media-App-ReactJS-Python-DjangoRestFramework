"""
URL configuration for social_media_app_api project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/auth/", include("authentication.urls")),
    path("api/posts/", include("posts.urls")),
    path("api/comments/", include("comments.urls")),
    path("api/likes/", include("likes.urls")),
    path("api/users/", include("users.urls")),
    path("api/relationships/", include("user_relationships.urls")),
] 

# In development (DEBUG=True) – use Django’s helper
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# In production (DEBUG=False) – still let Django serve media
else:
    urlpatterns += [
        re_path(r'^media/(?P<path>.*)$', serve, {
            'document_root': settings.MEDIA_ROOT,
        }),
    ]

# When the server is running in production (Debug=False), use this handler500
# to catch unexpected errors and send a message to the users.
handler500 = "utils.customExceptionHandler.handle_500_error"
