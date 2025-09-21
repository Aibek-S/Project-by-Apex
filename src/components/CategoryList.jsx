import { Link } from "react-router-dom";
import { useCategories } from "../hooks/useSupabase";
import { useLanguage } from "../contexts/LanguageContext";
import { Helmet } from "react-helmet-async";

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
        {categories.map((category) => (
          <article key={category.id} className="card">
            <div className="content">
              <h3>{getLocalizedField(category, "name")}</h3>
              <Link className="btn" to={`/category/${category.id}`} >
                {t("Move")}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}