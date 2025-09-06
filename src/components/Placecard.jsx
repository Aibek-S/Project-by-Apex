import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { getImageUrl } from "../hooks/useSupabase";

export default function PlaceCard({ place }) {
  const { getLocalizedField, t } = useLanguage();

  // Construct image URL from image filename - stored directly in images/ folder
  const imageUrl = place.image 
    ? getImageUrl(place.image)
    : null;
  const imageAlt = getLocalizedField(place, 'name');

  return (
    <article className="card">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={imageAlt}
          style={{
            width: "100%",
            height: "160px",
            objectFit: "cover",
            filter: "sepia(0.2) contrast(1.02) saturate(0.9)",
          }}
          onError={(e) => {
            // Show placeholder if image fails to load
            e.target.src = `https://picsum.photos/400/200?random=${place.id}`;
            e.target.onError = null; // Prevent infinite loop
          }}
        />
      )}
      <div className="content">
        <h3>{getLocalizedField(place, "name")}</h3>
        <p className="muted" style={{ minHeight: 42 }}>
          {getLocalizedField(place, "description").slice(0, 100)}....
        </p>
        <Link className="btn" to={`/place/${place.id}`}>
          {t("details") || "Подробнее"}
        </Link>
      </div>
    </article>
  );
}
