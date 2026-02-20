from django.db import models
from django.contrib.auth import get_user_model
from posts.models import Post

User = get_user_model()

# Create your models here.

class Like(models.Model):
    """Class which models a like left by a user on a particular post."""
    user = models.ForeignKey(User, on_delete = models.CASCADE)
    post = models.ForeignKey(Post, on_delete = models.CASCADE)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

