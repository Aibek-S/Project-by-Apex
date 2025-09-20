import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { usePlaces, getImageUrl } from "../hooks/useSupabase";
import { useLanguage } from "../contexts/LanguageContext";
import ImageLoader from "./ImageLoader";

export default function PlaceSlider() {
  const { places, loading, error } = usePlaces(); // Получаем все места
  const { t, getLocalizedField } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredPlaces, setFeaturedPlaces] = useState([]);

  // Выбираем случайные места для показа в слайдере
  useEffect(() => {
    if (places.length > 0) {
      const shuffled = [...places].sort(() => Math.random() - 0.5);
      setFeaturedPlaces(shuffled.slice(0, Math.min(6, shuffled.length)));
      setCurrentSlide(0);
    }
  }, [places]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredPlaces.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + featuredPlaces.length) % featuredPlaces.length
    );
  };

  // Show error state if there's an error loading places
  if (error) {
    return (
      <section className="place-slider" style={{ marginBottom: 32 }}>
        <h2 style={{ marginBottom: 16 }}>
          {t("featuredPlaces") || "Рекомендуемые места"}
        </h2>
        <div
          style={{
            height: "300px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--card)",
            borderRadius: "12px",
            border: "1px solid var(--border)",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <p
              className="muted"
              style={{ color: "var(--primary)", marginBottom: 16 }}
            >
              {t("error")}: {error}
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (loading || featuredPlaces.length === 0) {
    return (
      <div
        style={{
          height: "300px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--card)",
          borderRadius: "12px",
          marginBottom: "32px",
        }}
      >
        <p className="muted">{loading ? t("loading") : t("noData")}</p>
      </div>
    );
  }

  const currentPlace = featuredPlaces[currentSlide];

  return (
    <section className="place-slider" style={{ marginBottom: 32 }}>
      <h2 style={{ marginBottom: 16 }}>
        {t("featuredPlaces") || "Рекомендуемые места"}
      </h2>

      <div className="slider" style={{ position: "relative" }}>
        {/* Основное изображение */}
        <div className="slide" style={{ position: "relative", height: "300px" }}>
          {(currentPlace.place_photos && currentPlace.place_photos.length > 0) ? (
            <ImageLoader
              src={currentPlace.place_photos[0].url}
              alt={getLocalizedField(currentPlace, "name")}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "12px",
                filter: "sepia(0.25) contrast(1.05) saturate(0.95)",
              }}
            />
          ) : currentPlace.image ? (
            <ImageLoader
              src={getImageUrl(currentPlace.image)}
              alt={getLocalizedField(currentPlace, "name")}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "12px",
                filter: "sepia(0.25) contrast(1.05) saturate(0.95)",
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "var(--card)",
                borderRadius: "12px",
                border: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <p className="muted">{t("noImage") || "Нет изображения"}</p>
            </div>
          )}

          {/* Информация о месте */}
          <div
            className="slide-caption"
            style={{
              width: "320px",
              position: "absolute",
              bottom: "8px",
              left: "16px",
              right: "16px",
              background: "var(--card)",
              borderRadius: "12px",
              padding: "16px",
              border: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <div>
                <h5 style={{ margin: "0 0 0 0" }}>
                  {getLocalizedField(currentPlace, "name")}
                </h5>
                <p className="muted" style={{ margin: 0, fontSize: "0.7em" }}>
                  {getLocalizedField(currentPlace, "description").slice(0, 50)}
                  ...
                </p>
              </div>
              <Link
                className="btn"
                to={`/place/${currentPlace.id}`}
                style={{ flexShrink: 0 }}
              >
                {t("details") || "Подробнее"}
              </Link>
            </div>
          </div>
        </div>

        {/* Кнопки навигации */}
        {featuredPlaces.length > 1 && (
          <>
            <button
              className="slider-btn left"
              onClick={prevSlide}
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "50%",
                width: "44px",
                height: "44px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: "20px",
                color: "var(--text)",
                zIndex: 2,
              }}
              aria-label={t("previous") || "Предыдущее"}
            >
              ‹
            </button>

            <button
              className="slider-btn right"
              onClick={nextSlide}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "50%",
                width: "44px",
                height: "44px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: "20px",
                color: "var(--text)",
                zIndex: 2,
              }}
              aria-label={t("next") || "Следующее"}
            >
              ›
            </button>
          </>
        )}
      </div>
    </section>
  );
}
