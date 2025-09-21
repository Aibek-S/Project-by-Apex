import { useParams, Link } from "react-router-dom";
import { useTour } from "../hooks/useSupabase";
import { useLanguage } from "../contexts/LanguageContext";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import PlaceCard from "../components/Placecard";

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

  // Get the first place's image as the tour image
  let tourImage = null;
  if (places.length > 0 && places[0].place_photos && places[0].place_photos.length > 0) {
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
        {/* Tour Image */}
        {tourImage ? (
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
              <img
                src={tourImage}
                alt={tour.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'sepia(0.25) contrast(1.05) saturate(0.95)'
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
            <p className="muted" style={{ marginBottom: 16 }}>
              {t("company")}: {tour.company}
            </p>
          )}

          {tour.price && (
            <p style={{ marginBottom: 16, fontSize: "1.2em", fontWeight: 'bold' }}>
              {t("price")}: {tour.price} ₸
            </p>
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