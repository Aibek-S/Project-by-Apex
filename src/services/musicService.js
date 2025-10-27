import { supabase } from "../lib/supabase";

/**
 * Сервис для работы с музыкальными композициями
 */

// Получить все музыкальные композиции
export async function getMusicTracks() {
    try {
        const { data, error } = await supabase
            .from("music_tracks")
            .select("*")
            .order("order_position", { ascending: true });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error("Error fetching music tracks:", error);
        throw error;
    }
}

// Получить одну композицию по ID
export async function getMusicTrackById(id) {
    try {
        const { data, error } = await supabase
            .from("music_tracks")
            .select("*")
            .eq("id", id)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error fetching music track:", error);
        throw error;
    }
}

// Форматирование длительности из секунд в MM:SS
export function formatDuration(seconds) {
    if (!seconds) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
}
