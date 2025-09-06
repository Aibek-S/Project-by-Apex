// Точка входа приложения: подключаем React, роутер и глобальные стили
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { LanguageProvider } from "./contexts/LanguageContext.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import "./styles/global.css";

// Находим контейнер для рендера и инициализируем корень React 18
const container = document.getElementById("root");
const root = createRoot(container);

// Рендерим приложение с включённым StrictMode и маршрутизацией
root.render(
  <React.StrictMode>
    <AuthProvider>
      <LanguageProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </LanguageProvider>
    </AuthProvider>
  </React.StrictMode>
);