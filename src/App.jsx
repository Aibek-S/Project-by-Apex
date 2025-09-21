// Импортируем маршрутизатор и компоненты
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Suspense, lazy } from "react";
import { HelmetProvider } from "react-helmet-async";
import { AnimatePresence } from "framer-motion";
// Общие компоненты шапки/подвала
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
// Компоненты приложения
import HomePage from "./components/HomePage.jsx";
import PlaceList from "./components/PlaceList.jsx";
import PlaceDetail from "./components/PlaceDetail.jsx";
// Компоненты аутентификации
import LoginPage from "./components/LoginPage.jsx";
import SignupPage from "./components/SignupPage.jsx";
import ProfilePage from "./components/ProfilePage.jsx";
import SettingsPage from "./components/SettingsPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
// Компоненты туров
import TourListPage from "./pages/TourListPage.jsx";
import TourDetailPage from "./pages/TourDetailPage.jsx";
import { pageVariants } from "./utils/animations.js";

// Ленивая загрузка страницы карты
const MapPage = lazy(() => import("./pages/MapPage.jsx"));

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
  return (
    <HelmetProvider>
      <div className="app-shell">
        <Header />
        <main className="app-main">
          <Routes>
            {/* Аутентификация */}
            <Route path="/login" element={
              <AnimatedPage>
                <LoginPage />
              </AnimatedPage>
            } />
            <Route path="/signup" element={
              <AnimatedPage>
                <SignupPage />
              </AnimatedPage>
            } />
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
            <Route path="/settings" element={
              <AnimatedPage>
                <SettingsPage />
              </AnimatedPage>
            } />
            
            {/* Главная */}
            <Route path="/" element={
              <AnimatedPage>
                <HomePage />
              </AnimatedPage>
            } />
            {/* Страница категории */}
            <Route path="/category/:id" element={
              <AnimatedPage>
                <PlaceList />
              </AnimatedPage>
            } />
            {/* Страница конкретного места */}
            <Route path="/place/:id" element={
              <AnimatedPage>
                <PlaceDetail />
              </AnimatedPage>
            } />
            {/* Страница туров */}
            <Route path="/tours" element={
              <AnimatedPage>
                <TourListPage />
              </AnimatedPage>
            } />
            {/* Страница деталей тура */}
            <Route path="/tour/:id" element={
              <AnimatedPage>
                <TourDetailPage />
              </AnimatedPage>
            } />
            {/* Карта с ленивой загрузкой */}
            <Route 
              path="/map" 
              element={
                <AnimatedPage>
                  <Suspense fallback={
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100vh',
                      fontSize: '18px'
                    }}>
                      Загрузка карты...
                    </div>
                  }>
                    <MapPage />
                  </Suspense>
                </AnimatedPage>
              } 
            />
            {/* Редирект на главную, если адрес не найден */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HelmetProvider>
  );
}