import uuid

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