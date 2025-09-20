import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase.js";

export function useFeedback(placeId) {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeedback = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("feedback")
        .select(`
          *,
          users (
            full_name
          )
        `)
        .eq("place_id", placeId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      setFeedback(data || []);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching feedback:", err);
    } finally {
      setLoading(false);
    }
  }, [placeId]);

  useEffect(() => {
    if (placeId) {
      fetchFeedback();
    }
  }, [placeId, fetchFeedback]);

  const addFeedback = async (feedbackData) => {
    try {
      const { data, error } = await supabase
        .from("feedback")
        .insert({
          place_id: placeId,
          user_id: feedbackData.userId,
          rating: feedbackData.rating,
          comment: feedbackData.comment
        })
        .select();

      if (error) throw error;
      
      // Refresh feedback list
      await fetchFeedback();
      
      return data[0];
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateFeedback = async (feedbackId, feedbackData) => {
    try {
      const { data, error } = await supabase
        .from("feedback")
        .update({
          rating: feedbackData.rating,
          comment: feedbackData.comment,
          updated_at: new Date()
        })
        .eq("id", feedbackId)
        .eq("user_id", feedbackData.userId)
        .select();

      if (error) throw error;
      
      // Refresh feedback list
      await fetchFeedback();
      
      return data[0];
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteFeedback = async (feedbackId, userId) => {
    try {
      const { error } = await supabase
        .from("feedback")
        .delete()
        .eq("id", feedbackId)
        .eq("user_id", userId);

      if (error) throw error;
      
      // Refresh feedback list
      await fetchFeedback();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Calculate average rating
  const getAverageRating = () => {
    if (!feedback || feedback.length === 0) return 0;
    
    const sum = feedback.reduce((acc, item) => acc + item.rating, 0);
    return (sum / feedback.length).toFixed(1);
  };

  // Get rating distribution
  const getRatingDistribution = () => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    feedback.forEach(item => {
      distribution[item.rating]++;
    });
    
    return distribution;
  };

  return {
    feedback,
    loading,
    error,
    addFeedback,
    updateFeedback,
    deleteFeedback,
    getAverageRating,
    getRatingDistribution,
    refetch: fetchFeedback
  };
}