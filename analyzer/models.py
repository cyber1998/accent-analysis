from enum import Enum

from django.db import models

# Create your models here.

class AudioModel(Enum):
    GPT_4O_AUDIO_PREVIEW = 'gpt-4o-audio-preview'

class UserResult(models.Model):
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    score = models.FloatField()
    feedback = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    # To be updated with a FK to the AudioModel later.
    model = models.CharField(choices=[
        (tag.name, tag.value) for tag in AudioModel],
        max_length=255,
        default=AudioModel.GPT_4O_AUDIO_PREVIEW.value
    )

    def __str__(self):
        return f"{self.user.first_name} - {self.score} - {self.created_at}"

