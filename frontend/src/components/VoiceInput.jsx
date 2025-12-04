import { useState, useRef, useEffect } from 'react';

const VoiceInput = ({ onTranscriptReady }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [transcript, setTranscript] = useState('');
  
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check if browser supports Web Speech API
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcriptText = event.results[0][0].transcript;
        setTranscript(transcriptText);
        setIsRecording(false);
        setIsProcessing(false);
        onTranscriptReady(transcriptText);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        setIsProcessing(false);
        
        let errorMessage = 'An error occurred during speech recognition';
        
        switch (event.error) {
          case 'no-speech':
            errorMessage = 'No speech detected. Please try again.';
            break;
          case 'audio-capture':
            errorMessage = 'Microphone not found or not accessible.';
            break;
          case 'not-allowed':
            errorMessage = 'Microphone permission denied. Please allow microphone access.';
            break;
          case 'network':
            errorMessage = 'Network error occurred. Please check your connection.';
            break;
          default:
            errorMessage = `Speech recognition error: ${event.error}`;
        }
        
        setError(errorMessage);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
        setIsProcessing(false);
      };
    } else {
      setError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onTranscriptReady]);

  const startRecording = () => {
    if (!recognitionRef.current) {
      setError('Speech recognition is not available');
      return;
    }

    setError(null);
    setTranscript('');
    setIsRecording(true);
    
    try {
      recognitionRef.current.start();
    } catch (err) {
      console.error('Error starting recognition:', err);
      setError('Failed to start recording. Please try again.');
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      setIsProcessing(true);
      recognitionRef.current.stop();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-8 max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Voice Input</h2>
        <p className="text-gray-600 dark:text-gray-400">Speak naturally to create your task</p>
      </div>
      
      <div className="flex flex-col items-center space-y-6">
        {/* Microphone Button with Ripple Effect */}
        <div className="relative">
          {/* Animated Rings */}
          {isRecording && (
            <>
              <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-20"></div>
              <div className="absolute inset-0 rounded-full bg-red-400 animate-pulse opacity-30" style={{ animationDelay: '0.5s' }}></div>
            </>
          )}
          
          {/* Main Button */}
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}
            className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 transform ${
              isRecording
                ? 'bg-gradient-to-br from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 scale-110 shadow-2xl'
                : isProcessing
                ? 'bg-gradient-to-br from-gray-400 to-gray-500 cursor-not-allowed shadow-lg'
                : 'bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 hover:scale-105 shadow-xl hover:shadow-2xl'
            } text-white`}
            title={isRecording ? 'Stop recording' : 'Start recording'}
          >
            {isProcessing ? (
              <svg className="w-14 h-14 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : isRecording ? (
              <div className="flex flex-col items-center">
                <svg className="w-12 h-12 mb-1" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="7" y="7" width="10" height="10" rx="2" />
                </svg>
                <span className="text-xs font-semibold">Stop</span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <svg className="w-12 h-12 mb-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                </svg>
                <span className="text-xs font-semibold">Tap to Speak</span>
              </div>
            )}
          </button>
        </div>

        {/* Status Text with Icons */}
        <div className="text-center min-h-[60px] flex items-center justify-center">
          {isRecording && (
            <div className="flex items-center space-x-3 px-6 py-3 bg-red-50 border-2 border-red-200 rounded-full">
              <div className="flex space-x-1">
                <div className="w-1 h-4 bg-red-500 rounded-full animate-pulse"></div>
                <div className="w-1 h-4 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1 h-4 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <p className="text-red-600 font-bold text-lg">Listening...</p>
            </div>
          )}
          {isProcessing && (
            <div className="flex items-center space-x-3 px-6 py-3 bg-blue-50 border-2 border-blue-200 rounded-full">
              <svg className="w-5 h-5 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-blue-600 font-bold text-lg">Processing...</p>
            </div>
          )}
          {!isRecording && !isProcessing && !error && (
            <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-medium">Click the microphone to start recording</p>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="w-full p-4 bg-red-50 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-800 rounded-xl flex items-start space-x-3">
            <svg className="w-6 h-6 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-red-800 dark:text-red-300 font-semibold text-sm mb-1">Error</p>
              <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Transcript Preview */}
        {transcript && !isRecording && !isProcessing && (
          <div className="w-full p-5 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-2 border-green-200 dark:border-green-800 rounded-xl">
            <div className="flex items-center space-x-2 mb-3">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-sm font-bold text-green-800 dark:text-green-300">Transcript Captured</p>
            </div>
            <p className="text-gray-800 dark:text-gray-200 font-medium leading-relaxed">{transcript}</p>
          </div>
        )}

        {/* Instructions */}
        <div className="w-full p-5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-2 border-blue-200 dark:border-blue-800 rounded-xl">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-500 dark:bg-blue-600 rounded-lg p-2 flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-blue-900 dark:text-blue-300 mb-1">💡 Pro Tip</p>
              <p className="text-sm text-blue-800 dark:text-blue-400 leading-relaxed">
                Speak naturally and include details like <span className="font-semibold">"Send project proposal by next Wednesday, high priority"</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceInput;
