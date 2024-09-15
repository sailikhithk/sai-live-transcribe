import React from 'react';

interface TranscriptionDisplayProps {
  text: string;
}

export const TranscriptionDisplay: React.FC<TranscriptionDisplayProps> = ({ text }) => {
  return (
    <div className="transcription-display">
      <h2>Transcription</h2>
      <p>{text}</p>
    </div>
  );
};