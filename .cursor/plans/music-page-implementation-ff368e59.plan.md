<!-- ff368e59-8feb-4abf-8bf1-a6f28dfab0d5 62b5b566-5c66-497f-a053-bf9b4c8adc8d -->
# План реализации страницы музыки

## 1. Создание схемы базы данных в Supabase

Создать SQL скрипт `supabase-music-schema.sql` с таблицей `music_tracks`:

```sql
CREATE TABLE music_tracks (
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
  duration INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  order_position INTEGER DEFAULT 0
);
```

## 2. Создание сервиса для работы с музыкой

Создать `src/services/musicService.js` по аналогии с `articlesService.js`:

- Функция `getMusicTracks()` - получение всех композиций
- Использовать supabase client из `src/lib/supabase.js`
- Сортировка по `order_position`

## 3. Создание страницы MusicPage

Создать `src/pages/MusicPage.jsx`:

- Структура аналогична `ArticlesPage.jsx`
- Состояния: tracks, loading, error
- useEffect для загрузки данных через `getMusicTracks()`
- Grid layout для карточек композиций
- Использовать `useLanguage()` для локализации

## 4. Создание компонента MusicCard

Создать `src/components/MusicCard.jsx`:

- Принимает props: track (объект композиции)
- Отображает: название, автора, описание
- Встроенный HTML5 audio player:
  ```jsx
  <audio controls src={track.audio_url} style={{width: '100%'}} />
  ```

- Стилизация в едином стиле с другими карточками проекта

## 5. Обновление маршрутизации

В `src/App.jsx` заменить placeholder маршрут `/music`:

- Импортировать MusicPage
- Обернуть в AnimatedPage и Suspense

## 6. Добавление переводов

В `src/contexts/LanguageContext.jsx` добавить ключи:

- `music` - "Музыка" / "Music" / "Музыка"
- `composer` - "Композитор" / "Composer" / "Композитор"
- `duration` - "Длительность" / "Duration" / "Ұзақтығы"
- `listenNow` - "Слушать" / "Listen" / "Тыңдау"
- `noMusic` - "Композиций не найдено" / "No music found" / "Музыка табылмады"

## 7. Подготовка демо данных

Создать SQL скрипт с 6 примерами композиций (INSERT запросы) для демонстрации:

- Названия на трех языках
- Описания композиций
- Информация о композиторах
- Placeholder URL для аудио файлов (можно использовать публичные ссылки)

## Технические детали:

- Использовать существующие стили и компоненты проекта
- Адаптивный дизайн (grid с minmax)
- Анимации через framer-motion
- Обработка состояний loading/error
- Helmet для SEO

### To-dos

- [ ] Создать SQL схему для таблицы music_tracks в файле supabase-music-schema.sql
- [ ] Создать src/services/musicService.js с функциями для работы с Supabase
- [ ] Создать компонент src/components/MusicCard.jsx с audio плеером
- [ ] Создать страницу src/pages/MusicPage.jsx со списком композиций
- [ ] Обновить маршрут /music в src/App.jsx
- [ ] Добавить переводы в src/contexts/LanguageContext.jsx
- [ ] Создать SQL скрипт с 6 примерами композиций для демонстрации