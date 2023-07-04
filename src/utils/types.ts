export enum ContentType {

    ADD_TRANSCRIPT,
    TRANSCRIPTS,
    SETTINGS

}

export interface ApiData {

    organizationKey?: string | undefined;

    apiKey?: string | undefined;

    verified?: Date | undefined;

}

export interface FileTranscript {
    fileName: string;
    filePath: string;
    date: Date;
    transcript: string;
    summary: string;
    duration: number;
}

export interface Data {

    api: ApiData;

    transcripts: FileTranscript[];

}

export interface FormMessage {

    type: 'success' | 'error';

    field: string | 'global';

    message: string;

}

export interface LoadingStatus {

    progress: number;

    files: {
        file: File;
        status: 'queued' | 'transcribing' | 'summarizing' | 'done';
        error?: string;
    }[];

}