from rest_framework import serializers
from .models import Comment
from utils.sanitizeUserInput import sanitize_user_input
from django.contrib.auth import get_user_model

User = get_user_model()


class GetCommentAuthorSerializer(serializers.ModelSerializer):
    """
    Serializer which gets the id, username and profile picture of a user.
    """

    class Meta:
        model = User
        fields = ["id", "username", "profilePicture"]  


class GetCommentSerializer(serializers.ModelSerializer):
    """
    Serializer which gets all the properties of a comment, as well as the
    id, username and profile picture of the user who made the comment.

    The id, username and profile picture of the user who made the comment are
    retrieved through the GetCommentAuthorSerializer (nested serialization). 
    """

    # The author of the post is the User who created it (Post.user),
    # exposed here as a nested "author" object for the frontend.
    # The mapping from user to author is made through `source="user"`.
    author = GetCommentAuthorSerializer(source="user", read_only=True)

    class Meta:
        model = Comment
        fields = "__all__"

    
class CreateCommentSerializer(serializers.ModelSerializer):
    """
    Serializer for creating a comment. 
    The fields the serializer expects are defined in the Meta inner class.
    """

    class Meta:
        model = Comment
        fields = ["commentDescription", "post"]


    def validate(self, data):
        return sanitize_user_input(data)
