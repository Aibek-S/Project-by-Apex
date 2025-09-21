import { useState, useMemo } from "react";
import { usePlaces } from "../hooks/useSupabase";
import { useLanguage } from "../contexts/LanguageContext";
import Placecard from "./Placecard";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

export default function SearchSection() {
  const [query, setQuery] = useState("");
  const { places, loading, error } = usePlaces(); // Получаем все места
  const { t, getLocalizedField } = useLanguage();

  // Фильтрация мест по поисковому запросу
  const filteredPlaces = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return places.filter((place) => {
      const name = getLocalizedField(place, "name").toLowerCase();
      const description = getLocalizedField(place, "description").toLowerCase();
      return name.includes(q) || description.includes(q);
    });
  }, [places, query, getLocalizedField]);

  // Show error state if there's an error loading places
  if (error) {
    return (
      <section className="search-section" style={{ marginBottom: 32 }}>
        <h2 style={{ marginBottom: 16 }}>{t("search") || "Поиск мест"}</h2>
        <div
          style={{
            padding: "20px",
            background: "var(--card)",
            borderRadius: "12px",
            border: "1px solid var(--border)",
          }}
        >
          <p className="muted" style={{ color: "var(--primary)" }}>
            {t("error")}: {error}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="search-section" style={{ marginBottom: 32 }}>
      <Helmet>
        <title>{t("search") || "Поиск"} - Apex Tourism</title>
      </Helmet>
      <motion.h3 
        style={{ marginBottom: 16 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        {t("search") || "Поиск мест"}
      </motion.h3>

      {/* Поле поиска */}
      <motion.div 
        style={{ marginBottom: 24 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            t("searchPlaceholder") || "Введите название места или описание..."
          }
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: "12px",
            border: "1px solid var(--border)",
            background: "var(--card)",
            color: "var(--text)",
            fontSize: "16px",
          }}
        />
      </motion.div>

      {/* Результаты поиска */}
      {query && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
        >
          <h3 style={{ margin: "16px 0" }}>
            {t("searchResults") || "Результаты поиска"} ({filteredPlaces.length}
            )
          </h3>

          {loading ? (
            <p className="muted">{t("loading")}</p>
          ) : filteredPlaces.length > 0 ? (
            <div className="grid" style={{ marginTop: 16 }}>
              {filteredPlaces.map((place) => (
                <Placecard key={place.id} place={place} />
              ))}
            </div>
          ) : (
            <p className="muted">
              {t("noSearchResults") || "Ничего не найдено по вашему запросу"}
            </p>
          )}
        </motion.div>
      )}
    </section>
  );
}