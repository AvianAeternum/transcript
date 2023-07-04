import {BiPause, BiPlay} from "react-icons/bi";
import React, {useEffect, useRef, useState} from "react";

interface AudioPlayerProps {

    src: string;

}

// Custom simple audio player:

export function AudioPlayer({src}: AudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const audioRef = useRef<HTMLAudioElement>(null);

    /**
     * Toggles the play/pause state of the audio player
     */
    function togglePlay() {
        if (isPlaying) {
            audioRef.current?.pause();
        } else {
            audioRef.current?.play();
        }

        setIsPlaying(!isPlaying);
    }

    /**
     * Handles the time update event of the audio player
     */
    function handleTimeUpdate() {
        setCurrentTime(audioRef.current?.currentTime ?? 0);
    }

    /**
     * Formats the given time in seconds to a string
     *
     * @param time The time in seconds
     */
    function formatTime(time: number): string {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);

        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    }

    /**
     * Handles the click on the progress bar
     *
     * @param event The click event
     */
    function handleProgressBarClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        const audio = audioRef.current;
        if (!audio) {
            return;
        }

        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const width = rect.right - rect.left;
        const percentage = x / width;

        audio.currentTime = audio.duration * percentage;
    }

    useEffect(() => {
        if (!audioRef.current) {
            return;
        }

        const loadListener = () => {
            setIsPlaying(false);
            setCurrentTime(0);
            setDuration(audioRef.current?.duration ?? 0);
        }

        audioRef.current.addEventListener("loadedmetadata", loadListener);

        return () => {
            audioRef.current?.removeEventListener("loadedmetadata", loadListener);
        }
    }, [audioRef, audioRef.current]);


    return (
        <div className="flex items-center gap-2.5 bg-[rgba(0,0,0,0.5)] p-2.5">
            <div
                className="text-7xl text-white p-1 cursor-pointer hover:text-[rgba(255,255,255,0.75)] transition-colors duration-100"
                onClick={togglePlay}
            >
                {
                    isPlaying ? (
                        <BiPause/>
                    ) : (
                        <BiPlay/>
                    )
                }

            </div>
            <div className="flex flex-1 flex-col items-end gap-5">
                <span>
                    {formatTime(currentTime)}/{formatTime(duration)}
                </span>
                <div
                    className="flex items-center w-full h-4 cursor-pointer"
                    onClick={handleProgressBarClick}
                >
                    <div
                        className="w-full h-1 bg-[rgba(255,255,255,.5)]"
                    >
                        <div
                            className={`h-full bg-white relative after:absolute after:-right-1 after:h-2.5 after:w-2.5 after:rounded-full after:bg-white after:-top-1/2`}
                            style={{
                                width: `${currentTime / duration * 100}%`
                            }}
                        />
                    </div>
                </div>
            </div>
            <audio
                ref={audioRef}
                src={src}
                onEnded={() => setIsPlaying(false)}
                onTimeUpdate={handleTimeUpdate}
                hidden
            />
        </div>
    );

}