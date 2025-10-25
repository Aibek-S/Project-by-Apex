import geminiApiQueue from "./apiQueue";
import { chatService, chatUtils } from "../services/chatService.js";
import { dataService } from "../services/dataService.js";

// Utility functions for interacting with the Gemini API proxy server

const SERVER_URL =
    import.meta.env.VITE_GEMINI_SERVER_URL || "http://localhost:3001";

// AI assistant context for tourism guide
const AI_CONTEXT = `Ты — чат-бот-туроводитель для Мангистауской области.
Правила работы:
1. Отвечай только на одном из 3 языках: казахский, русский и английский. в зависимости на каком языке говорит пользователь.
2. Используй только данные из базы данных приложения (не придумывай факты).
3. Стиль речи — молодежный, простой и понятный, без сложных формулировок.
4. Тема всегда ограничена туризмом: достопримечательности, маршруты, культура, сервисы Мангистау.
5. Если информации в базе нет — говори об этом напрямую, не выдумывай.
6. Ширина твоего ответа не более 200 символов. ограничивайся короткостью если пользователь не просит об этом.
7. ИСПОЛЬЗУЙ markdown для красивого форматирования: **жирный**, *курсив*, код в обратных кавычках, - списки. Делай ответы структурированными.
Контекст разговора:`;

// Rate limiting configuration
const RATE_LIMIT = {
    maxRequests: 10,
    timeWindow: 60000, // 1 minute
    requests: [],
};

// Retry configuration
const RETRY_CONFIG = {
    maxRetries: 3,
    baseDelay: 1000, // 1 second
    maxDelay: 10000, // 10 seconds
};

// Utility functions
const utils = {
    /**
     * Check if rate limit is exceeded
     * @returns {boolean} True if rate limit exceeded
     */
    isRateLimited() {
        const now = Date.now();
        RATE_LIMIT.requests = RATE_LIMIT.requests.filter(
            (time) => now - time < RATE_LIMIT.timeWindow
        );
        return RATE_LIMIT.requests.length >= RATE_LIMIT.maxRequests;
    },

    /**
     * Add request to rate limit tracking
     */
    addRequest() {
        RATE_LIMIT.requests.push(Date.now());
    },

    /**
     * Retry function with exponential backoff
     * @param {Function} fn - Function to retry
     * @param {number} maxRetries - Maximum number of retries
     * @returns {Promise} Result of the function
     */
    async retryWithBackoff(fn, maxRetries = RETRY_CONFIG.maxRetries) {
        for (let i = 0; i < maxRetries; i++) {
            try {
                return await fn();
            } catch (error) {
                if (i === maxRetries - 1) throw error;

                const delay = Math.min(
                    RETRY_CONFIG.baseDelay * Math.pow(2, i),
                    RETRY_CONFIG.maxDelay
                );

                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }
    },

    /**
     * Sanitize input to prevent XSS and limit length
     * @param {string} input - Input to sanitize
     * @returns {string} Sanitized input
     */
    sanitizeInput(input) {
        if (typeof input !== "string") return "";

        return input
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
            .replace(/javascript:/gi, "")
            .replace(/on\w+\s*=/gi, "")
            .trim()
            .substring(0, 1000); // Limit length
    },

    /**
     * Get localized AI context based on language
     * @param {string} language - Language code
     * @returns {string} Localized context
     */
    getLocalizedContext(language = "ru") {
        const contexts = {
            kz: `Сіз Манғыстау облысының туризм гидісісіз.
Жұмыс ережелері:
1. Тек 3 тілдің біреуінде ғана жауап беріңіз: қазақ, орыс және ағылшын тілдерінде. Ол таңдау қандай тілмен жазғаныңа байланысты.
2. Тек қолданба дерекқорынан деректерді пайдаланыңыз.
3. Сөйлеу стилі - жасөспірімдерге арналған, қарапайым және түсінікті.
4. Тақырып әрдайым туризммен шектеулі: Манғыстау көрікті жерлері, маршруттары, мәдениеті.
5. Дерекқорда ақпарат жоқ болса - тікелей айтыңыз.
6. 200 әріптен астам жауап бермеңіз.
7. Markdown форматтауды ПАЙДАЛАНЫҢЫЗ: **қалың**, *курсив*, код, - тізімдер. Жауаптарды құрылымдалған етіп жасаңыз.
Контекст:`,
            ru: AI_CONTEXT,
            en: `You are a tourism guide chatbot for Mangystau region.
Rules:
1. Answer only in one of the 3 languages: Kazakh, Russian and English. The choice of language is dependent on the language the user is writing in.
2. Use only data from the application database.
3. Speech style - youth-friendly, simple and understandable.
4. Topic is always limited to tourism: attractions, routes, culture, Mangystau services.
5. If information is not in the database - say it directly.
6. Do not answer more than 200 characters.
7. USE markdown formatting: **bold**, *italic*, code in backticks, - lists. Make responses structured and beautiful.
Context:`,
        };

        return contexts[language] || contexts.ru;
    },

    /**
     * Detect language from text
     * @param {string} text - Text to analyze
     * @returns {string} Detected language code
     */
    detectLanguage(text) {
        if (!text) return "ru";

        // Simple language detection based on character sets
        const kazakhPattern = /[әғқңөұүһі]/i;
        const englishPattern = /[a-zA-Z]/;
        const cyrillicPattern = /[а-яё]/i;

        if (kazakhPattern.test(text)) return "kz";
        if (englishPattern.test(text) && !cyrillicPattern.test(text))
            return "en";
        return "ru";
    },

    /**
     * Анализ запроса пользователя для определения нужных данных из БД
     * @param {string} text - Текст пользователя
     * @returns {Object} Объект с типом запроса и параметрами
     */
    analyzeUserQuery(text) {
        const lowerText = text.toLowerCase();

        // Ключевые слова для разных типов запросов
        const keywords = {
            places: [
                "место",
                "места",
                "достопримечательност",
                "посетить",
                "орын",
                "place",
                "attraction",
                "көрікті",
                "расскажи",
                "опиши",
                "что такое",
                "где находится",
                "как добраться",
                "информация",
                "легенд",
                "история",
            ],
            tours: ["тур", "туры", "экскурсия", "tour", "маршрут", "route"],
            popular: [
                "популярн",
                "известн",
                "лучш",
                "popular",
                "best",
                "top",
                "танымал",
            ],
            historical: [
                "истори",
                "история",
                "historical",
                "ancient",
                "тарихи",
            ],
            nature: ["природ", "nature", "табиғи", "пейзаж", "landscape"],
            // Конкретные места Мангистау
            specificPlaces: [
                "шеркала",
                "sherkala",
                "бозжыра",
                "bozzhyra",
                "бекет-ата",
                "beket-ata",
                "шопан-ата",
                "shopan-ata",
                "shakpak-ata",
                "шакпак-ата",
                "устюрт",
                "ustyurt",
                "тузбаир",
                "tuzbair",
                "айракты",
                "airakty",
                "форт шевченко",
                "fort-shevchenko",
                "жана озен",
                "jana-ozen",
                "шетпе",
                "shetpe",
            ],
        };

        const result = {
            needsData: false,
            type: null,
            category: null,
            searchQuery: null,
        };

        // Проверка на запрос о конкретном месте
        const foundPlace = keywords.specificPlaces.find((place) =>
            lowerText.includes(place)
        );
        if (foundPlace) {
            result.needsData = true;
            result.type = "places";
            result.searchQuery = foundPlace;
            return result;
        }

        // Проверка на запрос о местах
        if (keywords.places.some((kw) => lowerText.includes(kw))) {
            result.needsData = true;
            result.type = "places";

            // Определение категории
            if (keywords.historical.some((kw) => lowerText.includes(kw))) {
                result.category = "historical";
            } else if (keywords.nature.some((kw) => lowerText.includes(kw))) {
                result.category = "nature";
            } else if (keywords.popular.some((kw) => lowerText.includes(kw))) {
                result.type = "popular_places";
            }
        }

        // Проверка на запрос о турах
        if (keywords.tours.some((kw) => lowerText.includes(kw))) {
            result.needsData = true;
            result.type = "tours";
        }

        return result;
    },

    /**
     * Получить данные из базы данных на основе анализа запроса
     * @param {Object} analysis - Результат анализа запроса
     * @param {string} language - Язык
     * @returns {Promise<string>} Форматированные данные
     */
    async fetchContextData(analysis, language = "ru") {
        if (!analysis.needsData) {
            return "";
        }

        try {
            let data = "";
            let items = [];

            switch (analysis.type) {
                case "places":
                    // Поиск конкретного места
                    if (analysis.searchQuery) {
                        items = await dataService.searchPlaces(
                            analysis.searchQuery,
                            language
                        );
                        // Если не найдено, попробовать на всех языках
                        if (!items || items.length === 0) {
                            const allPlaces = await dataService.getAllPlaces();
                            items = allPlaces.filter((place) => {
                                const nameRu = place.name_ru.toLowerCase();
                                const nameEn = place.name_en.toLowerCase();
                                const nameKz = place.name_kz.toLowerCase();
                                return (
                                    nameRu.includes(
                                        analysis.searchQuery.toLowerCase()
                                    ) ||
                                    nameEn.includes(
                                        analysis.searchQuery.toLowerCase()
                                    ) ||
                                    nameKz.includes(
                                        analysis.searchQuery.toLowerCase()
                                    )
                                );
                            });
                        }
                    } else if (analysis.category) {
                        // Найти категорию по ключевому слову
                        const category =
                            await dataService.findCategoryByKeyword(
                                analysis.category,
                                language
                            );
                        if (category) {
                            items = await dataService.getPlacesByCategory(
                                category.id
                            );
                        } else {
                            items = await dataService.getAllPlaces();
                        }
                    } else {
                        items = await dataService.getAllPlaces();
                    }
                    data = dataService.formatPlacesForAI(items, language);
                    break;

                case "popular_places":
                    items = await dataService.getPopularPlaces(5);
                    data = dataService.formatPlacesForAI(items, language);
                    break;

                case "tours":
                    items = await dataService.getAllTours();
                    data = dataService.formatToursForAI(items, language);
                    break;

                default:
                    return "";
            }

            if (data) {
                return `\n\nДанные из базы данных:\n${data}\n`;
            }

            return "";
        } catch (error) {
            console.error("Error fetching context data:", error);
            return "";
        }
    },
};

/**
 * Send a message to the Gemini API through our proxy server
 * @param {string} message - The message to send to Gemini
 * @param {Object} options - Additional options
 * @returns {Promise<string>} - The response from Gemini
 */
export async function sendGeminiMessage(message, options = {}) {
    // Sanitize input
    const sanitizedMessage = utils.sanitizeInput(message);
    if (!sanitizedMessage) {
        throw new Error("Message cannot be empty");
    }

    // Check rate limit
    if (utils.isRateLimited()) {
        throw new Error(
            "Rate limit exceeded. Please wait before sending another message."
        );
    }

    // Detect language and get localized context
    const language = options.language || utils.detectLanguage(sanitizedMessage);
    const localizedContext = utils.getLocalizedContext(language);

    // Create a request function that will be queued
    const requestFn = () => {
        return utils.retryWithBackoff(async () => {
            utils.addRequest();

            const startTime = Date.now();

            const response = await fetch(`${SERVER_URL}/api/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: `${localizedContext}\n\nПользователь: ${sanitizedMessage}`,
                    language: language,
                    stream: options.stream || false,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.error || `HTTP error! status: ${response.status}`
                );
            }

            const data = await response.json();
            const responseTime = Date.now() - startTime;

            // Track analytics if session is available
            if (chatService.getCurrentSessionId()) {
                await chatService.trackEvent(
                    chatService.getCurrentSessionId(),
                    null,
                    "response_received",
                    {
                        responseTime: responseTime,
                        language: language,
                        messageLength: sanitizedMessage.length,
                        responseLength: data.reply?.length || 0,
                    }
                );
            }

            return data.reply;
        });
    };

    // Add the request to the queue and return the promise
    return geminiApiQueue.add(requestFn);
}

/**
 * Send a message to the Gemini API with conversation context
 * @param {Array} contextMessages - Array of message objects with text and sender properties
 * @param {Object} options - Additional options
 * @returns {Promise<string>} - The response from Gemini
 */
export async function sendGeminiMessageWithContext(
    contextMessages,
    options = {}
) {
    if (!contextMessages || contextMessages.length === 0) {
        throw new Error("Context messages are required");
    }

    // Get the last user message to detect language
    const lastUserMessage = contextMessages
        .filter((msg) => msg.sender === "user")
        .pop();

    const language =
        options.language || utils.detectLanguage(lastUserMessage?.text || "");
    const localizedContext = utils.getLocalizedContext(language);

    // Check rate limit
    if (utils.isRateLimited()) {
        throw new Error(
            "Rate limit exceeded. Please wait before sending another message."
        );
    }

    // Analyze user query and fetch data from database if needed
    const analysis = utils.analyzeUserQuery(lastUserMessage?.text || "");
    let databaseContext = "";

    if (analysis.needsData) {
        databaseContext = await utils.fetchContextData(analysis, language);
    }

    // Create a request function that will be queued
    const requestFn = () => {
        return utils.retryWithBackoff(async () => {
            utils.addRequest();

            const startTime = Date.now();
            const formattedMessage = formatContextForPrompt(
                contextMessages,
                localizedContext,
                databaseContext
            );

            const response = await fetch(`${SERVER_URL}/api/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: formattedMessage,
                    language: language,
                    stream: options.stream || false,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.error || `HTTP error! status: ${response.status}`
                );
            }

            const data = await response.json();
            const responseTime = Date.now() - startTime;

            // Save messages to Supabase if session is available
            const sessionId = chatService.getCurrentSessionId();
            if (sessionId) {
                try {
                    // Save user message
                    const userMessage =
                        contextMessages[contextMessages.length - 1];
                    if (userMessage && userMessage.sender === "user") {
                        await chatService.saveMessage(
                            sessionId,
                            "user",
                            userMessage.text,
                            "user",
                            {
                                responseTime: responseTime,
                                tokenCount: chatUtils.estimateTokenCount(
                                    userMessage.text
                                ),
                                language: language,
                            }
                        );
                    }

                    // Save bot response
                    const messageId = await chatService.saveMessage(
                        sessionId,
                        "bot",
                        data.reply,
                        "assistant",
                        {
                            responseTime: responseTime,
                            tokenCount: chatUtils.estimateTokenCount(
                                data.reply
                            ),
                            language: language,
                            modelVersion: "gemini-2.5-flash",
                        }
                    );

                    // Track analytics
                    await chatService.trackEvent(
                        sessionId,
                        messageId,
                        "response_received",
                        {
                            responseTime: responseTime,
                            language: language,
                            contextLength: contextMessages.length,
                            responseLength: data.reply?.length || 0,
                        }
                    );
                } catch (error) {
                    console.error("Error saving messages to Supabase:", error);
                    // Don't throw - chat should continue even if saving fails
                }
            }

            return data.reply;
        });
    };

    // Add the request to the queue and return the promise
    return geminiApiQueue.add(requestFn);
}

/**
 * Format conversation context into a single prompt string
 * @param {Array} contextMessages - Array of message objects with text and sender properties
 * @param {string} localizedContext - Localized AI context
 * @param {string} databaseContext - Additional context from database
 * @returns {string} - Formatted prompt string
 */
function formatContextForPrompt(
    contextMessages,
    localizedContext = AI_CONTEXT,
    databaseContext = ""
) {
    // If no context, return AI context only
    if (!contextMessages || contextMessages.length === 0) {
        return `${localizedContext}\n\nПользователь: `;
    }

    // Format the context messages into a conversation format
    // Each message is prefixed with the sender role
    const formattedContext = contextMessages
        .map((msg) => {
            const role =
                msg.sender === "user" ? "Пользователь" : "Туроводитель";
            return `${role}: ${msg.text}`;
        })
        .join("\n");

    // Add AI context, database context (if any), and prompt for continuation
    return `${localizedContext}${databaseContext}\n\n${formattedContext}\nТуроводитель:`;
}

/**
 * Check if the server is healthy
 * @returns {Promise<boolean>} - True if server is healthy
 */
export async function checkServerHealth() {
    try {
        const response = await fetch(`${SERVER_URL}/api/health`);
        return response.ok;
    } catch (error) {
        console.error("Server health check failed:", error);
        return false;
    }
}

/**
 * Initialize chat service with user authentication
 * @param {string} userId - User ID from auth
 */
export async function initializeChatService(userId = null) {
    try {
        await chatService.initialize(userId);
        return chatService.getCurrentSessionId();
    } catch (error) {
        console.error("Error initializing chat service:", error);
        return null;
    }
}

/**
 * Get chat history from Supabase
 * @param {string} sessionId - Session ID
 * @param {number} limit - Number of messages to fetch
 * @returns {Promise<Array>} Array of messages
 */
export async function getChatHistory(sessionId, limit = 50) {
    try {
        return await chatService.getMessages(sessionId, limit);
    } catch (error) {
        console.error("Error getting chat history:", error);
        return [];
    }
}

/**
 * Save user feedback for a message
 * @param {string} messageId - Message ID
 * @param {number} rating - Rating from 1-5
 * @param {string} feedbackText - Optional feedback text
 */
export async function saveMessageFeedback(
    messageId,
    rating,
    feedbackText = null
) {
    try {
        await chatService.saveFeedback(messageId, rating, feedbackText);
    } catch (error) {
        console.error("Error saving feedback:", error);
        throw error;
    }
}

/**
 * Get chat sessions for the current user
 * @returns {Promise<Array>} Array of chat sessions
 */
export async function getChatSessions() {
    try {
        return await chatService.getSessions();
    } catch (error) {
        console.error("Error getting chat sessions:", error);
        return [];
    }
}

/**
 * Create a new chat session
 * @param {string} sessionName - Name for the session
 * @param {string} language - Language preference
 * @returns {Promise<string>} Session ID
 */
export async function createChatSession(
    sessionName = "New Chat",
    language = "ru"
) {
    try {
        return await chatService.createSession(sessionName, language);
    } catch (error) {
        console.error("Error creating chat session:", error);
        throw error;
    }
}

/**
 * Switch to a different chat session
 * @param {string} sessionId - Session ID to switch to
 */
export async function switchChatSession(sessionId) {
    try {
        chatService.setCurrentSessionId(sessionId);
        return sessionId;
    } catch (error) {
        console.error("Error switching chat session:", error);
        throw error;
    }
}

/**
 * Get session statistics
 * @param {string} sessionId - Session ID
 * @returns {Promise<Object>} Session statistics
 */
export async function getSessionStats(sessionId) {
    try {
        return await chatService.getSessionStats(sessionId);
    } catch (error) {
        console.error("Error getting session stats:", error);
        return null;
    }
}

/**
 * Stream a message response (for future implementation)
 * @param {string} message - Message to send
 * @param {Function} onChunk - Callback for each chunk
 * @param {Object} options - Additional options
 * @returns {Promise<string>} Complete response
 */
export async function streamGeminiMessage(message, onChunk, options = {}) {
    // This is a placeholder for future streaming implementation
    // For now, it falls back to regular message sending
    const response = await sendGeminiMessage(message, {
        ...options,
        stream: true,
    });

    // Simulate streaming by calling onChunk with the complete response
    if (onChunk && typeof onChunk === "function") {
        onChunk(response);
    }

    return response;
}

// Export utility functions
export { utils, chatUtils };
