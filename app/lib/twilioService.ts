import { getApiKey } from './helpers';

/**
 * TwilioService handles processing audio from Twilio calls and
 * integrating with the Deepgram conversation service.
 */
export class TwilioService {
  private apiKey: string | null = null;
  private deepgramApiUrl: string;
  
  constructor() {
    // Use Deepgram's REST API instead of WebSockets for server-side implementation
    this.deepgramApiUrl = process.env.NEXT_PUBLIC_DEEPGRAM_API_URL || 'https://api.deepgram.com/v1';
  }
  
  /**
   * Initializes the TwilioService by setting up the API key
   */
  async initialize(): Promise<boolean> {
    try {
      // Get the API key
      this.apiKey = await getApiKey('');
      
      if (!this.apiKey) {
        console.error('Failed to get API key for Twilio service');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error initializing TwilioService:', error);
      return false;
    }
  }
  
  /**
   * Processes audio from a URL (like Twilio's RecordingUrl)
   * @param audioUrl The URL of the audio to process
   */
  async processAudioFromUrl(audioUrl: string): Promise<any> {
    try {
      // Fetch the audio data from the URL
      const response = await fetch(audioUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch audio from URL: ${response.statusText}`);
      }
      
      // Get the audio data as an ArrayBuffer
      const audioData = await response.arrayBuffer();
      
      // Process the audio data with Deepgram
      const result = await this.transcribeAudio(audioData);
      return result;
    } catch (error) {
      console.error('Error processing audio from URL:', error);
      throw error;
    }
  }
  
  /**
   * Transcribes audio data using Deepgram's API
   * @param audioData The audio data as an ArrayBuffer
   */
  async transcribeAudio(audioData: ArrayBuffer): Promise<any> {
    if (!this.apiKey) {
      throw new Error('API key not initialized');
    }
    
    try {
      // Use Deepgram's REST API to transcribe the audio
      const transcriptionUrl = `${this.deepgramApiUrl}/listen`;
      
      const response = await fetch(transcriptionUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${this.apiKey}`,
          'Content-Type': 'audio/wav',
        },
        body: new Uint8Array(audioData),
      });
      
      if (!response.ok) {
        throw new Error(`Deepgram API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      return {
        success: true,
        message: 'Audio transcribed successfully',
        transcription: data.results?.channels[0]?.alternatives[0]?.transcript || '',
        data: data,
      };
    } catch (error) {
      console.error('Error transcribing audio:', error);
      return {
        success: false,
        message: 'Failed to transcribe audio',
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
  
  /**
   * Processes speech text directly if received from Twilio's SpeechResult
   * @param speechText The text from Twilio's speech recognition
   */
  async processSpeechText(speechText: string): Promise<any> {
    // When we already have the text from Twilio, we can just pass it along
    // to the conversational agent
    
    // Here we would typically send this text to a Chat API or LLM
    // For this demo, we'll just return it with a placeholder response
    
    return {
      success: true,
      message: 'Speech processed successfully',
      text: speechText,
      response: `This is a placeholder response for: "${speechText}"`,
    };
  }
} 