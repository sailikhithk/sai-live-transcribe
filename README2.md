# Live Transcription App

This is a local web application for live transcription that performs real-time speech-to-text conversion using Python, React, and TypeScript. The app runs entirely on your computer, providing an easy-to-use interface and ensuring data privacy by processing everything locally.

## Features

- Real-time speech-to-text transcription with high accuracy
- Support for English language (expandable to other languages)
- Live display of transcriptions on the user interface as audio is captured
- Basic controls for starting, pausing, and stopping the transcription process
- Options to copy, save, or export transcriptions in plain text format
- Local processing for enhanced privacy and security

## Prerequisites

- Node.js and npm (for the frontend)
- Python 3.7+ (for the backend)
- A modern web browser

## Installation

### Frontend

1. Navigate to the `frontend` directory:
   ```
   cd frontend
   ```

2. Install the dependencies:
   ```
   npm install
   ```

### Backend

1. Navigate to the `backend` directory:
   ```
   cd backend
   ```

2. Create a virtual environment (optional but recommended):
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```

3. Install the dependencies:
   ```
   pip install -r requirements.txt
   ```

## Running the Application

1. Start the backend server:
   ```
   cd backend
   python main.py
   ```

2. In a new terminal, start the frontend development server:
   ```
   cd frontend
   npm start
   ```

3. Open your web browser and navigate to `http://localhost:3000`.

## Usage

1. Click the "Start Recording" button to begin capturing audio.
2. Speak into your microphone.
3. The transcription will appear in real-time on the screen.
4. Click "Stop Recording" when you're done.
5. Use the "Save Transcription" button to download the transcription as a text file.

## Technology Stack

- Frontend: React with TypeScript
- Backend: Python with FastAPI
- Speech Recognition: OpenAI's Whisper model (running locally)

## Privacy and Security

All data processing occurs locally on your machine. No audio data or transcriptions are sent to external servers, ensuring your privacy and data security.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.