import { NextRequest, NextResponse } from 'next/server';
import { TwilioService } from '../../lib/twilioService';

/**
 * This function handles incoming webhook requests from Twilio.
 * 
 * It receives audio from a Twilio call, processes it, and streams it to the
 * Deepgram conversation service (similar to what happens when using the record button in the UI).
 * 
 * @param req The incoming webhook request from Twilio
 * @returns A TwiML response to control the call
 */
export async function POST(req: NextRequest) {
  try {
    // Parse the incoming request from Twilio (form data)
    const formData = await req.formData();
    
    // Get the RecordingUrl from Twilio if available
    const recordingUrl = formData.get('RecordingUrl') as string | null;
    
    // Get the caller's input (if using Twilio's Gather verb)
    const speechResult = formData.get('SpeechResult') as string | null;
    
    // Get call status
    const callStatus = formData.get('CallStatus') as string | null;
    
    // Log the received data for debugging
    console.log('Received Twilio webhook:', { 
      recordingUrl, 
      speechResult,
      callStatus
    });

    // Initialize Twilio service
    const twilioService = new TwilioService();
    const initialized = await twilioService.initialize();
    
    if (!initialized) {
      throw new Error('Failed to initialize Twilio service');
    }
    
    // Process the audio or speech if available
    let processingResult = null;
    
    if (recordingUrl) {
      // Process the audio recording URL
      processingResult = await twilioService.processAudioFromUrl(recordingUrl);
    } else if (speechResult) {
      // Process the speech result text
      processingResult = await twilioService.processSpeechText(speechResult);
    }
    
    console.log('Processing result:', processingResult);
    
    // Construct a TwiML response based on the processing result
    let twimlResponse;
    
    if (processingResult) {
      // If we successfully processed the input, respond with the result
      twimlResponse = `
        <?xml version="1.0" encoding="UTF-8"?>
        <Response>
          <Say>I received your input. Here's what Deepgram processed: ${processingResult.message}</Say>
          <Pause length="1"/>
          <Gather input="speech" action="/api/twilio-webhook" method="POST" timeout="5">
            <Say>Please speak again after the tone.</Say>
          </Gather>
        </Response>
      `;
    } else {
      // If we're just starting the call or didn't receive any input
      twimlResponse = `
        <?xml version="1.0" encoding="UTF-8"?>
        <Response>
          <Say>Welcome to the Deepgram conversation demo.</Say>
          <Gather input="speech" action="/api/twilio-webhook" method="POST" timeout="5">
            <Say>Please speak after the tone.</Say>
          </Gather>
        </Response>
      `;
    }
    
    // Return the TwiML response with the correct content type
    return new NextResponse(twimlResponse, {
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  } catch (error) {
    console.error('Error processing Twilio webhook:', error);
    
    // Return a basic TwiML response in case of error
    const errorTwiml = `
      <?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Say>Sorry, there was an error processing your request.</Say>
      </Response>
    `;
    
    return new NextResponse(errorTwiml, {
      status: 500,
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  }
} 