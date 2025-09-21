import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { motion } from "framer-motion";

export default function TourCard({ tour }) {
  const { t } = useLanguage();

  if (!tour) return null;

  // Get the first place's image as the tour image
  let tourImage = null;
  if (tour.tour_places && tour.tour_places.length > 0) {
    const firstPlace = tour.tour_places[0].places;
    if (firstPlace && firstPlace.place_photos && firstPlace.place_photos.length > 0) {
      tourImage = firstPlace.place_photos[0].url;
    }
  }

  return (
    <motion.div
      className="card"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
    >
      
          
        
      
      
      <div className="card-content"style={{padding: 8}}>
        
        <h3 className="card-title">{tour.name}</h3>
        
        {tour.company && (
          <p className="muted" style={{ marginBottom: 8 }}>
            {tour.company}
          </p>
        )}
        
        {tour.price && (
          <p style={{ marginBottom: 12, fontWeight: 'bold' }}>
            {t("price")}: {tour.price} ₸
          </p>
        )}
        
        {tour.description && (
          <p className="card-description" style={{ marginBottom: 16 }}>
            {tour.description.substring(0, 100)}
            {tour.description.length > 100 ? "..." : ""}
          </p>
        )}
        
        <Link 
          to={`/tour/${tour.id}`} 
          className="btn"
          style={{ width: '100%', textAlign: 'center', justifyContent:'center'}}
        >
          {t("details")}
        </Link>
      </div>
    </motion.div>
  );
}