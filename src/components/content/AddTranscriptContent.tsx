import React from "react";
import {useContentHook} from "@/hook/ContentHook";
import {FileTranscript, LoadingStatus} from "@/utils/types";
import {loadFile} from "@/utils/transcript";
import {BiPlus} from "react-icons/bi";
import UploadingFile from "@/components/content/add/UploadingFile";


export default function AddTranscriptContent() {
    const {data, setData} = useContentHook();
    const [loadingStatus, setLoadingStatus] = React.useState<LoadingStatus | null>(null);

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


    /**
     * Handle the file upload
     *
     * @param event the event
     */
    async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
        const target = event.target;
        const files = target.files;
        if (!files) {
            return;
        }

        const loadingStatus: LoadingStatus = {
            progress: 0,
            files: []
        };

        // First we need to add all the files to the loading status
        for (let i = 0; i < files.length; i++) {
            const file = files.item(i);
            if (!file) {
                continue;
            }

            loadingStatus.files.push({
                file: file,
                status: 'queued'
            });
        }

        // Set the loading status.
        setLoadingStatus(loadingStatus);

        const toAdd: FileTranscript[] = [];
        while (loadingStatus) {
            // Find the first file that is queued
            const file = loadingStatus?.files.find(file => file.status === 'queued');
            if (!file) {
                break;
            }

            updateLoadingStatus(file.file.name, 'transcribing');

            // Load the file
            const transcript = await loadFile(file.file, data, updateFileStatusError, updateLoadingStatus);
            if (transcript) {
                toAdd.push(transcript);
            }

            updateLoadingStatus(file.file.name, 'done');
        }

        console.log(`Adding ${toAdd.length} transcripts to the database`);

        // Add the transcripts to the database
        setData(currentData => {
            return {
                ...currentData,
                transcripts: currentData.transcripts.concat(toAdd)
            }
        });

        // Clear the file input value so we can upload the same file again
        target.value = '';

        // After 5 seconds we remove the loading status
        setTimeout(() => {
            setLoadingStatus(null);
        }, 5000);
    }

    if (loadingStatus) {
        return (
            <UploadingFile
                loadingStatus={loadingStatus}
                setLoadingStatus={setLoadingStatus}
            />
        );
    }

    return (
        <div className="h-full w-full flex flex-col justify-center items-center gap-5">
            <div
                className="flex justify-center items-center relative w-96 aspect-[3/2] bg-[rgba(255,255,255,0.1)] rounded-lg hover:bg-[rgba(255,255,255,0.2)] transition-colors duration-100 cursor-pointer"

            >
                <BiPlus
                    className="absolute text-[rgba(255,255,255,0.5)] text-3xl"
                />
                <input
                    type={"file"}
                    multiple={true}
                    accept={"audio/mp3"}
                    className="absolute w-full h-full opacity-0 cursor-pointer"
                    onChange={handleUpload}
                />
            </div>
            <h1 className="text-xl text-[rgba(255,255,255,0.5)] text-center">
                Drag and drop mp3 files to transcribe and organize.
            </h1>
        </div>
    )
}