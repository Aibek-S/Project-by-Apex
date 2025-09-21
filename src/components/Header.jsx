// Шапка сайта: логотип и навигация
import { NavLink, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  // Языковой контекст
  const { language, changeLanguage, t } = useLanguage();
  const { user } = useAuth();

  // Локальное состояние настроек
  const [theme, setTheme] = useState("dark");
  const [fontSize, setFontSize] = useState("16");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Читаем сохранённые настройки при монтировании
  useEffect(() => {
    const savedTheme = localStorage.getItem("app_theme") || "dark";
    const savedFontSize = localStorage.getItem("app_font_size") || "16";
    setTheme(savedTheme);
    setFontSize(savedFontSize);
    applyTheme(savedTheme);
    applyFontSize(savedFontSize);
  }, []);

  // Применяем тему, меняя класс на body
  const applyTheme = (value) => {
    if (value === "light") {
      document.body.classList.add("theme-light");
    } else {
      document.body.classList.remove("theme-light");
    }
  };

  // Применяем размер шрифта через корневую переменную
  const applyFontSize = (value) => {
    document.documentElement.style.setProperty(
      "--base-font-size",
      `${value}px`
    );
  };

  // Обработчик смены языка
  const handleLanguageChange = (newLanguage) => {
    changeLanguage(newLanguage);
  };
  
  // Обработчик для предотвращения закрытия меню при клике внутри
  const handleMenuClick = (e) => {
    e.stopPropagation();
  };
  
  // Обработчик для закрытия меню при клике вне его
  const handleOutsideClick = (e) => {
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };
  
  // Добавляем/удаляем класс при открытии/закрытии меню
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add('mobile-nav-open');
      document.addEventListener('click', handleOutsideClick);
      // Предотвращаем прокрутку фона при открытом меню
      document.body.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('mobile-nav-open');
      document.removeEventListener('click', handleOutsideClick);
      // Восстанавливаем прокрутку
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.classList.remove('mobile-nav-open');
      document.removeEventListener('click', handleOutsideClick);
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);
  
  // Mobile menu variants for framer-motion
  const mobileMenuVariants = {
    closed: {
      x: "-100%",
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    open: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };
  
  return (
    // Контейнер шапки
    <header className="site-header">
      <div className="inner">
        {/* Логотип/название — ссылка на главную */}
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <strong>{t("explore")}</strong>
        </Link>
        
        {/* Гамбургер меню для мобильных устройств */}
        <div 
          className="mobile-menu-toggle" 
          onClick={(e) => {
            e.stopPropagation();
            setMobileMenuOpen(!mobileMenuOpen);
          }}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
        
        {/* Навигация для десктопа */}
        <nav className="desktop-nav">
          <NavLink to="/">{t("home")}</NavLink>
          <NavLink to="/tours">{t("tours") || "Tours"}</NavLink>
          <NavLink to="/map">{t("map") || "Карта"}</NavLink>
          {user ? (
            <NavLink to="/profile">Профиль</NavLink>
          ) : (
            <>
              <NavLink to="/login">Вход</NavLink>
              <NavLink to="/signup">Регистрация</NavLink>
            </>
          )}
          <NavLink to="/settings">{t("settings")}</NavLink>
        </nav>
        
        {/* Мобильное меню */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav 
              className="mobile-nav"
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              onClick={handleMenuClick}
            >
              <NavLink to="/" onClick={() => setMobileMenuOpen(false)}>{t("home")}</NavLink>
              <NavLink to="/tours" onClick={() => setMobileMenuOpen(false)}>{t("tours") || "Tours"}</NavLink>
              <NavLink to="/map" onClick={() => setMobileMenuOpen(false)}>{t("map") || "Карта"}</NavLink>
              {user ? (
                <NavLink to="/profile" onClick={() => setMobileMenuOpen(false)}>Профиль</NavLink>
              ) : (
                <>
                  <NavLink to="/login" onClick={() => setMobileMenuOpen(false)}>Вход</NavLink>
                  <NavLink to="/signup" onClick={() => setMobileMenuOpen(false)}>Регистрация</NavLink>
                </>
              )}
              <NavLink to="/settings" onClick={() => setMobileMenuOpen(false)}>{t("settings")}</NavLink>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
