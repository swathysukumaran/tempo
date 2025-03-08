import { Request, Response } from 'express';
import { SpeechClient, protos } from '@google-cloud/speech';

const client = new SpeechClient();

export const transcribeAudio = async (req: Request, res: Response) => {
    try {
        const audioBytes = req.body.audio;
        console.log("request body", req.body);

        const audio = {
            content: Buffer.from(audioBytes, 'base64'),
        };

        const config = {
            encoding: protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.WEBM_OPUS, 
            sampleRateHertz: 48000,
            languageCode: 'en-US',
            audioChannelCount: 2, // Match the actual channel count
            enableAutomaticPunctuation: true
        };

        const request = {
            audio: audio,
            config: config,
        };

        const [response] = await client.recognize(request);

        // More robust transcription extraction
        const transcription = response.results
            ? response.results
                .map((result: any) => 
                    result.alternatives && result.alternatives.length > 0 
                        ? result.alternatives[0].transcript 
                        : ""
                )
                .filter((t: string) => t.trim() !== '')
                .join(' ')
            : "";

        console.log("Transcription:", transcription);

        res.json({ 
            transcription: transcription || "No speech detected",
        });
    } catch (error) {
        console.error('Transcription error:', error);
        res.status(500).json({ 
            message: 'Failed to transcribe audio',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};