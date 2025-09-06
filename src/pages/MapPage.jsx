import { useEffect, useMemo, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link, useSearchParams } from 'react-router-dom';
import L from 'leaflet';
import { useMapPlaces, getImageUrl } from '../hooks/useSupabase';
import { useLanguage } from '../contexts/LanguageContext';

// Импорт стилей Leaflet
import 'leaflet/dist/leaflet.css';

// Фикс иконок Leaflet в Vite
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Создание кастомной иконки маркера - единый стиль для всех мест
const createCustomIcon = () => {
  return L.divIcon({
    className: 'custom-marker primary-color',
    html: `<div class="marker-pin">
             <div class="marker-icon">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                 <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
               </svg>
             </div>
           </div>`,
    iconSize: [30, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -40]
  });
};

// Создание кастомной иконки маркера для выделенного места
const createHighlightedIcon = () => {
  return L.divIcon({
    className: 'custom-marker highlighted',
    html: `<div class="marker-pin">
             <div class="marker-icon">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                 <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
               </svg>
             </div>
           </div>`,
    iconSize: [36, 48],
    iconAnchor: [18, 48],
    popupAnchor: [0, -48]
  });
};

// Настройка иконок маркеров
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function MapPage() {
  const { places, loading, error } = useMapPlaces();
  const { language, getLocalizedField, t } = useLanguage();
  const [searchParams] = useSearchParams();
  const mapRef = useRef();
  
  // Получаем ID места из параметров URL
  const placeId = searchParams.get('place');
  
  // Проверка темы (тёмная по умолчанию)
  const [isDarkTheme, setIsDarkTheme] = useState(!document.body.classList.contains('theme-light'));

  // Отслеживаем изменения темы
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkTheme(!document.body.classList.contains('theme-light'));
    });
    
    observer.observe(document.body, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });
    
    return () => observer.disconnect();
  }, []);

  // Границы региона Мангистау
  const mangistauBounds = useMemo(() => [
    [41.8, 50.0], // юго-западный угол
    [46.8, 56.0]  // северо-восточный угол
  ], []);

  // Центр карты (примерно центр Мангистау)
  const mapCenter = useMemo(() => [44.3, 53.0], []);

  // Фокус на конкретном месте, если указано
  useEffect(() => {
    if (placeId && mapRef.current && places.length > 0) {
      const place = places.find(p => p.id === parseInt(placeId));
      if (place && place.lat && place.lng) {
        mapRef.current.setView([place.lat, place.lng], 13);
      }
    }
  }, [placeId, places]);

  // Обновление заголовка страницы
  useEffect(() => {
    document.title = `${t('map') || 'Карта'} - Мангистау`;
    return () => {
      document.title = 'Мангистау';
    };
  }, [language, t]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: 'var(--text)'
      }}>
        {t('loading') || 'Загрузка карты...'}
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        gap: '16px'
      }}>
        <p style={{ color: 'var(--primary)', fontSize: '18px' }}>
          {t('error')}: {error}
        </p>
        <Link to="/" className="btn">
          {t('back') || 'На главную'}
        </Link>
      </div>
    );
  }

  // Функция получения имени места на текущем языке
  const getPlaceName = (place) => {
    return getLocalizedField(place, 'name');
  };

  return (
    <div style={{ 
      height: '100vh', 
      width: '100%',
      backgroundColor: isDarkTheme ? '#1a120b' : '#ffffff'
    }}>
      <MapContainer
        center={mapCenter}
        zoom={8}
        style={{ height: '100%', width: '100%' }}
        maxBounds={mangistauBounds}
        maxBoundsViscosity={1.0}
        minZoom={7}
        maxZoom={18}
        ref={mapRef}
      >
        {/* Адаптивные тайлы в зависимости от темы */}
        {isDarkTheme ? (
          // Темная тема - картографический стиль
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
        ) : (
          // Светлая тема - стандартный OSM
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        )}

        {/* Маркеры мест */}
        {places.map((place) => {
          // Проверяем наличие координат
          if (!place.lat || !place.lng) return null;

          // Используем выделенную иконку для указанного места
          const isHighlighted = placeId && place.id === parseInt(placeId);
          const markerIcon = isHighlighted ? createHighlightedIcon() : createCustomIcon();

          return (
            <Marker
              key={place.id}
              position={[place.lat, place.lng]}
              icon={markerIcon}
            >
              <Popup
                maxWidth={300}
                className={`custom-popup ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}
              >
                <div style={{ 
                  padding: '8px',
                  fontFamily: 'inherit',
                  backgroundColor: isDarkTheme ? 'var(--card)' : '#ffffff',
                  color: isDarkTheme ? 'var(--text)' : '#2a1f1a'
                }}>
                  {/* Название места */}
                  <h3 style={{ 
                    margin: '0 0 12px 0',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: isDarkTheme ? 'var(--text)' : '#2a1f1a'
                  }}>
                    {getPlaceName(place)}
                  </h3>

                  {/* Категория */}
                  {place.categories && (
                    <p style={{ 
                      margin: '0 0 12px 0',
                      fontSize: '14px',
                      color: isDarkTheme ? 'var(--muted)' : '#6b5a4c',
                      fontStyle: 'italic'
                    }}>
                      {getLocalizedField(place.categories, 'name')}
                    </p>
                  )}

                  {/* Изображение */}
                  {place.image && (
                    <div style={{ marginBottom: '12px' }}>
                      <img
                        src={getImageUrl(place.image)}
                        alt={getPlaceName(place)}
                        loading="lazy"
                        style={{
                          width: '100%',
                          maxHeight: '150px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          border: `1px solid ${isDarkTheme ? 'var(--border)' : '#d9cfc6'}`
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  {/* Кнопка "Подробнее" */}
                  <Link
                    to={`/place/${place.id}`}
                    className="btn"
                    style={{
                      display: 'inline-block',
                      padding: '8px 16px',
                      backgroundColor: isDarkTheme ? 'var(--primary)' : '#c49a6c',
                      color: '#1a120b',
                      textDecoration: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      textAlign: 'center',
                      transition: 'background-color 0.2s ease'
                    }}
                  >
                    {t('details') || 'Подробнее'}
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Информация о количестве мест */}
      <div style={{
        position: 'absolute',
        top: '80px',
        right: '10px',
        background: isDarkTheme ? 'var(--card)' : '#ffffff',
        border: `1px solid ${isDarkTheme ? 'var(--border)' : '#d9cfc6'}`,
        borderRadius: '6px',
        padding: '8px 12px',
        fontSize: '14px',
        color: isDarkTheme ? 'var(--text)' : '#2a1f1a',
        zIndex: 1000,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        {t('placesOnMap') || 'Мест на карте'}: {places.length}
      </div>
      
      {/* Кнопка возврата к обзору карты */}
      <div style={{
        position: 'absolute',
        top: '80px',
        left: '10px',
        zIndex: 1000
      }}>
        <Link
          to="/map"
          className="btn"
          style={{
            display: 'inline-block',
            padding: '8px 12px',
            backgroundColor: isDarkTheme ? 'var(--card)' : '#ffffff',
            color: isDarkTheme ? 'var(--text)' : '#2a1f1a',
            textDecoration: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            border: `1px solid ${isDarkTheme ? 'var(--border)' : '#d9cfc6'}`,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          {t('showAllPlaces') || 'Показать все места'}
        </Link>
      </div>
    </div>
  );
}