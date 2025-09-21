// Подвал сайта: копирайт и общая информация
import { motion } from "framer-motion";

export default function Footer() {
  // Текущий год для копирайта
  const year = new Date().getFullYear();
  
  return (
    <motion.footer 
      className="site-footer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="inner">
        <span className="muted">© {year} Мангистау</span>
      </div>
    </motion.footer>
  );
}