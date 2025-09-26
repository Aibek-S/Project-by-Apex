import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { motion } from "framer-motion";
import ImageLoader from "./ImageLoader";

export default function TourCard({ tour }) {
  const { t, getLocalizedField } = useLanguage();

  if (!tour) return null;

  // Get tour photos (excluding logos) - limit to 3
  let tourImages = [];
  if (tour.tour_photos && Array.isArray(tour.tour_photos)) {
    tourImages = tour.tour_photos
      .filter(photo => !photo.is_logo)
      .map(photo => photo.url)
      .slice(0, 3);
  }

  // Get logo if exists
  let logoUrl = null;
  if (tour.tour_photos && Array.isArray(tour.tour_photos)) {
    const logo = tour.tour_photos.find(photo => photo.is_logo);
    if (logo) {
      logoUrl = logo.url;
    }
  }

  // Fallback to place images if no tour photos
  if (tourImages.length === 0 && tour.tour_places && Array.isArray(tour.tour_places)) {
    const placesWithImages = tour.tour_places
      .map(tp => tp.places)
      .filter(place => place && 
        ((place.place_photos && place.place_photos.length > 0) || place.image))
      .slice(0, 3); // Limit to 3 places
    
    tourImages = placesWithImages.map(place => {
      if (place.place_photos && place.place_photos.length > 0) {
        return place.place_photos[0].url;
      } else if (place.image) {
        return place.image;
      }
      return null;
    }).filter(img => img !== null);
  }

  return (
    <motion.div
      className="card"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRadius: '12px',
        overflow: 'hidden'
      }}
    >
      {/* Image gallery section */}
      {tourImages.length > 0 && (
        <div 
          style={{
            position: 'relative',
            height: '200px',
            overflow: 'hidden',
            display: 'flex',
            gap: '4px',
            padding: '4px'
          }}
        >
          {tourImages.map((img, index) => (
            <div 
              key={index}
              style={{
                flex: 1,
                height: '100%',
                overflow: 'hidden',
                borderRadius: '8px'
              }}
            >
              <ImageLoader
                src={img}
                alt={`${tour.name} - Image ${index + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
          ))}
        </div>
      )}

      <div 
        className="card-content"
        style={{
          padding: '16px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <h3 
          className="card-title" 
          style={{
            margin: '0 0 8px 0',
            fontSize: '1.25rem',
            lineHeight: '1.4'
          }}
        >
          {tour.name}
        </h3>
        
        {tour.company && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            marginBottom: 8
          }}>
            <p 
              className="muted" 
              style={{ 
                fontSize: '0.9rem',
                marginRight: '8px',
                marginBottom: 0
              }}
            >
              {tour.company}
            </p>
            {/* Logo display next to company name */}
            {logoUrl && (
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <ImageLoader
                  src={logoUrl}
                  alt={`${tour.name} logo`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
            )}
          </div>
        )}
        
        {tour.price && (
          <p 
            style={{ 
              marginBottom: 12, 
              fontWeight: 'bold',
              color: 'var(--primary)'
            }}
          >
            {t("price")}: {tour.price} ₸
          </p>
        )}
        
        {tour.description && (
          <p 
            className="card-description" 
            style={{ 
              marginBottom: 16,
              flex: 1,
              fontSize: '0.95rem',
              lineHeight: '1.5'
            }}
          >
            {tour.description.substring(0, 100)}
            {tour.description.length > 100 ? "..." : ""}
          </p>
        )}
        
        <Link 
          to={`/tour/${tour.id}`} 
          className="btn scale-hover"
          style={{ 
            width: '100%', 
            textAlign: 'center', 
            justifyContent: 'center',
            marginTop: 'auto'
          }}
        >
          {t("details")}
        </Link>
      </div>
    </motion.div>
  );
}