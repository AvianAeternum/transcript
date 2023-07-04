import {BsCircleFill} from "react-icons/bs";
import {cn} from "@/lib/utils";
import React from "react";
import {LoadingStatus} from "@/utils/types";

interface UploadingFileProps {

    loadingStatus: LoadingStatus;

    setLoadingStatus: React.Dispatch<React.SetStateAction<LoadingStatus | null>>;

}

export default function UploadingFile({loadingStatus, setLoadingStatus}: UploadingFileProps) {
    return (
        <div className="flex flex-col gap-5">
            {
                loadingStatus.files.map(file => (
                    <div
                        key={file.file.name}
                        className="flex justify-between gap-5 w-full text-md bg-[rgba(0,0,0,0.3)] p-2 rounded-[8px]"
                    >
                        <div className="flex flex-col">
                                <span>
                                    {file.file.name}
                                </span>
                            {
                                file.error && (
                                    <span className="text-red-500 text-xs">
                                            {file.error}
                                        </span>
                                )
                            }
                        </div>
                        <div className="flex gap-5 items-center">
                            <div className="flex items-center gap-2.5">
                                <span>Transcript</span>
                                <BsCircleFill
                                    className={cn({
                                        'text-xl': true,
                                        'text-red-500': file.status === 'queued' || file.error,
                                        'text-yellow-500': file.status === 'transcribing' && !file.error,
                                        'text-green-500': (file.status === 'summarizing' || file.status === 'done') && !file.error
                                    })}
                                />
                            </div>
                            <div className="flex items-center gap-2.5">
                                <span>
                                    Summary
                                </span>
                                <BsCircleFill
                                    className={cn({
                                        'text-lg': true,
                                        'text-red-500': file.status === 'queued' || file.status === 'transcribing' || file.error,
                                        'text-yellow-500': file.status === 'summarizing' && !file.error,
                                        'text-green-500': file.status === 'done' && !file.error
                                    })}
                                />
                            </div>
                        </div>
                    </div>
                ))
            }
            <div className="flex flex-col w-full items-end gap-2">
                <div className="w-full bg-[rgba(0,0,0,.25)] h-3">
                    <div
                        className="bg-green-500 h-full transition-all duration-1000"
                        style={{
                            width: `${loadingStatus.progress}%`
                        }}
                    />
                </div>
                <div className="w-full text-right">
                    {loadingStatus.progress.toFixed(2)}%
                </div>
            </div>
            <div className="mt-5 mx-auto">
                <button
                    className="px-5 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-100"
                    onClick={() => setLoadingStatus(null)}
                >
                    Cancel
                </button>
            </div>
        </div>
    )
}