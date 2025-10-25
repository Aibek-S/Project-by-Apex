import { supabase } from "../lib/supabase.js";

/**
 * Data Service для извлечения данных из базы данных
 * Используется чат-ботом для получения информации о местах и турах
 */
export class DataService {
    /**
     * Получить все места из базы данных
     * @returns {Promise<Array>} Массив мест
     */
    async getAllPlaces() {
        try {
            const { data, error } = await supabase
                .from("places")
                .select(
                    `
                    *,
                    categories (
                        id,
                        name_ru,
                        name_en,
                        name_kz
                    )
                `
                )
                .order("name_ru");

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error("Error fetching places:", error);
            return [];
        }
    }

    /**
     * Найти места по категории
     * @param {number} categoryId - ID категории места
     * @returns {Promise<Array>} Массив мест
     */
    async getPlacesByCategory(categoryId) {
        try {
            const { data, error } = await supabase
                .from("places")
                .select(
                    `
                    *,
                    categories (
                        id,
                        name_ru,
                        name_en,
                        name_kz
                    )
                `
                )
                .eq("category_id", categoryId)
                .order("name_ru");

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error("Error fetching places by category:", error);
            return [];
        }
    }

    /**
     * Поиск мест по ключевым словам
     * @param {string} query - Поисковый запрос
     * @param {string} language - Язык поиска
     * @returns {Promise<Array>} Массив мест
     */
    async searchPlaces(query, language = "ru") {
        try {
            const nameField = `name_${language}`;
            const descField = `description_${language}`;

            const { data, error } = await supabase
                .from("places")
                .select("*")
                .or(
                    `${nameField}.ilike.%${query}%,${descField}.ilike.%${query}%`
                );

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error("Error searching places:", error);
            return [];
        }
    }

    /**
     * Получить место по ID
     * @param {string} placeId - ID места
     * @returns {Promise<Object|null>} Место
     */
    async getPlaceById(placeId) {
        try {
            const { data, error } = await supabase
                .from("places")
                .select("*")
                .eq("id", placeId)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error("Error fetching place by ID:", error);
            return null;
        }
    }

    /**
     * Получить все туры с местами
     * @returns {Promise<Array>} Массив туров
     */
    async getAllTours() {
        try {
            const { data, error } = await supabase
                .from("tours")
                .select(
                    `
                    *,
                    tour_places (
                        position,
                        places (
                            id,
                            name_ru,
                            name_en,
                            name_kz
                        )
                    )
                `
                )
                .order("name_ru");

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error("Error fetching tours:", error);
            return [];
        }
    }

    /**
     * Получить тур по ID
     * @param {string} tourId - ID тура
     * @returns {Promise<Object|null>} Тур
     */
    async getTourById(tourId) {
        try {
            const { data, error } = await supabase
                .from("tours")
                .select("*")
                .eq("id", tourId)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error("Error fetching tour by ID:", error);
            return null;
        }
    }

    /**
     * Получить первые N мест (так как рейтинга нет в БД)
     * @param {number} limit - Количество мест
     * @returns {Promise<Array>} Массив мест
     */
    async getPopularPlaces(limit = 5) {
        try {
            const { data, error } = await supabase
                .from("places")
                .select(
                    `
                    *,
                    categories (
                        id,
                        name_ru,
                        name_en,
                        name_kz
                    )
                `
                )
                .order("id", { ascending: true })
                .limit(limit);

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error("Error fetching popular places:", error);
            return [];
        }
    }

    /**
     * Форматировать данные о местах для AI контекста
     * @param {Array} places - Массив мест
     * @param {string} language - Язык
     * @returns {string} Форматированная строка
     */
    formatPlacesForAI(places, language = "ru") {
        if (!places || places.length === 0) {
            return "Нет доступных мест.";
        }

        return places
            .map((place, index) => {
                const name = place[`name_${language}`] || place.name_ru;
                const desc =
                    place[`description_${language}`] || place.description_ru;
                const legends =
                    place[`legends_${language}`] || place.legends_ru;

                // Категория
                const categoryName = place.categories
                    ? place.categories[`name_${language}`] ||
                      place.categories.name_ru
                    : "Неизвестная категория";

                // Координаты
                const coords =
                    place.lat && place.lng
                        ? `(${place.lat.toFixed(4)}, ${place.lng.toFixed(4)})`
                        : "";

                // Базовая информация
                let result = `${index + 1}. **${name}** [${categoryName}] ${coords}\n`;

                // Описание
                if (desc) {
                    result += `   Описание: ${desc}\n`;
                }

                // Легенды
                if (legends) {
                    result += `   Легенды: ${legends}\n`;
                }

                return result;
            })
            .join("\n");
    }

    /**
     * Форматировать данные о турах для AI контекста
     * @param {Array} tours - Массив туров
     * @param {string} language - Язык
     * @returns {string} Форматированная строка
     */
    formatToursForAI(tours, language = "ru") {
        if (!tours || tours.length === 0) {
            return "Нет доступных туров.";
        }

        return tours
            .map((tour, index) => {
                const name = tour[`name_${language}`] || tour.name_ru;
                const desc =
                    tour[`description_${language}`] || tour.description_ru;
                const price = tour.price
                    ? `${tour.price} тг`
                    : "Цена не указана";
                const company = tour.company || "";

                // Места в туре
                let placesText = "";
                if (tour.tour_places && tour.tour_places.length > 0) {
                    const placeNames = tour.tour_places
                        .sort((a, b) => a.position - b.position)
                        .map(
                            (tp) =>
                                tp.places[`name_${language}`] ||
                                tp.places.name_ru
                        )
                        .join(", ");
                    placesText = `. Места: ${placeNames}`;
                }

                return `${index + 1}. ${name} (${company}): ${desc?.substring(0, 100)}...${placesText} Цена: ${price}`;
            })
            .join("\n");
    }

    /**
     * Получить все категории
     * @returns {Promise<Array>} Массив категорий
     */
    async getAllCategories() {
        try {
            const { data, error } = await supabase
                .from("categories")
                .select("*")
                .order("name_ru");

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error("Error fetching categories:", error);
            return [];
        }
    }

    /**
     * Найти категорию по названию (для поиска по ключевым словам)
     * @param {string} keyword - Ключевое слово
     * @param {string} language - Язык
     * @returns {Promise<Object|null>} Категория
     */
    async findCategoryByKeyword(keyword, language = "ru") {
        try {
            const nameField = `name_${language}`;
            const { data, error } = await supabase
                .from("categories")
                .select("*")
                .ilike(nameField, `%${keyword}%`)
                .limit(1)
                .single();

            if (error) return null;
            return data;
        } catch (error) {
            console.error("Error finding category:", error);
            return null;
        }
    }

    /**
     * Получить туры по компании
     * @param {string} companyName - Название компании
     * @returns {Promise<Array>} Массив туров
     */
    async getToursByCompany(companyName) {
        try {
            const { data, error } = await supabase
                .from("tours")
                .select(
                    `
                    *,
                    tour_places (
                        position,
                        places (
                            id,
                            name_ru,
                            name_en,
                            name_kz
                        )
                    )
                `
                )
                .ilike("company", `%${companyName}%`)
                .order("name_ru");

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error("Error fetching tours by company:", error);
            return [];
        }
    }

    /**
     * Получить места с легендами
     * @returns {Promise<Array>} Массив мест с легендами
     */
    async getPlacesWithLegends() {
        try {
            const { data, error } = await supabase
                .from("places")
                .select(
                    `
                    *,
                    categories (
                        id,
                        name_ru,
                        name_en,
                        name_kz
                    )
                `
                )
                .not("legends_ru", "is", null)
                .order("name_ru");

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error("Error fetching places with legends:", error);
            return [];
        }
    }

    /**
     * Форматировать категорию для AI
     * @param {Object} category - Категория
     * @param {string} language - Язык
     * @returns {string} Форматированная строка
     */
    formatCategoryForAI(category, language = "ru") {
        if (!category) return "";
        return category[`name_${language}`] || category.name_ru;
    }
}

// Создать singleton instance
export const dataService = new DataService();
