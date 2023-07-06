import {cn} from "@/lib/utils";
import {useContentHook} from "@/hook/ContentHook";
import {ContentType} from "@/utils/types";
import {CgFileDocument, CgSoftwareUpload} from "react-icons/cg";
import {TbSettings2} from "react-icons/tb";

export function SideBar() {
    const {contentType, setContentType} = useContentHook();

    return (
        <div
            className="w-[12%] bg-[rgba(0,0,0,.2)] flex flex-col py-1"
            style={{
                boxShadow: "inset -10px 0px 10px -10px rgba(0,0,0,0.5)",
            }}
        >
            <div
                className="relative flex items-center justify-center cursor-pointer p-4 group"
                onClick={() => setContentType(ContentType.UPLOAD)}
            >
                <div
                    className={cn({
                        "absolute left-0 h-3/4 w-1 bg-white rounded-r-md transition-transform duration-500 scale-y-0 group-hover:scale-y-50 rounded-2xl": true,
                        "scale-y-100 group-hover:scale-y-100": contentType === ContentType.UPLOAD,
                    })}
                />
                <CgSoftwareUpload
                    className={cn({
                        "text-[rgba(255,255,255,.5)] group-hover:text-white text-2xl transition-colors duration-500": true,
                        "text-white": contentType === ContentType.UPLOAD,
                    })}
                />
            </div>
            <div
                className="relative flex items-center justify-center cursor-pointer p-4 group"
                onClick={() => setContentType(ContentType.TRANSCRIPTS)}
            >
                <div
                    className={cn({
                        "absolute left-0 h-3/4 w-1 bg-white rounded-r-md transition-transform duration-500 scale-y-0 group-hover:scale-y-50 rounded-2xl": true,
                        "scale-y-100 group-hover:scale-y-100": contentType === ContentType.TRANSCRIPTS,
                    })}
                />
                <CgFileDocument
                    className={cn({
                        "text-[rgba(255,255,255,.5)] group-hover:text-white text-2xl transition-colors duration-500": true,
                        "text-white": contentType === ContentType.TRANSCRIPTS,
                    })}
                />
            </div>
            <div
                className="relative flex items-center justify-center cursor-pointer p-4 group mt-auto"
                onClick={() => setContentType(ContentType.SETTINGS)}
            >
                <div
                    className={cn({
                        "absolute left-0 h-3/4 w-1 bg-white rounded-r-md transition-transform duration-500 scale-y-0 group-hover:scale-y-50 rounded-2xl": true,
                        "scale-y-100 group-hover:scale-y-100": contentType === ContentType.SETTINGS,
                    })}
                />
                <TbSettings2
                    className={cn({
                        "text-[rgba(255,255,255,.5)] group-hover:text-white text-2xl transition-colors duration-500": true,
                        "text-white": contentType === ContentType.SETTINGS,
                    })}
                />
            </div>
        </div>
    )
}