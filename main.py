import sounddevice as sd
import numpy as np
import threading
import queue
import speech_recognition as sr
from pydub import AudioSegment
import io
import logging
import sys
import time

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class AudioTranscriber:
    """
    A class for capturing system audio and transcribing it in real-time.
    """

    def __init__(self):
        """
        Initialize the AudioTranscriber with necessary attributes.
        """
        self.recording = False
        self.audio_queue = queue.Queue()
        self.recognizer = sr.Recognizer()
        self.transcription_thread = None
        logger.info("AudioTranscriber initialized")

    def audio_callback(self, indata, frames, time, status):
        """
        Callback function for the audio stream.

        Args:
            indata (numpy.ndarray): Input audio data.
            frames (int): Number of frames.
            time (CData): Time information.
            status (CallbackFlags): Status of the callback.
        """
        if status:
            logger.error(f"Audio callback error: {status}")
        self.audio_queue.put(bytes(indata))

    def start_transcription(self):
        """
        Start the audio capture and transcription process.
        """
        self.recording = True
        self.transcription_thread = threading.Thread(target=self._transcribe_audio)
        self.transcription_thread.start()
        logger.info("Transcription started")

        try:
            with sd.InputStream(callback=self.audio_callback, channels=2, samplerate=44100, dtype='int16'):
                logger.info("Audio stream opened")
                while self.recording:
                    time.sleep(0.1)
        except Exception as e:
            logger.error(f"Error in audio stream: {e}")

    def stop_transcription(self):
        """
        Stop the audio capture and transcription process.
        """
        self.recording = False
        if self.transcription_thread:
            self.transcription_thread.join()
        logger.info("Transcription stopped")

    def _transcribe_audio(self):
        """
        Internal method to handle the transcription process.
        """
        while self.recording:
            if not self.audio_queue.empty():
                audio_data = b''.join(list(self.audio_queue.queue))
                self.audio_queue.queue.clear()

                try:
                    audio = AudioSegment(
                        data=audio_data,
                        sample_width=2,
                        frame_rate=44100,
                        channels=2
                    )
                    wav_data = io.BytesIO()
                    audio.export(wav_data, format="wav")
                    wav_data.seek(0)
                    
                    with sr.AudioFile(wav_data) as source:
                        audio = self.recognizer.record(source)
                    
                    text = self.recognizer.recognize_google(audio)
                    print(f"Transcription: {text}")
                except sr.UnknownValueError:
                    logger.warning("Google Speech Recognition could not understand audio")
                except sr.RequestError as e:
                    logger.error(f"Could not request results from Google Speech Recognition service; {e}")
                except Exception as e:
                    logger.error(f"Unexpected error during transcription: {e}")

            time.sleep(0.1)

def main():
    """
    Main function to run the audio transcription process.
    """
    transcriber = AudioTranscriber()
    
    try:
        transcriber.start_transcription()
        
        # Keep the main thread running
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        logger.info("Program terminated by user")
    finally:
        transcriber.stop_transcription()

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        logger.critical(f"Critical error: {e}")
        sys.exit(1)