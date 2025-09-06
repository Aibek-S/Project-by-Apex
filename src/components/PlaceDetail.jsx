import { useParams, Link } from "react-router-dom";
import { usePlace, getImageUrl } from "../hooks/useSupabase";
import { useLanguage } from "../contexts/LanguageContext";
import FeedbackSection from "./FeedbackSection";

export default function PlaceDetail() {
  const { id } = useParams();
  const { place, loading, error } = usePlace(id);
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
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "200px",
          gap: 16,
        }}
      >
        <p className="muted" style={{ color: "var(--primary)" }}>
          {t("error")}: {error}
        </p>
        <Link className="btn" to="/">
          {t("back")}
        </Link>
      </div>
    );
  }

  if (!place) {
    return (
      <div
        className="no-data-container"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "200px",
          gap: 16,
        }}
      >
        <p className="muted">{t("noData")}</p>
        <Link className="btn" to="/">
          {t("back")}
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Link
          className="btn"
          to={place.categories ? `/category/${place.categories.id}` : "/"}
          style={{ marginBottom: 16, display: "inline-block" }}
        >
          ← {t("back")}
        </Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }}>
        {/* Simple Image Display */}
        {place.image && (
          <div style={{ marginBottom: 16 }}>
            <img
              src={getImageUrl(place.image)}
              alt={getLocalizedField(place, "name")}
              style={{
                width: '100%',
                maxHeight: '400px',
                objectFit: 'cover',
                borderRadius: '12px',
                filter: 'sepia(0.25) contrast(1.05) saturate(0.95)'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        <div>
          <h1 style={{ marginBottom: 16 }}>
            {getLocalizedField(place, "name")}
          </h1>

          {place.categories && (
            <p className="muted" style={{ marginBottom: 16 }}>
              {t("categories")}: {getLocalizedField(place.categories, "name")}
            </p>
    )} 

          <div className="content">
            <p style={{ lineHeight: 1.6, fontSize: "1.1em" }}>
              {getLocalizedField(place, "description")}
            </p>
          </div>

          {/* Кнопка "Показать на карте" - только если у места есть координаты */}
          {place.lat && place.lng && (
            <div style={{ marginTop: 24 }}>
              <Link
                to={`/map?place=${place.id}`}
                className="btn"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                {t("showOnMap") || "Показать на карте"}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Feedback Section */}
      <div style={{ marginTop: 40 }}>
        <FeedbackSection placeId={place.id} />
      </div>
    </div>
  );
}