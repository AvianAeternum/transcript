import React from "react";
import {useContentHook} from "@/hook/ContentHook";
import {BiPlus} from "react-icons/bi";
import UploadingFile from "@/components/content/add/UploadingFile";


export default function UploadContent() {
    const {loadingStatus, setLoadingStatus, handleUpload} = useContentHook();
    const inputRef = React.useRef<HTMLInputElement>(null);

    if (loadingStatus) {
        return (
            <UploadingFile
                loadingStatus={loadingStatus}
                setLoadingStatus={setLoadingStatus}
            />
        );
    }

    function handleUploadClick() {
        if (!inputRef.current) {
            return;
        }

        inputRef.current.click();
    }

    return (
        <div className="h-full w-full flex flex-col justify-center items-center gap-5">
            <button
                className="px-5 py-2 rounded-lg bg-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.3)] transition-colors duration-100"
                onClick={handleUploadClick}
            >
                <BiPlus className="inline-block mr-2"/>
                Upload
                <input
                    type="file"
                    ref={inputRef}
                    className="hidden"
                    onChange={handleUpload}
                    multiple
                    accept={"audio/mp3"}
                />
            </button>
        </div>
    )
}