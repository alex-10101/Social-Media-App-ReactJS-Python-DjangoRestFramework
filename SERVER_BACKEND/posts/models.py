from django.db import models
from django.contrib.auth import get_user_model
import uuid
from django.core.files import File
from io import BytesIO
from PIL import Image

User = get_user_model()

# Create your models here.

class Post(models.Model):
    """Class which models a post of a particular user."""

    def upload_to(instance, filename):
        """Returns the path where the image will be uploaded."""
        return str(instance.user.id) + "/" + str(uuid.uuid4()) + "-" + filename

    postDescription = models.CharField(max_length=255, blank=True, null=True)
    img = models.ImageField(upload_to=upload_to, blank=True, null=True)
    user = models.ForeignKey(User, on_delete = models.CASCADE)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

