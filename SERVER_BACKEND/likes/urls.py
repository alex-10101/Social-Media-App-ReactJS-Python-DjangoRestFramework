from django.urls import path
from .views import LikeUnlikeApiView

urlpatterns = [
    path("", LikeUnlikeApiView.as_view(), name="like_unlike"),
]
