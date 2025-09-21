import { Link } from "react-router-dom";
import { useCategories } from "../hooks/useSupabase";
import { useLanguage } from "../contexts/LanguageContext";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

export default function CategoryList() {
  const { categories, loading, error } = useCategories();
  const { t, getLocalizedField } = useLanguage();

  if (loading) {
    return (
      <div
        className="loading-container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "200px",
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
          justifyContent: "center",
          alignItems: "center",
          minHeight: "200px",
        }}
      >
        <p className="muted" style={{ color: "var(--primary)" }}>
          {t("error")}: {error}
        </p>
      </div>
    );
  }

  if (!categories.length) {
    return (
      <div
        className="no-data-container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "200px",
        }}
      >
        <p className="muted">{t("noData")}</p>
      </div>
    );
  }

  return (
    <div>
      <Helmet>
        <title>{t("categories") || "Категории"} - Apex Tourism</title>
      </Helmet>
      <h2>{t("categories")}</h2>
      <p className="muted" style={{ marginBottom: 24 }}>
        {t("selectCategory")}
      </p>
      <div className="grid" style={{ marginTop: 12 }}>
        {categories.map((category, index) => (
          <motion.article 
            key={category.id} 
            className="card card-hover"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
            whileHover={{ 
              scale: 1.03,
              transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="content">
              <h3>{getLocalizedField(category, "name")}</h3>
              <Link className="btn scale-hover" to={`/category/${category.id}`} >
                {t("Move")}
              </Link>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}