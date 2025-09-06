import SearchSection from "./SearchSection";
import PlaceSlider from "./PlaceSlider";
import CategoryList from "./CategoryList";
import { useLanguage } from "../contexts/LanguageContext";

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div>
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
