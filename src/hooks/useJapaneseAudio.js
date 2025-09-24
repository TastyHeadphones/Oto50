import { useCallback, useRef, useEffect } from 'react';

// Custom hook for Japanese text-to-speech
export const useJapaneseAudio = () => {
  const speechSynthRef = useRef(null);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      speechSynthRef.current = window.speechSynthesis;
    }
  }, []);

  const speak = useCallback((text) => {
    if (!speechSynthRef.current || !text) {
      console.warn('Speech synthesis not available or no text provided');
      return;
    }

    // Cancel any ongoing speech
    speechSynthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Try to find Japanese voice
    const voices = speechSynthRef.current.getVoices();
    const japaneseVoice = voices.find(voice => 
      voice.lang.startsWith('ja') || 
      voice.name.toLowerCase().includes('japan')
    );
    
    if (japaneseVoice) {
      utterance.voice = japaneseVoice;
      utterance.lang = 'ja-JP';
    } else {
      utterance.lang = 'ja-JP';
    }
    
    utterance.rate = 0.8;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Error handling
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
    };
    
    try {
      speechSynthRef.current.speak(utterance);
    } catch (error) {
      console.error('Error speaking text:', error);
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    if (speechSynthRef.current) {
      speechSynthRef.current.cancel();
    }
  }, []);

  const isSupported = useCallback(() => {
    return 'speechSynthesis' in window;
  }, []);

  return { speak, stopSpeaking, isSupported };
};