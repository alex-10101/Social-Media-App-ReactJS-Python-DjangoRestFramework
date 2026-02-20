from rest_framework import serializers
from utils.compressImage import compress_image
from utils.sanitizeUserInput import sanitize_user_input
from .models import Post
from PIL import Image
from django.contrib.auth import get_user_model

User = get_user_model()

class GetPostAuthorSerializer(serializers.ModelSerializer):
    """
    Serializer which gets the id, username and profile picture of a user.
    """

    class Meta:
        model = User
        fields = ["id", "username", "profilePicture"]  

class GetPostSerializer(serializers.ModelSerializer):
    """
    Serializer which gets all the properties of a post, as well as the
    id, username and profile picture of the user who made the post.

    The id, username and profile picture of the user who made the post are
    retrieved through the GetPostAuthorSerializer (nested serialization). 

    The serializer also gets the number of comments on a post. 
    The "commentsCount" property is defined in the views.py file.
    (Not used anymore.)

    The serializer also gets the absolute url of to the image in the post.
    """

    img = serializers.SerializerMethodField()
    
    # The author of the post is the User who created it (Post.user),
    # exposed here as a nested "author" object for the frontend.
    # The mapping from user to author is made through `source="user"`.
    author = GetPostAuthorSerializer(source="user", read_only=True)

    # The number of comments on a post.
    # commentsCount = serializers.IntegerField(read_only=True)

    class Meta:
        model = Post
        fields = "__all__"

    def get_img(self, obj):
        """Method which returns the absolute URL of an image."""
        request = self.context.get("request")
        if obj.img and request:
            return request.build_absolute_uri(obj.img.url)
        return None
    
class CreatePostSerializer(serializers.ModelSerializer):
    """
    Serializer for creating a post and validating the users' fileuploads. 
    The fields the serializer expects are defined in the Meta inner class.
    """

    class Meta:
        model = Post
        fields = ["postDescription", "img"]
    
    def validate_img(self, value):
        if not value:
            return
        
        image = Image.open(value)

        media_type = image.get_format_mimetype()
        if media_type != "image/png" and media_type != "image/jpeg":
            raise serializers.ValidationError("Wrong media type. Only png and jpeg.")
        
        format = image.format

        if format != "PNG" and format != "JPEG":
            raise serializers.ValidationError("Wrong file format. Only png and jpeg.")

        try:
            image.verify()
        except:
            raise serializers.ValidationError("File not accepted.")

        # return value        
        return compress_image(value)


    def validate(self, data):
        return sanitize_user_input(data)
