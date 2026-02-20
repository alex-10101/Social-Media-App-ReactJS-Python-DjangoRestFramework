from rest_framework.views import APIView
from rest_framework import permissions
from django.contrib import auth
from rest_framework.response import Response
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer, DeleteAccountSerializer, ChangePasswordSerializer
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django.middleware.csrf import rotate_token
from django.utils.decorators import method_decorator
from rest_framework import status
from django.contrib.auth import get_user_model
import os
import shutil
from django.middleware.csrf import get_token
from django.contrib.sessions.models import Session
from django.utils import timezone

# Create your views here.

User = get_user_model()

class GetCSRFCookie(APIView):
    """View to get a CSRF cookie"""
    permission_classes = (permissions.AllowAny,)

    # def get(self, request):
    #     """
    #     When the client makes a page refresh, a request should be made to this endpoint to get a new csrf cookie.
    #     """
    #     rotate_token(request)
    #     return Response(status=status.HTTP_200_OK)

    @method_decorator(ensure_csrf_cookie)
    def get(self, request):
        """
        When the client app mounts and there is no CSRF cookie, a request should be made to this endpoint to get a new csrf cookie.
        """
        return Response(status=status.HTTP_200_OK)

@method_decorator(csrf_protect, name="dispatch") 
class CheckAuthenticatedView(APIView):
    """
    View to check if the current user is authenticated or not.
    When the client makes a page refresh, a request should be made to this endpoint to see if the user is authenticated.
    """

    def post(self, request):
        """Method which runs when the user submits a POST request to check if it is authenticated or not"""
        if bool(request.user and request.user.is_authenticated):
            user = UserSerializer(self.request.user)
            return Response({"user": user.data}, status=status.HTTP_200_OK)

        return Response(status=status.HTTP_401_UNAUTHORIZED)


@method_decorator(csrf_protect, name="dispatch") 
class RegisterView(APIView):
    """View to register a new user with email, username, password and password confirmation."""
    permission_classes=(permissions.AllowAny,)

    def post(self, request):
        """Method which runs when the user submits a POST request to register a new user with username and password"""
        
        serializer=RegisterSerializer(data=request.data)


        if serializer.is_valid():
            email=serializer.data["email"]
            password=serializer.data["password"]
            username=serializer.data["username"]

            User.objects.create_user(email=email, username=username, password=password)
            return Response(status=status.HTTP_201_CREATED)
                    
        return Response({"detail": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        


@method_decorator(csrf_protect, name="dispatch") 
class LoginView(APIView):
    """View to log in a user with username and password"""

    permission_classes = (permissions.AllowAny,)
    # throttle_scope = "login"

    def post(self, request):
        """Method which runs when the user submits a POST request to log in."""

        serializer=LoginSerializer(data=request.data)


        if serializer.is_valid():

            email=serializer.data["email"]
            password=serializer.data["password"]
            
            # authenticate with email and password (Django's default authentication is with username and password)
            user = auth.authenticate(username=email, password=password)

            # if user is None: 
            #     return Response({"detail": "Wrong username or password or inactive user."}, status=status.HTTP_400_BAD_REQUEST)                

            if user is None: 
                return Response({"detail": "Could not log in."}, status=status.HTTP_400_BAD_REQUEST)                


            auth.login(request, user)
            user = UserSerializer(self.request.user, context={"request": request})
            return Response({"user": user.data}, status=status.HTTP_200_OK)
        
        return Response({"detail": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    """View to log a user out."""
    permission_classes=[permissions.IsAuthenticated]

    def post(self, request):
        """Method which runs when the user submits a POST request to log out."""
        auth.logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)
        
class LogoutAllDevicesView(APIView):
    """View to log a user out of all devices."""
    permission_classes=[permissions.IsAuthenticated]

    def post(self, request):
        """Method which runs when the user submits a POST request to log out."""
        # Get all active sessions
        sessions = Session.objects.filter(expire_date__gte=timezone.now())
        
        # Loop through sessions and delete those for the current user
        for session in sessions:
            session_data = session.get_decoded()
            if session_data.get('_auth_user_id') == str(request.user.id):
                session.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)
    
class DeleteAccountView(APIView):
    """View to delete the account of the user"""
    permission_classes=[permissions.IsAuthenticated]

    def delete(self, request):
        """Delete the account of the current user (the user making the request)"""

        context={"request": request}

        serializer=DeleteAccountSerializer(data=request.data, context=context)


        if serializer.is_valid():
            user=request.user

            parent_folder = "media"
            directory_inside_parent_folder = str(user.id)
            folder_path = os.path.join(parent_folder, directory_inside_parent_folder)

            # delete all the files of the request user 
            if os.path.exists(folder_path):
                shutil.rmtree(folder_path)

            # delete the request user
            User.objects.filter(id=user.id).delete()

            return Response(status=status.HTTP_204_NO_CONTENT)
        
        return Response({"detail": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)



class ChangePasswordView(APIView):
    permission_classes=[permissions.IsAuthenticated]

    def put(self, request):
        """Change the password of the current user (the user making the request)"""

        context={'request': request}

        serializer=ChangePasswordSerializer(data=request.data, context=context)

        if serializer.is_valid():
            user=request.user
            user.set_password(data["new_password"])
            user.save()

            return Response(status=status.HTTP_204_NO_CONTENT)
        
        return Response({"detail": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)





