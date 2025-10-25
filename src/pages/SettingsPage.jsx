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
        alert(t("settingsSaved"));
        navigate(-1); // Go back to previous page
    };

    // Обработчик смены языка
    const handleLanguageChange = (newLanguage) => {
        changeLanguage(newLanguage);
    };

    // Get language name for display
    const getLanguageName = (langCode) => {
        const languages = {
            ru: t("languageRussian"),
            en: t("languageEnglish"),
            kz: t("languageKazakh"),
        };
        return languages[langCode] || langCode;
    };

    // Get theme name for display
    const getThemeName = (themeValue) => {
        return themeValue === "light" ? t("themeLight") : t("themeDark");
    };

    // Get font size description
    const getFontSizeDescription = (size) => {
        const sizes = {
            14: t("fontSizeSmall"),
            16: t("fontSizeNormal"),
            18: t("fontSizeLarge"),
            20: t("fontSizeExtraLarge"),
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
                <title>{t("settings")} - Apex Tourism</title>
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
                        {t("back")}
                    </AnimatedButton>
                </div>

                <div className="settings-content">
                    <div className="settings-section">
                        <div className="settings-card">
                            <h3>{t("basicSettings")}</h3>
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
                                        <option value="ru">
                                            {t("languageRussian")}
                                        </option>
                                        <option value="en">
                                            {t("languageEnglish")}
                                        </option>
                                        <option value="kz">
                                            {t("languageKazakh")}
                                        </option>
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
                                            {t("themeDark")}
                                        </option>
                                        <option value="light">
                                            {t("themeLight")}
                                        </option>
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
                                        <option value="14">
                                            {t("fontSizeSmall")}
                                        </option>
                                        <option value="16">
                                            {t("fontSizeNormal")}
                                        </option>
                                        <option value="18">
                                            {t("fontSizeLarge")}
                                        </option>
                                        <option value="20">
                                            {t("fontSizeExtraLarge")}
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

            {/* Mobile Responsive Styles */}
            <style>{`
                @media (max-width: 768px) {
                    .settings-container {
                        padding: 20px 12px !important;
                        min-height: 60vh !important;
                    }
                    
                    .settings-form {
                        padding: 24px 20px 20px 20px !important;
                        gap: 16px !important;
                    }
                    
                    .settings-header {
                        margin-bottom: 12px !important;
                    }
                    
                    .settings-header h2 {
                        font-size: 1.3rem !important;
                    }
                    
                    .settings-content {
                        gap: 12px !important;
                    }
                    
                    .settings-card {
                        padding: 16px !important;
                    }
                    
                    .settings-card h3 {
                        font-size: 1.1rem !important;
                        margin-bottom: 12px !important;
                    }
                    
                    .settings-row {
                        gap: 12px !important;
                    }
                    
                    .form-group {
                        margin-bottom: 0 !important;
                    }
                    
                    .form-group label {
                        font-size: 0.95rem !important;
                        margin-bottom: 6px !important;
                    }
                    
                    .settings-select {
                        padding: 8px 10px !important;
                        font-size: 0.95rem !important;
                    }
                }
                
                @media (max-width: 480px) {
                    .settings-container {
                        padding: 16px 8px !important;
                        min-height: auto !important;
                    }
                    
                    .settings-form {
                        padding: 20px 16px 16px 16px !important;
                        gap: 12px !important;
                        border-radius: 12px !important;
                    }
                    
                    .settings-header {
                        margin-bottom: 8px !important;
                        flex-direction: row !important;
                    }
                    
                    .settings-header h2 {
                        font-size: 1.2rem !important;
                    }
                    
                    .settings-header .icon-btn {
                        padding: 6px 12px !important;
                        font-size: 0.9rem !important;
                    }
                    
                    .settings-card {
                        padding: 12px !important;
                    }
                    
                    .settings-card h3 {
                        font-size: 1rem !important;
                        margin-bottom: 10px !important;
                    }
                    
                    .settings-row {
                        gap: 10px !important;
                    }
                    
                    .form-group label {
                        font-size: 0.9rem !important;
                        margin-bottom: 4px !important;
                    }
                    
                    .settings-select {
                        padding: 7px 8px !important;
                        font-size: 0.9rem !important;
                    }
                    
                    .settings-footer .btn {
                        width: 100% !important;
                        padding: 10px 16px !important;
                        font-size: 0.95rem !important;
                    }
                }
            `}</style>
        </motion.div>
    );
}
