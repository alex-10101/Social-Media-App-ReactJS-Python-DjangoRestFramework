from django.urls import path
from .views import ListCreatePostsApiView, DeletePostApiView

urlpatterns = [
    path("", ListCreatePostsApiView.as_view(), name="list_create_posts"),
    path("<int:postId>/", DeletePostApiView.as_view(), name="delete_post"),
]
