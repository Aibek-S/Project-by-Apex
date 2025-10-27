-- Схема базы данных для статей
-- Создайте эту таблицу в Supabase SQL Editor

-- Таблица статей
CREATE TABLE IF NOT EXISTS articles (
    id SERIAL PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title_ru TEXT NOT NULL,
    title_en TEXT NOT NULL,
    title_kz TEXT NOT NULL,
    excerpt_ru TEXT,
    excerpt_en TEXT,
    excerpt_kz TEXT,
    content_ru TEXT NOT NULL,
    content_en TEXT NOT NULL,
    content_kz TEXT NOT NULL,
    category_ru TEXT NOT NULL,
    category_en TEXT NOT NULL,
    category_kz TEXT NOT NULL,
    cover_image TEXT, -- URL основного изображения статьи
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    views INTEGER DEFAULT 0,
    author TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица изображений для статей (дополнительные изображения)
CREATE TABLE IF NOT EXISTS article_images (
    id SERIAL PRIMARY KEY,
    article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    caption_ru TEXT,
    caption_en TEXT,
    caption_kz TEXT,
    position INTEGER DEFAULT 0, -- порядок отображения
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы для оптимизации
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category_ru);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_article_images_article_id ON article_images(article_id);

-- Row Level Security (RLS)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_images ENABLE ROW LEVEL SECURITY;

-- Политики доступа: все могут читать
CREATE POLICY "Articles are viewable by everyone"
    ON articles FOR SELECT
    USING (true);

CREATE POLICY "Article images are viewable by everyone"
    ON article_images FOR SELECT
    USING (true);

-- Только аутентифицированные пользователи могут создавать/изменять
-- (можно настроить более детально позже)
CREATE POLICY "Authenticated users can insert articles"
    ON articles FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update articles"
    ON articles FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete articles"
    ON articles FOR DELETE
    USING (auth.role() = 'authenticated');

-- Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггер для автоматического обновления updated_at
CREATE TRIGGER update_articles_updated_at
    BEFORE UPDATE ON articles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Функция для увеличения счетчика просмотров
CREATE OR REPLACE FUNCTION increment_article_views(article_slug TEXT)
RETURNS void AS $$
BEGIN
    UPDATE articles
    SET views = views + 1
    WHERE slug = article_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Комментарии к таблицам
COMMENT ON TABLE articles IS 'Таблица для хранения статей о Мангистау';
COMMENT ON TABLE article_images IS 'Дополнительные изображения для статей';

-- Примеры категорий для статей:
-- 'history' - История и культура
-- 'nature' - Природа и геология
-- 'guide' - Путеводители и советы
-- 'legends' - Легенды и истории
-- 'ecology' - Экология и устойчивый туризм

