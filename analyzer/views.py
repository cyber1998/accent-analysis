import uuid

from django.contrib.auth.models import User
from rest_framework import views
from rest_framework.response import Response
from analyzer.helper import assess_pronunciation


# Create your views here.
class SpeechAnalyzerView(views.APIView):
    def post(self, request, *args, **kwargs):
        # Handle the incoming audio data
        audio_data = request.FILES.get('audio')
        if not audio_data:
            return Response({"error": "No audio file provided"}, status=400)

        # Ensure the audio data is in the correct format
        if not audio_data.name.endswith('.wav'):
            return Response({"error": "Invalid audio format. Please upload a .wav file."}, status=400)

        score, feedback = assess_pronunciation(audio_data)

        # Return the assessment as a response
        return Response({"score": score, "summary": feedback})


class RegisterUserView(views.APIView):
    def post(self, request, *args, **kwargs):
        # Handle user registration
        username = request.data.get('username')
        password = request.data.get('password')
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        email = request.data.get('email')

        if not username or not password:
            return Response({"error": "Username and password are required"}, status=400)

        try:
            user = User.objects.create_user(
                username=username,
                first_name=first_name,
                last_name=last_name,
                email=email
            )
            user.set_password(password)
            user.save()
        except Exception as e:
            return Response({"error": str(e)}, status=400)

        return Response({"message": "User registered successfully", "user_id": user.id}, status=201)