import { useState, useCallback } from 'react';

export const useAudioCapture = (onDataAvailable: (data: string) => void) => {
  const [audioError, setAudioError] = useState<string | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          onDataAvailable(base64data.split(',')[1]);
        };
        reader.readAsDataURL(event.data);
      };

      mediaRecorder.start(100);
    } catch (error) {
      console.error('Error starting recording:', error);
      setAudioError('Failed to start recording. Please check your microphone permissions.');
    }
  }, [onDataAvailable]);

  const stopRecording = useCallback(() => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => stream.getTracks())
      .then(tracks => tracks.forEach(track => track.stop()))
      .catch(error => {
        console.error('Error stopping recording:', error);
        setAudioError('Failed to stop recording.');
      });
  }, []);

  return { startRecording, stopRecording, audioError };
};