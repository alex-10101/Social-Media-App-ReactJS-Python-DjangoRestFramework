from django.urls import path
from .views import GetPostAuthorApiView, GetCommentAuthorApiView, GetUserApiView, UpdateUserApiView

urlpatterns = [
    path("findPostAuthor/<int:postId>/", GetPostAuthorApiView.as_view(), name="get_post_author"),
    path("findCommentAuthor/<int:commentId>/", GetCommentAuthorApiView.as_view(), name="get_comment_author"),
    path("findUser/<int:userId>/", GetUserApiView.as_view(), name="get_user"),
    path("update/", UpdateUserApiView.as_view(), name="update_user"),
]
