import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";
import {
    getArticleBySlug,
    getSimilarArticles,
} from "../services/articlesService";
import { CalendarIcon, EyeIcon, UserIcon } from "@heroicons/react/24/outline";

export default function ArticleDetailPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { t, language, getLocalizedField } = useLanguage();
    const [article, setArticle] = useState(null);
    const [similarArticles, setSimilarArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchArticle();
        window.scrollTo(0, 0);
    }, [slug]);

    const fetchArticle = async () => {
        try {
            setLoading(true);
            const data = await getArticleBySlug(slug);
            setArticle(data);

            // Загружаем похожие статьи
            if (data) {
                const similar = await getSimilarArticles(
                    slug,
                    getLocalizedField(data, "category"),
                    language
                );
                setSimilarArticles(similar);
            }
        } catch (err) {
            console.error("Error loading article:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

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

    if (loading) {
        return (
            <div
                style={{
                    textAlign: "center",
                    padding: "100px 0",
                    color: "var(--muted)",
                }}
            >
                {t("loading")}
            </div>
        );
    }

    if (error || !article) {
        return (
            <div style={{ textAlign: "center", padding: "100px 0" }}>
                <h2 style={{ color: "#ef4444", marginBottom: 16 }}>
                    {t("articleNotFound")}
                </h2>
                <Link to="/articles" className="btn">
                    ← {t("backToArticles")}
                </Link>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <Helmet>
                <title>
                    {getLocalizedField(article, "title")} - Apex Tourism
                </title>
                <meta
                    name="description"
                    content={getLocalizedField(article, "excerpt")}
                />
            </Helmet>

            {/* Breadcrumbs */}
            <div
                style={{
                    marginBottom: 24,
                    fontSize: "0.9rem",
                    color: "var(--muted)",
                }}
            >
                <Link to="/" style={{ color: "var(--primary)" }}>
                    {t("home")}
                </Link>
                {" / "}
                <Link to="/articles" style={{ color: "var(--primary)" }}>
                    {t("articles")}
                </Link>
                {" / "}
                <span>{getLocalizedField(article, "title")}</span>
            </div>

            {/* Back button */}
            <Link
                to="/articles"
                className="btn"
                style={{ marginBottom: 24, display: "inline-block" }}
            >
                ← {t("backToArticles")}
            </Link>

            {/* Article Hero */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                style={{
                    background: "var(--card)",
                    borderRadius: "16px",
                    overflow: "hidden",
                    border: "1px solid var(--border)",
                    marginBottom: 40,
                }}
            >
                {/* Cover Image */}
                {article.cover_image && (
                    <div
                        style={{
                            width: "100%",
                            height: "600px",
                            overflow: "hidden",
                        }}
                    >
                        <img
                            src={article.cover_image}
                            alt={getLocalizedField(article, "title")}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                            }}
                        />
                    </div>
                )}

                {/* Header Info */}
                <div style={{ padding: "32px" }}>
                    {/* Category */}
                    <div style={{ marginBottom: 16 }}>
                        <span
                            style={{
                                display: "inline-block",
                                padding: "6px 16px",
                                background: "var(--primary-muted)",
                                color: "var(--primary)",
                                borderRadius: "8px",
                                fontSize: "0.9rem",
                                fontWeight: 600,
                            }}
                        >
                            {getLocalizedField(article, "category")}
                        </span>
                    </div>

                    {/* Title */}
                    <h1
                        style={{
                            fontSize: "2.5rem",
                            marginBottom: 20,
                            color: "var(--text)",
                            lineHeight: 1.3,
                        }}
                    >
                        {getLocalizedField(article, "title")}
                    </h1>

                    {/* Metadata */}
                    <div
                        style={{
                            display: "flex",
                            gap: 24,
                            flexWrap: "wrap",
                            paddingTop: 20,
                            borderTop: "1px solid var(--border)",
                            fontSize: "0.95rem",
                            color: "var(--muted)",
                        }}
                    >
                        <span
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                            }}
                        >
                            <CalendarIcon
                                style={{ width: "18px", height: "18px" }}
                            />
                            {formatDate(article.published_at)}
                        </span>
                        <span
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                            }}
                        >
                            <EyeIcon
                                style={{ width: "18px", height: "18px" }}
                            />
                            {article.views} {t("views")}
                        </span>
                        {article.author && (
                            <span
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                }}
                            >
                                <UserIcon
                                    style={{ width: "18px", height: "18px" }}
                                />
                                {article.author}
                            </span>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Article Content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                style={{
                    background: "var(--card)",
                    borderRadius: "16px",
                    padding: "40px",
                    border: "1px solid var(--border)",
                    marginBottom: 40,
                }}
            >
                {/* Article body */}
                <div
                    className="article-content"
                    style={{
                        fontSize: "1.1rem",
                        lineHeight: 1.8,
                        color: "var(--text)",
                    }}
                    dangerouslySetInnerHTML={{
                        __html: getLocalizedField(article, "content"),
                    }}
                />

                {/* Additional Images */}
                {article.article_images &&
                    article.article_images.length > 0 && (
                        <div style={{ marginTop: 40 }}>
                            <h3
                                style={{
                                    marginBottom: 24,
                                    color: "var(--primary)",
                                }}
                            >
                                {t("gallery")}
                            </h3>
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(auto-fit, minmax(300px, 1fr))",
                                    gap: 20,
                                }}
                            >
                                {article.article_images
                                    .sort((a, b) => a.position - b.position)
                                    .map((img) => (
                                        <div
                                            key={img.id}
                                            style={{
                                                borderRadius: "12px",
                                                overflow: "hidden",
                                                border: "1px solid var(--border)",
                                            }}
                                        >
                                            <img
                                                src={img.url}
                                                alt={
                                                    getLocalizedField(
                                                        img,
                                                        "caption"
                                                    ) || ""
                                                }
                                                style={{
                                                    width: "100%",
                                                    height: "250px",
                                                    objectFit: "cover",
                                                }}
                                            />
                                            {getLocalizedField(
                                                img,
                                                "caption"
                                            ) && (
                                                <div
                                                    style={{
                                                        padding: "12px",
                                                        fontSize: "0.9rem",
                                                        color: "var(--muted)",
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    {getLocalizedField(
                                                        img,
                                                        "caption"
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}
            </motion.div>

            {/* Similar Articles */}
            {similarArticles.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    style={{ marginBottom: 40 }}
                >
                    <h2
                        style={{
                            fontSize: "2rem",
                            marginBottom: 24,
                            color: "var(--text)",
                        }}
                    >
                        {t("similarArticles")}
                    </h2>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(280px, 1fr))",
                            gap: 20,
                        }}
                    >
                        {similarArticles.map((similar) => (
                            <Link
                                key={similar.id}
                                to={`/article/${similar.slug}`}
                                style={{ textDecoration: "none" }}
                            >
                                <div
                                    style={{
                                        background: "var(--card)",
                                        borderRadius: "12px",
                                        overflow: "hidden",
                                        border: "1px solid var(--border)",
                                        transition: "all 0.3s ease",
                                        height: "100%",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform =
                                            "translateY(-4px)";
                                        e.currentTarget.style.borderColor =
                                            "var(--primary)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform =
                                            "translateY(0)";
                                        e.currentTarget.style.borderColor =
                                            "var(--border)";
                                    }}
                                >
                                    {similar.cover_image && (
                                        <img
                                            src={similar.cover_image}
                                            alt={getLocalizedField(
                                                similar,
                                                "title"
                                            )}
                                            style={{
                                                width: "100%",
                                                height: "150px",
                                                objectFit: "cover",
                                            }}
                                        />
                                    )}
                                    <div style={{ padding: "16px" }}>
                                        <h4
                                            style={{
                                                color: "var(--text)",
                                                marginBottom: 8,
                                                fontSize: "1.1rem",
                                            }}
                                        >
                                            {getLocalizedField(
                                                similar,
                                                "title"
                                            )}
                                        </h4>
                                        <p
                                            style={{
                                                color: "var(--muted)",
                                                fontSize: "0.9rem",
                                                lineHeight: 1.5,
                                            }}
                                        >
                                            {getLocalizedField(
                                                similar,
                                                "excerpt"
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Styles for article content */}
            <style>{`
                .article-content h2 {
                    color: var(--primary);
                    font-size: 1.8rem;
                    margin-top: 32px;
                    margin-bottom: 16px;
                }

                .article-content h3 {
                    color: var(--text);
                    font-size: 1.5rem;
                    margin-top: 28px;
                    margin-bottom: 14px;
                }

                .article-content p {
                    margin-bottom: 20px;
                }

                .article-content ul,
                .article-content ol {
                    margin-bottom: 20px;
                    padding-left: 32px;
                }

                .article-content li {
                    margin-bottom: 8px;
                }

                .article-content img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 12px;
                    margin: 24px 0;
                    border: 1px solid var(--border);
                }

                .article-content blockquote {
                    border-left: 4px solid var(--primary);
                    padding-left: 20px;
                    margin: 24px 0;
                    font-style: italic;
                    color: var(--muted);
                }

                .article-content code {
                    background: var(--bg);
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-size: 0.95em;
                }

                .article-content a {
                    color: var(--primary);
                    text-decoration: underline;
                }

                @media (max-width: 768px) {
                    .article-content {
                        font-size: 1rem !important;
                        padding: 24px !important;
                    }

                    h1 {
                        font-size: 1.8rem !important;
                    }

                    .article-content h2 {
                        font-size: 1.5rem !important;
                    }

                    .article-content h3 {
                        font-size: 1.3rem !important;
                    }
                }
            `}</style>
        </motion.div>
    );
}
