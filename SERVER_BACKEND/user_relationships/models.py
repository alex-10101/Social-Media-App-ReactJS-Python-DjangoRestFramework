from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

# Create your models here.

class Relationship(models.Model):
    """Class which models a relationship between two users."""
    followerUser = models.ForeignKey(User, on_delete = models.CASCADE, related_name="the_user_following")
    followedUser = models.ForeignKey(User, on_delete = models.CASCADE, related_name="the_user_being_followed")
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

