import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

// Переводы интерфейса
const translations = {
  ru: {
    home: "Главная",
    categories: "Категории",
    places: "Места",
    back: "Назад",
    loading: "Загрузка...",
    error: "Ошибка загрузки",
    noData: "Нет данных",
    settings: "Настройки",
    language: "Язык",
    theme: "Тема",
    fontSize: "Размер шрифта",
    save: "Сохранить",
    cancel: "Отмена",
    explore: "Туризм в Мангистау",
    selectCategory: "Выберите категорию для просмотра мест",
    details: "Подробнее",
    search: "Поиск мест",
    searchPlaceholder: "Введите название места или описание...",
    searchResults: "Результаты поиска",
    noSearchResults: "Ничего не найдено по вашему запросу",
    featuredPlaces: "Рекомендуемые места",
    previous: "Предыдущее",
    next: "Следующее",
    slide: "Слайд",
    map: "Карта",
    placesOnMap: "Мест на карте",
    showOnMap: "Показать на карте",
    showAllPlaces: "Показать все места",
    settingsSaved: "Настройки сохранены",
    Move: "Перейти",
  },
  en: {
    home: "Home",
    categories: "Categories",
    places: "Places",
    back: "Back",
    loading: "Loading...",
    error: "Loading error",
    noData: "No data",
    settings: "Settings",
    language: "Language",
    theme: "Theme",
    fontSize: "Font size",
    save: "Save",
    cancel: "Cancel",
    explore: "Tourism in Mangistau",
    selectCategory: "Select a category to view places",
    details: "Details",
    search: "Search Places",
    searchPlaceholder: "Enter place name or description...",
    searchResults: "Search Results",
    noSearchResults: "No results found for your query",
    featuredPlaces: "Featured Places",
    previous: "Previous",
    next: "Next",
    slide: "Slide",
    map: "Map",
    placesOnMap: "Places on map",
    showOnMap: "Show on map",
    showAllPlaces: "Show all places",
    settingsSaved: "Settings saved",
    Move: "Open",
  },
  kz: {
    home: "Басты бет",
    categories: "Санаттар",
    places: "Орындар",
    back: "Артқа",
    loading: "Жүктелуде...",
    error: "Жүктеу қатесі",
    noData: "Деректер жоқ",
    settings: "Баптаулар",
    language: "Тіл",
    theme: "Тақырып",
    fontSize: "Қаріп өлшемі",
    save: "Сақтау",
    cancel: "Болдырмау",
    explore: "Манғыстаудағы туризм",
    selectCategory: "Орындарды көру үшін санатты таңдаңыз",
    details: "Толығырақ",
    search: "Орындарды іздеу",
    searchPlaceholder: "Орын атауын немесе сипаттамасын енгізіңіз...",
    searchResults: "Іздеу нәтижелері",
    noSearchResults: "Сұрауыңыз бойынша ештеңе табылмады",
    featuredPlaces: "Ұсынылатын орындар",
    previous: "Алдыңғы",
    next: "Келесі",
    slide: "Слайд",
    map: "Карта",
    placesOnMap: "Картадағы орындар",
    showOnMap: "Картада көрсету",
    showAllPlaces: "Барлық орындарды көрсету",
    settingsSaved: "Баптаулар сақталды",
    Move: "Ашу",
  },
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("ru");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("app_language") || "ru";
    setLanguage(savedLanguage);
  }, []);

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem("app_language", newLanguage);
  };

  const t = (key) => translations[language][key] || key;

  // Функция для получения названия поля в зависимости от языка
  const getLocalizedField = (obj, fieldName) => {
    if (!obj) return "";
    const localizedField = `${fieldName}_${language}`;
    return obj[localizedField] || obj[`${fieldName}_ru`] || "";
  };

  const value = {
    language,
    changeLanguage,
    t,
    getLocalizedField,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}