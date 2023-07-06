export enum ContentType {

    UPLOAD,
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

export interface Theme {

    name: string;
    bgBeginColor: string;
    bgEndColor: string;
    bgRotation: number;

}

export const THEME_PRESETS: Theme[] = [
    {
        name: "Red",
        bgBeginColor: "#371923",
        bgEndColor: "#5C343D",
        bgRotation: 55
    },
    {
        name: "Blue",
        bgBeginColor: "#121B3F",
        bgEndColor: "#1F2C6D",
        bgRotation: 55
    },
    {
        name: "Brown",
        bgBeginColor: "#2C1C10",
        bgEndColor: "#5D3E2A",
        bgRotation: 55,
    },
    {
        name: "Purple",
        bgBeginColor: "#380723",
        bgEndColor: "#5e1449",
        bgRotation: 55,
    },
    {
        name: "Green",
        bgBeginColor: "#0F2A1B",
        bgEndColor: "#1F4A2E",
        bgRotation: 55,
    },
    {
        name: "Yellow",
        bgBeginColor: "#3A2A0C",
        bgEndColor: "#5D4A1E",
        bgRotation: 55,
    },
    {
        name: "Orange",
        bgBeginColor: "#3A1A0C",
        bgEndColor: "#5D2A1E",
        bgRotation: 55,
    },
];

export interface Data {

    api: ApiData;

    theme: Theme;

    savedThemes: Theme[];

    transcripts: FileTranscript[];

}

export interface FormMessage {

    type: 'success' | 'error';

    field: string | 'global';

    message: string;

}

export interface LoadingStatus {

    progress: number;

    consoleMessages: string[];

    files: {
        file: File;
        status: 'queued' | 'transcribing' | 'summarizing' | 'done';
        error?: string;
    }[];

}