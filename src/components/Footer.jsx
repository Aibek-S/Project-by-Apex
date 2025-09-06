// Подвал сайта: копирайт и общая информация
export default function Footer() {
  // Текущий год для копирайта
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="inner">
        <span className="muted">© {year} Мангистау</span>
      </div>
    </footer>
  );
}
