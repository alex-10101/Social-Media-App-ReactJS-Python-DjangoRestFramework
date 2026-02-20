from django.db import models
from django.contrib.auth import get_user_model
from posts.models import Post

User = get_user_model()

# Create your models here.

class Comment(models.Model):
    commentDescription = models.CharField(max_length=255)
    user = models.ForeignKey(User, on_delete = models.CASCADE)
    post = models.ForeignKey(Post, on_delete = models.CASCADE)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)
