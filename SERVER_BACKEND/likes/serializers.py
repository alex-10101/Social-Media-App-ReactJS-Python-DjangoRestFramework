from rest_framework import serializers
from utils.sanitizeUserInput import sanitize_user_input
from .models import Like

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = "__all__"

class AddLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ["post"]

    def validate(self, data):
        return sanitize_user_input(data)

