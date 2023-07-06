"use client";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {FileTranscript} from "@/utils/types";
import {BiArrowBack} from "react-icons/bi";
import {AudioPlayer} from "@/components/common/AudioPlayer";

interface CurrentTranscriptProps {

    currentTranscript: FileTranscript;

    setCurrentTranscript: Dispatch<SetStateAction<FileTranscript | null>>;

}

export default function CurrentTranscript({currentTranscript, setCurrentTranscript}: CurrentTranscriptProps) {
    const [audioSrc, setAudioSrc] = useState<string>('');

    /**
     * Initialize the audio source
     */
    async function initAudioSrc() {
        if (!currentTranscript) {
            return;
        }

        const {convertFileSrc} = (await import("@tauri-apps/api/tauri"));
        const src = convertFileSrc(currentTranscript.filePath);

        setAudioSrc(src);
    }

    useEffect(() => {
        initAudioSrc().catch(console.error);
    }, []);

    return (
        <div
            className="flex flex-col absolute top-0 left-0 w-full bg-[rgba(255,255,255,.01)] h-full bg-opacity-50 backdrop-blur z-50 p-2.5 text-[rgba(255,255,255,0.8)]">
            <div className="flex items-center gap-2.5">
                <BiArrowBack
                    className="text-2xl cursor-pointer hover:text-red-500 transition-colors duration-100"
                    onClick={() => setCurrentTranscript(null)}
                />
                <h1 className="text-xl">
                    {
                        currentTranscript.fileName.replace('.mp3', '')
                    } ({
                    new Date(currentTranscript.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                        hourCycle: 'h12',
                        hour: 'numeric',
                        minute: 'numeric'
                    })
                })
                </h1>
            </div>

            <div className="pt-5">
                <h2 className="text-lg">
                    Summary
                </h2>
                <p className="text-sm text-white">
                    {
                        currentTranscript.summary
                    }
                </p>
            </div>
            <div className="pt-5">
                <AudioPlayer
                    src={audioSrc}
                />
            </div>
            <div className="flex flex-1 overflow-y-auto bg-[rgba(0,0,0,0.5)] mt-2.5 p-2.5 rounded-2xl">
                <p
                    dangerouslySetInnerHTML={{
                        __html: currentTranscript.transcript.replace(/\n/g, '<br>')
                    }}
                />
            </div>
        </div>
    )
}