from django.urls import path
from .views import GetAddOrRemoveUserRelationshipApiView, GetAllUserRelationshipsApiView

urlpatterns = [
    path("", GetAddOrRemoveUserRelationshipApiView.as_view(), name="get__add_or_remove_user_relationship"),
    path("all/", GetAllUserRelationshipsApiView.as_view(), name="get_all_user_relationship"),
]
