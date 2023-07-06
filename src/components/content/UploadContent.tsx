import React from "react";
import {useContentHook} from "@/hook/ContentHook";
import {FileTranscript, LoadingStatus} from "@/utils/types";
import {loadFile} from "@/utils/transcript";
import {BiPlus} from "react-icons/bi";
import UploadingFile from "@/components/content/add/UploadingFile";


export default function UploadContent() {
    const {data, setData} = useContentHook();
    const [loadingStatus, setLoadingStatus] = React.useState<LoadingStatus | null>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

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
                className="relative bg-[rgba(255,255,255,0.1)] flex justify-center items-center hover:bg-[rgba(255,255,255,0.2)] transition-colors duration-200 ease-in-out rounded-xl cursor-pointer"
            >
                <div className="flex p-2 cursor-none">
                    <BiPlus
                        className="text-[rgba(255,255,255,0.5)] text-3xl"
                    />
                </div>
                <div className="px-4 border-l border-white h-full flex items-center cursor-none">
                    <p className="text-[rgba(255,255,255,0.5)] text-sm cursor-none">Upload a file</p>
                </div>
                <input
                    type={"file"}
                    multiple={true}
                    accept={"audio/mp3"}
                    className="absolute w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={handleUpload}
                    ref={inputRef}
                />
            </div>
        </div>
    )
}