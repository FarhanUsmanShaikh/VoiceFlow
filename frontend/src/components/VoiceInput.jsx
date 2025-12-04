import { useState, useRef, useEffect } from 'react';

const VoiceInput = ({ onTranscriptReady }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  
  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef('');

  useEffect(() => {
    
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.maxAlternatives = 1;
      
      recognitionRef.current.onresult = (event) => {
        let interimText = '';
        let finalText = '';

        // Process all results
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalText += transcript + ' ';
          } else {
            interimText += transcript;
          }
        }

        setInterimTranscript(interimText);

        if (finalText) {
          finalTranscriptRef.current += finalText;
          setTranscript(finalTranscriptRef.current.trim());
        }
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
        
        const finalText = finalTranscriptRef.current.trim();
        if (finalText) {
          setTranscript(finalText);
          setInterimTranscript('');
          setIsProcessing(true);
          
          setTimeout(() => {
            onTranscriptReady(finalText);
            setIsProcessing(false);
          }, 500);
        } else {
          setError('No speech detected. Please try again.');
          setIsProcessing(false);
        }
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
    setInterimTranscript('');
    finalTranscriptRef.current = '';
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
      recognitionRef.current.stop();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-6 max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Voice Input</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">Speak naturally to create your task</p>
      </div>
      
      <div className="flex flex-col items-center space-y-4">
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
            className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 transform ${
              isRecording
                ? 'bg-gradient-to-br from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 scale-110 shadow-2xl'
                : isProcessing
                ? 'bg-gradient-to-br from-gray-400 to-gray-500 cursor-not-allowed shadow-lg'
                : 'bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 hover:scale-105 shadow-xl hover:shadow-2xl'
            } text-white`}
            title={isRecording ? 'Stop recording' : 'Start recording'}
          >
            {isProcessing ? (
              <svg className="w-10 h-10 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : isRecording ? (
              <div className="flex flex-col items-center">
                <svg className="w-8 h-8 mb-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="7" y="7" width="10" height="10" rx="2" />
                </svg>
                <span className="text-xs font-semibold">Stop</span>
              </div>
            ) : (
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
              </svg>
            )}
          </button>
        </div>

        {/* Status Text with Icons */}
        <div className="text-center min-h-[40px] flex items-center justify-center w-full">
          {isRecording && (
            <div className="w-full space-y-3">
              <div className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-1 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <div className="w-1 h-3 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1 h-3 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <p className="text-red-600 dark:text-red-400 font-semibold text-sm">Listening... (Auto-stops after pause)</p>
              </div>
              {/* Live Transcript */}
              {(transcript || interimTranscript) && (
                <div className="w-full p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">Live Transcript:</p>
                  <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                    {transcript}
                    <span className="text-gray-500 dark:text-gray-400 italic">{interimTranscript}</span>
                  </p>
                </div>
              )}
            </div>
          )}
          {isProcessing && (
            <div className="flex items-center space-x-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
              <svg className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-blue-600 dark:text-blue-400 font-semibold text-sm">Processing...</p>
            </div>
          )}
          {!isRecording && !isProcessing && !error && !transcript && (
            <p className="text-sm text-gray-500 dark:text-gray-400">Click the microphone to start</p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="w-full p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-2">
            <svg className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Transcript Preview */}
        {transcript && !isRecording && !isProcessing && (
          <div className="w-full p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-xs font-bold text-green-800 dark:text-green-300">Captured</p>
            </div>
            <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">{transcript}</p>
          </div>
        )}

        {/* Instructions - Show when idle OR recording */}
        {((!isRecording && !transcript) || isRecording) && (
          <div className="w-full p-3 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-xs font-semibold text-blue-900 dark:text-blue-300 mb-1.5">💡 Quick Tips</p>
            <ul className="text-xs text-blue-800 dark:text-blue-400 leading-relaxed space-y-0.5">
              <li>• Speak naturally with short pauses</li>
              <li>• Auto-stops after 3-4 seconds of silence</li>
              <li>• Example: "Send proposal by Friday, high priority"</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceInput;
