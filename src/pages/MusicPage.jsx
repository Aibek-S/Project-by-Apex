import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";
import { getMusicTracks } from "../services/musicService";
import MusicCard from "../components/MusicCard";

export default function MusicPage() {
    const { t } = useLanguage();
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTracks();
    }, []);

    const fetchTracks = async () => {
        try {
            setLoading(true);
            const data = await getMusicTracks();
            setTracks(data);
        } catch (err) {
            console.error("Error loading music tracks:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <Helmet>
                <title>{t("music") || "Музыка"} - Apex Tourism</title>
            </Helmet>

            {/* Header Section */}
            <div style={{ marginBottom: 32 }}>
                <Link
                    to="/"
                    className="btn"
                    style={{ marginBottom: 16, display: "inline-block" }}
                >
                    ← {t("back")}
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    style={{
                        background:
                            "linear-gradient(135deg, var(--card) 0%, rgba(212, 165, 116, 0.05) 100%)",
                        padding: "48px 32px",
                        borderRadius: "20px",
                        border: "1px solid var(--border)",
                        textAlign: "center",
                        marginBottom: 40,
                        position: "relative",
                        overflow: "hidden",
                    }}
                >
                    {/* Декоративная линия */}
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: "4px",
                            background:
                                "linear-gradient(90deg, transparent, var(--primary), transparent)",
                        }}
                    />

                    <h1
                        style={{
                            fontSize: "2.5rem",
                            fontWeight: 700,
                            color: "var(--primary)",
                            marginBottom: 16,
                            letterSpacing: "-0.5px",
                        }}
                    >
                        {t("musicHeroTitle") || "Музыка Мангистау"}
                    </h1>
                    <p
                        style={{
                            fontSize: "1.15rem",
                            color: "var(--text)",
                            opacity: 0.9,
                            maxWidth: "700px",
                            margin: "0 auto",
                            lineHeight: 1.6,
                        }}
                    >
                        {t("musicHeroDescription") ||
                            "Послушайте традиционные кюй и мелодии региона"}
                    </p>
                </motion.div>
            </div>

            {/* Music Tracks Grid */}
            {loading ? (
                <div
                    style={{
                        textAlign: "center",
                        padding: "60px 0",
                        color: "var(--muted)",
                    }}
                >
                    {t("loading")}
                </div>
            ) : error ? (
                <div
                    style={{
                        textAlign: "center",
                        padding: "60px 0",
                        color: "#ef4444",
                    }}
                >
                    {t("error")}: {error}
                </div>
            ) : tracks.length === 0 ? (
                <div
                    style={{
                        textAlign: "center",
                        padding: "60px 0",
                        color: "var(--muted)",
                    }}
                >
                    {t("noMusic") || "Композиций не найдено"}
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fill, minmax(350px, 1fr))",
                        gap: 24,
                        marginBottom: 40,
                        alignItems: "start",
                    }}
                >
                    {tracks.map((track, index) => (
                        <MusicCard key={track.id} track={track} index={index} />
                    ))}
                </motion.div>
            )}
        </motion.div>
    );
}
