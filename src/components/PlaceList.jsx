import { useParams, Link } from "react-router-dom";
import { usePlaces, useCategories } from "../hooks/useSupabase";
import { useLanguage } from "../contexts/LanguageContext";
import PlaceCard from "./Placecard";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

export default function PlaceList() {
  const { id } = useParams();
  const { places, loading: placesLoading, error: placesError } = usePlaces(id);
  const { categories, loading: categoriesLoading } = useCategories();
  const { t, getLocalizedField } = useLanguage();

  const category = categories.find((cat) => cat.id === parseInt(id));

  if (placesLoading || categoriesLoading) {
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

  if (placesError) {
    return (
      <div
        className="error-container"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "200px",
          gap: 16,
        }}
      >
        <p className="muted" style={{ color: "var(--primary)" }}>
          {t("error")}: {placesError}
        </p>
        <Link className="btn" to="/">
          {t("back")}
        </Link>
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
        <title>
          {category 
            ? `${getLocalizedField(category, "name")} - ${t("categories") || "Категории"}`
            : (t("places") || "Места")}
        </title>
      </Helmet>
      <div style={{ marginBottom: 24 }}>
        <Link
          className="btn"
          to="/"
          style={{ marginBottom: 16, display: "inline-block" }}
        >
          ← {t("back")}
        </Link>
        <h2>{category ? getLocalizedField(category, "name") : t("places")}</h2>
      </div>

      {!places.length ? (
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
      ) : (
        <motion.div 
          className="grid" 
          style={{ marginTop: 12 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
          {places.map((place, index) => (
            <motion.div
              key={place.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
            >
              <PlaceCard place={place} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}