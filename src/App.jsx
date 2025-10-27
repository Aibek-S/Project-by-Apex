// Импортируем маршрутизатор и компоненты
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Suspense, lazy, useState } from "react";
import { HelmetProvider } from "react-helmet-async";
import { AnimatePresence } from "framer-motion";
// Общие компоненты шапки/подвала
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
// Компоненты приложения
import HomePage from "./pages/HomePage.jsx";
import PlaceList from "./components/PlaceList.jsx";
import PlaceDetail from "./components/PlaceDetail.jsx";
// Компоненты аутентификации
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
// Компоненты туров
import TourListPage from "./pages/TourListPage.jsx";
import TourDetailPage from "./pages/TourDetailPage.jsx";
// About page
import AboutPage from "./pages/AboutPage.jsx";
// Articles pages
import ArticlesPage from "./pages/ArticlesPage.jsx";
import ArticleDetailPage from "./pages/ArticleDetailPage.jsx";
// Music page
import MusicPage from "./pages/MusicPage.jsx";
// Company page
import CompanyDetailPage from "./pages/CompanyDetailPage.jsx";
import { pageVariants } from "./utils/animations.js";

// Ленивая загрузка страницы карты и чат-бота
const MapPage = lazy(() => import("./pages/MapPage.jsx"));
const ChatBot = lazy(() => import("./components/ChatBot.jsx"));

// ChatBot Modal Component
const ChatBotModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
            }}
            onClick={onClose}
        >
            <div
                style={{
                    backgroundColor: "var(--card)",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                    maxWidth: "500px",
                    width: "100%",
                    maxHeight: "80vh",
                    overflow: "hidden",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <Suspense
                    fallback={
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "300px",
                                fontSize: "18px",
                            }}
                        >
                            Loading chat...
                        </div>
                    }
                >
                    <ChatBot showHeader={true} onClose={onClose} />
                </Suspense>
            </div>
        </div>
    );
};

// Animated page wrapper component
const AnimatedPage = ({ children }) => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <div
                key={location.pathname}
                initial="initial"
                animate="enter"
                exit="exit"
                variants={pageVariants}
                style={{ width: "100%" }}
            >
                {children}
            </div>
        </AnimatePresence>
    );
};

// Корневой компонент приложения: шапка, маршрутизация, подвал
export default function App() {
    const [isChatOpen, setIsChatOpen] = useState(false);

    return (
        <HelmetProvider>
            <div className="app-shell">
                <Header onChatToggle={() => setIsChatOpen(true)} />
                <main className="app-main">
                    <Routes>
                        {/* Аутентификация */}
                        <Route
                            path="/login"
                            element={
                                <AnimatedPage>
                                    <LoginPage />
                                </AnimatedPage>
                            }
                        />
                        <Route
                            path="/signup"
                            element={
                                <AnimatedPage>
                                    <SignupPage />
                                </AnimatedPage>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <AnimatedPage>
                                        <ProfilePage />
                                    </AnimatedPage>
                                </ProtectedRoute>
                            }
                        />

                        {/* Настройки */}
                        <Route
                            path="/settings"
                            element={
                                <AnimatedPage>
                                    <SettingsPage />
                                </AnimatedPage>
                            }
                        />

                        {/* Главная */}
                        <Route
                            path="/"
                            element={
                                <AnimatedPage>
                                    <HomePage key="home" />
                                </AnimatedPage>
                            }
                        />
                        {/* Страница категории */}
                        <Route
                            path="/category/:id"
                            element={
                                <AnimatedPage>
                                    <PlaceList />
                                </AnimatedPage>
                            }
                        />
                        {/* Страница конкретного места */}
                        <Route
                            path="/place/:id"
                            element={
                                <AnimatedPage>
                                    <PlaceDetail />
                                </AnimatedPage>
                            }
                        />
                        {/* Страница туров */}
                        <Route
                            path="/tours"
                            element={
                                <AnimatedPage>
                                    <TourListPage />
                                </AnimatedPage>
                            }
                        />
                        {/* Страница деталей тура */}
                        <Route
                            path="/tour/:id"
                            element={
                                <AnimatedPage>
                                    <TourDetailPage />
                                </AnimatedPage>
                            }
                        />
                        {/* About page */}
                        <Route
                            path="/about"
                            element={
                                <AnimatedPage>
                                    <AboutPage />
                                </AnimatedPage>
                            }
                        />
                        {/* Articles pages */}
                        <Route
                            path="/articles"
                            element={
                                <AnimatedPage>
                                    <ArticlesPage />
                                </AnimatedPage>
                            }
                        />
                        <Route
                            path="/article/:slug"
                            element={
                                <AnimatedPage>
                                    <ArticleDetailPage />
                                </AnimatedPage>
                            }
                        />
                        {/* Music page */}
                        <Route
                            path="/music"
                            element={
                                <AnimatedPage>
                                    <MusicPage />
                                </AnimatedPage>
                            }
                        />
                        {/* Chat page */}
                        <Route
                            path="/chat"
                            element={
                                <AnimatedPage>
                                    <Suspense
                                        fallback={
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    height: "100vh",
                                                    fontSize: "18px",
                                                }}
                                            >
                                                Loading chat...
                                            </div>
                                        }
                                    >
                                        <ChatBot showHeader={true} />
                                    </Suspense>
                                </AnimatedPage>
                            }
                        />
                        {/* Карта с ленивой загрузкой */}
                        <Route
                            path="/map"
                            element={
                                <AnimatedPage>
                                    <Suspense
                                        fallback={
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    height: "100vh",
                                                    fontSize: "18px",
                                                }}
                                            >
                                                Загрузка карты...
                                            </div>
                                        }
                                    >
                                        <MapPage />
                                    </Suspense>
                                </AnimatedPage>
                            }
                        />
                        {/* Company details page */}
                        <Route
                            path="/company/:companyName"
                            element={
                                <AnimatedPage>
                                    <CompanyDetailPage />
                                </AnimatedPage>
                            }
                        />
                        {/* Редирект на главную, если адрес не найден */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
                <Footer />
                <ChatBotModal
                    isOpen={isChatOpen}
                    onClose={() => setIsChatOpen(false)}
                />
            </div>
        </HelmetProvider>
    );
}
