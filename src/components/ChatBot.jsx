import React, { useState, useRef, useEffect, useCallback } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import {
    sendGeminiMessageWithContext,
    initializeChatService,
    getChatHistory,
    saveMessageFeedback,
    getChatSessions,
    createChatSession,
    switchChatSession,
    getSessionStats,
    chatUtils,
} from "../utils/geminiClient";
import geminiApiQueue from "../utils/apiQueue";
import MarkdownMessage from "./MarkdownMessage";
import {
    ChatBubbleLeftRightIcon,
    PlusIcon,
    XMarkIcon,
    ClipboardDocumentIcon,
    ArrowPathIcon,
    StarIcon as StarOutline,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";

const ChatBot = ({ showHeader = true, onClose }) => {
    // Use language context for translations
    const { t, language } = useLanguage();
    const { user } = useAuth();

    // State to store conversation history
    const [conversationHistory, setConversationHistory] = useState([]);

    // State for current input and UI states
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [queueLength, setQueueLength] = useState(0);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [currentSessionId, setCurrentSessionId] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [showSessions, setShowSessions] = useState(false);
    const [messageActions, setMessageActions] = useState({});
    const [hoveredRating, setHoveredRating] = useState(null); // Для отслеживания наведения на звезды

    // Refs
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const fileInputRef = useRef(null);

    // Initialize chat service when component mounts
    useEffect(() => {
        if (!user?.id) return;
        const initChat = async () => {
            try {
                const sessionId = await initializeChatService(user?.id);
                if (sessionId) {
                    setCurrentSessionId(sessionId);
                    await loadChatHistory(sessionId);
                    await loadSessions();
                }
            } catch (error) {
                console.error("Error initializing chat:", error);
            }
        };

        initChat();
    }, [user?.id]);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [conversationHistory]);

    // Focus input on initial render
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // Update queue length
    useEffect(() => {
        const updateQueueLength = () => {
            setQueueLength(geminiApiQueue.length);
        };

        updateQueueLength();
        const interval = setInterval(updateQueueLength, 100);
        return () => clearInterval(interval);
    }, []);

    // Monitor online/offline status
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    // Load chat history from Supabase
    const loadChatHistory = async (sessionId) => {
        try {
            const messages = await getChatHistory(sessionId, 50);
            const formattedMessages = chatUtils.formatMessagesForAI(messages);
            setConversationHistory(formattedMessages);
        } catch (error) {
            console.error("Error loading chat history:", error);
        }
    };

    // Load chat sessions
    const loadSessions = async () => {
        try {
            const userSessions = await getChatSessions();
            setSessions(userSessions);
        } catch (error) {
            console.error("Error loading sessions:", error);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading || !isOnline || !user) return;

        try {
            // Add user message to conversation history
            const userMessage = {
                id: Date.now(),
                text: inputValue.trim(),
                sender: "user",
                timestamp: new Date().toISOString(),
            };
            const updatedHistory = [...conversationHistory, userMessage];

            // Limit conversation history to last 10 messages for context
            const limitedHistory = updatedHistory.slice(-10);
            setConversationHistory(limitedHistory);

            // Clear input and set loading state
            setInputValue("");
            setIsLoading(true);
            setError("");

            // Get bot response with context
            const response = await sendGeminiMessageWithContext(
                limitedHistory,
                { language }
            );

            // Add bot message to conversation history
            const botMessage = {
                id: Date.now() + 1,
                text: response,
                sender: "bot",
                timestamp: new Date().toISOString(),
            };
            const finalHistory = [...limitedHistory, botMessage];
            setConversationHistory(finalHistory);

            // Reload chat history to get the latest messages from Supabase
            if (currentSessionId) {
                await loadChatHistory(currentSessionId);
            }
        } catch (err) {
            setError(err.message || t("error"));
            // Add error message to conversation history
            const errorMessage = {
                id: Date.now(),
                text: t("chatError"),
                sender: "bot",
                isError: true,
                timestamp: new Date().toISOString(),
            };
            const updatedHistory = [...conversationHistory, errorMessage];
            setConversationHistory(updatedHistory);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && e.ctrlKey) {
            handleSubmit(e);
        }
    };

    // Message actions
    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            // Show temporary success message
            setMessageActions((prev) => ({ ...prev, [Date.now()]: "copied" }));
            setTimeout(() => {
                setMessageActions((prev) => {
                    const newActions = { ...prev };
                    delete newActions[Date.now()];
                    return newActions;
                });
            }, 2000);
        } catch (error) {
            console.error("Error copying to clipboard:", error);
        }
    };

    const regenerateMessage = async (messageId) => {
        // Find the message and regenerate it
        const messageIndex = conversationHistory.findIndex(
            (msg) => msg.id === messageId
        );
        if (messageIndex === -1) return;

        const previousMessages = conversationHistory.slice(0, messageIndex);
        const lastUserMessage = previousMessages
            .filter((msg) => msg.sender === "user")
            .pop();

        if (!lastUserMessage) return;

        try {
            setIsLoading(true);
            const response = await sendGeminiMessageWithContext(
                previousMessages,
                { language }
            );

            // Update the message
            setConversationHistory((prev) =>
                prev.map((msg) =>
                    msg.id === messageId
                        ? {
                              ...msg,
                              text: response,
                              timestamp: new Date().toISOString(),
                          }
                        : msg
                )
            );
        } catch (error) {
            console.error("Error regenerating message:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const rateMessage = async (messageId, rating) => {
        try {
            await saveMessageFeedback(messageId, rating);
            setMessageActions((prev) => ({ ...prev, [messageId]: "rated" }));
        } catch (error) {
            console.error("Error rating message:", error);
        }
    };

    // Session management
    const createNewSession = async () => {
        try {
            const sessionName = chatUtils.generateSessionName(
                conversationHistory[0]?.text || "New Chat"
            );
            const newSessionId = await createChatSession(sessionName, language);
            setCurrentSessionId(newSessionId);
            setConversationHistory([]);
            await loadSessions();
        } catch (error) {
            console.error("Error creating new session:", error);
        }
    };

    const switchSession = async (sessionId) => {
        try {
            await switchChatSession(sessionId);
            setCurrentSessionId(sessionId);
            await loadChatHistory(sessionId);
            setShowSessions(false);
        } catch (error) {
            console.error("Error switching session:", error);
        }
    };

    return (
        <div className="chat-container">
            {/* Chat header */}
            {showHeader && (
                <div className="chat-header">
                    <div className="chat-header-content">
                        <div>
                            <h2>{t("aiAssistant")}</h2>
                            {!isOnline && (
                                <div className="offline-indicator">
                                    {t("offline")}
                                </div>
                            )}
                        </div>
                        <div className="chat-header-actions">
                            {user && queueLength > 0 && (
                                <div className="queue-indicator">
                                    {t("queuePending")} {queueLength}
                                </div>
                            )}
                            {user && (
                                <>
                                    <button
                                        onClick={() =>
                                            setShowSessions(!showSessions)
                                        }
                                        className="sessions-button"
                                        title={t("chatSessions")}
                                    >
                                        <ChatBubbleLeftRightIcon className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={createNewSession}
                                        className="new-session-button"
                                        title={t("newChat")}
                                    >
                                        <PlusIcon className="w-5 h-5" />
                                    </button>
                                </>
                            )}
                            {onClose && (
                                <button
                                    onClick={onClose}
                                    className="chat-close-button"
                                    aria-label={t("closeChat")}
                                >
                                    <XMarkIcon className="w-6 h-6" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Sessions sidebar */}
            {user && showSessions && (
                <div
                    className={`sessions-sidebar ${showSessions ? "open" : ""}`}
                >
                    <div className="sessions-header">
                        <h3>{t("chatSessions")}</h3>
                        <button onClick={() => setShowSessions(false)}>
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="sessions-list">
                        {sessions.map((session) => (
                            <div
                                key={session.id}
                                className={`session-item ${session.id === currentSessionId ? "active" : ""}`}
                                onClick={() => switchSession(session.id)}
                            >
                                <div className="session-name">
                                    {session.session_name}
                                </div>
                                <div className="session-date">
                                    {new Date(
                                        session.updated_at
                                    ).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Messages container */}
            <div className="chat-messages">
                {!user ? (
                    <div className="welcome-message">
                        <p>
                            {t("pleaseLoginOrSignup")}{" "}
                            <a href="/login">{t("login")}</a>{" "}
                            <a href="/signup">{t("signup")}</a>.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Welcome message when chat is empty */}
                        {conversationHistory.length === 0 && !isLoading && (
                            <div className="welcome-message">
                                <p>{t("chatWelcomeMessage")}</p>
                                <div className="welcome-suggestions">
                                    <button
                                        className="suggestion-button"
                                        onClick={() =>
                                            setInputValue(t("suggestQuestion1"))
                                        }
                                    >
                                        {t("suggestQuestion1")}
                                    </button>
                                    <button
                                        className="suggestion-button"
                                        onClick={() =>
                                            setInputValue(t("suggestQuestion2"))
                                        }
                                    >
                                        {t("suggestQuestion2")}
                                    </button>
                                    <button
                                        className="suggestion-button"
                                        onClick={() =>
                                            setInputValue(t("suggestQuestion3"))
                                        }
                                    >
                                        {t("suggestQuestion3")}
                                    </button>
                                </div>
                            </div>
                        )}

                        {conversationHistory.map((message) => (
                            <div
                                key={message.id}
                                className={`message-container ${message.sender}`}
                            >
                                <div className={`message ${message.sender}`}>
                                    <div
                                        className={`message-bubble ${message.sender} ${message.isError ? "error" : ""}`}
                                    >
                                        {message.sender === "bot" &&
                                        !message.isError ? (
                                            <MarkdownMessage
                                                content={message.text}
                                            />
                                        ) : (
                                            message.text
                                        )}
                                        <div className="message-timestamp">
                                            {new Date(
                                                message.timestamp
                                            ).toLocaleTimeString()}
                                        </div>
                                    </div>
                                </div>

                                {/* Message actions - под сообщением */}
                                {message.sender === "bot" &&
                                    !message.isError && (
                                        <div className="message-actions">
                                            <button
                                                onClick={() =>
                                                    copyToClipboard(
                                                        message.text
                                                    )
                                                }
                                                className="action-button copy-button"
                                                title={t("copyMessage")}
                                            >
                                                <ClipboardDocumentIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    regenerateMessage(
                                                        message.id
                                                    )
                                                }
                                                className="action-button regenerate-button"
                                                title={t("regenerateMessage")}
                                            >
                                                <ArrowPathIcon className="w-4 h-4" />
                                            </button>
                                            <div className="rating-buttons">
                                                {[1, 2, 3, 4, 5].map(
                                                    (rating) => {
                                                        // Определяем, должна ли звезда быть заполненной
                                                        const isHovered =
                                                            hoveredRating &&
                                                            hoveredRating.messageId ===
                                                                message.id &&
                                                            rating <=
                                                                hoveredRating.rating;
                                                        const isRated =
                                                            messageActions[
                                                                message.id
                                                            ] === "rated";

                                                        return (
                                                            <button
                                                                key={rating}
                                                                onClick={() =>
                                                                    rateMessage(
                                                                        message.id,
                                                                        rating
                                                                    )
                                                                }
                                                                onMouseEnter={() =>
                                                                    setHoveredRating(
                                                                        {
                                                                            messageId:
                                                                                message.id,
                                                                            rating,
                                                                        }
                                                                    )
                                                                }
                                                                onMouseLeave={() =>
                                                                    setHoveredRating(
                                                                        null
                                                                    )
                                                                }
                                                                className={`rating-button ${isRated ? "rated" : ""} ${isHovered ? "hovered" : ""}`}
                                                                title={`${t("rateMessage")} ${rating}`}
                                                            >
                                                                {isHovered ||
                                                                isRated ? (
                                                                    <StarSolid className="w-3.5 h-3.5" />
                                                                ) : (
                                                                    <StarOutline className="w-3.5 h-3.5" />
                                                                )}
                                                            </button>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        </div>
                                    )}
                            </div>
                        ))}

                        {isLoading && (
                            <div className="message bot">
                                <div className="message-bubble bot typing-indicator">
                                    <div className="typing-dots">
                                        <div className="typing-dot"></div>
                                        <div className="typing-dot"></div>
                                        <div className="typing-dot"></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {error && <div className="error-message">{error}</div>}

                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Input area */}
            {user && (
                <form onSubmit={handleSubmit} className="chat-input-form">
                    <div className="input-group">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isLoading || !isOnline}
                            placeholder={
                                isOnline
                                    ? t("typeMessage")
                                    : t("offlineMessage")
                            }
                            className="chat-input"
                            aria-label={t("typeMessage")}
                        />
                        <button
                            type="submit"
                            disabled={
                                !inputValue.trim() || isLoading || !isOnline
                            }
                            className="btn chat-send-button"
                            aria-label={t("sendMessage")}
                        >
                            {t("send")}
                        </button>
                    </div>
                    <div className="input-hint">{t("chatHint")}</div>
                </form>
            )}
        </div>
    );
};

export default ChatBot;
