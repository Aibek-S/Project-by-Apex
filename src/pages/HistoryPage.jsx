import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function HistoryPage() {
    const { t, getLocalizedField } = useLanguage();
    const [historicalPlaces, setHistoricalPlaces] = useState([]);
    const [selectedEra, setSelectedEra] = useState(null);

    // Загрузка исторических мест из базы данных
    useEffect(() => {
        async function fetchHistoricalPlaces() {
            try {
                // Загружаем 3 исторических места
                const { data: historical, error: histError } = await supabase
                    .from("places")
                    .select("id, name_ru, name_en, name_kz, place_photos(url)")
                    .eq("category_id", 1)
                    .limit(3);

                if (histError) throw histError;

                // Загружаем 3 природных места
                const { data: nature, error: natError } = await supabase
                    .from("places")
                    .select("id, name_ru, name_en, name_kz, place_photos(url)")
                    .eq("category_id", 2)
                    .limit(3);

                if (natError) throw natError;

                // Объединяем оба массива
                const allPlaces = [...(historical || []), ...(nature || [])];
                setHistoricalPlaces(allPlaces);
            } catch (error) {
                console.error("Error fetching historical places:", error);
                setHistoricalPlaces([]);
            }
        }

        fetchHistoricalPlaces();
    }, []);

    // Временная линия событий
    const timeline = [
        {
            year: t("history_era1_year"),
            title: t("history_era1_title"),
            desc: t("history_era1_desc"),
        },
        {
            year: t("history_era2_year"),
            title: t("history_era2_title"),
            desc: t("history_era2_desc"),
        },
        {
            year: t("history_era3_year"),
            title: t("history_era3_title"),
            desc: t("history_era3_desc"),
        },
        {
            year: t("history_era4_year"),
            title: t("history_era4_title"),
            desc: t("history_era4_desc"),
        },
        {
            year: t("history_era5_year"),
            title: t("history_era5_title"),
            desc: t("history_era5_desc"),
        },
    ];

    const facts = [
        t("history_fact1"),
        t("history_fact2"),
        t("history_fact3"),
        t("history_fact4"),
        t("history_fact5"),
        t("history_fact6"),
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
            <Helmet>
                <title>{t("historyOfMangystau") || "История Мангистау"}</title>
            </Helmet>

            {/* Hero Section */}
            <div style={{ marginBottom: 32 }}>
                <Link
                    to="/"
                    className="btn"
                    style={{ marginBottom: 16, display: "inline-block" }}
                >
                    ← {t("back")}
                </Link>

                <motion.div
                    className="history-hero"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    style={{
                        background: "var(--card)",
                        borderRadius: "16px",
                        padding: "40px 24px",
                        border: "1px solid var(--border)",
                        textAlign: "center",
                        marginBottom: 40,
                        position: "relative",
                        overflow: "hidden",
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: "4px",
                            background:
                                "linear-gradient(90deg, var(--primary), #b8935f, var(--primary))",
                        }}
                    />

                    <h1
                        style={{
                            fontSize: "2.5rem",
                            marginBottom: 16,
                            color: "var(--primary)",
                            fontWeight: 700,
                        }}
                    >
                        {t("historyOfMangystau")}
                    </h1>
                    <p
                        style={{
                            fontSize: "1.2rem",
                            color: "var(--muted)",
                            lineHeight: 1.6,
                            maxWidth: "800px",
                            margin: "0 auto",
                        }}
                    >
                        {t("historyIntro")}
                    </p>
                </motion.div>
            </div>

            {/* Timeline Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                style={{ marginBottom: 50 }}
            >
                <h2
                    style={{
                        fontSize: "2rem",
                        marginBottom: 30,
                        color: "var(--text)",
                        textAlign: "center",
                    }}
                >
                    {t("historicalTimeline")}
                </h2>

                <div style={{ position: "relative" }}>
                    {/* Timeline line */}
                    <div
                        style={{
                            position: "absolute",
                            left: "50%",
                            top: 0,
                            bottom: 0,
                            width: "2px",
                            background: "var(--border)",
                            transform: "translateX(-50%)",
                        }}
                        className="timeline-line"
                    />

                    {timeline.map((event, index) => (
                        <motion.div
                            key={index}
                            initial={{
                                opacity: 0,
                                x: index % 2 === 0 ? -50 : 50,
                            }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                                duration: 0.4,
                                delay: 0.3 + index * 0.1,
                            }}
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    index % 2 === 0
                                        ? "1fr auto 1fr"
                                        : "1fr auto 1fr",
                                gap: 20,
                                marginBottom: 40,
                                alignItems: "center",
                            }}
                            className="timeline-grid"
                        >
                            {/* Content (left or right depending on index) */}
                            {index % 2 === 0 ? (
                                <>
                                    <div
                                        className="timeline-content"
                                        onClick={() => setSelectedEra(index)}
                                        style={{
                                            background: "var(--card)",
                                            padding: "20px",
                                            borderRadius: "12px",
                                            border: "1px solid var(--border)",
                                            textAlign: "right",
                                            cursor: "pointer",
                                            transition: "all 0.2s ease",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform =
                                                "translateY(-2px)";
                                            e.currentTarget.style.boxShadow =
                                                "0 4px 12px rgba(0, 0, 0, 0.2)";
                                            e.currentTarget.style.borderColor =
                                                "var(--primary)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform =
                                                "translateY(0)";
                                            e.currentTarget.style.boxShadow =
                                                "none";
                                            e.currentTarget.style.borderColor =
                                                "var(--border)";
                                        }}
                                    >
                                        <h3
                                            style={{
                                                color: "var(--primary)",
                                                marginBottom: 8,
                                            }}
                                        >
                                            {event.year}
                                        </h3>
                                        <h4
                                            style={{
                                                marginBottom: 12,
                                                color: "var(--text)",
                                            }}
                                        >
                                            {event.title}
                                        </h4>
                                        <p
                                            style={{
                                                color: "var(--muted)",
                                                lineHeight: 1.6,
                                                margin: 0,
                                            }}
                                        >
                                            {event.desc}
                                        </p>
                                    </div>
                                    <div
                                        className="timeline-dot"
                                        style={{
                                            width: "16px",
                                            height: "16px",
                                            borderRadius: "50%",
                                            background: "var(--primary)",
                                            border: "3px solid var(--card)",
                                            zIndex: 1,
                                        }}
                                    />
                                    <div className="timeline-empty" />
                                </>
                            ) : (
                                <>
                                    <div className="timeline-empty" />
                                    <div
                                        className="timeline-dot"
                                        style={{
                                            width: "16px",
                                            height: "16px",
                                            borderRadius: "50%",
                                            background: "var(--primary)",
                                            border: "3px solid var(--card)",
                                            zIndex: 1,
                                        }}
                                    />
                                    <div
                                        className="timeline-content"
                                        onClick={() => setSelectedEra(index)}
                                        style={{
                                            background: "var(--card)",
                                            padding: "20px",
                                            borderRadius: "12px",
                                            border: "1px solid var(--border)",
                                            textAlign: "left",
                                            cursor: "pointer",
                                            transition: "all 0.2s ease",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform =
                                                "translateY(-2px)";
                                            e.currentTarget.style.boxShadow =
                                                "0 4px 12px rgba(0, 0, 0, 0.2)";
                                            e.currentTarget.style.borderColor =
                                                "var(--primary)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform =
                                                "translateY(0)";
                                            e.currentTarget.style.boxShadow =
                                                "none";
                                            e.currentTarget.style.borderColor =
                                                "var(--border)";
                                        }}
                                    >
                                        <h3
                                            style={{
                                                color: "var(--primary)",
                                                marginBottom: 8,
                                            }}
                                        >
                                            {event.year}
                                        </h3>
                                        <h4
                                            style={{
                                                marginBottom: 12,
                                                color: "var(--text)",
                                            }}
                                        >
                                            {event.title}
                                        </h4>
                                        <p
                                            style={{
                                                color: "var(--muted)",
                                                lineHeight: 1.6,
                                                margin: 0,
                                            }}
                                        >
                                            {event.desc}
                                        </p>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Interesting Facts Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                style={{ marginBottom: 50 }}
            >
                <h2
                    style={{
                        fontSize: "2rem",
                        marginBottom: 30,
                        color: "var(--text)",
                        textAlign: "center",
                    }}
                >
                    {t("interestingFacts")}
                </h2>

                <div
                    className="facts-grid"
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(300px, 1fr))",
                        gap: 20,
                    }}
                >
                    {facts.map((fact, index) => (
                        <motion.div
                            className="fact-card"
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                                duration: 0.3,
                                delay: 0.6 + index * 0.1,
                            }}
                            style={{
                                background: "var(--card)",
                                padding: "24px",
                                borderRadius: "12px",
                                border: "1px solid var(--border)",
                                position: "relative",
                                transition:
                                    "transform 0.2s ease, box-shadow 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform =
                                    "translateY(-4px)";
                                e.currentTarget.style.boxShadow =
                                    "0 8px 16px rgba(0, 0, 0, 0.2)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform =
                                    "translateY(0)";
                                e.currentTarget.style.boxShadow = "none";
                            }}
                        >
                            <div
                                className="fact-number"
                                style={{
                                    fontSize: "2rem",
                                    color: "var(--primary)",
                                    marginBottom: 12,
                                    fontWeight: 700,
                                }}
                            >
                                {index + 1}
                            </div>
                            <p
                                style={{
                                    color: "var(--text)",
                                    lineHeight: 1.6,
                                    margin: 0,
                                }}
                            >
                                {fact}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Historical Photos Gallery */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.7 }}
                style={{ marginBottom: 40 }}
            >
                <h2
                    style={{
                        fontSize: "2rem",
                        marginBottom: 30,
                        color: "var(--text)",
                        textAlign: "center",
                    }}
                >
                    {t("historicalPlaces")}
                </h2>

                <div
                    className="places-gallery"
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(280px, 1fr))",
                        gap: 20,
                    }}
                >
                    {historicalPlaces.length === 0 ? (
                        <p
                            style={{
                                color: "var(--muted)",
                                textAlign: "center",
                                gridColumn: "1 / -1",
                            }}
                        >
                            {t("loading")}
                        </p>
                    ) : (
                        historicalPlaces.map((place, index) => (
                            <Link
                                key={place.id}
                                to={`/place/${place.id}`}
                                style={{ textDecoration: "none" }}
                            >
                                <motion.div
                                    className="gallery-card"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{
                                        duration: 0.3,
                                        delay: 0.8 + index * 0.1,
                                    }}
                                    style={{
                                        background: "var(--card)",
                                        borderRadius: "12px",
                                        overflow: "hidden",
                                        border: "1px solid var(--border)",
                                        transition:
                                            "transform 0.2s ease, box-shadow 0.2s ease",
                                        cursor: "pointer",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform =
                                            "scale(1.05)";
                                        e.currentTarget.style.boxShadow =
                                            "0 8px 20px rgba(0, 0, 0, 0.3)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform =
                                            "scale(1)";
                                        e.currentTarget.style.boxShadow =
                                            "none";
                                    }}
                                >
                                    <img
                                        src={
                                            place.place_photos &&
                                            place.place_photos.length > 0
                                                ? place.place_photos[0].url
                                                : "/images/placeholder.jpg"
                                        }
                                        alt={getLocalizedField(place, "name")}
                                        style={{
                                            width: "100%",
                                            height: "200px",
                                            objectFit: "cover",
                                            filter: "sepia(0.2) contrast(1.02) saturate(0.9)",
                                        }}
                                    />
                                    <div
                                        style={{
                                            padding: "16px",
                                            textAlign: "center",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "8px",
                                        }}
                                    >
                                        <h4
                                            style={{
                                                color: "var(--text)",
                                                margin: 0,
                                                fontSize: "1.1rem",
                                            }}
                                        >
                                            {getLocalizedField(place, "name")}
                                        </h4>
                                        <span
                                            style={{
                                                color: "var(--primary)",
                                                fontSize: "0.9rem",
                                                fontWeight: 600,
                                            }}
                                        >
                                            {t("details")} →
                                        </span>
                                    </div>
                                </motion.div>
                            </Link>
                        ))
                    )}
                </div>
            </motion.div>

            {/* Modal for Era Details */}
            {selectedEra !== null && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelectedEra(null)}
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "rgba(0, 0, 0, 0.7)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000,
                        padding: "20px",
                        backdropFilter: "blur(4px)",
                    }}
                >
                    <motion.div
                        className="era-modal"
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: "var(--card)",
                            borderRadius: "16px",
                            padding: "32px",
                            maxWidth: "700px",
                            width: "100%",
                            maxHeight: "80vh",
                            overflow: "auto",
                            border: "1px solid var(--border)",
                            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)",
                            position: "relative",
                        }}
                    >
                        {/* Close Button */}
                        <button
                            className="close-button"
                            onClick={() => setSelectedEra(null)}
                            style={{
                                position: "absolute",
                                top: "16px",
                                right: "16px",
                                background: "transparent",
                                border: "1px solid var(--border)",
                                borderRadius: "50%",
                                width: "40px",
                                height: "40px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                color: "var(--text)",
                                fontSize: "24px",
                                transition: "all 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background =
                                    "var(--primary)";
                                e.currentTarget.style.color = "#1a120b";
                                e.currentTarget.style.transform =
                                    "rotate(90deg)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background =
                                    "transparent";
                                e.currentTarget.style.color = "var(--text)";
                                e.currentTarget.style.transform =
                                    "rotate(0deg)";
                            }}
                        >
                            ×
                        </button>

                        {/* Era Header */}
                        <div
                            style={{
                                borderBottom: "2px solid var(--primary)",
                                paddingBottom: "20px",
                                marginBottom: "24px",
                            }}
                        >
                            <h2
                                style={{
                                    color: "var(--primary)",
                                    fontSize: "1.8rem",
                                    marginBottom: "8px",
                                    marginTop: 0,
                                }}
                            >
                                {timeline[selectedEra].year}
                            </h2>
                            <h3
                                style={{
                                    color: "var(--text)",
                                    fontSize: "1.4rem",
                                    margin: 0,
                                }}
                            >
                                {timeline[selectedEra].title}
                            </h3>
                        </div>

                        {/* Era Content */}
                        <div style={{ marginBottom: "24px" }}>
                            <p
                                style={{
                                    color: "var(--text)",
                                    lineHeight: 1.8,
                                    fontSize: "1.05rem",
                                    margin: 0,
                                }}
                            >
                                {t(`history_era${selectedEra + 1}_full`)}
                            </p>
                        </div>

                        {/* Decorative element */}
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                gap: "8px",
                                paddingTop: "20px",
                                borderTop: "1px solid var(--border)",
                            }}
                        >
                            {[...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    style={{
                                        width: "8px",
                                        height: "8px",
                                        borderRadius: "50%",
                                        background:
                                            i === selectedEra
                                                ? "var(--primary)"
                                                : "var(--border)",
                                        transition: "all 0.3s ease",
                                    }}
                                />
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            )}

            {/* Mobile Responsive Styles */}
            <style>{`
        @media (max-width: 768px) {
          h1 {
            font-size: 1.8rem !important;
          }
          h2 {
            font-size: 1.5rem !important;
          }
          
          /* Hero Section - компактнее */
          .history-hero {
            padding: 28px 20px !important;
            margin-bottom: 28px !important;
          }
          
          /* Timeline - вертикальная с линией слева */
          .timeline-grid {
            display: grid !important;
            grid-template-columns: 24px 1fr !important;
            gap: 0 16px !important;
            margin-bottom: 16px !important;
            align-items: start !important;
            position: relative !important;
          }
          
          /* Скрываем пустой div */
          .timeline-grid .timeline-empty {
            display: none !important;
          }
          
          /* Точка на линии - всегда в первой колонке */
          .timeline-grid .timeline-dot {
            grid-column: 1 !important;
            grid-row: 1 !important;
            width: 16px !important;
            height: 16px !important;
            border-radius: 50% !important;
            background: var(--primary) !important;
            border: 3px solid var(--card) !important;
            margin: 8px auto 0 auto !important;
            position: relative !important;
            z-index: 2 !important;
          }
          
          /* Карточка события - всегда во второй колонке */
          .timeline-grid .timeline-content {
            grid-column: 2 !important;
            grid-row: 1 !important;
            text-align: left !important;
            padding: 16px !important;
          }
          
          /* Вертикальная линия */
          .timeline-line {
            left: 10px !important;
            transform: none !important;
            width: 2px !important;
          }
          
          .timeline-grid h3 {
            font-size: 1rem !important;
            margin-bottom: 6px !important;
          }
          
          .timeline-grid h4 {
            font-size: 1.05rem !important;
            margin-bottom: 8px !important;
          }
          
          .timeline-grid p {
            font-size: 0.95rem !important;
            line-height: 1.5 !important;
          }
          
          /* Facts Section */
          .facts-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          
          .fact-card {
            padding: 20px !important;
          }
          
          .fact-card .fact-number {
            font-size: 1.8rem !important;
            margin-bottom: 10px !important;
          }
          
          .fact-card p {
            font-size: 0.95rem !important;
            line-height: 1.5 !important;
          }
          
          /* Gallery */
          .places-gallery {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          
          .gallery-card img {
            height: 180px !important;
          }
        }
        
        @media (max-width: 480px) {
          h1 {
            font-size: 1.5rem !important;
          }
          h2 {
            font-size: 1.3rem !important;
          }
          
          /* Hero Section - очень компактный */
          .history-hero {
            padding: 24px 16px !important;
            margin-bottom: 24px !important;
          }
          
          .history-hero h1 {
            font-size: 1.6rem !important;
            margin-bottom: 12px !important;
          }
          
          .history-hero p {
            font-size: 1rem !important;
            line-height: 1.5 !important;
          }
          
          /* Timeline - вертикальная, еще компактнее */
          .timeline-grid {
            grid-template-columns: 18px 1fr !important;
            gap: 0 12px !important;
            margin-bottom: 14px !important;
          }
          
          /* Точка на линии - меньше */
          .timeline-grid .timeline-dot {
            width: 14px !important;
            height: 14px !important;
            border: 2px solid var(--card) !important;
          }
          
          /* Карточка события - компактнее */
          .timeline-grid .timeline-content {
            padding: 14px !important;
          }
          
          .timeline-grid h3 {
            font-size: 0.95rem !important;
            margin-bottom: 4px !important;
          }
          
          .timeline-grid h4 {
            font-size: 1rem !important;
            margin-bottom: 6px !important;
          }
          
          .timeline-grid p {
            font-size: 0.9rem !important;
            line-height: 1.4 !important;
          }
          
          /* Вертикальная линия - тоньше */
          .timeline-line {
            left: 9px !important;
            width: 2px !important;
          }
          
          /* Facts Section - компактный */
          .facts-grid {
            gap: 12px !important;
          }
          
          .fact-card {
            padding: 16px !important;
          }
          
          .fact-card .fact-number {
            font-size: 1.5rem !important;
            margin-bottom: 8px !important;
          }
          
          .fact-card p {
            font-size: 0.9rem !important;
            line-height: 1.4 !important;
          }
          
          /* Gallery - компактный */
          .places-gallery {
            gap: 12px !important;
          }
          
          .gallery-card {
            border-radius: 10px !important;
          }
          
          .gallery-card img {
            height: 160px !important;
          }
          
          .gallery-card h4 {
            font-size: 1rem !important;
            padding: 12px !important;
          }
          
          /* Modal - адаптивный */
          .era-modal {
            padding: 24px 16px !important;
            max-width: 95% !important;
            margin: 10px !important;
          }
          
          .era-modal h2 {
            font-size: 1.4rem !important;
          }
          
          .era-modal h3 {
            font-size: 1.2rem !important;
          }
          
          .era-modal p {
            font-size: 0.95rem !important;
            line-height: 1.6 !important;
          }
          
          .era-modal .close-button {
            width: 36px !important;
            height: 36px !important;
            font-size: 20px !important;
          }
        }
      `}</style>
        </motion.div>
    );
}
