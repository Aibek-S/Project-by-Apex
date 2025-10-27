-- Таблица для хранения музыкальных композиций Мангистау
CREATE TABLE IF NOT EXISTS music_tracks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_ru TEXT NOT NULL,
  title_kz TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_ru TEXT,
  description_kz TEXT,
  description_en TEXT,
  composer_ru TEXT NOT NULL,
  composer_kz TEXT NOT NULL,
  composer_en TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  duration INTEGER, -- длительность в секундах
  created_at TIMESTAMP DEFAULT NOW(),
  order_position INTEGER DEFAULT 0
);

-- Индекс для быстрой сортировки
CREATE INDEX IF NOT EXISTS idx_music_tracks_order ON music_tracks(order_position);

-- Добавление комментариев к таблице
COMMENT ON TABLE music_tracks IS 'Музыкальные композиции и кюй Мангистау';
COMMENT ON COLUMN music_tracks.duration IS 'Длительность композиции в секундах';
COMMENT ON COLUMN music_tracks.order_position IS 'Позиция для сортировки (0 = первая)';

