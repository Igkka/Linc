
"use client";

import { useEffect, useRef, useState } from "react";
import {
    Play,
    Pause,
    Volume2,
    VolumeX,
    Music
} from "lucide-react";

export default function MusicPlayer({
    musicUrl,
    title,
    artist,
    cover
}) {
    const audioRef = useRef(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(10);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.volume = (volume / 100) * 0.5;
    }, [volume]);

    useEffect(() => {
        async function playFromEntry() {
            const audio = audioRef.current;
            if (!audio) return;

            try {
                await audio.play();
            } catch (error) {
                console.error("AUDIO_PLAY_ERROR:", error);
            }
        }

        window.addEventListener(
            "linxy:enter-profile",
            playFromEntry
        );

        return () => {
            window.removeEventListener(
                "linxy:enter-profile",
                playFromEntry
            );
        };
    }, []);

    async function togglePlayback() {
        const audio = audioRef.current;
        if (!audio) return;

        if (audio.paused) {
            try {
                await audio.play();
            } catch (error) {
                console.error("AUDIO_PLAY_ERROR:", error);
            }
        } else {
            audio.pause();
        }
    }

    function formatTime(time) {
        if (!Number.isFinite(time)) return "0:00";

        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);

        return `${minutes}:${String(seconds).padStart(2, "0")}`;
    }

    function seek(e) {
        const audio = audioRef.current;
        if (!audio || !Number.isFinite(audio.duration)) return;

        const time = Number(e.target.value);

        audio.currentTime = time;
        setCurrentTime(time);
    }

    if (!musicUrl) return null;

    const progress = duration > 0
        ? (currentTime / duration) * 100
        : 0;

    return (
        <div className="music-player">
            <div className="music-cover">
                {cover ? (
                    <img src={cover} alt="" />
                ) : (
                    <Music size={21} strokeWidth={1.6} />
                )}
            </div>

            <div className="music-info">
                <span className="music-title">
                    {title || "Untitled"}
                </span>

                <span className="music-artist">
                    {artist || "Unknown artist"}
                </span>
            </div>

            <button
                type="button"
                className="music-play-button"
                onClick={togglePlayback}
                aria-label={isPlaying ? "Pause" : "Play"}
            >
                {isPlaying
                    ? <Pause size={19} strokeWidth={2} />
                    : <Play size={19} strokeWidth={2} />}
            </button>

            <div className="music-volume">
                <button
                    type="button"
                    className="music-volume-button"
                    aria-label={volume === 0 ? "Unmute" : "Mute"}
                    onClick={() => setVolume(v => v === 0 ? 10 : 0)}
                >
                    {volume === 0
                        ? <VolumeX size={17} />
                        : <Volume2 size={17} />}
                </button>

                <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    aria-label="Volume"
                    style={{
                        "--volume-progress": `${volume}%`
                    }}
                    onChange={e => setVolume(Number(e.target.value))}
                />
            </div>

<div className="music-timeline">
    <span>{formatTime(currentTime)}</span>

   
<input
    className="music-seek"
    type="range"
    min={0}
    max={duration || 0}
    step={0.1}
    value={Math.min(currentTime, duration || 0)}
    disabled={!duration}
    aria-label="Seek music"
    style={{
        "--seek-progress": `${
            duration > 0
                ? (currentTime / duration) * 100
                : 0
        }%`
    }}
    onInput={(e) => {
        const audio = audioRef.current;
        if (!audio || !Number.isFinite(audio.duration)) return;

        const time = Number(e.currentTarget.value);
        audio.currentTime = time;
        setCurrentTime(time);
    }}
/>

    <span>{formatTime(duration)}</span>
</div>

            <audio
                ref={audioRef}
                src={musicUrl}
                preload="metadata"
                
                onLoadedMetadata={e => {
                    setDuration(e.currentTarget.duration || 0);
                }}
                onDurationChange={e => {
                    setDuration(e.currentTarget.duration || 0);
                }}
                onTimeUpdate={e => {
                    setCurrentTime(e.currentTarget.currentTime);
                }}
                onEnded={() => {
                    setIsPlaying(false);
                    setCurrentTime(0);
                }}
                onPause={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
            />
        </div>
    );
}
