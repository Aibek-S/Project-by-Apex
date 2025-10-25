# Использование схемы базы данных в ChatBot

## 📊 Структура базы данных

### 1. Таблица `places` (Места)

```sql
- id (bigint, primary key)
- category_id (bigint, foreign key → categories.id)
- name_ru, name_en, name_kz (text)
- description_ru, description_en, description_kz (text)
- lat, lng (double precision)
- legends_ru, legends_en, legends_kz (text)
- inmap_url (text)
```

### 2. Таблица `tours` (Туры)

```sql
- id (serial, primary key)
- company (text)
- price (integer)
- instagram_url (text)
- name_ru, name_en, name_kz (text)
- description_ru, description_en, description_kz (text)
```

### 3. Таблица `categories` (Категории)

```sql
- id (bigint, primary key)
- name_ru, name_en, name_kz (text)
```

### 4. Таблица `tour_places` (Связь туры-места)

```sql
- id (serial, primary key)
- tour_id (integer, foreign key → tours.id)
- place_id (integer, foreign key → places.id)
- position (integer)
```

### 5. Таблица `users` (Пользователи)

```sql
- id (uuid, primary key, foreign key → auth.users.id)
- full_name (text)
- created_at, updated_at (timestamp)
```

---

## 🔧 Методы DataService

### Места (Places)

#### `getAllPlaces()`

Получает все места с информацией о категориях (JOIN с `categories`).

```javascript
const places = await dataService.getAllPlaces();
```

#### `getPlacesByCategory(categoryId)`

Получает места определенной категории.

```javascript
const places = await dataService.getPlacesByCategory(1);
```

#### `searchPlaces(query, language)`

Поиск мест по названию или описанию.

```javascript
const places = await dataService.searchPlaces("Шеркала", "ru");
```

#### `getPlaceById(placeId)`

Получить конкретное место по ID.

```javascript
const place = await dataService.getPlaceById(123);
```

#### `getPopularPlaces(limit)`

Получает первые N мест (так как поля rating нет).

```javascript
const popular = await dataService.getPopularPlaces(5);
```

#### `getPlacesWithLegends()`

Получает только места, у которых есть легенды.

```javascript
const placesWithLegends = await dataService.getPlacesWithLegends();
```

---

### Туры (Tours)

#### `getAllTours()`

Получает все туры с информацией о местах (JOIN с `tour_places` и `places`).

```javascript
const tours = await dataService.getAllTours();
```

Возвращаемый объект тура включает:

```javascript
{
  id: 1,
  name_ru: "Тур по Мангистау",
  company: "Mangystau Tour",
  price: 50000,
  tour_places: [
    {
      position: 1,
      places: {
        id: 1,
        name_ru: "Шеркала",
        name_en: "Sherkala",
        name_kz: "Шеркала"
      }
    },
    // ...
  ]
}
```

#### `getTourById(tourId)`

Получить конкретный тур по ID.

```javascript
const tour = await dataService.getTourById(1);
```

#### `getToursByCompany(companyName)`

Получить туры определенной компании.

```javascript
const tours = await dataService.getToursByCompany("Mangystau Tour");
```

---

### Категории (Categories)

#### `getAllCategories()`

Получает все категории.

```javascript
const categories = await dataService.getAllCategories();
```

#### `findCategoryByKeyword(keyword, language)`

Находит категорию по ключевому слову.

```javascript
const category = await dataService.findCategoryByKeyword("история", "ru");
// Вернет категорию с названием содержащим "история"
```

---

## 🤖 Интеграция с AI

### Автоматическое извлечение данных

Когда пользователь задает вопрос, система:

1. **Анализирует запрос** (`analyzeUserQuery`)
2. **Определяет тип данных** (места/туры/категории)
3. **Извлекает данные из БД**
4. **Форматирует для AI** (`formatPlacesForAI`, `formatToursForAI`)
5. **Передает в контекст AI**

### Пример работы:

#### Запрос: "Покажи исторические места"

1. Анализ: тип="places", категория="historical"
2. Поиск категории: `findCategoryByKeyword("истори", "ru")`
3. Получение мест: `getPlacesByCategory(category.id)`
4. Форматирование для AI:

```
Данные из базы данных:
1. Бекет-Ата: Подземная мечеть в меловой горе...
2. Шопан-Ата: Некрополь с древними мавзолеями...
3. Форт Шевченко: Исторический форт 19 века...
```

5. AI получает эти данные в контексте и отвечает

#### Запрос: "Какие туры есть?"

1. Анализ: тип="tours"
2. Получение туров: `getAllTours()`
3. Форматирование:

```
Данные из базы данных:
1. Тур по Мангистау (Mangystau Tour): Экскурсия по всем достопримечательностям... Места: Шеркала, Бозжыра, Тузбаир. Цена: 50000 тг
2. Сафари по степи (Adventure Kazakhstan): Путешествие по дикой природе... Места: Устюрт, Шеркала. Цена: 35000 тг
```

---

## 💡 Форматирование данных для AI

### `formatPlacesForAI(places, language)`

Форматирует массив мест в текст для AI:

```javascript
const formatted = dataService.formatPlacesForAI(places, "ru");
// "1. Шеркала: Удивительная гора в форме юрты...
//  2. Бозжыра: Белые скалы и каньоны..."
```

### `formatToursForAI(tours, language)`

Форматирует массив туров в текст для AI:

```javascript
const formatted = dataService.formatToursForAI(tours, "ru");
// "1. Тур по Мангистау (Mangystau Tour): Экскурсия... Места: Шеркала, Бозжыра. Цена: 50000 тг
//  2. Сафари (Adventure): Путешествие... Места: Устюрт. Цена: 35000 тг"
```

---

## 🔍 Ключевые слова для анализа

Система распознает следующие ключевые слова в запросах:

### Места:

- **Русский**: место, места, достопримечательност, посетить
- **Казахский**: орын, көрікті
- **Английский**: place, attraction

### Туры:

- **Русский**: тур, туры, экскурсия, маршрут
- **Казахский**: тур
- **Английский**: tour, route

### Категории:

- **Популярные**: популярн, известн, лучш, popular, best, top
- **Исторические**: истори, история, historical, тарихи
- **Природные**: природ, nature, табиғи, пейзаж

---

## 📈 Производительность

### Оптимизация запросов:

1. **JOIN запросы** - используются для получения связанных данных за один запрос
2. **Индексы** - на полях `lat`, `lng` для быстрого поиска по координатам
3. **Limit** - ограничение количества результатов
4. **Кэширование** - данные кэшируются на время обработки запроса

### Примеры JOIN запросов:

```sql
-- Места с категориями
SELECT places.*, categories.*
FROM places
LEFT JOIN categories ON places.category_id = categories.id

-- Туры с местами
SELECT tours.*, tour_places.*, places.*
FROM tours
LEFT JOIN tour_places ON tours.id = tour_places.tour_id
LEFT JOIN places ON tour_places.place_id = places.id
ORDER BY tour_places.position
```

---

## ✅ Преимущества текущей реализации

1. ✅ **Правильные названия полей** - используется `name_*` вместо `title_*`
2. ✅ **Foreign Keys** - правильная работа с `category_id` и связанными таблицами
3. ✅ **JOIN запросы** - эффективное получение связанных данных
4. ✅ **Многоязычность** - поддержка ru/kz/en на уровне БД
5. ✅ **Легенды** - отдельные поля для легенд на каждом языке
6. ✅ **Геолокация** - поля `lat`, `lng` для карты
7. ✅ **Связь тур-места** - таблица `tour_places` с позиционированием
8. ✅ **Instagram интеграция** - поле `instagram_url` для туров

---

## 🎯 Резюме

Вся система теперь **точно соответствует реальной схеме базы данных**:

- Используются правильные названия полей (`name_*`, а не `title_*`)
- Учитываются foreign keys (`category_id`)
- JOIN запросы для получения связанных данных
- Поддержка всех языков на уровне БД
- Эффективная интеграция с AI чат-ботом

