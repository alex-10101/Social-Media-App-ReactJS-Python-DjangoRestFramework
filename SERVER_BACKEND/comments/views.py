from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from .models import Comment
from .serializers import GetCommentSerializer, CreateCommentSerializer
from rest_framework.pagination import PageNumberPagination
from django.db.models import Count

# Create your views here.

class CommentPagination(PageNumberPagination):
    # Default number of posts returned per page
    # Example: GET /comments/  -> returns 3 comments    
    page_size = 3

    # Name of the query parameter that allows the client
    # to override `page_size` dynamically.
    # Example: GET /comments/?page_size=5    
    page_size_query_param = "page_size"

    # Maximum number of comments the client is allowed to request per page,
    # even if a larger `page_size` is provided in the query params.
    # This prevents clients from requesting too much data at once.  
    max_page_size = 5

class CommentListCreateApiView(APIView):
    """
    Class based view for getting all comments on a particular post and for creating a new post.
    """
    permission_classes=[permissions.IsAuthenticated]

    def get(self, request):
        """
        Get all the comments on a particular post. The post_id is a query parameter.
        The comments are paginated.
        """
        post_id = request.query_params.get("postId")
        post_comments = Comment.objects.filter(post__id=post_id).select_related("user").order_by("-createdAt")

        # paginate the post comments
        paginator = CommentPagination()
        page=paginator.paginate_queryset(post_comments, request)
        serializer = GetCommentSerializer(page, many=True)

        # Result JSON shape (USEFUL for infiniteQuery):
        # {
        #   "count": 123,
        #   "next": "http://localhost:8000/api/comments?page=2",
        #   "previous": null,
        #   "results": [ ...posts... ]
        # }
        # (Status 200 response code is added automatically)
        return paginator.get_paginated_response(serializer.data)
        
    def post(self, request):
        """
        Add a comment on a particular post.
        """

        serializer = CreateCommentSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(status=status.HTTP_201_CREATED)
        
        return Response(
            {"detail": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST)

class CommentCountApiView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """
        Get number of comments for a particular post. The postId is a query parameter.
        """
        post_id = request.query_params.get("postId")
        if not post_id:
            return Response({"detail": "postId query param is required."}, status=status.HTTP_400_BAD_REQUEST)

        count = Comment.objects.filter(post__id=post_id).count()
        return Response({"postId": int(post_id), "count": count}, status=status.HTTP_200_OK)

class CommentDetailApiView(APIView):
    """
    Class based view for deleting a particular comment.
    """
    permission_classes=[permissions.IsAuthenticated]

    def delete(self, request, postId, commentId):
        """
        Delete a particular post. The commentId is a request parameter.
        """
        comment = None
        try:
            comment = Comment.objects.get(id=commentId, post__id = postId, user__id = request.user.id)
        except Comment.DoesNotExist:
            return Response(
                {"detail": "The comment with the given id, post id, and user id does not exist"},
                status=status.HTTP_404_NOT_FOUND
            )

        comment.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)



