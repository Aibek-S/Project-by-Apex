import { supabase } from "../lib/supabase";

/**
 * Сервис для работы со статьями
 */

// Получить все статьи с пагинацией
export async function getArticles({ limit = 50, offset = 0 } = {}) {
    try {
        let query = supabase
            .from("articles")
            .select("*")
            .order("published_at", { ascending: false });

        if (limit) {
            query = query.range(offset, offset + limit - 1);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error("Error fetching articles:", error);
        throw error;
    }
}

// Получить статью по slug
export async function getArticleBySlug(slug) {
    try {
        const { data, error } = await supabase
            .from("articles")
            .select(
                `
                *,
                article_images (
                    id,
                    url,
                    caption_ru,
                    caption_en,
                    caption_kz,
                    position
                )
            `
            )
            .eq("slug", slug)
            .single();

        if (error) throw error;

        // Увеличиваем счетчик просмотров
        if (data) {
            await incrementArticleViews(slug);
        }

        return data;
    } catch (error) {
        console.error("Error fetching article:", error);
        throw error;
    }
}

// Получить статьи по категории
export async function getArticlesByCategory(category, language = "ru") {
    try {
        const categoryField = `category_${language}`;
        const { data, error } = await supabase
            .from("articles")
            .select("*")
            .eq(categoryField, category)
            .order("published_at", { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error("Error fetching articles by category:", error);
        throw error;
    }
}

// Получить похожие статьи (по той же категории)
export async function getSimilarArticles(
    currentSlug,
    category,
    language = "ru",
    limit = 3
) {
    try {
        const categoryField = `category_${language}`;
        const { data, error } = await supabase
            .from("articles")
            .select("*")
            .eq(categoryField, category)
            .neq("slug", currentSlug)
            .order("published_at", { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error("Error fetching similar articles:", error);
        throw error;
    }
}

// Увеличить счетчик просмотров
async function incrementArticleViews(slug) {
    try {
        const { error } = await supabase.rpc("increment_article_views", {
            article_slug: slug,
        });

        if (error) throw error;
    } catch (error) {
        console.error("Error incrementing views:", error);
    }
}

// Поиск статей
export async function searchArticles(query, language = "ru") {
    try {
        const titleField = `title_${language}`;
        const excerptField = `excerpt_${language}`;

        const { data, error } = await supabase
            .from("articles")
            .select("*")
            .or(
                `${titleField}.ilike.%${query}%,${excerptField}.ilike.%${query}%`
            )
            .order("published_at", { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error("Error searching articles:", error);
        throw error;
    }
}

// Получить все уникальные категории
export async function getCategories(language = "ru") {
    try {
        const categoryField = `category_${language}`;
        const { data, error } = await supabase
            .from("articles")
            .select(categoryField)
            .order(categoryField);

        if (error) throw error;

        // Получаем уникальные категории
        const uniqueCategories = [
            ...new Set(data.map((item) => item[categoryField])),
        ];
        return uniqueCategories;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
}
