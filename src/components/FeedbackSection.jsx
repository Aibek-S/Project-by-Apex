import { useState } from "react";
import AnimatedButton from "../components/AnimatedButton";
import { useAuth } from "../contexts/AuthContext";
import { useFeedback } from "../hooks/useFeedback";
import { useLanguage } from "../contexts/LanguageContext";

export default function FeedbackSection({ placeId }) {
    const { user } = useAuth();
    const { t, language } = useLanguage();
    const {
        feedback,
        loading,
        error,
        addFeedback,
        getAverageRating,
        getRatingDistribution,
    } = useFeedback(placeId);

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [feedbackError, setFeedbackError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            setFeedbackError(t("pleaseLoginToReview"));
            return;
        }

        if (rating === 0) {
            setFeedbackError(t("pleaseRate"));
            return;
        }

        setSubmitting(true);
        setFeedbackError("");

        try {
            await addFeedback({
                userId: user.id,
                rating,
                comment,
            });

            // Reset form
            setRating(0);
            setComment("");
        } catch (err) {
            setFeedbackError(t("reviewError") + " " + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const averageRating = getAverageRating();
    const ratingDistribution = getRatingDistribution();

    // Function to render star ratings
    const renderStars = (ratingValue, size = "medium") => {
        const stars = [];
        const starSize =
            size === "large" ? "24px" : size === "medium" ? "20px" : "16px";

        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span
                    key={i}
                    style={{
                        color: i <= ratingValue ? "#FFD700" : "#ddd",
                        fontSize: starSize,
                        cursor: "pointer",
                    }}
                    onClick={() => setRating(i)}
                >
                    ★
                </span>
            );
        }

        return stars;
    };

    // Function to render star ratings for display only
    const renderStaticStars = (ratingValue, size = "medium") => {
        const stars = [];
        const starSize =
            size === "large" ? "24px" : size === "medium" ? "20px" : "16px";

        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span
                    key={i}
                    style={{
                        color: i <= ratingValue ? "#FFD700" : "#ddd",
                        fontSize: starSize,
                    }}
                >
                    ★
                </span>
            );
        }

        return stars;
    };

    return (
        <div className="feedback-section">
            <h3>{t("visitorReviews")}</h3>

            {/* Average Rating Display */}
            <div className="average-rating">
                <div className="rating-value">
                    <span className="rating-number">{averageRating}</span>
                    <div className="stars">
                        {renderStaticStars(Math.round(averageRating), "large")}
                    </div>
                    <span className="rating-count">
                        ({feedback.length} {t("reviews")})
                    </span>
                </div>
            </div>

            {/* Rating Distribution */}
            <div className="rating-distribution">
                {[5, 4, 3, 2, 1].map((starCount) => (
                    <div key={starCount} className="rating-bar">
                        <span className="star-label">{starCount} ★</span>
                        <div className="bar-container">
                            <div
                                className="bar"
                                style={{
                                    width:
                                        feedback.length > 0
                                            ? `${(ratingDistribution[starCount] / feedback.length) * 100}%`
                                            : "0%",
                                }}
                            ></div>
                        </div>
                        <span className="count">
                            {ratingDistribution[starCount]}
                        </span>
                    </div>
                ))}
            </div>

            {/* Feedback Form */}
            {user ? (
                <div className="feedback-form-container">
                    <h4>{t("leaveReview")}</h4>
                    <form onSubmit={handleSubmit} className="feedback-form">
                        {feedbackError && (
                            <div className="error-message">{feedbackError}</div>
                        )}

                        <div className="form-group">
                            <label>{t("yourRating")}</label>
                            <div className="star-rating">
                                {renderStars(rating)}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="comment">{t("yourComment")}</label>
                            <textarea
                                id="comment"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder={t("shareExperience")}
                                rows="4"
                            />
                        </div>

                        <AnimatedButton
                            type="submit"
                            disabled={submitting}
                            className="btn"
                        >
                            {submitting ? t("submitting") : t("submitReview")}
                        </AnimatedButton>
                    </form>
                </div>
            ) : (
                <div className="login-prompt">
                    <p>
                        {t("pleaseLoginOrSignup")}{" "}
                        <a href="/login">{t("login")}</a>{" "}
                        <a href="/signup">{t("signup")}</a>.
                    </p>
                </div>
            )}

            {/* Feedback List */}
            <div className="feedback-list">
                <h4>{t("visitorReviews")}</h4>

                {loading ? (
                    <div className="loading">{t("loadingReviews")}</div>
                ) : error ? (
                    <div className="error-message">
                        {t("errorLoadingReviews")} {error}
                    </div>
                ) : feedback.length === 0 ? (
                    <p className="no-feedback">{t("noReviewsYet")}</p>
                ) : (
                    <div className="feedback-items">
                        {feedback.map((item) => (
                            <div key={item.id} className="feedback-item">
                                <div className="feedback-header">
                                    <div className="user-info">
                                        <div className="avatar">
                                            <div className="avatar-placeholder">
                                                👤
                                            </div>
                                        </div>
                                        <div className="user-details">
                                            <span className="user-name">
                                                {item.users?.full_name ||
                                                    t("anonymousUser")}
                                            </span>
                                            <div className="rating">
                                                {renderStaticStars(item.rating)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="date">
                                        {new Date(
                                            item.created_at
                                        ).toLocaleDateString(
                                            language === "ru"
                                                ? "ru-RU"
                                                : language === "en"
                                                  ? "en-US"
                                                  : "kk-KZ"
                                        )}
                                    </div>
                                </div>
                                {item.comment && (
                                    <div className="comment">
                                        {item.comment}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
