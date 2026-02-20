from rest_framework import serializers
from utils.sanitizeUserInput import sanitize_user_input
from .models import Relationship

class RelationshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Relationship
        fields = "__all__"


class CreateRelationshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Relationship
        fields = ["followedUser"]
        
    def validate(self, data):
        return sanitize_user_input(data)
