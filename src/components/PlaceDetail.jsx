import { useParams, Link } from "react-router-dom";
import { usePlace, getImageUrl } from "../hooks/useSupabase";
import { useLanguage } from "../contexts/LanguageContext";
import { useToursByPlace } from "../hooks/useSupabase";
import FeedbackSection from "./FeedbackSection";
import { useState, useEffect } from "react";
import ImageLoader from "./ImageLoader";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import TourCard from "./TourCard";

export default function PlaceDetail() {
    const { id } = useParams();
    const { place, loading, error } = usePlace(id);
    const { language } = useLanguage();
    const {
        tours,
        loading: toursLoading,
        error: toursError,
    } = useToursByPlace(id, language);
    const { t, getLocalizedField } = useLanguage();
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

    // If there's no ID, we shouldn't be on this page, so we can return null or redirect
    // This prevents the "No data" message from showing during navigation transitions
    if (!id) {
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

    // Get all photos for the place (up to 3) from place_photos table
    const allPhotos = [];

    // Add photos from place_photos table (up to 3 total)
    if (place.place_photos && Array.isArray(place.place_photos)) {
        place.place_photos.forEach((photo) => {
            if (allPhotos.length < 3) {
                allPhotos.push(photo.url); // Use the full URL directly
            }
        });
    }

    // If we have no photos from place_photos, fall back to the main image
    if (allPhotos.length === 0 && place.image) {
        allPhotos.push(getImageUrl(place.image)); // Process the image filename
    }

    // If we have no photos at all, we'll show a placeholder
    const hasPhotos = allPhotos.length > 0;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
            <Helmet>
                <title>
                    {place
                        ? `${getLocalizedField(place, "name")} - ${t("details") || "Подробности"}`
                        : t("placeDetails") || "Детали места"}
                </title>
            </Helmet>
            <div style={{ marginBottom: 24 }}>
                <Link
                    className="btn"
                    to={
                        place.categories
                            ? `/category/${place.categories.id}`
                            : "/"
                    }
                    style={{ marginBottom: 16, display: "inline-block" }}
                >
                    ← {t("back")}
                </Link>
            </div>

            <div
                style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }}
            >
                {/* Photo Gallery */}
                {hasPhotos ? (
                    <motion.div
                        style={{ marginBottom: 16 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                    >
                        {/* Main photo display */}
                        <div
                            className="place-detail-photo"
                            style={{
                                position: "relative",
                                marginBottom: "12px",
                                height: "700px",
                            }}
                        >
                            <ImageLoader
                                src={allPhotos[selectedPhotoIndex]} // Use the URL directly
                                alt={`${getLocalizedField(place, "name")} - Photo ${selectedPhotoIndex + 1}`}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    borderRadius: "12px",
                                    filter: "sepia(0.25) contrast(1.05) saturate(0.95)",
                                }}
                            />
                        </div>

                        {/* Thumbnail navigation (if more than one photo) */}
                        {allPhotos.length > 1 && (
                            <div
                                style={{
                                    display: "flex",
                                    gap: "8px",
                                    justifyContent: "center",
                                    flexWrap: "wrap",
                                }}
                            >
                                {allPhotos.map((photo, index) => (
                                    <motion.div
                                        key={index}
                                        style={{
                                            width: "60px",
                                            height: "60px",
                                            borderRadius: "8px",
                                            overflow: "hidden",
                                            cursor: "pointer",
                                            border:
                                                selectedPhotoIndex === index
                                                    ? "2px solid var(--primary)"
                                                    : "1px solid var(--border)",
                                            filter:
                                                selectedPhotoIndex === index
                                                    ? "sepia(0.25) contrast(1.05) saturate(0.95)"
                                                    : "sepia(0.1) contrast(0.95) saturate(0.85) opacity(0.8)",
                                            flex: "0 0 auto",
                                        }}
                                        onClick={() =>
                                            setSelectedPhotoIndex(index)
                                        }
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        transition={{
                                            duration: 0.2,
                                            ease: [0.4, 0, 0.2, 1],
                                        }}
                                    >
                                        <ImageLoader
                                            src={photo} // Use the URL directly
                                            alt={`${getLocalizedField(place, "name")} - Thumbnail ${index + 1}`}
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                            }}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <div
                        style={{
                            width: "100%",
                            height: "400px",
                            background: "var(--card)",
                            borderRadius: "12px",
                            border: "1px solid var(--border)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: "16px",
                        }}
                    >
                        <p className="muted">
                            {t("noImage") || "No image available"}
                        </p>
                    </div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.4,
                        delay: 0.1,
                        ease: [0.4, 0, 0.2, 1],
                    }}
                >
                    <h1 style={{ marginBottom: 16 }}>
                        {getLocalizedField(place, "name")}
                    </h1>

                    {place.categories && (
                        <p className="muted" style={{ marginBottom: 16 }}>
                            {t("categories")}:{" "}
                            {getLocalizedField(place.categories, "name")}
                        </p>
                    )}

                    <div className="content">
                        <p style={{ lineHeight: 1.6, fontSize: "1.1em" }}>
                            {getLocalizedField(place, "description")}
                        </p>

                        {/* Display legends after description if they exist */}
                        {(place.legends_ru ||
                            place.legends_en ||
                            place.legends_kz) && (
                            <div style={{ marginTop: 24 }}>
                                <h3
                                    style={{
                                        marginBottom: 12,
                                        color: "var(--text-secondary)",
                                    }}
                                >
                                    {t("legends")}
                                </h3>
                                <p
                                    style={{
                                        lineHeight: 1.6,
                                        fontSize: "1em",
                                        fontStyle: "italic",
                                    }}
                                >
                                    {getLocalizedField(place, "legends")}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Кнопка "Показать на карте" - только если у места есть координаты */}
                    {place.lat && place.lng && (
                        <div style={{ marginTop: 16 }}>
                            <Link
                                to={`/map?place=${place.id}`}
                                className="btn scale-hover"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 8,
                                }}
                            >
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                </svg>
                                {t("showOnMap") || "Показать на карте"}
                            </Link>
                        </div>
                    )}

                    {/* 360° Panoramic View Button - only show if inmap_url exists */}
                    {place.inmap_url && (
                        <div style={{ marginTop: 16 }}>
                            <a
                                href={place.inmap_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn scale-hover"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 8,
                                }}
                            >
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-3.5l6-4.5-6-4.5z" />
                                </svg>
                                {t("view360") || "360° View"}
                            </a>
                            <p
                                className="muted"
                                style={{
                                    fontSize: "0.85em",
                                    marginTop: 8,
                                    opacity: 0.7,
                                }}
                            >
                                {language === "ru" && "Панорамы предоставлены "}
                                {language === "kz" && "Панорамалар ұсынған "}
                                {language === "en" && "Panoramas provided by "}
                                <a
                                    href="https://mangystau.inmap.kz/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        color: "var(--primary)",
                                        textDecoration: "none",
                                    }}
                                >
                                    mangystau.inmap.kz
                                </a>
                            </p>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Tours for this place */}
            <motion.div
                style={{ marginTop: 40 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.4,
                    delay: 0.2,
                    ease: [0.4, 0, 0.2, 1],
                }}
            >
                <h2 style={{ marginBottom: 24 }}>
                    {t("availableTours") || "Available Tours"}
                </h2>

                {toursLoading ? (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            minHeight: "100px",
                        }}
                    >
                        <p className="muted">{t("loading")}</p>
                    </div>
                ) : toursError ? (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            minHeight: "100px",
                        }}
                    >
                        <p className="muted">
                            {t("errorLoadingTours") || "Error loading tours"}
                        </p>
                    </div>
                ) : tours && Array.isArray(tours) && tours.length > 0 ? (
                    <div
                        className="grid"
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fill, minmax(300px, 1fr))",
                            gap: 24,
                        }}
                    >
                        {tours.map((tour) => (
                            <TourCard key={tour.id} tour={tour} />
                        ))}
                    </div>
                ) : (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            minHeight: "100px",
                        }}
                    >
                        <p className="muted">
                            {t("noToursForThisPlace") ||
                                "No tours available for this place"}
                        </p>
                    </div>
                )}
            </motion.div>

            {/* Feedback Section */}
            <motion.div
                style={{ marginTop: 40 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.4,
                    delay: 0.3,
                    ease: [0.4, 0, 0.2, 1],
                }}
            >
                <FeedbackSection placeId={place.id} />
            </motion.div>

            {/* Mobile Responsive Styles */}
            <style>{`
                @media (max-width: 768px) {
                    .place-detail-photo {
                        height: 300px !important;
                    }
                    
                    h1 {
                        font-size: 1.8rem !important;
                    }
                    
                    h2 {
                        font-size: 1.5rem !important;
                    }
                    
                    .content p {
                        font-size: 1rem !important;
                    }
                    
                    .grid {
                        grid-template-columns: 1fr !important;
                    }
                }
                
                @media (max-width: 480px) {
                    .place-detail-photo {
                        height: 250px !important;
                        border-radius: 8px !important;
                    }
                    
                    h1 {
                        font-size: 1.5rem !important;
                    }
                    
                    h2 {
                        font-size: 1.3rem !important;
                    }
                }
            `}</style>
        </motion.div>
    );
}
