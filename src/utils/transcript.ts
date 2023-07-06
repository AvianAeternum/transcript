import {fileToDate, saveFile} from "@/utils/file";
import {Data, FileTranscript} from "@/utils/types";

/**
 * Transcribe the file to text
 *
 * @param apiKey the api key
 * @param organizationKey the organization key
 * @param file the file
 */
export async function transcribeFile(apiKey: string, organizationKey: string | undefined, file: File,
                                     addConsoleMessage: (message: string) => void
): Promise<string | undefined> {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("model", "whisper-1");

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            ...(organizationKey && {"OpenAI-Organization": organizationKey})
        } as any,
        body: formData
    }).then(response => response.json());

    addConsoleMessage(`${file.name}: RAW RESPONSE: ${JSON.stringify(response)}`);

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
export async function summarizeTranscript(apiKey: string, organizationKey: string | undefined, transcript: string,
                                          file: File,
                                          addConsoleMessage: (message: string) => void
): Promise<string | undefined> {
    const response = await fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            ...(organizationKey && {"OpenAI-Organization": organizationKey})
        } as any,
        body: JSON.stringify({
            model: "text-davinci-003",
            prompt: `Please provide a concise summary of 16 words or less, of the key points discussed in the monologue. The transcript is as follows: '${transcript}'`,
            max_tokens: 75,
        })
    }).then(response => response.json());
    addConsoleMessage(`${file.name}: RAW RESPONSE: ${JSON.stringify(response)}`);
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

/**
 * Load the file
 *
 * @param file the file
 * @param data the data
 * @param updateFileStatusError the function to update the file status error
 * @param updateLoadingStatus the function to update the loading status
 */
export async function loadFile(file: File, data: Data,
                               updateFileStatusError: (name: string | undefined, error: string) => void,
                               addConsoleMessage: (message: string) => void,
                               updateLoadingStatus: (fileName: string, status: 'transcribing' | 'summarizing') => void
): Promise<FileTranscript | undefined> {
    const api = data.api;
    if (!api || !api.verified) {
        updateFileStatusError(file.name, 'API Key is not verified!');
        addConsoleMessage(`${file.name}: API Key is not verified, skipping file!`);
        return undefined;
    }

    const apiKey = api.apiKey;
    const organizationKey = api.organizationKey;
    if (!apiKey) {
        updateFileStatusError(file.name, 'API Key is not set!');
        addConsoleMessage(`${file.name}: API Key is not set, skipping file!`);
        return undefined;
    }

    const fileName = file.name;
    // Ensure the file name is unique
    if (data.transcripts.find(transcript => transcript.fileName === fileName)) {
        updateFileStatusError(file.name, 'File does already exist in the database!');
        addConsoleMessage(`${file.name}: File does already exist in the database, skipping file!`);
        return undefined;
    }

    const fileExtension = fileName.split('.').pop();
    // Make sure the file is an mp3 file
    if (fileExtension !== 'mp3') {
        updateFileStatusError(file.name, 'File is not an mp3 file!');
        addConsoleMessage(`${file.name}: File is not an mp3 file, skipping file!`);
        return undefined;
    }

    const date = fileToDate(file);
    if (!date) {
        addConsoleMessage(`${file.name}: No date found in metadata, skipping file!`);
        return undefined;
    }

    const filePath = await saveFile(file, date);
    // Make sure the file was saved
    if (!filePath) {
        updateFileStatusError(file.name, 'File could not be saved!');
        addConsoleMessage(`${file.name}: File could not be saved, skipping file!`);
        return undefined;
    }

    const transcript = await transcribeFile(apiKey, organizationKey, file, addConsoleMessage);
    // Make sure it a transcript was created
    if (!transcript) {
        updateFileStatusError(file.name, 'Transcript could not be created!');
        addConsoleMessage(`${file.name}: Transcript could not be created, skipping file!`);
        return undefined;
    }

    updateLoadingStatus(file.name, 'summarizing')

    const summary = await summarizeTranscript(apiKey, organizationKey, transcript, file, addConsoleMessage);
    // Make sure a summary was created
    if (!summary) {
        updateFileStatusError(file.name, 'Summary could not be created!');
        addConsoleMessage(`${file.name}: Summary could not be created, skipping file!`);
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