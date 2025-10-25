import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

// Переводы интерфейса
const translations = {
    ru: {
        home: "Главная",
        categories: "Категории",
        places: "Места",
        tours: "Туры",
        back: "Назад",
        loading: "Загрузка...",
        error: "Ошибка загрузки",
        noData: "Нет данных",
        settings: "Настройки",
        language: "Язык",
        theme: "Тема",
        fontSize: "Размер шрифта",
        save: "Сохранить",
        cancel: "Отмена",
        explore: "Туризм в Мангистау",
        selectCategory: "Выберите категорию для просмотра мест",
        details: "Подробнее",
        search: "Поиск мест",
        searchPlaceholder: "Введите название места или описание...",
        searchResults: "Результаты поиска",
        noSearchResults: "Ничего не найдено по вашему запросу",
        featuredPlaces: "Рекомендуемые места",
        previous: "Предыдущее",
        next: "Следующее",
        slide: "Слайд",
        map: "Карта",
        placesOnMap: "Мест на карте",
        showOnMap: "Показать на карте",
        showAllPlaces: "Показать все места",
        settingsSaved: "Настройки сохранены",
        Move: "Открыть",
        legends: "Легенды",
        price: "Цена",
        company: "Компания",
        services: "Услуги",
        contact: "Контакты",
        moreDetails: "Подробнее",
        tourDetails: "О туре",
        backToTours: "Вернуться к турам",
        placesInThisTour: "Места в этом туре",
        availableTours: "Доступные туры",
        noTours: "Нет доступных туров",
        noToursForThisPlace: "Для этого места нет доступных туров",
        errorLoadingTours: "Ошибка загрузки туров",
        retry: "Повторить",
        noImage: "Нет изображения",
        about: "О нас",
        phone: "Телефон",
        instagram: "Инстаграм",
        aboutDescription:
            "Apex Tourism — это ваш проводник в изучении великолепного региона Мангистау. Наше приложение разработано, чтобы помочь путешественникам открывать для себя уникальные природные и культурные достопримечательности этой прекрасной области Казахстана.",
        ourMission: "Наша миссия",
        missionDescription:
            "Мы стремимся способствовать устойчивому туризму в Мангистау, предоставляя подробную информацию о местных достопримечательностях, повышая осведомленность о богатом культурном наследии региона и поддерживая местные предприятия и туроператоров.",
        whatWeOffer: "Что мы предлагаем",
        offer1: "Полная база данных туристических достопримечательностей Мангистау",
        offer2: "Подробная информация о каждом месте, включая историю, легенды и фотографии",
        offer3: "Интерактивная карта, которая поможет вам ориентироваться и исследовать регион",
        offer4: "Подобранные туры, созданные местными экспертами",
        offer5: "Информация о местной культуре, традициях и обычаях",
        offer6: "Отзывы пользователей и рейтинги, которые помогут вам принимать обоснованные решения",
        whyChooseUs: "Почему выбирают Apex Tourism?",
        whyChooseUsDescription:
            "Наша команда сочетает местную экспертизу с современными технологиями, чтобы обеспечить вам лучший возможный туристический опыт. Мы работаем напрямую с местными гидами и туроператорами, чтобы предоставить подлинные и незабываемые впечатления для наших посетителей.",
        trustedCompanion: "Ваш надежный туристический компаньон в Мангистау",
        // Company page translations
        companyAbout:
            "Mangystau Tour — это туристическая компания, специализирующаяся на организации путешествий по Мангистау. Мы показываем уникальную природу, исторические и культурные памятники региона, делая отдых ярким и незабываемым.",
        companyFounded: "Основано в 2015 году",
        companyAddress: "г. Актау, ул. Достык, 45",
        companyServices: [
            "Туры по Мангистау",
            "Экскурсии к Шерқала, Бозжыра, Тузбаир",
            "Сафари по степи",
            "Кемпинг и активный отдых",
        ],
        // Authentication translations
        profile: "Профиль",
        login: "Вход",
        signup: "Регистрация",
        email: "Email",
        password: "Пароль",
        fullName: "Полное имя",
        enterEmail: "Введите ваш email",
        enterPassword: "Введите ваш пароль",
        enterFullName: "Введите ваше полное имя",
        signIn: "Войти",
        signUp: "Зарегистрироваться",
        signOut: "Выйти",
        noAccount: "Нет аккаунта?",
        haveAccount: "Уже есть аккаунт?",
        register: "Зарегистрироваться",
        loginAction: "Войти",
        profileUpdated: "Профиль успешно обновлен",
        errorLoadingProfile: "Ошибка при загрузке профиля",
        saveChanges: "Сохранить изменения",
        saving: "Сохранение...",
        signingOut: "Выход...",
        checkEmail:
            "Пожалуйста, проверьте вашу почту и подтвердите адрес электронной почты.",
        fillAllFields: "Пожалуйста, заполните все поля",
        passwordMinLength: "Пароль должен содержать минимум 6 символов",
        signupSuccess:
            "Регистрация успешна! Проверьте ваш email для подтверждения.",
        confirmPassword: "Подтвердите пароль",
        enterPasswordAgain: "Введите пароль еще раз",
        // Application name
        appName: "Apex Tourism",
        // Instagram
        visitInstagram: "Посетить Instagram",
        // 360° view
        view360: "360° Просмотр",
        view360NotAvailable: "Пока недоступно",
        // Chat translations
        aiAssistant: "Ассистент",
        queuePending: "Очередь:",
        closeChat: "Закрыть чат",
        typeMessage: "Введите ваше сообщение...",
        sendMessage: "Отправить сообщение",
        send: "Отправить",
        chatError:
            "Извините, произошла ошибка. Пожалуйста, попробуйте еще раз.",
        chatWelcomeMessage:
            "Привет! Я ваш туристический гид по Мангистау. Задавайте вопросы о достопримечательностях, маршрутах и культуре региона.",
        copyMessage: "Копировать сообщение",
        regenerateMessage: "Перегенерировать сообщение",
        rateMessage: "Оценить сообщение",
        chatSessions: "История чатов",
        newChat: "Новый чат",
        offline: "Офлайн",
        offlineMessage: "Нет подключения к интернету",
        chatHint: "Нажмите Ctrl+Enter для отправки",
        suggestQuestion1: "Расскажи о достопримечательностях Мангистау",
        suggestQuestion2: "Какие туры доступны?",
        suggestQuestion3: "Покажи интересные места на карте",
        basicSettings: "Основные настройки",
        // Language names
        languageRussian: "Русский",
        languageEnglish: "English",
        languageKazakh: "Қазақша",
        // Theme names
        themeLight: "Светлая",
        themeDark: "Тёмная",
        // Font sizes
        fontSizeSmall: "Маленький",
        fontSizeNormal: "Обычный",
        fontSizeLarge: "Крупный",
        fontSizeExtraLarge: "Очень крупный",
        // Feedback translations
        visitorReviews: "Отзывы посетителей",
        averageRating: "Средняя оценка",
        reviews: "Отзывов",
        leaveReview: "Оставить отзыв",
        yourRating: "Ваша оценка:",
        yourComment: "Ваш комментарий:",
        shareExperience: "Поделитесь своими впечатлениями...",
        submitReview: "Отправить отзыв",
        submitting: "Отправка...",
        pleaseLoginToReview:
            "Пожалуйста, войдите в систему, чтобы оставить отзыв",
        pleaseRate: "Пожалуйста, поставьте оценку",
        reviewError: "Ошибка при отправке отзыва:",
        loadingReviews: "Загрузка отзывов...",
        errorLoadingReviews: "Ошибка загрузки отзывов:",
        noReviewsYet: "Пока нет отзывов. Будьте первым!",
        anonymousUser: "Анонимный пользователь",
        pleaseLoginOrSignup:
            "Пожалуйста, войдите или зарегистрируйтесь, чтобы оставить отзыв.",
        loginLink: "Войдите",
        signupLink: "Зарегистрируйтесь",
        // History page translations
        historyOfMangystau: "История Мангистау",
        historyCallToAction:
            "Узнайте о богатой истории и культурном наследии Мангистау, от древних времён до современности",
        exploreHistory: "Узнать историю",
        historicalTimeline: "Историческая хронология",
        interestingFacts: "Интересные факты",
        historicalPlaces: "Исторические места",
        historyIntro:
            "Мангистау — регион с богатейшей историей, хранящий следы древних цивилизаций, Великого Шёлкового пути и уникальной культуры казахского народа",
        // Временная линия
        history_era1_year: "V-III вв. до н.э.",
        history_era1_title: "Древние племена",
        history_era1_desc:
            "На территории Мангистау проживали сакские и массагетские племена, оставившие после себя древние некрополи и петроглифы",
        history_era2_year: "VIII-XII вв.",
        history_era2_title: "Великий Шёлковый путь",
        history_era2_desc:
            "Мангистау становится важным транзитным пунктом Великого Шёлкового пути, через который проходили караваны между Востоком и Западом",
        history_era3_year: "X-XIII вв.",
        history_era3_title: "Подземные мечети",
        history_era3_desc:
            "Строительство уникальных подземных мечетей Бекет-Ата, Шопан-Ата и Шакпак-Ата, ставших центрами суфизма в регионе",
        history_era4_year: "XVIII-XIX вв.",
        history_era4_title: "Казахские жузы",
        history_era4_desc:
            "Мангистау становится важным центром Младшего жуза, здесь происходят важные события казахской истории и формируется уникальная культура",
        history_era5_year: "XX век - наши дни",
        history_era5_title: "Современное развитие",
        history_era5_desc:
            "Развитие нефтегазовой промышленности, строительство Актау и превращение региона в важный экономический центр Казахстана",
        // Интересные факты
        history_fact1:
            "Мангистау — единственный регион в мире с таким количеством подземных мечетей, вырубленных в скалах",
        history_fact2:
            "Впадина Карагие — самая низкая точка на территории СНГ, расположенная на 132 метра ниже уровня моря",
        history_fact3:
            "Название 'Мангистау' происходит от тюркского 'Мың қыстау' — 'тысяча зимовок', что отражает кочевой образ жизни предков",
        history_fact4:
            "Каньон Бозжыра — дно древнего океана, где были найдены зубы акул и раковины моллюсков",
        history_fact5:
            "Мангистау был домом для многих суфийских шейхов и святых, чьи мавзолеи до сих пор являются местами паломничества",
        history_fact6:
            "Миллионы лет назад территория Мангистау была дном океана Тетис, затем океан отступил, и на его месте образовались засушливые степи и живописные каньоны",
        // Расширенные описания эпох для модального окна
        history_era1_full:
            "В этот период на территории современного Мангистау обитали воинственные сакские племена, известные своим искусством верховой езды и изготовления золотых украшений. Массагеты, согласно древним источникам, разгромили армию персидского царя Кира II. Археологические раскопки обнаружили множество курганов с богатыми захоронениями, содержащими оружие, украшения и предметы быта. Петроглифы того периода изображают сцены охоты, ритуальные танцы и астрономические наблюдения.",
        history_era2_full:
            "Мангистау занимал стратегическое положение на Великом Шёлковом пути, соединяя Восток и Запад. Через регион проходили караваны с шелком, специями, драгоценными камнями и другими товарами. Вдоль торговых путей возникали караван-сараи, где путники могли отдохнуть и пополнить запасы. Этот период способствовал культурному обмену между различными цивилизациями, распространению новых технологий, религиозных идей и научных знаний.",
        history_era3_full:
            "Строительство подземных мечетей стало уникальным явлением в исламской архитектуре. Мечети Бекет-Ата, Шопан-Ата и Шакпак-Ата были высечены в скалах и служили не только местами поклонения, но и убежищами для суфийских учителей и их последователей. Эти святые места привлекали паломников со всей Центральной Азии. Подземные помещения создавали особую акустику и микроклимат, способствующие медитации и духовным практикам.",
        history_era4_full:
            "В этот период Мангистау стал важным политическим и культурным центром казахского народа. Здесь формировались родовые традиции, развивалось устное народное творчество, создавались эпические поэмы. Регион был ареной важных исторических событий, включая казахско-джунгарские войны и процесс присоединения к Российской империи. Некрополи этого периода демонстрируют высокое мастерство каменной резьбы и уникальные архитектурные формы.",
        history_era5_full:
            "XX век принес радикальные изменения в жизнь региона. Открытие месторождений нефти и газа в 1960-х годах привело к индустриализации Мангистау. Был построен город Актау (первоначально Шевченко) - первый в СССР город, полностью обеспечиваемый опресненной морской водой. Развитие атомной энергетики, создание Мангышлакского атомно-энергетического комбината стало важной вехой. Сегодня Мангистау - динамично развивающийся регион Казахстана с богатой историей и перспективным будущем.",
    },
    en: {
        home: "Home",
        categories: "Categories",
        places: "Places",
        tours: "Tours",
        back: "Back",
        loading: "Loading...",
        error: "Loading Error",
        noData: "No Data",
        settings: "Settings",
        language: "Language",
        theme: "Theme",
        fontSize: "Font Size",
        save: "Save",
        cancel: "Cancel",
        explore: "Tourism in Mangystau",
        selectCategory: "Select a Category to View Places",
        details: "Details",
        search: "Search Places",
        searchPlaceholder: "Enter place name or description...",
        searchResults: "Search Results",
        noSearchResults: "Nothing Found for Your Request",
        featuredPlaces: "Featured Places",
        previous: "Previous",
        next: "Next",
        slide: "Slide",
        map: "Map",
        placesOnMap: "Places on Map",
        showOnMap: "Show on Map",
        showAllPlaces: "Show All Places",
        settingsSaved: "Settings Saved",
        Move: "Open",
        legends: "Legends",
        price: "Price",
        company: "Company",
        services: "Services",
        contact: "Contact",
        moreDetails: "More Details",
        tourDetails: "Tour Details",
        backToTours: "Back to Tours",
        placesInThisTour: "Places in This Tour",
        availableTours: "Available Tours",
        noTours: "No Tours Available",
        noToursForThisPlace: "No Tours Available for This Place",
        errorLoadingTours: "Error Loading Tours",
        retry: "Retry",
        noImage: "No Image",
        about: "About Us",
        phone: "Phone",
        instagram: "Instagram",
        aboutDescription:
            "Apex Tourism is your gateway to exploring the magnificent Mangystau region. Our application is designed to help travelers discover the unique natural and cultural attractions of this beautiful area in Kazakhstan.",
        ourMission: "Our Mission",
        missionDescription:
            "We aim to promote sustainable tourism in Mangystau by providing detailed information about local attractions, creating awareness about the region's rich cultural heritage, and supporting local businesses and tour operators.",
        whatWeOffer: "What We Offer",
        offer1: "Comprehensive database of tourist attractions in Mangystau",
        offer2: "Detailed information about each location including history, legends, and photos",
        offer3: "Interactive map to help you navigate and explore the region",
        offer4: "Curated tours created by local experts",
        offer5: "Information about local culture, traditions, and customs",
        offer6: "User reviews and ratings to help you make informed decisions",
        whyChooseUs: "Why Choose Apex Tourism?",
        whyChooseUsDescription:
            "Our team combines local expertise with modern technology to provide you with the best possible travel experience. We work directly with local guides and tour operators to ensure authentic and memorable experiences for our visitors.",
        trustedCompanion: "Your Trusted Travel Companion in Mangystau",
        // Company page translations
        companyAbout:
            "Mangystau Tour is a travel company specializing in organizing trips across Mangystau. We showcase the region's unique nature, historical and cultural landmarks, making your journey bright and unforgettable.",
        companyFounded: "Founded in 2015",
        companyAddress: "Aktau, Dostyk St., 45",
        companyServices: [
            "Mangystau Tours",
            "Excursions to Sherkala, Bozzhyra, Tuzbair",
            "Steppe Safari",
            "Camping and Outdoor Activities",
        ],
        // Authentication translations
        profile: "Profile",
        login: "Login",
        signup: "Sign Up",
        email: "Email",
        password: "Password",
        fullName: "Full Name",
        enterEmail: "Enter Your Email",
        enterPassword: "Enter Your Password",
        enterFullName: "Enter Your Full Name",
        signIn: "Sign In",
        signUp: "Sign Up",
        signOut: "Sign Out",
        noAccount: "No Account?",
        haveAccount: "Already Have an Account?",
        register: "Register",
        loginAction: "Log In",
        profileUpdated: "Profile Updated Successfully",
        errorLoadingProfile: "Error Loading Profile",
        saveChanges: "Save Changes",
        saving: "Saving...",
        signingOut: "Signing Out...",
        checkEmail: "Please Check Your Email and Confirm Your Email Address.",
        fillAllFields: "Please Fill in All Fields",
        passwordMinLength: "Password Must Be at Least 6 Characters",
        signupSuccess:
            "Registration Successful! Please Check Your Email for Confirmation.",
        confirmPassword: "Confirm Password",
        enterPasswordAgain: "Enter Password Again",
        // Application name
        appName: "Apex Tourism",
        // Instagram
        visitInstagram: "Visit Instagram",
        // 360° view
        view360: "360° View",
        view360NotAvailable: "Not Available Yet",
        // Chat translations
        aiAssistant: "Assistant",
        queuePending: "Queue:",
        closeChat: "Close Chat",
        typeMessage: "Type Your Message...",
        sendMessage: "Send Message",
        send: "Send",
        chatError: "Sorry, I Encountered an Error. Please Try Again.",
        chatWelcomeMessage:
            "Hello! I'm Your Tourism Guide for Mangystau. Ask Questions About Attractions, Routes, and Regional Culture.",
        copyMessage: "Copy Message",
        regenerateMessage: "Regenerate Message",
        rateMessage: "Rate Message",
        chatSessions: "Chat History",
        newChat: "New Chat",
        offline: "Offline",
        offlineMessage: "No Internet Connection",
        chatHint: "Press Ctrl+Enter to Send",
        suggestQuestion1: "Tell Me About Mangystau Attractions",
        suggestQuestion2: "What Tours Are Available?",
        suggestQuestion3: "Show Interesting Places on the Map",
        basicSettings: "Basic Settings",
        // Language names
        languageRussian: "Русский",
        languageEnglish: "English",
        languageKazakh: "Қазақша",
        // Theme names
        themeLight: "Light",
        themeDark: "Dark",
        // Font sizes
        fontSizeSmall: "Small",
        fontSizeNormal: "Normal",
        fontSizeLarge: "Large",
        fontSizeExtraLarge: "Extra Large",
        // Feedback translations
        visitorReviews: "Visitor Reviews",
        averageRating: "Average Rating",
        reviews: "Reviews",
        leaveReview: "Leave a Review",
        yourRating: "Your Rating:",
        yourComment: "Your Comment:",
        shareExperience: "Share Your Experience...",
        submitReview: "Submit Review",
        submitting: "Submitting...",
        pleaseLoginToReview: "Please Log in to Leave a Review",
        pleaseRate: "Please Provide a Rating",
        reviewError: "Error Submitting Review:",
        loadingReviews: "Loading Reviews...",
        errorLoadingReviews: "Error Loading Reviews:",
        noReviewsYet: "No Reviews Yet. Be the First!",
        anonymousUser: "Anonymous User",
        pleaseLoginOrSignup: "Please Log in or Sign up to Leave a Review.",
        loginLink: "Log In",
        signupLink: "Sign Up",
        // History page translations
        historyOfMangystau: "History of Mangystau",
        historyCallToAction:
            "Learn about the rich history and cultural heritage of Mangystau, from ancient times to the present",
        exploreHistory: "Explore History",
        historicalTimeline: "Historical Timeline",
        interestingFacts: "Interesting Facts",
        historicalPlaces: "Historical Places",
        historyIntro:
            "Mangystau is a region with a rich history, preserving traces of ancient civilizations, the Great Silk Road and the unique culture of the Kazakh people",
        // Timeline
        history_era1_year: "V-III centuries BC",
        history_era1_title: "Ancient Tribes",
        history_era1_desc:
            "Saka and Massagetae tribes lived in Mangystau, leaving behind ancient necropolises and petroglyphs",
        history_era2_year: "VIII-XII centuries",
        history_era2_title: "Great Silk Road",
        history_era2_desc:
            "Mangystau becomes an important transit point on the Great Silk Road, through which caravans passed between East and West",
        history_era3_year: "X-XIII centuries",
        history_era3_title: "Underground Mosques",
        history_era3_desc:
            "Construction of unique underground mosques Beket-Ata, Shopan-Ata and Shakpak-Ata, which became centers of Sufism in the region",
        history_era4_year: "XVIII-XIX centuries",
        history_era4_title: "Kazakh Zhuzes",
        history_era4_desc:
            "Mangystau becomes an important center of the Junior Zhuz, important events of Kazakh history take place here and a unique culture is formed",
        history_era5_year: "XX century - present",
        history_era5_title: "Modern Development",
        history_era5_desc:
            "Development of the oil and gas industry, construction of Aktau and transformation of the region into an important economic center of Kazakhstan",
        // Interesting facts
        history_fact1:
            "Mangystau is the only region in the world with so many underground mosques carved into the rocks",
        history_fact2:
            "The Karagiye Depression is the lowest point in the CIS territory, located 132 meters below sea level",
        history_fact3:
            "The name 'Mangystau' comes from the Turkic 'Mıñ qıstaw' - 'a thousand winter camps', which reflects the nomadic lifestyle of ancestors",
        history_fact4:
            "The Bozzhyra Canyon is the bottom of an ancient ocean, where shark teeth and mollusk shells have been found",
        history_fact5:
            "Mangystau was home to many Sufi sheikhs and saints, whose mausoleums are still places of pilgrimage",
        history_fact6:
            "Millions of years ago, the Mangystau territory was the bottom of the Tethys Ocean, then the ocean receded, and in its place arid steppes and picturesque canyons were formed",
        // Extended era descriptions for modal
        history_era1_full:
            "During this period, the territory of modern Mangystau was inhabited by warlike Saka tribes, known for their horsemanship and gold jewelry making. The Massagetae, according to ancient sources, defeated the army of Persian King Cyrus II. Archaeological excavations have discovered many burial mounds with rich burials containing weapons, jewelry and household items. Petroglyphs from that period depict hunting scenes, ritual dances and astronomical observations.",
        history_era2_full:
            "Mangystau occupied a strategic position on the Great Silk Road, connecting East and West. Caravans with silk, spices, precious stones and other goods passed through the region. Caravanserais arose along trade routes where travelers could rest and replenish supplies. This period facilitated cultural exchange between different civilizations, the spread of new technologies, religious ideas and scientific knowledge.",
        history_era3_full:
            "The construction of underground mosques became a unique phenomenon in Islamic architecture. The mosques of Beket-Ata, Shopan-Ata and Shakpak-Ata were carved into rocks and served not only as places of worship, but also as shelters for Sufi teachers and their followers. These holy places attracted pilgrims from all over Central Asia. Underground premises created special acoustics and microclimate conducive to meditation and spiritual practices.",
        history_era4_full:
            "During this period, Mangystau became an important political and cultural center of the Kazakh people. Tribal traditions were formed here, oral folk art developed, and epic poems were created. The region was the arena of important historical events, including the Kazakh-Dzungar wars and the process of joining the Russian Empire. Necropolises of this period demonstrate high mastery of stone carving and unique architectural forms.",
        history_era5_full:
            "The 20th century brought radical changes to the life of the region. The discovery of oil and gas fields in the 1960s led to the industrialization of Mangystau. The city of Aktau (originally Shevchenko) was built - the first city in the USSR completely supplied with desalinated seawater. The development of nuclear energy and the creation of the Mangyshlak Atomic Energy Complex became an important milestone. Today Mangystau is a dynamically developing region of Kazakhstan with a rich history and a promising future.",
    },
    kz: {
        home: "Басты бет",
        categories: "Санаттар",
        places: "Орындар",
        tours: "Турлар",
        back: "Артқа",
        loading: "Жүктелуде...",
        error: "Жүктеу қатесі",
        noData: "Деректер жоқ",
        settings: "Баптаулар",
        language: "Тіл",
        theme: "Тақырып",
        fontSize: "Қаріп өлшемі",
        save: "Сақтау",
        cancel: "Болдырмау",
        explore: "Маңғыстаудағы туризм",
        selectCategory: "Орындарды көру үшін санатты таңдаңыз",
        details: "Толығырақ",
        search: "Орындарды іздеу",
        searchPlaceholder: "Орын атауын немесе сипаттамасын енгізіңіз...",
        searchResults: "Іздеу нәтижелері",
        noSearchResults: "Сұрауыңыз бойынша ештеңе табылмады",
        featuredPlaces: "Ұсынылатын орындар",
        previous: "Алдыңғы",
        next: "Келесі",
        slide: "Слайд",
        map: "Карта",
        placesOnMap: "Картадағы орындар",
        showOnMap: "Картада көрсету",
        showAllPlaces: "Барлық орындарды көрсету",
        settingsSaved: "Баптаулар сақталды",
        Move: "Ашу",
        legends: "Аңыздар",
        price: "Бағасы",
        company: "Компания",
        services: "Қызметтер",
        contact: "Байланыс",
        moreDetails: "Толығырақ",
        tourDetails: "Тур туралы",
        backToTours: "Турларға қайту",
        placesInThisTour: "Осы турдағы орындар",
        availableTours: "Қолжетімді турлар",
        noTours: "Қолжетімді турлар жоқ",
        noToursForThisPlace: "Осы орын үшін қолжетімді турлар жоқ",
        errorLoadingTours: "Турларды жүктеу қатесі",
        retry: "Қайталау",
        noImage: "Сурет жоқ",
        about: "Біз туралы",
        phone: "Телефон",
        instagram: "Instagram",
        aboutDescription:
            "Apex Tourism — Маңғыстау өңірін зерттеуге арналған негізгі қақпаңыз. Біздің қолданба саяхатшыларға Қазақстанның осы ғажайып аймағының бірегей табиғи және мәдени көрнекті жерлерін ашуға көмектеседі.",
        ourMission: "Біздің миссиямыз",
        missionDescription:
            "Біз Маңғыстауда тұрақты туризмді насихаттау мақсатында жергілікті көрнекті жерлер туралы егжей-тегжейлі ақпарат беру, өңірдің бай мәдени мұрасы туралы хабардарлықты арттыру және жергілікті кәсіпкерлер мен туроператорларға қолдау көрсету мақсатында жұмыс істейміз.",
        whatWeOffer: "Біз ұсынатын мүмкіндіктер",
        offer1: "Маңғыстаудағы туристік көрнекті жерлердің толық дерекқоры",
        offer2: "Әрбір орынның тарихы, аңыздары және фотосуреттері туралы егжей-тегжейлі ақпарат",
        offer3: "Өңірде бағдарлауға және зерттеуге көмектесетін интерактивті карта",
        offer4: "Жергілікті мамандар жасаған таңдаулы турлар",
        offer5: "Жергілікті мәдениет, дәстүрлер және әдет-ғұрыптар туралы ақпарат",
        offer6: "Шешім қабылдауға көмектесетін пайдаланушы пікірлері мен рейтингтері",
        whyChooseUs: "Неліктен Apex Tourism таңдау керек?",
        whyChooseUsDescription:
            "Біздің команда жергілікті тәжірибені заманауи технологиялармен ұштастырып, сізге ең жақсы саяхат тәжірибесін ұсынады. Біз жергілікті гидтар мен туроператорлармен тікелей жұмыс істеп, қонақтарымыз үшін шынайы және есте қаларлық тәжірибелерді қамтамасыз етеміз.",
        trustedCompanion: "Маңғыстаудағы сенімді саяхат серігіңіз",
        // Company page translations
        companyAbout:
            "Mangystau Tour — Маңғыстау бойынша сапарларды ұйымдастыруға маманданған туристік компания. Біз аймақтың ерекше табиғатын, тарихи және мәдени орындарын көрсетеміз, демалысты жарқын әрі есте қаларлық етеміз.",
        companyFounded: "2015 жылы құрылған",
        companyAddress: "Ақтау қ., Достық көш., 45",
        companyServices: [
            "Маңғыстау турлары",
            "Шерқала, Бозжыра, Тұзбайыр экскурсиялары",
            "Дала сафарисі",
            "Кемпинг және белсенді демалыс",
        ],
        // Authentication translations
        profile: "Профиль",
        login: "Кіру",
        signup: "Тіркелу",
        email: "Email",
        password: "Құпия сөз",
        fullName: "Толық аты",
        enterEmail: "Email енгізіңіз",
        enterPassword: "Құпия сөзді енгізіңіз",
        enterFullName: "Толық атыңызды енгізіңіз",
        signIn: "Кіру",
        signUp: "Тіркелу",
        signOut: "Шығу",
        noAccount: "Тіркелгі жоқ па?",
        haveAccount: "Тіркелгіңіз бар ма?",
        register: "Тіркелу",
        loginAction: "Кіру",
        profileUpdated: "Профиль сәтті жаңартылды",
        errorLoadingProfile: "Профильді жүктеу қатесі",
        saveChanges: "Өзгерістерді сақтау",
        saving: "Сақталуда...",
        signingOut: "Шығу...",
        checkEmail: "Электрондық поштаңызды тексеріп, мекенжайыңызды растаңыз.",
        fillAllFields: "Барлық өрістерді толтырыңыз",
        passwordMinLength: "Құпия сөз кемінде 6 таңбадан тұруы керек",
        signupSuccess:
            "Тіркеу сәтті өтті! Растау үшін электрондық поштаңызды тексеріңіз.",
        confirmPassword: "Құпия сөзді растау",
        enterPasswordAgain: "Құпия сөзді қайта енгізіңіз",
        // Application name
        appName: "Apex Tourism",
        // Instagram
        visitInstagram: "Instagram-ға өту",
        // 360° view
        view360: "360° Көрініс",
        view360NotAvailable: "Әзірше қолжетімді емес",
        // Chat translations
        aiAssistant: "Ассистент",
        queuePending: "Кезек:",
        closeChat: "Чатты жабу",
        typeMessage: "Хабарламаңызды теріңіз...",
        sendMessage: "Хабарлама жіберу",
        send: "Жіберу",
        chatError: "Кешіріңіз, қате орын алды. Қайтадан көріңіз.",
        chatWelcomeMessage:
            "Сәлем! Мен Маңғыстау өңірінің туризм гидімін. Көрнекті жерлер, маршруттар және өңір мәдениеті туралы сұрақтар қойыңыз.",
        copyMessage: "Хабарламаны көшіру",
        regenerateMessage: "Хабарламаны қайта жасау",
        rateMessage: "Хабарламаны бағалау",
        chatSessions: "Чат тарихы",
        newChat: "Жаңа чат",
        offline: "Офлайн",
        offlineMessage: "Интернет байланысы жоқ",
        chatHint: "Жіберу үшін Ctrl+Enter басыңыз",
        suggestQuestion1: "Маңғыстау көрнекті жерлері туралы айтып бер",
        suggestQuestion2: "Қандай турлар бар?",
        suggestQuestion3: "Картада қызықты жерлерді көрсет",
        basicSettings: "Негізгі баптаулар",
        // Language names
        languageRussian: "Русский",
        languageEnglish: "English",
        languageKazakh: "Қазақша",
        // Theme names
        themeLight: "Жарық",
        themeDark: "Қараңғы",
        // Font sizes
        fontSizeSmall: "Кіші",
        fontSizeNormal: "Қалыпты",
        fontSizeLarge: "Үлкен",
        fontSizeExtraLarge: "Өте үлкен",
        // Feedback translations
        visitorReviews: "Қонақтардың пікірлері",
        averageRating: "Орташа бағалау",
        reviews: "Пікір",
        leaveReview: "Пікір қалдыру",
        yourRating: "Сіздің бағалауыңыз:",
        yourComment: "Сіздің пікіріңіз:",
        shareExperience: "Өз тәжірибеңізбен бөлісіңіз...",
        submitReview: "Пікір жіберу",
        submitting: "Жіберілуде...",
        pleaseLoginToReview: "Пікір қалдыру үшін жүйеге кіріңіз",
        pleaseRate: "Бағалау қалдырыңыз",
        reviewError: "Пікір жіберу қатесі:",
        loadingReviews: "Пікірлер жүктелуде...",
        errorLoadingReviews: "Пікірлерді жүктеу қатесі:",
        noReviewsYet: "Әлі пікірлер жоқ. Бірінші болыңыз!",
        anonymousUser: "Анонимді пайдаланушы",
        pleaseLoginOrSignup: "Пікір қалдыру үшін кіріңіз немесе тіркеліңіз.",
        loginLink: "Кіріңіз",
        signupLink: "Тіркеліңіз",
        // History page translations
        historyOfMangystau: "Маңғыстау тарихы",
        historyCallToAction:
            "Ежелгі заманнан бүгінге дейінгі Маңғыстаудың бай тарихы мен мәдени мұрасымен танысыңыз",
        exploreHistory: "Тарихпен танысу",
        historicalTimeline: "Тарихи хронология",
        interestingFacts: "Қызықты фактілер",
        historicalPlaces: "Тарихи орындар",
        historyIntro:
            "Маңғыстау — ежелгі өркениеттердің, Ұлы Жібек жолының және қазақ халқының бірегей мәдениетінің іздерін сақтайтын бай тарихы бар өңір",
        // Timeline
        history_era1_year: "б.з.д. V-III ғғ.",
        history_era1_title: "Ежелгі тайпалар",
        history_era1_desc:
            "Маңғыстау аумағында сақ және массагет тайпалары тұрған, олар ежелгі некрополдер мен петроглифтерді қалдырды",
        history_era2_year: "VIII-XII ғғ.",
        history_era2_title: "Ұлы Жібек жолы",
        history_era2_desc:
            "Маңғыстау Ұлы Жібек жолының маңызды транзиттік нүктесіне айналады, ол арқылы Шығыс пен Батыс арасында керуендер өтті",
        history_era3_year: "X-XIII ғғ.",
        history_era3_title: "Жерасты мешіттері",
        history_era3_desc:
            "Өңірдегі сопылық орталықтарына айналған Бекет-Ата, Шопан-Ата және Шақпақ-Ата бірегей жерасты мешіттерінің салынуы",
        history_era4_year: "XVIII-XIX ғғ.",
        history_era4_title: "Қазақ жүздері",
        history_era4_desc:
            "Маңғыстау Кіші жүздің маңызды орталығына айналады, мұнда қазақ тарихының маңызды оқиғалары болады және бірегей мәдениет қалыптасады",
        history_era5_year: "XX ғ. - қазіргі күн",
        history_era5_title: "Қазіргі даму",
        history_era5_desc:
            "Мұнай-газ өнеркәсібінің дамуы, Ақтаудың салынуы және өңірдің Қазақстанның маңызды экономикалық орталығына айналуы",
        // Interesting facts
        history_fact1:
            "Маңғыстау — жартастарға қашалған көптеген жерасты мешіттері бар әлемдегі жалғыз өңір",
        history_fact2:
            "Қарақия ойпаты — ТМД аумағындағы ең төмен нүкте, теңіз деңгейінен 132 метр төмен орналасқан",
        history_fact3:
            "'Маңғыстау' атауы түркі тілінен 'Мың қыстау' дегенді білдіреді - бұл аталардың көшпелі өмір салтын көрсетеді",
        history_fact4:
            "Бозжыра шатқалы — ежелгі мұхит түбі, мұнда акулалардың тістері мен ұлу қабықтары табылған",
        history_fact5:
            "Маңғыстау көптеген сопы шейхтері мен әулиелердің отаны болды, олардың мавзолейлері әлі күнге дейін қажылық орындары болып табылады",
        history_fact6:
            "Бұдан миллиондаған жыл бұрын Маңғыстау аумағы Тетис мұхитының түбі болған, кейін мұхит тартылып, оның орнында құрғақ дала мен әсем шатқалдар қалыптасты",
        // Модальды терезе үшін кеңейтілген дәуір сипаттамалары
        history_era1_full:
            "Бұл кезеңде қазіргі Маңғыстау аумағында ат мінгіш өнері мен алтын зергерлік бұйымдарын жасаумен танымал жауынгер сақ тайпалары тұрды. Массагеттер, ежелгі деректерге сәйкес, парсы патшасы Кир II әскерін жеңді. Археологиялық қазба жұмыстары қару-жарақ, зергерлік бұйымдар мен тұрмыстық заттары бар бай қоршаулармен көптеген обалар тапты. Сол кезеңнің петроглифтерінде аңшылық көріністері, рәсімдік билер және астрономиялық бақылаулар бейнеленген.",
        history_era2_full:
            "Маңғыстау Ұлы Жібек жолында стратегиялық орынды иеленіп, Шығыс пен Батысты байланыстырды. Өңір арқылы жібек, дәмдеуіштер, асыл тастар және басқа тауарлармен керуендер өтті. Сауда жолдары бойында саудагерлер демалып, қорларын толықтыра алатын керуен-сарайлар пайда болды. Бұл кезең әртүрлі өркениеттер арасындағы мәдени алмасуға, жаңа технологиялардың, діни идеялар мен ғылыми білімдердің таралуына ықпал етті.",
        history_era3_full:
            "Жерасты мешіттерін салу ислам сәулетіндегі бірегей құбылысқа айналды. Бекет-Ата, Шопан-Ата және Шақпақ-Ата мешіттері жартастарға қашалған және тек құлшылық орындары ғана емес, сонымен қатар сопылық ұстаздар мен олардың ізбасарларына пана болды. Бұл қасиетті орындар бүкіл Орталық Азиядан қажылар тартты. Жерасты үй-жайлары медитация мен рухани тәжірибелерге ықпал ететін арнайы акустика мен микроклимат жасады.",
        history_era4_full:
            "Бұл кезеңде Маңғыстау қазақ халқының маңызды саяси және мәдени орталығына айналды. Мұнда рулық дәстүрлер қалыптасты, ауызша халық шығармашылығы дамып, эпостық поэмалар жасалды. Өңір қазақ-жоңғар соғыстары мен Ресей империясына қосылу процесін қоса алғанда, маңызды тарихи оқиғалардың ұйымы болды. Осы кезеңнің некрополдері тас ою өнерінің жоғары шеберлігі мен бірегей сәулеттік формаларды көрсетеді.",
        history_era5_full:
            "XX ғасыр өңір өміріне түбегейлі өзгерістер әкелді. 1960 жылдардағы мұнай мен газ кен орындарының ашылуы Маңғыстаудың индустрияландырылуына әкелді. Ақтау қаласы (бастапқыда Шевченко) салынды - КСРО-дағы тұзсыздандырылған теңіз суымен толық қамтамасыз етілген алғашқы қала. Атом энергетикасының дамуы, Маңғышлақ атом энергетикасы комбинатының құрылуы маңызды кезең болды. Бүгінгі күні Маңғыстау - бай тарихы мен перспективалы болашағы бар Қазақстанның қарқынды дамып келе жатқан өңірі.",
    },
};

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState("ru");

    useEffect(() => {
        const savedLanguage = localStorage.getItem("app_language") || "ru";
        setLanguage(savedLanguage);
    }, []);

    const changeLanguage = (newLanguage) => {
        setLanguage(newLanguage);
        localStorage.setItem("app_language", newLanguage);
    };

    const t = (key) => translations[language][key] || key;

    // Функция для получения названия поля в зависимости от языка
    const getLocalizedField = (obj, fieldName) => {
        if (!obj) return "";
        const localizedField = `${fieldName}_${language}`;
        return (
            obj[localizedField] ||
            obj[`${fieldName}_ru`] ||
            obj[`${fieldName}_en`] ||
            obj[`${fieldName}_kz`] ||
            ""
        );
    };

    const value = {
        language,
        changeLanguage,
        t,
        getLocalizedField,
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
