import { Request, Response } from 'express';
import { SpeechClient, protos } from '@google-cloud/speech';

const client = new SpeechClient();

export const transcribeAudio = async (req: Request, res: Response) => {
    try {
        const audioBytes = req.body.audioContent;
        const audio = {
            content: audioBytes,
        };
        const config = {
            encoding: protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.LINEAR16, 
            sampleRateHertz: 16000,
            languageCode: 'en-US',
        };
        const request = {
            audio: audio,
            config: config,
        };

        const [response] = await client.recognize(request);

        // Check for null/undefined alternatives
        const transcription = response.results
            .map((result: protos.google.cloud.speech.v1.ISpeechRecognitionResult) => {
                if (result.alternatives && result.alternatives.length > 0) {
                    return result.alternatives[0].transcript;
                } else {
                    return ""; // Return empty string if no alternatives
                }
            })
            .join('\n');

        res.json({ transcription });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to transcribe audio' });
    }
};