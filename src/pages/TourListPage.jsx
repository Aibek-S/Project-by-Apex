import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTours } from "../hooks/useSupabase";
import { useLanguage } from "../contexts/LanguageContext";
import TourCard from "../components/TourCard";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

export default function TourListPage() {
    const { language } = useLanguage();
    const { tours, loading, error, refetch } = useTours(language);
    const { t } = useLanguage();

    useEffect(() => {
        refetch();
    }, [refetch]);

    if (loading) {
        return (
            <div
                className="loading-container"
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "400px",
                }}
            >
                <p className="muted">{t("loading")}</p>
            </div>
        );
    }

    if (error) {
        return (
            <div
                className="error-container"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "400px",
                    gap: 16,
                }}
            >
                <p className="muted" style={{ color: "var(--primary)" }}>
                    {t("error")}: {error}
                </p>
                <button className="btn" onClick={refetch}>
                    {t("retry")}
                </button>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
            <Helmet>
                <title>{t("tours") || "Tours"}</title>
            </Helmet>

            <div style={{ marginBottom: 24 }}>
                <Link
                    to="/"
                    className="btn"
                    style={{ marginBottom: 16, display: "inline-block" }}
                >
                    ← {t("back")}
                </Link>
                <h1>{t("tours") || "Tours"}</h1>
            </div>

            {tours && tours.length > 0 ? (
                <div
                    className="grid"
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fill, minmax(300px, 1fr))",
                        gap: 24,
                    }}
                >
                    {tours.map((tour) => (
                        <TourCard key={tour.id} tour={tour} />
                    ))}
                </div>
            ) : (
                <div
                    className="no-data-container"
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: "300px",
                        gap: 16,
                    }}
                >
                    <p className="muted">
                        {t("noTours") || "No tours available"}
                    </p>
                    <button className="btn" onClick={refetch}>
                        {t("retry")}
                    </button>
                </div>
            )}
        </motion.div>
    );
}
