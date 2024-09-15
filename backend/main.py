import sounddevice as sd
import numpy as np
import threading
import queue
import io
import logging
import sys
import time
import base64
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import whisper

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Load Whisper model
model = whisper.load_model("base")

class AudioTranscriber:
    def __init__(self):
        self.recording = False
        self.audio_queue = queue.Queue()
        logger.info("AudioTranscriber initialized")

    def audio_callback(self, indata, frames, time, status):
        if status:
            logger.error(f"Audio callback error: {status}")
        self.audio_queue.put(bytes(indata))

    async def start_transcription(self, websocket: WebSocket):
        self.recording = True
        logger.info("Transcription started")

        try:
            with sd.InputStream(callback=self.audio_callback, channels=2, samplerate=44100, dtype='float32'):
                logger.info("Audio stream opened")
                while self.recording:
                    if not self.audio_queue.empty():
                        audio_data = b''.join(list(self.audio_queue.queue))
                        self.audio_queue.queue.clear()

                        try:
                            # Convert audio data to numpy array
                            audio_array = np.frombuffer(audio_data, dtype=np.float32)
                            
                            # Perform transcription
                            result = model.transcribe(audio_array)
                            
                            # Send transcription back to client
                            await websocket.send_text(result["text"])
                            logger.info(f"Transcription sent: {result['text']}")
                        except Exception as e:
                            logger.error(f"Transcription error: {e}")
                    
                    await asyncio.sleep(0.1)
        except Exception as e:
            logger.error(f"Error in audio stream: {e}")

    def stop_transcription(self):
        self.recording = False
        logger.info("Transcription stopped")

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    transcriber = AudioTranscriber()
    try:
        await transcriber.start_transcription(websocket)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
    finally:
        transcriber.stop_transcription()
        await websocket.close()

if __name__ == "__main__":
    import uvicorn
    try:
        uvicorn.run(app, host="0.0.0.0", port=8000)
    except Exception as e:
        logger.critical(f"Critical error: {e}")
        sys.exit(1)