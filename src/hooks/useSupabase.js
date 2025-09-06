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
      
      setPlaces(data || []);
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
          image,
          lat,
          lng,
          category_id,
          categories (
            id,
            name_ru,
            name_en,
            name_kz
          )
        `)
        .not('lat', 'is', null)
        .not('lng', 'is', null)
        .order('id');

      if (error) throw error;
      
      setPlaces(data || []);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching map places:", err);
    } finally {
      setLoading(false);
    }
  };

  return { places, loading, error, refetch: fetchMapPlaces };
}