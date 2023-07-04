import {fileNameToDate, saveFile} from "@/utils/file";
import {Data, FileTranscript} from "@/utils/types";

/**
 * Transcribe the file to text
 *
 * @param apiKey the api key
 * @param organizationKey the organization key
 * @param file the file
 */
export async function transcribeFile(apiKey: string, organizationKey: string, file: File): Promise<string | undefined> {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("model", "whisper-1");

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "OpenAI-Organization": organizationKey
        } as any,
        body: formData
    }).then(response => response.json());

    if (response.error) {
        console.log(response.error);
        return undefined;
    }

    return response.text;
}

/**
 * Summarize the transcript to a few sentences
 *
 * @param apiKey the api key
 * @param organizationKey the organization key
 * @param transcript the transcript
 */
export async function summarizeTranscript(apiKey: string, organizationKey: string, transcript: string): Promise<string | undefined> {
    const response = await fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "OpenAI-Organization": organizationKey,
            "Content-Type": "application/json"
        } as any,
        body: JSON.stringify({
            model: "text-davinci-003",
            prompt: `Please provide a concise summary of 16 words or less, of the key points discussed in the monologue. The transcript is as follows: '${transcript}'`,
            max_tokens: 75,
        })
    }).then(response => response.json());
    if (response.error) {
        console.log(response.error);
        return undefined;
    }

    const choices = response.choices;
    if (!choices || choices.length === 0) {
        return undefined;
    }

    return choices[0].text;
}

export async function loadFile(file: File, data: Data,
                               updateFileStatusError: (name: string | undefined, error: string) => void,
                               updateLoadingStatus: (fileName: string, status: 'transcribing' | 'summarizing') => void
): Promise<FileTranscript | undefined> {
    const api = data.api;
    if (!api || !api.verified) {
        updateFileStatusError(file.name, 'API Key is not verified!');
        return undefined;
    }

    const apiKey = api.apiKey;
    const organizationKey = api.organizationKey;
    if (!apiKey || !organizationKey) {
        updateFileStatusError(file.name, 'API Key is not set!');
        return undefined;
    }

    const fileName = file.name;
    // Ensure the file name is unique
    if (data.transcripts.find(transcript => transcript.fileName === fileName)) {
        updateFileStatusError(file.name, 'File does already exist in the database!');
        return undefined;
    }

    const fileExtension = fileName.split('.').pop();
    // Make sure the file is an mp3 file
    if (fileExtension !== 'mp3') {
        updateFileStatusError(file.name, 'File is not an mp3 file!');
        return undefined;
    }

    const date = fileNameToDate(fileName);
    // Make sure the file name is in the correct format
    if (!date) {
        updateFileStatusError(file.name, 'File name is not in the correct format!');
        return undefined;
    }

    const filePath = await saveFile(file, date);
    // Make sure the file was saved
    if (!filePath) {
        updateFileStatusError(file.name, 'File could not be saved!');
        return undefined;
    }

    const transcript = await transcribeFile(apiKey, organizationKey, file);
    // Make sure it a transcript was created
    if (!transcript) {
        updateFileStatusError(file.name, 'Transcript could not be created!')
        return undefined;
    }

    updateLoadingStatus(file.name, 'summarizing')

    const summary = await summarizeTranscript(apiKey, organizationKey, transcript);
    // Make sure a summary was created
    if (!summary) {
        updateFileStatusError(file.name, 'Summary could not be created!');
        return undefined;
    }

    // Get the duration of the file
    const buffer = await file.arrayBuffer();
    const audioContext = new AudioContext();
    const audioBuffer = await audioContext.decodeAudioData(buffer);
    const duration = audioBuffer.duration;

    // Create the transcript data
    return {
        fileName: fileName,
        filePath: filePath,
        date: date,
        transcript: transcript,
        summary: summary,
        duration: duration * 1000, // Convert to milliseconds
    } as FileTranscript;
}