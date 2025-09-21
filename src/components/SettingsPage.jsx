import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import AnimatedButton from "../components/AnimatedButton";

export default function SettingsPage() {
    const { language, changeLanguage, t } = useLanguage();
    const navigate = useNavigate();

    const [theme, setTheme] = useState("dark");
    const [fontSize, setFontSize] = useState("16");

    // Читаем сохранённые настройки при монтировании
    useEffect(() => {
        const savedTheme = localStorage.getItem("app_theme") || "dark";
        const savedFontSize = localStorage.getItem("app_font_size") || "16";
        setTheme(savedTheme);
        setFontSize(savedFontSize);
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

    // Обработчик сохранения настроек
    const saveSettings = () => {
        localStorage.setItem("app_theme", theme);
        localStorage.setItem("app_font_size", fontSize);
        applyTheme(theme);
        applyFontSize(fontSize);
        alert(t("settingsSaved") || "Настройки сохранены");
        navigate(-1); // Go back to previous page
    };

    // Обработчик смены языка
    const handleLanguageChange = (newLanguage) => {
        changeLanguage(newLanguage);
    };

    // Get language name for display
    const getLanguageName = (langCode) => {
        const languages = {
            ru: "Русский",
            en: "English",
            kz: "Қазақша",
        };
        return languages[langCode] || langCode;
    };

    // Get theme name for display
    const getThemeName = (themeValue) => {
        return themeValue === "light" ? "Светлая" : "Тёмная";
    };

    // Get font size description
    const getFontSizeDescription = (size) => {
        const sizes = {
            14: "Маленький",
            16: "Обычный",
            18: "Крупный",
            20: "Очень крупный",
        };
        return sizes[size] || `${size}px`;
    };

    return (
        <motion.div
            className="settings-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
            <Helmet>
                <title>{t("settings") || "Настройки"} - Apex Tourism</title>
            </Helmet>
            <motion.div
                className="settings-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.4,
                    delay: 0.1,
                    ease: [0.4, 0, 0.2, 1],
                }}
            >
                <div className="settings-header">
                    <h2>{t("settings")}</h2>
                    <AnimatedButton
                        className="icon-btn"
                        onClick={() => navigate(-1)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    >
                        {t("back") || "Назад"}
                    </AnimatedButton>
                </div>

                <div className="settings-content">
                    <div className="settings-section">
                        <div className="settings-card">
                            <h3>Основные настройки</h3>
                            <div className="settings-row">
                                <div className="form-group">
                                    <label htmlFor="language">
                                        {t("language")}
                                    </label>
                                    <select
                                        id="language"
                                        value={language}
                                        onChange={(e) =>
                                            handleLanguageChange(e.target.value)
                                        }
                                        className="settings-select"
                                    >
                                        <option value="ru">Русский</option>
                                        <option value="en">English</option>
                                        <option value="kz">Қазақша</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="theme">{t("theme")}</label>
                                    <select
                                        id="theme"
                                        value={theme}
                                        onChange={(e) =>
                                            setTheme(e.target.value)
                                        }
                                        className="settings-select"
                                    >
                                        <option value="dark">
                                            Тёмная (историческая)
                                        </option>
                                        <option value="light">Светлая</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="font">
                                        {t("fontSize")}
                                    </label>
                                    <select
                                        id="font"
                                        value={fontSize}
                                        onChange={(e) =>
                                            setFontSize(e.target.value)
                                        }
                                        className="settings-select"
                                    >
                                        <option value="14">Маленький</option>
                                        <option value="16">Обычный</option>
                                        <option value="18">Крупный</option>
                                        <option value="20">
                                            Очень крупный
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="settings-footer">
                    <AnimatedButton
                        className="btn"
                        onClick={saveSettings}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    >
                        {t("save")}
                    </AnimatedButton>
                </div>
            </motion.div>
        </motion.div>
    );
}
