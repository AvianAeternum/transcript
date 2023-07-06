"use client";

import React, {createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState} from "react";
import {ContentType, Data, FileTranscript, LoadingStatus, THEME_PRESETS} from "@/utils/types";
import {loadFile} from "@/utils/transcript";

const DEFAULT_DATA: Data = {
    api: {},
    theme: THEME_PRESETS[0],
    savedThemes: THEME_PRESETS,
    transcripts: []
}

interface ContentHookProviderProps {

    children: ReactNode;

}

interface ContentHookContext {

    data: Data

    setData: Dispatch<SetStateAction<Data>>;

    contentType: ContentType;

    setContentType: Dispatch<SetStateAction<ContentType>>;

    loadingStatus: LoadingStatus | null;

    setLoadingStatus: Dispatch<SetStateAction<LoadingStatus | null>>;

    handleUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;

}

const ContentHookContext = createContext<ContentHookContext>(null as unknown as ContentHookContext);

export function ContentHookProvider({children}: ContentHookProviderProps) {
    const [contentType, setContentType] = useState<ContentType>(ContentType.UPLOAD);
    const [data, setData] = useState<Data>(DEFAULT_DATA);
    const [loadingStatus, setLoadingStatus] = React.useState<LoadingStatus | null>(null);

    /**
     * Save the data to localstorage
     *
     * @param data the data
     */
    function saveData(data: Data) {
        localStorage.setItem("data", JSON.stringify(data));
        console.log("Saved data to localstorage");
    }

    /**
     * Load the data from localstorage
     */
    function loadData() {
        // If localstorage doesn't have data, return
        if (!localStorage.getItem("data")) {
            return;
        }

        // Get the data from localstorage
        const data = JSON.parse(localStorage.getItem("data") as string) as Data;


        // Ensure that the data has the correct keys
        const newData: Data = {
            ...DEFAULT_DATA,
            ...data
        };

        // Set the data
        setData(newData);
        console.log("Loaded data from localstorage")
    }

    function updateFileStatusError(name: string | undefined, error: string) {
        if (!name) {
            return;
        }

        setLoadingStatus(currentLoadingStatus => {
            if (!currentLoadingStatus) {
                return null;
            }

            const files = currentLoadingStatus.files;
            const index = files.findIndex(file => file.file.name === name);
            if (index === -1) {
                return currentLoadingStatus;
            }

            files[index].error = error;

            return {
                ...currentLoadingStatus,
                files: files
            };
        });
    }

    function updateLoadingStatus(name: string | undefined, newStatus: 'queued' | 'transcribing' | 'summarizing' | 'done') {
        if (!name) {
            return;
        }

        setLoadingStatus(currentLoadingStatus => {
            if (!currentLoadingStatus) {
                return null;
            }

            const files = currentLoadingStatus.files;
            const index = files.findIndex(file => file.file.name === name);
            if (index === -1) {
                return currentLoadingStatus;
            }

            files[index].status = newStatus;

            // First we calcualte the progress this one item would add if it was done
            const progressPerItem = 100 / files.length;
            let progress = 0;
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (file.status === 'done') {
                    progress += progressPerItem;
                    continue;
                }

                if (file.status !== 'summarizing') {
                    continue;
                }

                progress += progressPerItem / 2;
            }

            currentLoadingStatus.progress = Math.min(progress, 100);

            return {
                ...currentLoadingStatus,
                files: files
            };
        });
    }

    function addConsoleMessage(message: string) {
        setLoadingStatus(currentLoadingStatus => {
            if (!currentLoadingStatus) {
                return null;
            }

            currentLoadingStatus.consoleMessages.push(message);

            return currentLoadingStatus;
        });
    }

    /**
     * Handle the file upload
     *
     * @param event the event
     */
    async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
        if (loadingStatus) {
            console.log(`Already loading`);
            return;
        }

        const target = event.target;
        const files = target.files;
        if (!files) {
            console.log(`No files found in the event`)
            return;
        }

        const newLoadingStatus: LoadingStatus = {
            progress: 0,
            consoleMessages: [],
            files: []
        };

        // First we need to add all the files to the loading status
        for (let i = 0; i < files.length; i++) {
            const file = files.item(i);
            if (!file) {
                continue;
            }

            newLoadingStatus.files.push({
                file: file,
                status: 'queued'
            });
            newLoadingStatus.consoleMessages.push(`Queued ${file.name}`);
        }

        // Set the loading status.
        setLoadingStatus(newLoadingStatus);

        const toAdd: FileTranscript[] = [];
        while (newLoadingStatus) {
            // Find the first file that is queued
            const file = newLoadingStatus?.files.find(file => file.status === 'queued');
            if (!file) {
                break;
            }

            updateLoadingStatus(file.file.name, 'transcribing');

            // Load the file
            const transcript = await loadFile(file.file, data, updateFileStatusError, addConsoleMessage, updateLoadingStatus);
            if (transcript) {
                toAdd.push(transcript);
            }

            updateLoadingStatus(file.file.name, 'done');
        }

        // Add the transcripts to the database
        setData(currentData => {
            return {
                ...currentData,
                transcripts: currentData.transcripts.concat(toAdd)
            }
        });

        // Clear the file input value so we can upload the same file again
        target.value = '';
    }

    useEffect(() => {

        // Load the data (data.json) file
        loadData();
    }, []);

    useEffect(() => {
        if (data === DEFAULT_DATA) {
            return;
        }

        // Save the data (data.json) file
        saveData(data);
    }, [data]);

    return (
        <ContentHookContext.Provider
            value={{
                contentType,
                setContentType,
                data,
                setData,
                loadingStatus,
                setLoadingStatus,
                handleUpload
            }}
        >
            {children}
        </ContentHookContext.Provider>
    );
}

export function useContentHook() {
    const context = useContext(ContentHookContext);
    if (!context) {
        throw new Error("useContentHook must be used within a ContentHookProvider");
    }

    return context;
}