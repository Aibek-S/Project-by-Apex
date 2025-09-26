// Подвал сайта: копирайт и общая информация
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  // Текущий год для копирайта
  const year = new Date().getFullYear();
  
  return (
    <motion.footer 
      className="site-footer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="inner" style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        padding: '16px 0'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px'
        }}>
          <img 
            src="/favicon.ico" 
            alt="Apex Tourism Logo" 
            style={{ width: '24px', height: '24px' }}
          />
          <span className="muted">© {year} Apex Tourism</span>
        </div>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: '24px',
          flexWrap: 'wrap'
        }}>
          <span className="muted">{t("phone")}: +7 775 893 54 07</span>
          <span className="muted">{t("instagram")}: @byapexco</span>
          <Link 
            to="/about" 
            style={{ 
              color: 'var(--primary)', 
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            {t("about")}
          </Link>
        </div>
      </div>
    </motion.footer>
  );
}