import { supabase } from "../lib/supabase.js";

/**
 * Chat Service for Supabase Integration
 * Handles chat sessions, messages, analytics, and feedback
 */
export class ChatService {
    constructor() {
        this.currentSessionId = null;
        this.currentUserId = null;
    }

    /**
     * Initialize chat service with user context
     * @param {string} userId - User ID from auth
     */
    async initialize(userId = null) {
        this.currentUserId = userId;

        // If user is authenticated, get or create active session
        if (userId) {
            await this.getOrCreateActiveSession();
        }
    }

    /**
     * Get or create an active chat session for the current user
     * @returns {Promise<string>} Session ID
     */
    async getOrCreateActiveSession() {
        if (!this.currentUserId) {
            throw new Error("User must be authenticated to create sessions");
        }

        try {
            // Try to get existing active session
            const { data: existingSession, error: fetchError } = await supabase
                .from("chat_sessions")
                .select("id")
                .eq("user_id", this.currentUserId)
                .eq("is_active", true)
                .order("updated_at", { ascending: false })
                .limit(1)
                .single();

            if (existingSession && !fetchError) {
                this.currentSessionId = existingSession.id;
                return existingSession.id;
            }

            // Create new session if none exists
            const { data: newSession, error: createError } = await supabase
                .from("chat_sessions")
                .insert({
                    user_id: this.currentUserId,
                    session_name: "New Chat",
                    language: "ru",
                    is_active: true,
                })
                .select("id")
                .single();

            if (createError) throw createError;

            this.currentSessionId = newSession.id;
            return newSession.id;
        } catch (error) {
            console.error("Error getting/creating chat session:", error);
            throw error;
        }
    }

    /**
     * Create a new chat session
     * @param {string} sessionName - Name for the session
     * @param {string} language - Language preference
     * @returns {Promise<string>} Session ID
     */
    async createSession(sessionName = "New Chat", language = "ru") {
        if (!this.currentUserId) {
            throw new Error("User must be authenticated to create sessions");
        }

        try {
            // Deactivate current session if exists
            if (this.currentSessionId) {
                await this.deactivateSession(this.currentSessionId);
            }

            const { data, error } = await supabase
                .from("chat_sessions")
                .insert({
                    user_id: this.currentUserId,
                    session_name: sessionName,
                    language: language,
                    is_active: true,
                })
                .select("id")
                .single();

            if (error) throw error;

            this.currentSessionId = data.id;
            return data.id;
        } catch (error) {
            console.error("Error creating chat session:", error);
            throw error;
        }
    }

    /**
     * Get all chat sessions for the current user
     * @returns {Promise<Array>} Array of chat sessions
     */
    async getSessions() {
        if (!this.currentUserId) {
            return [];
        }

        try {
            const { data, error } = await supabase
                .from("chat_sessions")
                .select(
                    "id, session_name, language, created_at, updated_at, is_active"
                )
                .eq("user_id", this.currentUserId)
                .order("updated_at", { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error("Error fetching chat sessions:", error);
            return [];
        }
    }

    /**
     * Get messages for a specific session
     * @param {string} sessionId - Session ID
     * @param {number} limit - Number of messages to fetch
     * @returns {Promise<Array>} Array of messages
     */
    async getMessages(sessionId, limit = 50) {
        try {
            const { data, error } = await supabase
                .from("chat_messages")
                .select(
                    "id, message_type, content, role, timestamp, is_error, metadata"
                )
                .eq("session_id", sessionId)
                .order("timestamp", { ascending: true })
                .limit(limit);

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error("Error fetching messages:", error);
            return [];
        }
    }

    /**
     * Get chat context (last N messages) for AI
     * @param {string} sessionId - Session ID
     * @param {number} limit - Number of messages for context
     * @returns {Promise<Array>} Array of context messages
     */
    async getChatContext(sessionId, limit = 5) {
        try {
            const { data, error } = await supabase
                .from("chat_messages")
                .select("id, message_type, content, role, timestamp")
                .eq("session_id", sessionId)
                .order("timestamp", { ascending: false })
                .limit(limit);

            if (error) throw error;

            // Reverse to get chronological order
            return (data || []).reverse();
        } catch (error) {
            console.error("Error fetching chat context:", error);
            return [];
        }
    }

    /**
     * Save a message to the database
     * @param {string} sessionId - Session ID
     * @param {string} messageType - 'user', 'bot', or 'system'
     * @param {string} content - Message content
     * @param {string} role - 'user', 'assistant', or 'system'
     * @param {Object} metadata - Additional metadata
     * @returns {Promise<string>} Message ID
     */
    async saveMessage(sessionId, messageType, content, role, metadata = {}) {
        try {
            const { data, error } = await supabase
                .from("chat_messages")
                .insert({
                    session_id: sessionId,
                    message_type: messageType,
                    content: content,
                    role: role,
                    metadata: metadata,
                    is_error: messageType === "bot" && metadata.isError,
                    response_time_ms: metadata.responseTime,
                    token_count: metadata.tokenCount,
                    model_version: metadata.modelVersion || "gemini-2.5-flash",
                })
                .select("id")
                .single();

            if (error) throw error;
            return data.id;
        } catch (error) {
            console.error("Error saving message:", error);
            throw error;
        }
    }

    /**
     * Track analytics event
     * @param {string} sessionId - Session ID
     * @param {string} messageId - Message ID (optional)
     * @param {string} eventType - Type of event
     * @param {Object} eventData - Event data
     */
    async trackEvent(sessionId, messageId, eventType, eventData = {}) {
        try {
            await supabase.from("chat_analytics").insert({
                session_id: sessionId,
                message_id: messageId,
                event_type: eventType,
                event_data: eventData,
                user_agent: navigator.userAgent,
                timestamp: new Date().toISOString(),
            });
        } catch (error) {
            console.error("Error tracking event:", error);
            // Don't throw - analytics failures shouldn't break the chat
        }
    }

    /**
     * Save user feedback for a message
     * @param {string} messageId - Message ID
     * @param {number} rating - Rating from 1-5
     * @param {string} feedbackText - Optional feedback text
     */
    async saveFeedback(messageId, rating, feedbackText = null) {
        if (!this.currentUserId) {
            throw new Error("User must be authenticated to save feedback");
        }

        try {
            const { error } = await supabase.from("chat_feedback").insert({
                message_id: messageId,
                user_id: this.currentUserId,
                rating: rating,
                feedback_text: feedbackText,
            });

            if (error) throw error;
        } catch (error) {
            console.error("Error saving feedback:", error);
            throw error;
        }
    }

    /**
     * Update session metadata
     * @param {string} sessionId - Session ID
     * @param {Object} metadata - Metadata to update
     */
    async updateSessionMetadata(sessionId, metadata) {
        try {
            const { error } = await supabase
                .from("chat_sessions")
                .update({ metadata: metadata })
                .eq("id", sessionId);

            if (error) throw error;
        } catch (error) {
            console.error("Error updating session metadata:", error);
            throw error;
        }
    }

    /**
     * Deactivate a session
     * @param {string} sessionId - Session ID
     */
    async deactivateSession(sessionId) {
        try {
            const { error } = await supabase
                .from("chat_sessions")
                .update({ is_active: false })
                .eq("id", sessionId);

            if (error) throw error;
        } catch (error) {
            console.error("Error deactivating session:", error);
            throw error;
        }
    }

    /**
     * Delete a session and all its messages
     * @param {string} sessionId - Session ID
     */
    async deleteSession(sessionId) {
        try {
            const { error } = await supabase
                .from("chat_sessions")
                .delete()
                .eq("id", sessionId);

            if (error) throw error;
        } catch (error) {
            console.error("Error deleting session:", error);
            throw error;
        }
    }

    /**
     * Get session statistics
     * @param {string} sessionId - Session ID
     * @returns {Promise<Object>} Session statistics
     */
    async getSessionStats(sessionId) {
        try {
            const { data, error } = await supabase
                .from("chat_messages")
                .select("message_type, response_time_ms, token_count")
                .eq("session_id", sessionId);

            if (error) throw error;

            const stats = {
                totalMessages: data.length,
                userMessages: data.filter((m) => m.message_type === "user")
                    .length,
                botMessages: data.filter((m) => m.message_type === "bot")
                    .length,
                averageResponseTime: 0,
                totalTokens: 0,
            };

            const botMessages = data.filter(
                (m) => m.message_type === "bot" && m.response_time_ms
            );
            if (botMessages.length > 0) {
                stats.averageResponseTime =
                    botMessages.reduce(
                        (sum, m) => sum + m.response_time_ms,
                        0
                    ) / botMessages.length;
            }

            const messagesWithTokens = data.filter((m) => m.token_count);
            if (messagesWithTokens.length > 0) {
                stats.totalTokens = messagesWithTokens.reduce(
                    (sum, m) => sum + m.token_count,
                    0
                );
            }

            return stats;
        } catch (error) {
            console.error("Error getting session stats:", error);
            return null;
        }
    }

    /**
     * Clean up old sessions (called periodically)
     */
    async cleanupOldSessions() {
        try {
            const { data, error } = await supabase.rpc(
                "cleanup_old_chat_sessions"
            );

            if (error) throw error;
            return data;
        } catch (error) {
            console.error("Error cleaning up old sessions:", error);
            return 0;
        }
    }

    /**
     * Get current session ID
     * @returns {string|null} Current session ID
     */
    getCurrentSessionId() {
        return this.currentSessionId;
    }

    /**
     * Set current session ID
     * @param {string} sessionId - Session ID
     */
    setCurrentSessionId(sessionId) {
        this.currentSessionId = sessionId;
    }
}

// Create singleton instance
export const chatService = new ChatService();

// Export utility functions
export const chatUtils = {
    /**
     * Format messages for AI context
     * @param {Array} messages - Array of message objects
     * @returns {Array} Formatted messages for AI
     */
    formatMessagesForAI(messages) {
        return messages.map((msg) => ({
            id: msg.id,
            text: msg.content,
            sender: msg.message_type === "user" ? "user" : "bot",
            timestamp: msg.timestamp,
            metadata: msg.metadata,
        }));
    },

    /**
     * Generate session name from first user message
     * @param {string} firstMessage - First user message
     * @returns {string} Generated session name
     */
    generateSessionName(firstMessage) {
        const words = firstMessage.trim().split(" ");
        const preview = words.slice(0, 4).join(" ");
        return preview.length > 30 ? preview.substring(0, 30) + "..." : preview;
    },

    /**
     * Calculate response time
     * @param {number} startTime - Start timestamp
     * @returns {number} Response time in milliseconds
     */
    calculateResponseTime(startTime) {
        return Date.now() - startTime;
    },

    /**
     * Estimate token count (rough approximation)
     * @param {string} text - Text to count tokens for
     * @returns {number} Estimated token count
     */
    estimateTokenCount(text) {
        // Rough approximation: 1 token ≈ 4 characters for most languages
        return Math.ceil(text.length / 4);
    },
};
