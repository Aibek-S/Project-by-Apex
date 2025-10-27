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

            {/* Две большие секции-карточки */}
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
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "24px",
                }}
            >
                {/* Карточка Музыка */}
                <Link
                    to="/music"
                    style={{
                        textDecoration: "none",
                        color: "inherit",
                        display: "block",
                    }}
                >
                    <div
                        style={{
                            padding: "48px 32px",
                            background:
                                "linear-gradient(135deg, var(--card) 0%, rgba(212, 165, 116, 0.05) 100%)",
                            borderRadius: "20px",
                            border: "1px solid var(--border)",
                            textAlign: "center",
                            position: "relative",
                            overflow: "hidden",
                            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                            transition: "all 0.3s ease",
                            cursor: "pointer",
                            height: "100%",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform =
                                "translateY(-4px)";
                            e.currentTarget.style.boxShadow =
                                "0 8px 30px rgba(212, 165, 116, 0.3)";
                            e.currentTarget.style.borderColor =
                                "var(--primary)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow =
                                "0 4px 20px rgba(0, 0, 0, 0.1)";
                            e.currentTarget.style.borderColor = "var(--border)";
                        }}
                    >
                        {/* Декоративная линия сверху */}
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

                        <h2
                            style={{
                                fontSize: "2rem",
                                marginBottom: 16,
                                color: "var(--primary)",
                                fontWeight: 700,
                                letterSpacing: "-0.5px",
                            }}
                        >
                            {t("musicHeroTitle") || "Музыка Мангистау"}
                        </h2>

                        <p
                            style={{
                                fontSize: "1.1rem",
                                color: "var(--text)",
                                lineHeight: 1.7,
                                opacity: 0.85,
                                marginBottom: 24,
                            }}
                        >
                            {t("musicHeroDescription") ||
                                "Послушайте традиционные кюй и мелодии региона"}
                        </p>

                        <div
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "8px",
                                fontSize: "1rem",
                                color: "var(--primary)",
                                fontWeight: 600,
                            }}
                        >
                            {t("exploreMusic") || "Слушать музыку"}
                        </div>
                    </div>
                </Link>

                {/* Карточка Статьи */}
                <Link
                    to="/articles"
                    style={{
                        textDecoration: "none",
                        color: "inherit",
                        display: "block",
                    }}
                >
                    <div
                        style={{
                            padding: "48px 32px",
                            background:
                                "linear-gradient(135deg, var(--card) 0%, rgba(212, 165, 116, 0.05) 100%)",
                            borderRadius: "20px",
                            border: "1px solid var(--border)",
                            textAlign: "center",
                            position: "relative",
                            overflow: "hidden",
                            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                            transition: "all 0.3s ease",
                            cursor: "pointer",
                            height: "100%",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform =
                                "translateY(-4px)";
                            e.currentTarget.style.boxShadow =
                                "0 8px 30px rgba(212, 165, 116, 0.3)";
                            e.currentTarget.style.borderColor =
                                "var(--primary)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow =
                                "0 4px 20px rgba(0, 0, 0, 0.1)";
                            e.currentTarget.style.borderColor = "var(--border)";
                        }}
                    >
                        {/* Декоративная линия сверху */}
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

                        <h2
                            style={{
                                fontSize: "2rem",
                                marginBottom: 16,
                                color: "var(--primary)",
                                fontWeight: 700,
                                letterSpacing: "-0.5px",
                            }}
                        >
                            {t("articlesHeroTitle")}
                        </h2>

                        <p
                            style={{
                                fontSize: "1.1rem",
                                color: "var(--text)",
                                lineHeight: 1.7,
                                opacity: 0.85,
                                marginBottom: 24,
                            }}
                        >
                            {t("articlesHeroDescription")}
                        </p>

                        <div
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "8px",
                                fontSize: "1rem",
                                color: "var(--primary)",
                                fontWeight: 600,
                            }}
                        >
                            {t("exploreArticles")}
                        </div>
                    </div>
                </Link>
            </motion.div>
        </motion.div>
    );
}
