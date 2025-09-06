// Импортируем маршрутизатор и компоненты
import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
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

// Ленивая загрузка страницы карты
const MapPage = lazy(() => import("./pages/MapPage.jsx"));

// Корневой компонент приложения: шапка, маршрутизация, подвал
export default function App() {
  return (
    <div className="app-shell">
      <Header />
      <main className="app-main">
        <Routes>
          {/* Аутентификация */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          
          {/* Настройки */}
          <Route path="/settings" element={<SettingsPage />} />
          
          {/* Главная */}
          <Route path="/" element={<HomePage />} />
          {/* Страница категории */}
          <Route path="/category/:id" element={<PlaceList />} />
          {/* Страница конкретного места */}
          <Route path="/place/:id" element={<PlaceDetail />} />
          {/* Карта с ленивой загрузкой */}
          <Route 
            path="/map" 
            element={
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
            } 
          />
          {/* Редирект на главную, если адрес не найден */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}