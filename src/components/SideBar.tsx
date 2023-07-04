import {cn} from "@/lib/utils";
import {BiFile, BiPlus} from "react-icons/bi";
import {BsGear} from "react-icons/bs";
import {useContentHook} from "@/hook/ContentHook";
import {ContentType} from "@/utils/types";

export function SideBar() {
    const {contentType, setContentType} = useContentHook();

    return (
        <div
            className="w-[12%] bg-[rgba(0,0,0,.5)] flex flex-col gap-1 py-1"
            style={{
                boxShadow: "inset -10px 0px 10px -10px rgba(0,0,0,0.5)",
            }}
        >
            <div
                className={cn({
                    "flex justify-center items-center cursor-pointer mx-1 hover:bg-[rgba(255,255,255,0.1)] transition-colors duration-100 rounded-2xl aspect-[1/1]": true,
                    "bg-[rgba(255,255,255,0.1)]": contentType === ContentType.ADD_TRANSCRIPT,
                })}
                onClick={() => setContentType(ContentType.ADD_TRANSCRIPT)}
            >
                <BiPlus
                    className="text-2xl"
                />
            </div>
            <div
                className={cn({
                    "flex justify-center items-center cursor-pointer mx-1 hover:bg-[rgba(255,255,255,0.1)] transition-colors duration-100 rounded-2xl aspect-[1/1]": true,
                    "bg-[rgba(255,255,255,0.1)]": contentType === ContentType.TRANSCRIPTS,
                })}
                onClick={() => setContentType(ContentType.TRANSCRIPTS)}
            >
                <BiFile
                    className="text-2xl"
                />
            </div>
            <div
                className={cn({
                    "flex justify-center items-center cursor-pointer mx-1 hover:bg-[rgba(255,255,255,0.1)] transition-colors duration-100 rounded-2xl aspect-[1/1]": true,
                    "bg-[rgba(255,255,255,0.1)]": contentType === ContentType.SETTINGS,
                })}
                onClick={() => setContentType(ContentType.SETTINGS)}
            >
                <BsGear
                    className="text-2xl"
                />
            </div>
        </div>
    )
}