import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import SearchSection from "../components/SearchSection";
import PlaceSlider from "../components/PlaceSlider";
import CategoryList from "../components/CategoryList";
import { useLanguage } from "../contexts/LanguageContext";
import { motion } from "framer-motion";

export default function HomePage() {
    const { t } = useLanguage();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
            <Helmet>
                <title>{t("home") || "Главная - Apex Tourism"}</title>
            </Helmet>

            {/* Секция поиска */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.4,
                    delay: 0.1,
                    ease: [0.4, 0, 0.2, 1],
                }}
            >
                <SearchSection />
            </motion.div>

            {/* Слайдер с рекомендуемыми местами */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.4,
                    delay: 0.2,
                    ease: [0.4, 0, 0.2, 1],
                }}
            >
                <PlaceSlider />
            </motion.div>

            {/* Разделитель */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.4,
                    delay: 0.3,
                    ease: [0.4, 0, 0.2, 1],
                }}
                style={{
                    borderTop: "1px solid var(--border)",
                    margin: "32px 0",
                    paddingTop: "32px",
                }}
            >
                {/* Список категорий */}
                <CategoryList />
            </motion.div>

            {/* История Мангистау секция */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.4,
                    delay: 0.4,
                    ease: [0.4, 0, 0.2, 1],
                }}
                style={{
                    marginTop: "40px",
                    padding: "32px",
                    background: "var(--card)",
                    borderRadius: "16px",
                    border: "1px solid var(--border)",
                    textAlign: "center",
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
                        height: "3px",
                        background:
                            "linear-gradient(90deg, transparent, var(--primary), transparent)",
                    }}
                />

                <h2
                    style={{
                        fontSize: "1.8rem",
                        marginBottom: 16,
                        color: "var(--primary)",
                    }}
                >
                    {t("historyOfMangystau")}
                </h2>

                <p
                    style={{
                        fontSize: "1.1rem",
                        color: "var(--muted)",
                        marginBottom: 24,
                        lineHeight: 1.6,
                    }}
                >
                    {t("historyCallToAction")}
                </p>

                <Link
                    to="/history"
                    className="btn"
                    style={{
                        fontSize: "1.1rem",
                        padding: "12px 32px",
                        display: "inline-block",
                    }}
                >
                    {t("exploreHistory")} →
                </Link>
            </motion.div>
        </motion.div>
    );
}
