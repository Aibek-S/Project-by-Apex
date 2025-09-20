import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { getImageUrl } from "../hooks/useSupabase";
import ImageLoader from "./ImageLoader";

export default function PlaceCard({ place }) {
  const { getLocalizedField, t } = useLanguage();

  // Get image URL from place_photos if available, otherwise fallback to place.image
  let imageUrl = null;
  
  if (place.place_photos && Array.isArray(place.place_photos) && place.place_photos.length > 0) {
    // Use the first photo from place_photos
    imageUrl = place.place_photos[0].url;
  } else if (place.image) {
    // Fallback to place.image
    imageUrl = getImageUrl(place.image);
  }
  
  const imageAlt = getLocalizedField(place, 'name');

  return (
    <article className="card">
      {imageUrl && (
        <div style={{ height: "160px" }}>
          <ImageLoader
            src={imageUrl}
            alt={imageAlt}
            style={{
              width: "100%",
              height: "100%",
              filter: "sepia(0.2) contrast(1.02) saturate(0.9)",
            }}
          />
        </div>
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