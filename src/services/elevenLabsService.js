// ElevenLabs Text-to-Speech Service
// Provides high-quality voice synthesis with better Arabic support

const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

// Voice IDs for different languages
const VOICE_IDS = {
  // English voices
  en: 'FGY2WhTYpPnrIDTdsKH5', // Amelia - clear English voice
  
  // Arabic voice (you can change this to your preferred Arabic voice)
  ar: 'FGY2WhTYpPnrIDTdsKH5', // Hoda (multilingual, supports Arabic)
};

// Initialize ElevenLabs with API key
let apiKey = null;

export const initializeElevenLabs = (key) => {
  apiKey = key;
  return !!key;
};

// Convert text to speech using ElevenLabs API
export const textToSpeech = async (text, language = 'en') => {
  if (!apiKey) {
    throw new Error('ElevenLabs API key not initialized');
  }

  try {
    const voiceId = VOICE_IDS[language] || VOICE_IDS.en;
    
    const response = await fetch(
      `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2', // Best for Arabic
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true
          }
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail?.message || 'Failed to generate speech');
    }

    // Get audio blob
    const audioBlob = await response.blob();
    return audioBlob;
  } catch (error) {
    console.error('ElevenLabs TTS Error:', error);
    throw error;
  }
};

// Play audio from blob
export const playAudio = (audioBlob) => {
  return new Promise((resolve, reject) => {
    try {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        resolve();
      };
      
      audio.onerror = (error) => {
        URL.revokeObjectURL(audioUrl);
        reject(error);
      };
      
      audio.play().catch(reject);
      
      return audio; // Return audio element for control
    } catch (error) {
      reject(error);
    }
  });
};

// Get available voices from ElevenLabs
export const getAvailableVoices = async () => {
  if (!apiKey) {
    throw new Error('ElevenLabs API key not initialized');
  }

  try {
    const response = await fetch(`${ELEVENLABS_API_URL}/voices`, {
      headers: {
        'xi-api-key': apiKey,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch voices');
    }

    const data = await response.json();
    return data.voices;
  } catch (error) {
    console.error('Error fetching voices:', error);
    return [];
  }
};

export default {
  initializeElevenLabs,
  textToSpeech,
  playAudio,
  getAvailableVoices,
};

