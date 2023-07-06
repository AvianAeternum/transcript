import {FileTranscript} from "@/utils/types";
import {AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {Dispatch, SetStateAction} from "react";
import {BiTrash} from "react-icons/bi";
import {convertDay, convertDuration, convertTime} from "@/utils/time";
import {useContentHook} from "@/hook/ContentHook";

interface TranscriptDateListProps {

    date: string;

    transcripts: FileTranscript[];

    setCurrentTranscript: Dispatch<SetStateAction<FileTranscript | null>>;

}

export default function TranscriptMonth({date, transcripts, setCurrentTranscript}: TranscriptDateListProps) {
    const {setData} = useContentHook();

    return (
        <AccordionItem value={date}>
            <AccordionTrigger className="text-xl">
                {
                    date
                }
            </AccordionTrigger>
            <AccordionContent className="px-2">
                {transcripts
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map(transcript => {
                        const date = new Date(transcript.date);

                        /**
                         * Handles the click event on the item
                         *
                         * @param e The click event
                         */
                        function handleItemClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
                            // Ensure that the click event is not triggered when clicking on the delete button
                            if ((e.target as HTMLElement).id === 'delete') {
                                return;
                            }

                            // Ensure the click event is not triggered when clicking on the delete icon
                            if ((e.target as HTMLElement).tagName === 'svg') {
                                return;
                            }

                            e.preventDefault();
                            e.stopPropagation();

                            setCurrentTranscript(transcript);
                        }

                        /**
                         * Handles the delete event on the item.
                         *
                         * @param e The click event
                         */
                        async function handleDelete(e: React.MouseEvent<SVGSVGElement, MouseEvent>) {
                            const {removeFile, exists} = (await import('@tauri-apps/api/fs'));

                            e.preventDefault();
                            e.stopPropagation();

                            if (await exists(transcript.filePath)) {
                                await removeFile(transcript.filePath);
                            }

                            setData(prev => ({
                                ...prev,
                                transcripts: prev.transcripts.filter(t => t.fileName !== transcript.fileName)
                            }));
                        }

                        return (
                            <div
                                key={transcript.fileName}
                                className="flex items-center py-2 px-4 border-b border-[rgba(0,0,0,0.5)] hover:bg-[rgba(0,0,0,0.3)] transition-colors duration-200 cursor-pointer"
                                onClick={handleItemClick}
                            >
                                <div
                                    className="w-2/6 text-left text-lg"
                                >
                                    {
                                        convertDay(date.getDate())
                                    }
                                </div>
                                <div
                                    className="w-2/6 text-left text-lg"
                                >
                                    {
                                        convertTime(date)
                                    }
                                </div>
                                <div
                                    className="w-2/6 text-left text-lg"
                                >
                                    {
                                        convertDuration(transcript.duration)
                                    }
                                </div>
                                <div className="w-1/6 flex justify-end items-center z-50" id="delete">
                                    <BiTrash
                                        className="text-xl hover:text-red-500 transition-colors duration-200 cursor-pointer"
                                        onClick={handleDelete}
                                    />
                                </div>
                            </div>
                        );
                    })
                }
            </AccordionContent>
        </AccordionItem>
    );
}