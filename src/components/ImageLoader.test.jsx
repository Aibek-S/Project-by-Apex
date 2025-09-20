import { render, screen, waitFor } from '@testing-library/react';
import ImageLoader from './ImageLoader';

describe('ImageLoader', () => {
  test('displays loading spinner while image is loading', () => {
    render(
      <ImageLoader 
        src="https://example.com/test-image.jpg" 
        alt="Test Image" 
      />
    );
    
    // Check that loading spinner is displayed
    const spinner = screen.getByRole('img', { hidden: true });
    expect(spinner).toBeInTheDocument();
  });

  test('displays image when loaded', async () => {
    render(
      <ImageLoader 
        src="https://example.com/test-image.jpg" 
        alt="Test Image" 
      />
    );
    
    // Simulate image load
    const img = screen.getByRole('img');
    img.onload();
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(img).toHaveStyle('opacity: 1');
    });
    
    // Check that image is displayed
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/test-image.jpg');
    expect(img).toHaveAttribute('alt', 'Test Image');
  });

  test('displays error message when image fails to load', async () => {
    render(
      <ImageLoader 
        src="https://example.com/broken-image.jpg" 
        alt="Broken Image" 
      />
    );
    
    // Simulate image error
    const img = screen.getByRole('img');
    img.onerror();
    
    // Wait for error state
    await waitFor(() => {
      expect(screen.getByText('Image not available')).toBeInTheDocument();
    });
    
    // Check that image is hidden
    expect(img).toHaveStyle('opacity: 0');
  });
});