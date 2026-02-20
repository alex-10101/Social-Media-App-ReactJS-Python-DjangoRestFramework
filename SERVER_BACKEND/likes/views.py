from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from .models import Like
from posts.models import Post
from .serializers import LikeSerializer, AddLikeSerializer

# Create your views here.

class LikeUnlikeApiView(APIView):
    """
    Class based view for getting all likes on a particular post and for creating a new post
    and for liking or unliking a particular post. 
    """
    permission_classes=[permissions.IsAuthenticated]

    def get(self, request):
        """
        Get all the likes on a particular post. The postId is a request parameter.
        """
        post_id = request.query_params.get("postId")
        post_likes = Like.objects.filter(post=post_id)
        # post_likes = Like.objects.filter(post__id=post_id)
        serializer = LikeSerializer(post_likes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        """
        Like a particular post, or unlike an already appreaciated post.
        The postId is a request parameter.
        """
        post_id = request.query_params.get("postId")
        user_id = request.user.id

        # I should not be able to like my own post 
        # try:
        #     post = Post.objects.get(id=post_id)
        #     if post.user.id == user_id:
        #         return Response(status=status.HTTP_204_NO_CONTENT)
        # except Post.DoesNotExist:
        #     return Response(
        #         {"detail": "The post with the given id does not exist"},
        #         status=status.HTTP_404_NOT_FOUND
        #     )
    
        # remove like if it already exists
        existing_like = Like.objects.filter(user=request.user, post_id=post_id,).first()
        if existing_like:
            existing_like.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        
        serializer = AddLikeSerializer(data={"post": post_id})
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(status=status.HTTP_201_CREATED)

        return Response(
            {"detail": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST)


# class LikeUnlikeApiView(APIView):
#     """
#     Class based view for getting all likes on a particular post and for creating a new post
#     and for liking or unliking a particular post. 
#     """
#     permission_classes=[permissions.IsAuthenticated]

#     def get(self, request):
#         """
#         Return like summary for a post:
#         - likeCount: total likes on the post
#         - likedByCurrentUser: whether current user liked it
#         - id: current user's like id (or null)
#         """
#         post_id = request.query_params.get("postId")
#         if not post_id:
#             return Response(
#                 {"detail": "postId query param is required"},
#                 status=status.HTTP_400_BAD_REQUEST,
#             )

#         data = (
#             Post.objects
#             .filter(id=post_id)
#             .annotate(
#                 likeCount=Count("like", distinct=True),  # use your related_name; see note below
#                 likedByCurrentUser=Exists(
#                     Like.objects.filter(post_id=post_id, user=request.user)
#                 ),
#             )
#             .values("likeCount", "likedByCurrentUser")
#             .first()
#         )

#         if data is None:
#             return Response({"detail": "Post not found"}, status=status.HTTP_404_NOT_FOUND)

#         return Response(data, status=status.HTTP_200_OK)
    
#     def post(self, request):
#         """
#         Like a particular post, or unlike an already appreaciated post.
#         The postId is a request parameter.
#         """
#         post_id = request.query_params.get("postId")
#         user_id = request.user.id

#         # I should not be able to like my own post 
#         # try:
#         #     post = Post.objects.get(id=post_id)
#         #     if post.user.id == user_id:
#         #         return Response(status=status.HTTP_204_NO_CONTENT)
#         # except Post.DoesNotExist:
#         #     return Response(
#         #         {"detail": "The post with the given id does not exist"},
#         #         status=status.HTTP_404_NOT_FOUND
#         #     )
    
#         # remove like if it already exists
#         try:
#             existing_like = Like.objects.get(user=request.user, post_id=post_id)
#             if existing_like:
#                 existing_like.delete()
#                 return Response(status=status.HTTP_204_NO_CONTENT)
#         except Like.DoesNotExist:
#             pass
            
#         serializer = AddLikeSerializer(data={"post": post_id})
#         if serializer.is_valid():
#             serializer.save(user=request.user)
#             return Response(status=status.HTTP_201_CREATED)

#         return Response(
#             {"detail": serializer.errors},
#             status=status.HTTP_400_BAD_REQUEST)
