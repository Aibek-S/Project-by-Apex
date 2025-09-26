import { useParams, Link } from "react-router-dom";
import { useTour } from "../hooks/useSupabase";
import { useLanguage } from "../contexts/LanguageContext";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import PlaceCard from "../components/Placecard";
import ImageLoader from "../components/ImageLoader";

export default function TourDetailPage() {
  const { id } = useParams();
  const { tour, loading, error } = useTour(id);
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="loading-container" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px' 
      }}>
        <p className="muted">{t("loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container" style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px',
        gap: 16
      }}>
        <p className="muted" style={{ color: 'var(--primary)' }}>
          {t("error")}: {error}
        </p>
        <Link className="btn" to="/tours">
          {t("backToTours")}
        </Link>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="no-data-container" style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px',
        gap: 16
      }}>
        <p className="muted">{t("noData")}</p>
        <Link className="btn" to="/tours">
          {t("backToTours")}
        </Link>
      </div>
    );
  }

  // Get places from tour_places relation, already sorted by position in the hook
  const places = tour.tour_places 
    ? tour.tour_places.map(tp => tp.places).filter(place => place !== null) 
    : [];

  // Get tour photos (excluding logos)
  let tourImages = [];
  if (tour.tour_photos && Array.isArray(tour.tour_photos)) {
    tourImages = tour.tour_photos
      .filter(photo => !photo.is_logo)
      .map(photo => photo.url);
  }

  // Get logo if exists
  let logoUrl = null;
  if (tour.tour_photos && Array.isArray(tour.tour_photos)) {
    const logo = tour.tour_photos.find(photo => photo.is_logo);
    if (logo) {
      logoUrl = logo.url;
    }
  }

  // Fallback to first place's image if no tour photos
  let tourImage = null;
  if (tourImages.length > 0) {
    tourImage = tourImages[0];
  } else if (places.length > 0 && places[0].place_photos && places[0].place_photos.length > 0) {
    tourImage = places[0].place_photos[0].url;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      <Helmet>
        <title>
          {tour 
            ? `${tour.name} - ${t("tourDetails") || "Tour Details"}`
            : (t("tourDetails") || "Tour Details")}
        </title>
      </Helmet>
      
      <div style={{ marginBottom: 24 }}>
        <Link to="/tours" className="btn" style={{ marginBottom: 16, display: 'inline-block' }}>
          ← {t("backToTours")}
        </Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }}>
        {/* Tour Images Gallery */}
        {tourImages.length > 0 ? (
          <motion.div 
            style={{ marginBottom: 16 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            <div style={{ 
              position: 'relative',
              height: '400px',
              borderRadius: '12px',
              overflow: 'hidden'
            }}>
              {tourImages.length === 1 ? (
                // Single image
                <ImageLoader
                  src={tourImages[0]}
                  alt={tour.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                // Multiple images in a grid
                <div 
                  style={{
                    display: 'grid',
                    gridTemplateColumns: tourImages.length === 2 ? '1fr 1fr' : '1fr 1fr 1fr',
                    gridTemplateRows: '1fr 1fr',
                    gap: '4px',
                    height: '100%'
                  }}
                >
                  {tourImages.map((img, index) => (
                    <div 
                      key={index}
                      style={{
                        gridColumn: tourImages.length === 3 && index === 2 ? '2' : (index % 2 === 0 ? '1' : '2'),
                        gridRow: tourImages.length === 3 && index === 2 ? '2' : '1',
                        overflow: 'hidden'
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
            </div>
          </motion.div>
        ) : places.length > 0 && places[0].place_photos && places[0].place_photos.length > 0 ? (
          // Fallback to place image
          <motion.div 
            style={{ marginBottom: 16 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            <div style={{ 
              position: 'relative',
              height: '400px',
              borderRadius: '12px',
              overflow: 'hidden'
            }}>
              <ImageLoader
                src={places[0].place_photos[0].url}
                alt={tour.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
          </motion.div>
        ) : (
          <div style={{ 
            width: '100%',
            height: '400px',
            background: 'var(--card)',
            borderRadius: '12px',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}>
            <p className="muted">{t("noImage") || "No image available"}</p>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
        >
          <h1 style={{ marginBottom: 16 }}>
            {tour.name}
          </h1>

          {tour.company && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              marginBottom: 16
            }}>
              <p className="muted" style={{ 
                marginBottom: 0,
                marginRight: '8px'
              }}>
                {t("company")}: {tour.company}
              </p>
              {/* Logo display next to company name */}
              {logoUrl && (
                <div style={{
                  width: '32px',
                  height: '32px',
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
            <p style={{ marginBottom: 16, fontSize: "1.2em", fontWeight: 'bold' }}>
              {t("price")}: {tour.price} ₸
            </p>
          )}

          {/* Instagram button */}
          {tour.instagram_url && (
            <a 
              href={tour.instagram_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn scale-hover"
              style={{ 
                marginBottom: 16, 
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              {t("visitInstagram") || "Visit Instagram"}
            </a>
          )}

          <div className="content">
            <p style={{ lineHeight: 1.6, fontSize: "1.1em" }}>
              {tour.description}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Places in this tour */}
      {places.length > 0 && (
        <motion.div 
          style={{ marginTop: 40 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
        >
          <h2 style={{ marginBottom: 24 }}>
            {t("placesInThisTour") || "Places in this tour"}
          </h2>
          
          <div className="grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: 24 
          }}>
            {places.map((place, index) => (
              <div key={place.id} style={{ position: 'relative' }}>
                {/* Position indicator */}
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  background: 'var(--primary)',
                  color: '#1a120b',
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  zIndex: 2,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                }}>
                  {index + 1}
                </div>
                <PlaceCard place={place} />
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}