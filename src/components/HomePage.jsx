import { Helmet } from "react-helmet-async";
import SearchSection from "./SearchSection";
import PlaceSlider from "./PlaceSlider";
import CategoryList from "./CategoryList";
import { useLanguage } from "../contexts/LanguageContext";

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div>
      <Helmet>
        <title>{t("home") || "Главная - Apex Tourism"}</title>
      </Helmet>
      {/* Секция поиска */}
      <SearchSection />

      {/* Слайдер с рекомендуемыми местами */}
      <PlaceSlider />

      {/* Разделитель */}
      <div
        style={{
          borderTop: "1px solid var(--border)",
          margin: "32px 0",
          paddingTop: "32px",
        }}
      >
        {/* Список категорий */}
        <CategoryList />
      </div>
    </div>
  );
}