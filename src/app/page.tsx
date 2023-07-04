"use client";

import {HiXMark} from "react-icons/hi2";
import {appWindow} from "@tauri-apps/api/window";
import {SideBar} from "@/components/SideBar";
import {useContentHook} from "@/hook/ContentHook";
import {ContentType} from "@/utils/types";
import AddTranscriptContent from "@/components/content/AddTranscriptContent";
import SettingsContent from "@/components/content/settingsContent";
import TranscriptsContent from "@/components/content/TranscriptsContent";

export default function Home() {
    const {contentType} = useContentHook();

    /**
     * Close the app window
     */
    function handleCloseClick() {
        if (!appWindow) {
            return;
        }

        appWindow.close().catch(console.error);
    }

    return (
        <main
            className="flex flex-col flex-wrap min-h-screen bg-gray-900"
        >
            <div
                className="h-fit px-2 flex justify-between items-center bg-[rgba(0,0,0,0.2)]"
                data-tauri-drag-region
            >
                <div>
                    Transcript
                </div>
                <div
                    className="flex justify-end items-center py-2 text-white hover:text-red-500 transition-colors duration-100"
                    onClick={handleCloseClick}
                >
                    <HiXMark
                        className="text-xl cursor-pointer"
                    />
                </div>
            </div>
            <div
                className="flex flex-1"
            >
                <SideBar/>
                <div
                    className="flex-1 overflow-y-auto p-2.5 relative max-h-[calc(100vh-3rem)]"
                >
                    {
                        contentType === ContentType.ADD_TRANSCRIPT && (
                            <AddTranscriptContent/>
                        )
                    }
                    {
                        contentType === ContentType.TRANSCRIPTS && (
                            <TranscriptsContent/>
                        )
                    }
                    {
                        contentType === ContentType.SETTINGS && (
                            <SettingsContent/>
                        )
                    }
                </div>
            </div>

        </main>
    )
}