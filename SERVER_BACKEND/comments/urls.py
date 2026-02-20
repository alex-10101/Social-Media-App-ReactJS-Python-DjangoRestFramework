from django.urls import path
from .views import CommentCountApiView, CommentListCreateApiView, CommentDetailApiView

urlpatterns = [
    path("", CommentListCreateApiView.as_view(), name="list_create_comment"),
    path("count/", CommentCountApiView.as_view(), name="comments-count"),    
    path("<int:postId>/<int:commentId>/", CommentDetailApiView.as_view(), name="detail_comment"),
]
