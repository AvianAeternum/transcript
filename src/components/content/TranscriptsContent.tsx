import {useContentHook} from "@/hook/ContentHook";
import {FileTranscript} from "@/utils/types";
import {Accordion} from "@/components/ui/accordion";
import TranscriptMonth from "@/components/content/list/TranscriptMonth";
import {useState} from "react";
import CurrentTranscript from "@/components/content/list/CurrentTranscript";

interface TranscriptYear {
    year: number;
    transcripts: {
        month: number;
        transcripts: FileTranscript[];
    }[];
}

export default function TranscriptsContent() {
    const [currentTranscript, setCurrentTranscript] = useState<FileTranscript | null>(null);
    const {data} = useContentHook();
    const transcripts = splitTranscriptsByYearAndMonth(data.transcripts);

    return (
        <div className="flex flex-col gap-5">
            {
                transcripts.sort((a, b) => a.year - b.year).map(year => (
                    <div key={year.year}>
                        <div className="flex items-center justify-between py-2">
                            <h1 className="text-2xl">
                                {
                                    year.year
                                }
                            </h1>
                        </div>
                        <Accordion type="multiple" className="flex flex-col gap-5">
                            {
                                year.transcripts
                                    .sort((a, b) => a.month - b.month)
                                    .map(month => (
                                        <TranscriptMonth
                                            key={month.month}
                                            date={convertMonth(month.month)}
                                            transcripts={month.transcripts}
                                            setCurrentTranscript={setCurrentTranscript}
                                        />
                                    ))
                            }
                        </Accordion>
                    </div>
                ))
            }
            {
                currentTranscript && (
                    <CurrentTranscript
                        currentTranscript={currentTranscript}
                        setCurrentTranscript={setCurrentTranscript}
                    />
                )
            }
        </div>
    )

}

/**
 * Convert a month number to a month name
 *
 * @param month the month number
 */
function convertMonth(month: number) {
    if (month === 1) {
        return "January";
    } else if (month === 2) {
        return "February";
    } else if (month === 3) {
        return "March";
    } else if (month === 4) {
        return "April";
    } else if (month === 5) {
        return "May";
    } else if (month === 6) {
        return "June";
    } else if (month === 7) {
        return "July";
    } else if (month === 8) {
        return "August";
    } else if (month === 9) {
        return "September";
    } else if (month === 10) {
        return "October";
    } else if (month === 11) {
        return "November";
    }

    return "December";
}

/**
 * Splits the transcripts by year and month.
 *
 * @param transcripts The transcripts to split
 */
function splitTranscriptsByYearAndMonth(transcripts: FileTranscript[]): TranscriptYear[] {
    const result: TranscriptYear[] = [];

    for (const fileTranscript of transcripts) {
        const transcriptDate = new Date(fileTranscript.date);
        const year = transcriptDate.getFullYear();
        const month = transcriptDate.getMonth() + 1; // Months are zero-based in JavaScript

        let yearEntry = result.find((entry) => entry.year === year);
        if (!yearEntry) {
            yearEntry = {year, transcripts: []};
            result.push(yearEntry);
        }

        let monthEntry = yearEntry.transcripts.find((entry) => entry.month === month);
        if (!monthEntry) {
            monthEntry = {month, transcripts: []};
            yearEntry.transcripts.push(monthEntry);
        }

        monthEntry.transcripts.push(fileTranscript);
    }


    return result;
}