# 📊 Анализ проекта Apex-Tourism для миграции на Next.js

## 🔍 Текущая архитектура

### Технологический стек:

- **Frontend**: React 18 + Vite + React Router DOM
- **Backend**: Express.js (API proxy для Gemini)
- **База данных**: Supabase
- **Карты**: Leaflet + React-Leaflet
- **Анимации**: Framer Motion
- **Стилизация**: CSS + CSS переменные
- **Многоязычность**: Кастомный LanguageContext (ru/en/kz)

### Структура проекта:

#### Страницы (src/pages/):

1. **HomePage.jsx** - Главная страница с категориями и слайдером
2. **AboutPage.jsx** - О компании
3. **CompanyDetailPage.jsx** - Детали туркомпании
4. **LoginPage.jsx** - Авторизация
5. **SignupPage.jsx** - Регистрация
6. **ProfilePage.jsx** - Профиль пользователя
7. **SettingsPage.jsx** - Настройки приложения
8. **MapPage.jsx** - Интерактивная карта (ленивая загрузка)
9. **TourListPage.jsx** - Список туров
10. **TourDetailPage.jsx** - Детали тура

#### Компоненты (src/components/):

1. **Header.jsx** - Навигация, языки, аутентификация, чат
2. **Footer.jsx** - Подвал
3. **PlaceList.jsx** - Список мест по категориям
4. **PlaceDetail.jsx** - Детали места
5. **PlaceSlider.jsx** - Слайдер мест
6. **Placecard.jsx** - Карточка места
7. **TourCard.jsx** - Карточка тура
8. **ChatBot.jsx** - AI чат-бот
9. **SearchSection.jsx** - Поиск
10. **ProtectedRoute.jsx** - Защита маршрутов
11. **CategoryList.jsx** - Список категорий
12. **ImageLoader.jsx** - Загрузка изображений
13. **FeedbackSection.jsx** - Обратная связь
14. **AnimatedButton.jsx** - Анимированная кнопка
15. **ChatBotLoading.jsx** - Загрузка чата
16. **LazyChatBot.jsx** - Ленивая загрузка чата

#### Контексты:

1. **LanguageContext.jsx** - Многоязычность (ru/en/kz)
2. **AuthContext.jsx** - Аутентификация через Supabase

#### Утилиты:

1. **animations.js** - Framer Motion анимации
2. **geminiClient.js** - Клиент для Gemini API
3. **apiQueue.js** - Очередь API запросов

#### API (server.js):

1. **POST /api/chat** - Gemini API proxy
2. **GET /api/health** - Health check

## 🗺️ Карта зависимостей

### Внешние зависимости:

- **Supabase**: Аутентификация, база данных
- **Leaflet**: Карты
- **Framer Motion**: Анимации
- **Google Gemini API**: AI чат-бот
- **React Router DOM**: Маршрутизация
- **React Helmet Async**: SEO мета-теги

### Внутренние зависимости:

- **LanguageContext** → Все компоненты
- **AuthContext** → Защищенные маршруты
- **Supabase** → Аутентификация и данные
- **Gemini API** → ChatBot компонент
- **Animations** → Все страницы и компоненты

## 🎯 План миграции

### Фаза 1: Анализ и подготовка ✅

- [x] Анализ структуры проекта
- [x] Создание плана миграции
- [ ] Создание нового Next.js проекта

### Фаза 2: Базовая инфраструктура

- [ ] Настройка Supabase для SSR
- [ ] Создание базовых layout'ов

### Фаза 3: Миграция контекстов

- [ ] LanguageContext с SSR поддержкой
- [ ] AuthContext с SSR поддержкой

### Фаза 4: Миграция компонентов

- [ ] Базовые компоненты (Header, Footer)
- [ ] Интерактивные компоненты (ChatBot, SearchSection)

### Фаза 5: Миграция карт Leaflet

- [ ] Настройка Leaflet для SSR
- [ ] Компоненты карт

### Фаза 6: Миграция страниц

- [ ] Главная страница с SSR
- [ ] Страницы мест с SSG
- [ ] Страницы туров

### Фаза 7: Миграция API

- [ ] Gemini API на Next.js API routes
- [ ] Дополнительные endpoints

### Фаза 8: Миграция анимаций

- [ ] Адаптация Framer Motion для SSR
- [ ] Компоненты анимаций

### Фаза 9: Тестирование

- [ ] Комплексное тестирование
- [ ] SEO оптимизация

### Фаза 10: Деплой

- [ ] Подготовка к деплою
- [ ] Финальная проверка

## ⚠️ Потенциальные проблемы

### 1. SSR совместимость:

- **Leaflet**: Требует dynamic import с ssr: false
- **Framer Motion**: Нужна защита от гидратационных ошибок
- **localStorage**: Использование в LanguageContext

### 2. Роутинг:

- React Router DOM → Next.js App Router
- Защищенные маршруты → middleware
- Ленивая загрузка → dynamic imports

### 3. API:

- Express.js → Next.js API routes
- CORS настройки
- Переменные окружения

### 4. Стили:

- CSS переменные → CSS-in-JS или Tailwind
- Глобальные стили → Next.js структура

### 5. Данные:

- Supabase клиент для SSR
- Предзагрузка данных
- Кэширование

## 🚀 Преимущества миграции

1. **SEO**: SSR/SSG для лучшего SEO
2. **Производительность**: Оптимизация загрузки
3. **DX**: Улучшенный developer experience
4. **Масштабируемость**: Лучшая архитектура
5. **Современность**: Актуальный стек технологий

## 📋 Следующие шаги

1. Создать новый Next.js проект
2. Настроить базовую инфраструктуру
3. Мигрировать контексты
4. Постепенно переносить компоненты
5. Тестировать каждый этап
