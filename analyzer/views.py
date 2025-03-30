import uuid

from django.contrib.auth.models import User
from django.db import models
from rest_framework import views
from rest_framework.response import Response
from analyzer.helper import assess_pronunciation
from analyzer.models import UserResult


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

        # Save the result to the database
        user_result = UserResult.objects.create(
            user=request.user,
            score=score,
            feedback=feedback,
            model='gpt-4o-audio-preview'
        )

        # Return the assessment as a response
        return Response({"score": score, "summary": feedback})


class PastResultsView(views.APIView):
    def get(self, request, *args, **kwargs):
        # Retrieve past results for the authenticated user
        user_results = UserResult.objects.filter(user=request.user).order_by('-created_at')
        results = [
            {
                "id": result.id,
                "score": result.score,
                "feedback": result.feedback,
                "created_at": result.created_at,
                "model": result.model
            }
            for result in user_results
        ]
        return Response({"results": results})


class PerformanceGraphView(views.APIView):
    def get(self, request, *args, **kwargs):
        # Retrieve performance data for the authenticated user
        user_results = UserResult.objects.filter(user=request.user).order_by('-created_at')
        performance_data = [
            {
                "created_at": result.created_at,
                "score": result.score
            }
            for result in user_results
        ]
        return Response({"results": performance_data})


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