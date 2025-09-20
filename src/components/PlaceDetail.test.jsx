import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PlaceDetail from './PlaceDetail';
import { LanguageProvider } from '../contexts/LanguageContext';
import { AuthProvider } from '../contexts/AuthContext';
import { vi } from 'vitest';

// Mock the usePlace hook
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
        image: 'main-image.jpg', // This is now a fallback
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

// Mock useParams
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useParams: () => ({ id: '1' })
  };
});

// Mock FeedbackSection to avoid auth context issues
vi.mock('./FeedbackSection', () => ({
  default: () => <div data-testid="feedback-section">Feedback Section</div>
}));

describe('PlaceDetail', () => {
  const renderComponent = () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <LanguageProvider>
            <PlaceDetail />
          </LanguageProvider>
        </AuthProvider>
      </BrowserRouter>
    );
  };

  test('displays place information correctly', () => {
    renderComponent();
    
    // Check that the place name is displayed (in Russian as default)
    expect(screen.getByText('Тестовое место')).toBeInTheDocument();
    
    // Check that the description is displayed (in Russian as default)
    expect(screen.getByText('Описание тестового места')).toBeInTheDocument();
  });

  test('displays photo gallery with multiple images from place_photos', () => {
    renderComponent();
    
    // Check that the main image is displayed (first photo from place_photos)
    const mainImage = screen.getByAltText('Тестовое место - Photo 1');
    expect(mainImage).toBeInTheDocument();
    expect(mainImage).toHaveAttribute('src', 'https://example.com/photo1.jpg');
  });

  test('displays thumbnails for multiple photos', () => {
    renderComponent();
    
    // Check that thumbnails are displayed
    const thumbnails = screen.getAllByRole('img');
    expect(thumbnails).toHaveLength(3); // Main image + 2 thumbnails
    
    // Check that thumbnails have correct alt texts
    expect(screen.getByAltText('Тестовое место - Thumbnail 1')).toBeInTheDocument();
    expect(screen.getByAltText('Тестовое место - Thumbnail 2')).toBeInTheDocument();
  });
});