import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";
import { getArticles, getCategories } from "../services/articlesService";
import { CalendarIcon } from "@heroicons/react/24/outline";

export default function ArticlesPage() {
    const { t, language, getLocalizedField } = useLanguage();
    const [articles, setArticles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchArticles();
        // fetchCategories(); // Temporarily disabled
    }, []);

    const fetchArticles = async () => {
        try {
            setLoading(true);
            const data = await getArticles();
            setArticles(data);
        } catch (err) {
            console.error("Error loading articles:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const cats = await getCategories(language);
            setCategories(cats);
        } catch (err) {
            console.error("Error loading categories:", err);
        }
    };

    const filteredArticles =
        selectedCategory === "all"
            ? articles
            : articles.filter(
                  (article) =>
                      getLocalizedField(article, "category") ===
                      selectedCategory
              );

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(
            language === "ru" ? "ru-RU" : language === "kz" ? "kk-KZ" : "en-US",
            {
                year: "numeric",
                month: "long",
                day: "numeric",
            }
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <Helmet>
                <title>{t("articles") || "Статьи"} - Apex Tourism</title>
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
                    transition={{ duration: 0.4 }}
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
                        {t("articles")}
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
                        {t("articlesDescription")}
                    </p>
                </motion.div>
            </div>

            {/* Category Filter - temporarily disabled */}
            {/* <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                style={{ marginBottom: 32 }}
            >
                <div
                    style={{
                        display: "flex",
                        gap: 12,
                        flexWrap: "wrap",
                        justifyContent: "center",
                    }}
                >
                    <button
                        onClick={() => setSelectedCategory("all")}
                        className="btn"
                        style={{
                            background:
                                selectedCategory === "all"
                                    ? "var(--primary)"
                                    : "var(--card)",
                            color:
                                selectedCategory === "all"
                                    ? "#1a120b"
                                    : "var(--text)",
                            border: "1px solid var(--border)",
                        }}
                    >
                        {t("allCategories")}
                    </button>
                    {categories.map((category, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedCategory(category)}
                            className="btn"
                            style={{
                                background:
                                    selectedCategory === category
                                        ? "var(--primary)"
                                        : "var(--card)",
                                color:
                                    selectedCategory === category
                                        ? "#1a120b"
                                        : "var(--text)",
                                border: "1px solid var(--border)",
                            }}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </motion.div> */}

            {/* Articles Grid */}
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
            ) : filteredArticles.length === 0 ? (
                <div
                    style={{
                        textAlign: "center",
                        padding: "60px 0",
                        color: "var(--muted)",
                    }}
                >
                    {t("noArticles")}
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fill, minmax(320px, 1fr))",
                        gap: 24,
                        marginBottom: 40,
                    }}
                >
                    {filteredArticles.map((article, index) => (
                        <motion.div
                            key={article.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                            <Link
                                to={`/article/${article.slug}`}
                                style={{ textDecoration: "none" }}
                            >
                                <div
                                    className="article-card"
                                    style={{
                                        background: "var(--card)",
                                        borderRadius: "12px",
                                        overflow: "hidden",
                                        border: "1px solid var(--border)",
                                        transition: "all 0.3s ease",
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform =
                                            "translateY(-4px)";
                                        e.currentTarget.style.boxShadow =
                                            "0 8px 20px rgba(0, 0, 0, 0.3)";
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
                                    {/* Cover Image */}
                                    {article.cover_image && (
                                        <div
                                            style={{
                                                width: "100%",
                                                height: "200px",
                                                overflow: "hidden",
                                                position: "relative",
                                            }}
                                        >
                                            <img
                                                src={article.cover_image}
                                                alt={getLocalizedField(
                                                    article,
                                                    "title"
                                                )}
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover",
                                                }}
                                            />
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div
                                        style={{
                                            padding: "20px",
                                            flex: 1,
                                            display: "flex",
                                            flexDirection: "column",
                                        }}
                                    >
                                        {/* Category Badge */}
                                        <div style={{ marginBottom: 12 }}>
                                            <span
                                                style={{
                                                    display: "inline-block",
                                                    padding: "4px 12px",
                                                    background:
                                                        "var(--primary-muted)",
                                                    color: "var(--primary)",
                                                    borderRadius: "6px",
                                                    fontSize: "0.85rem",
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {getLocalizedField(
                                                    article,
                                                    "category"
                                                )}
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h3
                                            style={{
                                                color: "var(--text)",
                                                marginBottom: 12,
                                                fontSize: "1.3rem",
                                                lineHeight: 1.4,
                                            }}
                                        >
                                            {getLocalizedField(
                                                article,
                                                "title"
                                            )}
                                        </h3>

                                        {/* Excerpt */}
                                        <p
                                            style={{
                                                color: "var(--muted)",
                                                marginBottom: 16,
                                                lineHeight: 1.6,
                                                fontSize: "0.95rem",
                                                flex: 1,
                                            }}
                                        >
                                            {getLocalizedField(
                                                article,
                                                "excerpt"
                                            )}
                                        </p>

                                        {/* Metadata */}
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "flex-end",
                                                alignItems: "center",
                                                paddingTop: 16,
                                                borderTop:
                                                    "1px solid var(--border)",
                                                fontSize: "0.85rem",
                                                color: "var(--muted)",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "4px",
                                                }}
                                            >
                                                <CalendarIcon
                                                    style={{
                                                        width: "14px",
                                                        height: "14px",
                                                    }}
                                                />
                                                {formatDate(
                                                    article.published_at
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* Mobile responsive styles */}
            <style>{`
                @media (max-width: 768px) {
                    .article-card {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </motion.div>
    );
}
