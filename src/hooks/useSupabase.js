import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase.js";

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if supabase client is properly configured
      if (!supabase) {
        throw new Error("Supabase client is not properly configured. Check your .env file.");
      }

      const { data, error } = await supabase
        .from("categories")
        .select("id, name_ru, name_en, name_kz")
        .order("id");

      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  return { categories, loading, error, refetch: fetchCategories };
}

export function usePlaces(categoryId = null) {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlaces = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if supabase client is properly configured
      if (!supabase) {
        throw new Error("Supabase client is not properly configured. Check your .env file.");
      }

      let query = supabase
        .from("places")
        .select(`
          *,
          categories (
            id,
            name_ru,
            name_en,
            name_kz
          ),
          place_photos (
            id,
            url
          )
        `);

      if (categoryId) {
        // Convert categoryId to number to match database type
        const numericCategoryId = parseInt(categoryId, 10);
        if (!isNaN(numericCategoryId)) {
          query = query.eq("category_id", numericCategoryId);
        }
      }

      const { data, error } = await query.order("id");

      if (error) throw error;
      
      // Limit to first photo only for list views
      const placesWithLimitedPhotos = data.map(place => {
        if (place.place_photos && Array.isArray(place.place_photos)) {
          return {
            ...place,
            place_photos: place.place_photos.slice(0, 1) // Only first photo for performance
          };
        }
        return place;
      });
      
      setPlaces(placesWithLimitedPhotos || []);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching places:", err);
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    fetchPlaces();
  }, [fetchPlaces]);

  return { places, loading, error, refetch: fetchPlaces };
}

export function usePlace(placeId) {
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlace = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if supabase client is properly configured
      if (!supabase) {
        throw new Error("Supabase client is not properly configured. Check your .env file.");
      }

      // Convert placeId to number to match database type
      const numericPlaceId = parseInt(placeId, 10);
      if (isNaN(numericPlaceId)) {
        throw new Error("Invalid place ID");
      }

      // Fetch place data with photos
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
          ),
          place_photos (
            id,
            url
          )
        `
        )
        .eq("id", numericPlaceId)
        .single();

      if (error) throw error;
      
      setPlace(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching place:", err);
    } finally {
      setLoading(false);
    }
  }, [placeId]);

  useEffect(() => {
    if (placeId) {
      fetchPlace();
    } else {
      setPlace(null);
      setLoading(false);
    }
  }, [placeId, fetchPlace]);

  return { place, loading, error, refetch: fetchPlace };
}

// Helper function to construct image URL - images stored directly in images/ folder
export function getImageUrl(image) {
  if (!image) return null;
  
  // Check if VITE_SUPABASE_URL is set
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (!supabaseUrl) {
    console.error("VITE_SUPABASE_URL is not set in .env file");
    return null;
  }
  
  return `${supabaseUrl}/storage/v1/object/public/images/${image}`;
}

// Optimized hook for map - fetch only required fields
export function useMapPlaces() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMapPlaces();
  }, []);

  const fetchMapPlaces = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if supabase client is properly configured
      if (!supabase) {
        throw new Error("Supabase client is not properly configured. Check your .env file.");
      }

      const { data, error } = await supabase
        .from("places")
        .select(`
          id,
          name_ru,
          name_en,
          name_kz,
          lat,
          lng,
          category_id,
          categories (
            id,
            name_ru,
            name_en,
            name_kz
          ),
          place_photos (
            id,
            url
          )
        `)
        .not('lat', 'is', null)
        .not('lng', 'is', null)
        .order('id');

      if (error) throw error;
      
      // Limit to first photo only for map views
      const placesWithLimitedPhotos = data.map(place => {
        if (place.place_photos && Array.isArray(place.place_photos)) {
          return {
            ...place,
            place_photos: place.place_photos.slice(0, 1) // Only first photo for performance
          };
        }
        return place;
      });
      
      setPlaces(placesWithLimitedPhotos || []);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching map places:", err);
    } finally {
      setLoading(false);
    }
  };

  return { places, loading, error, refetch: fetchMapPlaces };
}

// Hook to fetch all tours
export function useTours() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTours = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if supabase client is properly configured
      if (!supabase) {
        throw new Error("Supabase client is not properly configured. Check your .env file.");
      }

      // Fetch tours with associated places, ordered by position
      const { data, error } = await supabase
        .from("tours")
        .select(`
          *,
          tour_places (
            position,
            places (
              id,
              name_ru,
              name_en,
              name_kz,
              place_photos (
                id,
                url
              )
            )
          )
        `)
        .order("id");

      if (error) throw error;
      
      // Sort places within each tour by position
      const toursWithSortedPlaces = data.map(tour => {
        if (tour.tour_places) {
          // Sort tour_places by position
          tour.tour_places.sort((a, b) => (a.position || 0) - (b.position || 0));
        }
        return tour;
      });
      
      setTours(toursWithSortedPlaces || []);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching tours:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  return { tours, loading, error, refetch: fetchTours };
}

// Hook to fetch a single tour by ID
export function useTour(tourId) {
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTour = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if supabase client is properly configured
      if (!supabase) {
        throw new Error("Supabase client is not properly configured. Check your .env file.");
      }

      // Convert tourId to number to match database type
      const numericTourId = parseInt(tourId, 10);
      if (isNaN(numericTourId)) {
        throw new Error("Invalid tour ID");
      }

      // Fetch tour data with associated places, ordered by position
      const { data, error } = await supabase
        .from("tours")
        .select(`
          *,
          tour_places (
            position,
            places (
              id,
              name_ru,
              name_en,
              name_kz,
              description_ru,
              description_en,
              description_kz,
              legends_ru,
              legends_en,
              legends_kz,
              place_photos (
                id,
                url
              )
            )
          )
        `)
        .eq("id", numericTourId)
        .single();

      if (error) throw error;
      
      // Sort places by position
      if (data && data.tour_places) {
        data.tour_places.sort((a, b) => (a.position || 0) - (b.position || 0));
      }
      
      setTour(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching tour:", err);
    } finally {
      setLoading(false);
    }
  }, [tourId]);

  useEffect(() => {
    if (tourId) {
      fetchTour();
    } else {
      setTour(null);
      setLoading(false);
    }
  }, [tourId, fetchTour]);

  return { tour, loading, error, refetch: fetchTour };
}

// Hook to fetch tours for a specific place
export function useToursByPlace(placeId) {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchToursByPlace = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if supabase client is properly configured
      if (!supabase) {
        throw new Error("Supabase client is not properly configured. Check your .env file.");
      }

      // Convert placeId to number to match database type
      const numericPlaceId = parseInt(placeId, 10);
      if (isNaN(numericPlaceId)) {
        throw new Error("Invalid place ID");
      }

      // Fetch tours that include this place
      const { data, error } = await supabase
        .from("tours")
        .select(`
          *,
          tour_places (
            position,
            place_id
          )
        `)
        .eq("tour_places.place_id", numericPlaceId);
      
      // Additional check to ensure we only return tours that actually have the place
      // This handles cases where the join might return unexpected results
      const filteredData = data ? data.filter(tour => 
        tour.tour_places && tour.tour_places.some(tp => tp.place_id === numericPlaceId)
      ) : [];

      if (error) throw error;
      
      setTours(filteredData || []);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching tours for place:", err);
    } finally {
      setLoading(false);
    }
  }, [placeId]);

  useEffect(() => {
    if (placeId) {
      fetchToursByPlace();
    } else {
      setTours([]);
      setLoading(false);
    }
  }, [placeId, fetchToursByPlace]);

  return { tours, loading, error, refetch: fetchToursByPlace };
}
