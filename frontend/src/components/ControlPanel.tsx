import React from 'react';

interface ControlPanelProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onSaveTranscription: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  isRecording,
  onStartRecording,
  onStopRecording,
  onSaveTranscription,
}) => {
  return (
    <div className="control-panel">
      {isRecording ? (
        <button onClick={onStopRecording}>Stop Recording</button>
      ) : (
        <button onClick={onStartRecording}>Start Recording</button>
      )}
      <button onClick={onSaveTranscription}>Save Transcription</button>
    </div>
  );
};