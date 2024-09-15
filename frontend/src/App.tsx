import React, { useState, useEffect } from 'react';
import { TranscriptionDisplay } from './components/TranscriptionDisplay';
import { ControlPanel } from './components/ControlPanel';
import { ErrorDisplay } from './components/ErrorDisplay';
import { useWebSocket } from './hooks/useWebSocket';
import { useAudioCapture } from './hooks/useAudioCapture';

const App: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const socketUrl = 'ws://localhost:8000/ws';

  const { sendMessage, lastMessage, socketError } = useWebSocket(socketUrl);
  const { startRecording, stopRecording, audioError } = useAudioCapture(sendMessage);

  useEffect(() => {
    if (lastMessage) {
      setTranscription(prev => prev + ' ' + lastMessage);
    }
  }, [lastMessage]);

  useEffect(() => {
    setError(socketError || audioError || null);
  }, [socketError, audioError]);

  const handleStartRecording = () => {
    setIsRecording(true);
    startRecording();
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    stopRecording();
  };

  const handleSaveTranscription = () => {
    const element = document.createElement("a");
    const file = new Blob([transcription], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "transcription.txt";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="App">
      <h1>Live Transcription App</h1>
      <ControlPanel
        isRecording={isRecording}
        onStartRecording={handleStartRecording}
        onStopRecording={handleStopRecording}
        onSaveTranscription={handleSaveTranscription}
      />
      <TranscriptionDisplay text={transcription} />
      <ErrorDisplay error={error} />
    </div>
  );
};

export default App;