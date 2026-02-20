from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from django.contrib.auth import get_user_model
from comments.models import Comment
from authentication.serializers import UserSerializer, UpdateUserSerializer
from posts.models import Post
from rest_framework.parsers import MultiPartParser, FormParser

User = get_user_model()

# Create your views here.

class GetPostAuthorApiView(APIView):
    """Class based view to get the author of a post. Not used anymore."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, postId):
        """Get the author of a comment. The postId is request parameter."""

        post = None
        try:
            post = Post.objects.get(id=postId)
        except Post.DoesNotExist:
            return Response(
                {"detail": "Post not found."}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        user = post.user

        serializer = UserSerializer(user,  context={"request": request})

        return Response(serializer.data, status=status.HTTP_200_OK)


class GetCommentAuthorApiView(APIView):
    """Class based view to get the author of a comment. Not used anymore."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, commentId):
        """Get the author of a post. The commentId is request parameter."""

        comment = None
        try:
            comment = Comment.objects.get(id=commentId)
        except Comment.DoesNotExist:
            return Response(
                {"detail": "Comment not found."}, 
                status=status.HTTP_404_NOT_FOUND
            )

        user = comment.user

        serializer = UserSerializer(user,  context={"request": request})

        return Response(serializer.data, status=status.HTTP_200_OK)


class GetUserApiView(APIView):
    """Class based view to get the profile of a particular user."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, userId):
        """Get the author of a post. The userId is a request parameter."""
        user = None
        try:
            user = User.objects.get(id=userId)
        except User.DoesNotExist:
            return Response(
                {"detail": "User not found."}, 
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = UserSerializer(user, context={"request": request})

        return Response(serializer.data, status=status.HTTP_200_OK)

class UpdateUserApiView(APIView):
    """Class based view to update the profile of a particular user."""

    permission_classes = [permissions.IsAuthenticated]
    # parser_classes are used because we are dealing with request data that comes in as FormData
    parser_classes = [MultiPartParser, FormParser]

    def put(self, request):
        """Creates a new post."""

        serializer = UpdateUserSerializer(data=request.data, partial=True, instance=request.user)

        if serializer.is_valid():
            serializer.save()            

            user = User.objects.get(id=request.user.id)
            user_serializer = UserSerializer(user, context={"request": request})

            return Response({"user": user_serializer.data}, status=status.HTTP_200_OK)

        return Response(
            {"detail": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST)
