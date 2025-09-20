import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PlaceDetail from './PlaceDetail';
import { LanguageProvider } from '../contexts/LanguageContext';
import { AuthProvider } from '../contexts/AuthContext';
import { vi } from 'vitest';

// Mock FeedbackSection to avoid auth context issues
vi.mock('./FeedbackSection', () => ({
  default: () => <div data-testid="feedback-section">Feedback Section</div>
}));

// Mock useParams
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useParams: () => ({ id: '1' })
  };
});

describe('PlaceDetail - Flexible Photo Handling', () => {
  test('handles single photo correctly', () => {
    // Mock the usePlace hook with single photo
    vi.mock('../hooks/useSupabase', async (importOriginal) => {
      const actual = await importOriginal();
      return {
        ...actual,
        usePlace: () => ({
          place: {
            id: 1,
            name_ru: 'Тестовое место',
            name_en: 'Test Place',
            name_kz: 'Тест орын',
            description_ru: 'Описание тестового места',
            description_en: 'Description of test place',
            description_kz: 'Тест орынының сипаттамасы',
            image: 'main-image.jpg',
            place_photos: [
              { id: 1, url: 'https://example.com/photo1.jpg' }
            ]
          },
          loading: false,
          error: null
        }),
        getImageUrl: (image) => `https://storage.example.com/${image}`
      };
    });

    render(
      <BrowserRouter>
        <AuthProvider>
          <LanguageProvider>
            <PlaceDetail />
          </LanguageProvider>
        </AuthProvider>
      </BrowserRouter>
    );
    
    // Check that only main image is displayed (no thumbnails)
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(1);
    expect(screen.getByAltText('Тестовое место - Photo 1')).toBeInTheDocument();
  });

  test('handles two photos correctly', () => {
    // Mock the usePlace hook with two photos
    vi.mock('../hooks/useSupabase', async (importOriginal) => {
      const actual = await importOriginal();
      return {
        ...actual,
        usePlace: () => ({
          place: {
            id: 1,
            name_ru: 'Тестовое место',
            name_en: 'Test Place',
            name_kz: 'Тест орын',
            description_ru: 'Описание тестового места',
            description_en: 'Description of test place',
            description_kz: 'Тест орынының сипаттамасы',
            image: 'main-image.jpg',
            place_photos: [
              { id: 1, url: 'https://example.com/photo1.jpg' },
              { id: 2, url: 'https://example.com/photo2.jpg' }
            ]
          },
          loading: false,
          error: null
        }),
        getImageUrl: (image) => `https://storage.example.com/${image}`
      };
    });

    render(
      <BrowserRouter>
        <AuthProvider>
          <LanguageProvider>
            <PlaceDetail />
          </LanguageProvider>
        </AuthProvider>
      </BrowserRouter>
    );
    
    // Check that main image and two thumbnails are displayed
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(3); // Main image + 2 thumbnails
  });

  test('handles three photos correctly', () => {
    // Mock the usePlace hook with three photos
    vi.mock('../hooks/useSupabase', async (importOriginal) => {
      const actual = await importOriginal();
      return {
        ...actual,
        usePlace: () => ({
          place: {
            id: 1,
            name_ru: 'Тестовое место',
            name_en: 'Test Place',
            name_kz: 'Тест орын',
            description_ru: 'Описание тестового места',
            description_en: 'Description of test place',
            description_kz: 'Тест орынының сипаттамасы',
            image: 'main-image.jpg',
            place_photos: [
              { id: 1, url: 'https://example.com/photo1.jpg' },
              { id: 2, url: 'https://example.com/photo2.jpg' },
              { id: 3, url: 'https://example.com/photo3.jpg' }
            ]
          },
          loading: false,
          error: null
        }),
        getImageUrl: (image) => `https://storage.example.com/${image}`
      };
    });

    render(
      <BrowserRouter>
        <AuthProvider>
          <LanguageProvider>
            <PlaceDetail />
          </LanguageProvider>
        </AuthProvider>
      </BrowserRouter>
    );
    
    // Check that main image and three thumbnails are displayed
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(4); // Main image + 3 thumbnails
  });

  test('handles fallback to places.image when no place_photos', () => {
    // Mock the usePlace hook with no place_photos
    vi.mock('../hooks/useSupabase', async (importOriginal) => {
      const actual = await importOriginal();
      return {
        ...actual,
        usePlace: () => ({
          place: {
            id: 1,
            name_ru: 'Тестовое место',
            name_en: 'Test Place',
            name_kz: 'Тест орын',
            description_ru: 'Описание тестового места',
            description_en: 'Description of test place',
            description_kz: 'Тест орынының сипаттамасы',
            image: 'main-image.jpg',
            place_photos: []
          },
          loading: false,
          error: null
        }),
        getImageUrl: (image) => `https://storage.example.com/${image}`
      };
    });

    render(
      <BrowserRouter>
        <AuthProvider>
          <LanguageProvider>
            <PlaceDetail />
          </LanguageProvider>
        </AuthProvider>
      </BrowserRouter>
    );
    
    // Check that fallback image is displayed
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(1);
    expect(screen.getByAltText('Тестовое место - Photo 1')).toBeInTheDocument();
    expect(screen.getByAltText('Тестовое место - Photo 1')).toHaveAttribute('src', 'https://storage.example.com/main-image.jpg');
  });
});