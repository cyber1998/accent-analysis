import base64
from io import BytesIO

from speech_analyzer.settings import OPENAI_API_KEY
from openai import OpenAI
from pydub import AudioSegment


def convert_to_wav(file):
    audio_data = BytesIO(file.read())
    audio = AudioSegment.from_file(audio_data)
    output_buffer = BytesIO()
    audio.export(output_buffer, format='wav')
    return output_buffer.getvalue()

def assess_pronunciation(voice_data):
    voice_data = convert_to_wav(voice_data)
    client = OpenAI(api_key=OPENAI_API_KEY)
    encoded_string = base64.b64encode(voice_data).decode('utf-8')

    completion = client.chat.completions.create(
        model="gpt-4o-audio-preview",
        modalities=["text", "audio"],
        audio={"voice": "alloy", "format": "wav"},
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Compare the input to a modern RP accent. Give it a score between 0 and 100, with 0 being the worst and 100 being perfect."
                                "For example, given an arbritrary input, your output (after assessing the input) should directly address the user in first person and your feedback must be limited to 150 characters"
                                "Your response should be in the following format: "
                                f"Score:<int>|||Feedback:<str>"
                    },
                    {
                        "type": "input_audio",
                        "input_audio": {
                            "data": encoded_string,
                            "format": "wav"
                        }
                    }
                ]
            },
            {
                "role": "system",
                "content": [
                    {
                        "type": "text",
                        "text": """
                        You are an intelligent AI who specializes in assessing and teaching a modern RP accent.
                        You will be listening to an audio recording of a person speaking an arbritrary sentence.
                        """
                    }
                ]
            }
        ]
    )

    score = completion.choices[0].message.audio.transcript.split("|||")[0].split(":")[1].strip()
    feedback = completion.choices[0].message.audio.transcript.split("|||")[1].split(":")[1].strip()
    return score, feedback