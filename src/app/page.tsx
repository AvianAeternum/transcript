"use client";

import {SideBar} from "@/components/SideBar";
import {useContentHook} from "@/hook/ContentHook";
import {ContentType, Theme, THEME_PRESETS} from "@/utils/types";
import UploadContent from "@/components/content/UploadContent";
import SettingsContent from "@/components/content/settingsContent";
import TranscriptsContent from "@/components/content/TranscriptsContent";
import {useEffect, useState} from "react";

export default function Home() {
    const {contentType, data} = useContentHook();
    const [theme, setTheme] = useState<Theme>(data.theme ?? THEME_PRESETS[0]);

    useEffect(() => {
        setTheme(data.theme ?? THEME_PRESETS[0]);
    }, [data]);

    return (
        <main
            className={`flex flex-col flex-wrap min-h-screen`}
            style={{
                background: `linear-gradient(${theme.bgRotation}deg, ${theme.bgBeginColor}, ${theme.bgEndColor})`
            }}
        >
            <div
                className="flex flex-1"
            >
                <SideBar/>
                <div
                    className="flex-1 overflow-y-auto p-2.5 relative bg-[rgba(255,255,255,.05)]"
                >
                    {
                        contentType === ContentType.UPLOAD && (
                            <UploadContent/>
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