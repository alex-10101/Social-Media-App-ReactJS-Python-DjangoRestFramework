from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from user_relationships.models import Relationship
from posts.models import Post
from .serializers import GetPostSerializer, CreatePostSerializer
import os
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Q
from rest_framework.pagination import PageNumberPagination
from django.db.models import Count

# Create your views here.

class TimelinePostsPagination(PageNumberPagination):
    # Default number of posts returned per page
    # Example: GET /posts/  -> returns 3 posts    
    page_size = 3

    # Name of the query parameter that allows the client
    # to override `page_size` dynamically.
    # Example: GET /posts/?page_size=5    
    page_size_query_param = "page_size"

    # Maximum number of posts the client is allowed to request per page,
    # even if a larger `page_size` is provided in the query params.
    # This prevents clients from requesting too much data at once.  
    max_page_size = 5



class ListCreatePostsApiView(APIView):
    """
    Class based view for getting all the posts of the current user and the posts of the users,
    that the current user (the user making the request) is following.
    """
    permission_classes=[permissions.IsAuthenticated]

    # parser_classes are used because we are dealing with request data that comes in as FormData
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        """
        Get all the posts of the current user and the posts of the users,
        that the current user (the user making the request) is following.
        """
        user = request.user

        #.values returns a list of dictionaries with the user ids
        #    [
        #       {"followedUser_id": 3},
        #       {"followedUser_id": 7},
        #       {"followedUser_id": 12},
        #    ]

        #.values_list returns a list of tuples with the user ids: [(3,), (7,), (12,)]. flat=True returns only the ids: [3, 7, 12]

        # ids of the users followed by the current request user
        followed_user_ids = Relationship.objects.filter(followerUser=request.user).values_list("followedUser_id", flat=True) 


        timeline_posts = (
            Post.objects
            .select_related("user")
            .filter(
                Q(user=request.user) | Q(user_id__in=followed_user_ids)
            )

             # add a "commentCount" field, which shows the number of comments on a post. 
             # "comment" is the default related name to the Coment model.
            # .annotate(commentsCount=Count("comment", distinct=True)) 
                                                                    
            .order_by("-createdAt")
        )

        # paginate the timeline posts
        paginator = TimelinePostsPagination()
        page = paginator.paginate_queryset(timeline_posts, request)        

        # Return all timeline posts. Passing the context allows setting the full path to the media files urls. 
        serializer = GetPostSerializer(page, many=True, context={"request": request})

        # Result JSON shape when returning serializer.data in the repsonse (NOT USEFUL for infiniteQuery):
        # [
        #     {'id': 12, 'img': None, 'postDescription': 'DSDAS', 'user': 2, etc.}, 
        #     {'id': 11, 'img': None, 'postDescription': 'SDFDSADFDSADF','user': 2, etc.},
        #     ... 
        # ]
        # return Response(serializer.data, status=status.HTTP_200_OK)        

        # Result JSON shape (USEFUL for infiniteQuery):
        # {
        #   "count": 123,
        #   "next": "http://localhost:8000/api/posts?page=2",
        #   "previous": null,
        #   "results": [ ...posts... ]
        # }
        # (Status 200 response code is added automatically)
        return paginator.get_paginated_response(serializer.data)

    def post(self, request):
        """Creates a new post."""
        if not request.data:
            return Response(status=status.HTTP_204_NO_CONTENT)

        serializer = CreatePostSerializer(data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save(user = request.user)
            return Response(status=status.HTTP_201_CREATED)

        return Response(
            {"detail": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST)


class DeletePostApiView(APIView):
    """Class based view for deleting a particular post."""
    permission_classes=[permissions.IsAuthenticated]

    def delete(self, request, postId):
        """
        Delete a particular post. The postId is a request parameter.
        """
        post = None
        try:
            post = Post.objects.get(id=postId, user=request.user)
        except Post.DoesNotExist:
            return Response(
                {"detail": "The post with the given id does not exist"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # if the post contains an image, remove the image from media folder
        if post.img:
            os.remove(post.img.path)

        # delete the post from the database
        post.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)



    
