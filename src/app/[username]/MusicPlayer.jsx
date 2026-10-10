
    "use client";

    import { useEffect, useRef, useState } from "react";
    import { Play, Pause, Volume2, VolumeX, Music } from "lucide-react";

    export default function MusicPlayer({ musicUrl, title, artist, cover }) {
        const audioRef = useRef(null);
        const [isPlaying, setIsPlaying] = useState(false);
        const [volume, setVolume] = useState(10);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = (volume / 100) * 0.5;
        }
    }, [volume]);

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

        if (!musicUrl) return null;
        return (
            <div className="music-player">
                  <div className="music-cover">
                {cover ? (
                    <img
                        src={cover}
                        alt=""
                        onLoad={() => console.log("Обложка загружена:", cover)}
                        onError={() => console.error("Ошибка загрузки обложки:", cover)}
                    />
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
                        onClick={() => setVolume((v) => v === 0 ? 10 : 0)}
                    >
                        {volume === 0
                            ? <VolumeX size={17} />
                            : <Volume2 size={17} />}
                    </button>

                    <input
                        type="range"
                        min="0"
                        max="50"
                        value={volume}
                        aria-label="Volume"
                        style={{ "--volume-progress": `${volume * 2}%` }}
                        onChange={(e) => setVolume(Number(e.target.value))}
                    />
                </div>

                <audio
                    ref={audioRef}
                    src={musicUrl}
                    onEnded={() => setIsPlaying(false)}
                    onPause={() => setIsPlaying(false)}
                    onPlay={() => setIsPlaying(true)}
                />
            </div>
        );
    }
