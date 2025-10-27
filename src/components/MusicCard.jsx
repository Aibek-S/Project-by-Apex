import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import {
    MusicalNoteIcon,
    UserIcon,
    ChevronDownIcon,
    PlayIcon,
    PauseIcon,
    EllipsisVerticalIcon,
    ArrowDownTrayIcon,
} from "@heroicons/react/24/solid";

export default function MusicCard({ track, index = 0 }) {
    const { getLocalizedField, t } = useLanguage();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showMenu, setShowMenu] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    const audioRef = useRef(null);
    const menuRef = useRef(null);

    const title = getLocalizedField(track, "title");
    const description = getLocalizedField(track, "description");
    const composer = getLocalizedField(track, "composer");

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => {
            if (audio.duration && !isNaN(audio.duration)) {
                setDuration(audio.duration);
            }
        };
        const handleEnded = () => setIsPlaying(false);

        // Пытаемся получить длительность сразу
        if (audio.duration && !isNaN(audio.duration)) {
            setDuration(audio.duration);
        }

        audio.addEventListener("timeupdate", updateTime);
        audio.addEventListener("loadedmetadata", updateDuration);
        audio.addEventListener("durationchange", updateDuration);
        audio.addEventListener("canplay", updateDuration);
        audio.addEventListener("ended", handleEnded);

        return () => {
            audio.removeEventListener("timeupdate", updateTime);
            audio.removeEventListener("loadedmetadata", updateDuration);
            audio.removeEventListener("durationchange", updateDuration);
            audio.removeEventListener("canplay", updateDuration);
            audio.removeEventListener("ended", handleEnded);
        };
    }, []);

    // Закрытие меню при клике вне его
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };

        if (showMenu) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showMenu]);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleProgressClick = (e) => {
        const audio = audioRef.current;
        const bounds = e.currentTarget.getBoundingClientRect();
        const percent = (e.clientX - bounds.left) / bounds.width;
        audio.currentTime = percent * duration;
    };

    const formatTime = (seconds) => {
        if (!seconds || isNaN(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = track.audio_url;
        link.download = `${title}.mp3`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setShowMenu(false);
    };

    const handleSpeedChange = (speed) => {
        const audio = audioRef.current;
        audio.playbackRate = speed;
        setPlaybackRate(speed);
        setShowMenu(false);
    };

    const progress = duration ? (currentTime / duration) * 100 : 0;
    const speedOptions = [0.5, 0.75, 1, 1.25, 1.5];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            style={{
                background:
                    "linear-gradient(135deg, var(--card) 0%, rgba(212, 165, 116, 0.05) 100%)",
                borderRadius: "16px",
                border: "1px solid var(--border)",
                padding: "24px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease",
                height: "fit-content",
            }}
            whileHover={{
                boxShadow: "0 4px 16px rgba(212, 165, 116, 0.2)",
                borderColor: "var(--primary)",
            }}
        >
            {/* Заголовок и композитор */}
            <div style={{ marginBottom: 16 }}>
                <div
                    style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 8,
                        marginBottom: 8,
                    }}
                >
                    <MusicalNoteIcon
                        style={{
                            width: 24,
                            height: 24,
                            color: "var(--primary)",
                            flexShrink: 0,
                            marginTop: 2,
                        }}
                    />
                    <h3
                        style={{
                            fontSize: "1.25rem",
                            fontWeight: 700,
                            color: "var(--text)",
                            margin: 0,
                            lineHeight: 1.3,
                        }}
                    >
                        {title}
                    </h3>
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        marginLeft: 32,
                    }}
                >
                    <UserIcon
                        style={{
                            width: 16,
                            height: 16,
                            color: "var(--muted)",
                        }}
                    />
                    <p
                        style={{
                            fontSize: "0.95rem",
                            color: "var(--muted)",
                            margin: 0,
                        }}
                    >
                        {composer}
                    </p>
                </div>
            </div>

            {/* Кнопка раскрытия описания */}
            {description && (
                <>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            background: "transparent",
                            border: "none",
                            color: "var(--primary)",
                            fontSize: "0.9rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            padding: "8px 0",
                            marginBottom: 12,
                            transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.opacity = "0.8";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.opacity = "1";
                        }}
                    >
                        {isExpanded
                            ? t("hideDescription") || "Скрыть описание"
                            : t("showDescription") || "Показать описание"}
                        <ChevronDownIcon
                            style={{
                                width: 16,
                                height: 16,
                                transform: isExpanded
                                    ? "rotate(180deg)"
                                    : "rotate(0)",
                                transition: "transform 0.3s ease",
                            }}
                        />
                    </button>

                    {/* Раскрывающееся описание */}
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                style={{ overflow: "hidden" }}
                            >
                                <p
                                    style={{
                                        fontSize: "0.95rem",
                                        color: "var(--text)",
                                        opacity: 0.8,
                                        lineHeight: 1.6,
                                        marginBottom: 16,
                                        whiteSpace: "pre-line",
                                    }}
                                >
                                    {description}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            )}

            {/* Скрытый аудио элемент */}
            <audio ref={audioRef} src={track.audio_url} preload="metadata" />

            {/* Кастомный аудио плеер */}
            <div
                style={{
                    background:
                        "linear-gradient(135deg, var(--primary) 0%, rgba(212, 165, 116, 0.8) 100%)",
                    borderRadius: "12px",
                    padding: "16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    boxShadow: "0 2px 8px rgba(212, 165, 116, 0.3)",
                    transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                        "0 4px 12px rgba(212, 165, 116, 0.5)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                        "0 2px 8px rgba(212, 165, 116, 0.3)";
                    e.currentTarget.style.transform = "translateY(0)";
                }}
            >
                {/* Кнопка Play/Pause */}
                <button
                    onClick={togglePlay}
                    style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        border: "none",
                        background: "rgba(26, 18, 11, 0.8)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        flexShrink: 0,
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                            "rgba(26, 18, 11, 1)";
                        e.currentTarget.style.transform = "scale(1.1)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                            "rgba(26, 18, 11, 0.8)";
                        e.currentTarget.style.transform = "scale(1)";
                    }}
                >
                    {isPlaying ? (
                        <PauseIcon
                            style={{ width: 20, height: 20, color: "#d4a574" }}
                        />
                    ) : (
                        <PlayIcon
                            style={{ width: 20, height: 20, color: "#d4a574" }}
                        />
                    )}
                </button>

                {/* Прогресс бар и время */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Временная шкала */}
                    <div
                        onClick={handleProgressClick}
                        style={{
                            width: "100%",
                            height: "8px",
                            background: "rgba(26, 18, 11, 0.25)",
                            borderRadius: "4px",
                            cursor: "pointer",
                            marginBottom: "8px",
                            position: "relative",
                            overflow: "hidden",
                        }}
                    >
                        <div
                            style={{
                                width: `${progress}%`,
                                height: "100%",
                                background: "rgba(26, 18, 11, 0.9)",
                                borderRadius: "4px",
                                transition: "width 0.1s linear",
                                minWidth: progress > 0 ? "2px" : "0",
                            }}
                        />
                    </div>

                    {/* Время */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: "0.75rem",
                            color: "rgba(26, 18, 11, 0.7)",
                            fontWeight: 600,
                        }}
                    >
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Кнопка меню */}
                <div style={{ position: "relative" }} ref={menuRef}>
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            border: "none",
                            background: "rgba(26, 18, 11, 0.3)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            flexShrink: 0,
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                                "rgba(26, 18, 11, 0.5)";
                            e.currentTarget.style.transform = "scale(1.1)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background =
                                "rgba(26, 18, 11, 0.3)";
                            e.currentTarget.style.transform = "scale(1)";
                        }}
                    >
                        <EllipsisVerticalIcon
                            style={{ width: 20, height: 20, color: "#d4a574" }}
                        />
                    </button>

                    {/* Выпадающее меню */}
                    <AnimatePresence>
                        {showMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.2 }}
                                style={{
                                    position: "absolute",
                                    bottom: "calc(100% + 8px)",
                                    right: 0,
                                    background: "var(--card)",
                                    border: "1px solid var(--border)",
                                    borderRadius: "8px",
                                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                                    minWidth: "160px",
                                    zIndex: 10,
                                    overflow: "hidden",
                                }}
                            >
                                {/* Скачать */}
                                <button
                                    onClick={handleDownload}
                                    style={{
                                        width: "100%",
                                        padding: "10px 14px",
                                        border: "none",
                                        background: "transparent",
                                        textAlign: "left",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        color: "var(--text)",
                                        fontSize: "0.85rem",
                                        transition: "background 0.2s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background =
                                            "rgba(212, 165, 116, 0.1)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background =
                                            "transparent";
                                    }}
                                >
                                    <ArrowDownTrayIcon
                                        style={{
                                            width: 14,
                                            height: 14,
                                            color: "var(--primary)",
                                        }}
                                    />
                                    {t("download") || "Скачать"}
                                </button>

                                {/* Разделитель */}
                                <div
                                    style={{
                                        height: "1px",
                                        background: "var(--border)",
                                        margin: "2px 0",
                                    }}
                                />

                                {/* Заголовок скорости */}
                                <div
                                    style={{
                                        padding: "6px 14px 2px",
                                        fontSize: "0.75rem",
                                        color: "var(--muted)",
                                        fontWeight: 600,
                                    }}
                                >
                                    {t("playbackSpeed") || "Скорость"}
                                </div>

                                {/* Скорости */}
                                {speedOptions.map((speed) => (
                                    <button
                                        key={speed}
                                        onClick={() => handleSpeedChange(speed)}
                                        style={{
                                            width: "100%",
                                            padding: "8px 14px",
                                            border: "none",
                                            background:
                                                playbackRate === speed
                                                    ? "rgba(212, 165, 116, 0.15)"
                                                    : "transparent",
                                            textAlign: "left",
                                            cursor: "pointer",
                                            color: "var(--text)",
                                            fontSize: "0.85rem",
                                            fontWeight:
                                                playbackRate === speed
                                                    ? 600
                                                    : 400,
                                            transition: "background 0.2s ease",
                                        }}
                                        onMouseEnter={(e) => {
                                            if (playbackRate !== speed) {
                                                e.currentTarget.style.background =
                                                    "rgba(212, 165, 116, 0.1)";
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (playbackRate !== speed) {
                                                e.currentTarget.style.background =
                                                    "transparent";
                                            }
                                        }}
                                    >
                                        {speed}x{playbackRate === speed && " ✓"}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}
