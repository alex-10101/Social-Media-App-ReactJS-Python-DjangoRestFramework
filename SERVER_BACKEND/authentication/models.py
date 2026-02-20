from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid
from django.core.files import File
from io import BytesIO
from PIL import Image

# Create your models here.

class CustomUser(AbstractUser):
    """ 
    Class which represents a custom user model 
    and which should be used instead if Django's default User model.
    Extends the AbstractUser class with the given attributes.
    """    

    def upload_to(instance, filename):
        """Returns the path where the image will be uploaded."""
        return str(instance.id) + "/" + str(uuid.uuid4()) + "-" + filename

    coverPicture = models.ImageField(upload_to=upload_to, blank=True, null=True)
    profilePicture = models.ImageField(upload_to=upload_to, blank=True, null=True) 
    city = models.CharField(max_length=255, blank=True, null=True)
    website = models.CharField(max_length=255, blank=True, null=True)


