-- 📝 Пример первой тестовой статьи для проверки системы
-- Скопируйте и выполните этот SQL в Supabase SQL Editor

-- Статья 1: Великий Шёлковый путь
INSERT INTO articles (
    slug,
    title_ru,
    title_en,
    title_kz,
    excerpt_ru,
    excerpt_en,
    excerpt_kz,
    content_ru,
    content_en,
    content_kz,
    category_ru,
    category_en,
    category_kz,
    cover_image,
    author
) VALUES (
    'velikij-shelkovyj-put-v-mangystau',
    
    'Великий Шёлковый путь в Мангистау',
    'The Great Silk Road in Mangystau',
    'Маңғыстаудағы Ұлы Жібек жолы',
    
    'История торговых караванов, проходивших через Мангистау, и их влияние на культуру региона. Узнайте о караван-сараях, товарах и культурном обмене.',
    'The history of trade caravans passing through Mangystau and their influence on the region''s culture. Learn about caravanserais, goods and cultural exchange.',
    'Маңғыстау арқылы өткен сауда керуендерінің тарихы және олардың өңір мәдениетіне әсері. Керуен-сарайлар, тауарлар және мәдени алмасу туралы біліңіз.',
    
    -- Русский контент
    '<h2>Введение</h2>
    <p>Великий Шёлковый путь — одна из самых значимых торговых магистралей в истории человечества, соединявшая Восток и Запад на протяжении многих веков. Мангистау занимал важное стратегическое положение на этом пути, являясь связующим звеном между Центральной Азией и Каспийским регионом.</p>
    
    <h2>Исторический контекст</h2>
    <p>В период с VIII по XII века через территорию современного Мангистау проходили караваны, везущие разнообразные товары:</p>
    <ul>
        <li><strong>Шёлк из Китая</strong> — самый ценный товар, давший название всему пути</li>
        <li><strong>Специи из Индии</strong> — перец, корица, шафран</li>
        <li><strong>Драгоценные камни</strong> — рубины, изумруды, лазурит</li>
        <li><strong>Керамика и стекло</strong> — изделия из Персии и Средней Азии</li>
        <li><strong>Металлы и оружие</strong> — железо, сталь, доспехи</li>
    </ul>
    
    <h2>Караван-сараи Мангистау</h2>
    <p>Вдоль торговых путей возникали караван-сараи — постоялые дворы для купцов и путников. Эти сооружения служили не только местом отдыха, но и торговыми центрами, где можно было:</p>
    <ul>
        <li>Отдохнуть и восстановить силы</li>
        <li>Пополнить запасы воды и провизии</li>
        <li>Обменяться товарами</li>
        <li>Получить информацию о дорогах</li>
        <li>Найти охрану для дальнейшего пути</li>
    </ul>
    
    <blockquote>
    «Шёлковый путь был не просто торговой дорогой — это был мост между цивилизациями, по которому шли не только товары, но и идеи, знания, религии и культуры»
    </blockquote>
    
    <h2>Культурный обмен</h2>
    <p>Торговые караваны принесли в Мангистау не только материальные богатства, но и способствовали культурному обмену:</p>
    <ul>
        <li><strong>Новые технологии</strong> — методы обработки металлов, ткачество, гончарное дело</li>
        <li><strong>Религиозные идеи</strong> — распространение ислама в регионе</li>
        <li><strong>Архитектурные стили</strong> — влияние персидской и среднеазиатской архитектуры</li>
        <li><strong>Научные знания</strong> — математика, астрономия, медицина</li>
        <li><strong>Искусство</strong> — каллиграфия, орнаменты, музыка</li>
    </ul>
    
    <h2>Археологические находки</h2>
    <p>Современные археологи продолжают находить следы древних караванных путей на территории Мангистау. Среди находок:</p>
    <ul>
        <li>Остатки караван-сараев</li>
        <li>Керамические изделия из разных регионов</li>
        <li>Монеты различных государств</li>
        <li>Фрагменты тканей и украшений</li>
    </ul>
    
    <h2>Влияние на современность</h2>
    <p>Наследие Великого Шёлкового пути живо и сегодня. Многие исторические памятники Мангистау, которые мы можем посетить, связаны именно с этим периодом. Подземные мечети, некрополи и древние поселения хранят память о тех временах, когда через эти земли проходили караваны с сокровищами.</p>
    
    <h2>Заключение</h2>
    <p>Великий Шёлковый путь оставил неизгладимый след в истории и культуре Мангистау. Этот регион был свидетелем встречи различных цивилизаций, обмена идеями и культурами. Сегодня мы можем увидеть это наследие в архитектуре, традициях и духовной культуре региона.</p>',
    
    -- English контент
    '<h2>Introduction</h2>
    <p>The Great Silk Road was one of the most significant trade routes in human history, connecting East and West for many centuries. Mangystau occupied an important strategic position on this route, serving as a link between Central Asia and the Caspian region.</p>
    
    <h2>Historical Context</h2>
    <p>During the period from the 8th to 12th centuries, caravans carrying diverse goods passed through the territory of modern Mangystau:</p>
    <ul>
        <li><strong>Silk from China</strong> — the most valuable commodity that gave its name to the entire route</li>
        <li><strong>Spices from India</strong> — pepper, cinnamon, saffron</li>
        <li><strong>Precious stones</strong> — rubies, emeralds, lapis lazuli</li>
        <li><strong>Ceramics and glass</strong> — products from Persia and Central Asia</li>
        <li><strong>Metals and weapons</strong> — iron, steel, armor</li>
    </ul>
    
    <h2>Caravanserais of Mangystau</h2>
    <p>Along trade routes, caravanserais emerged — inns for merchants and travelers. These structures served not only as resting places but also as trading centers where one could:</p>
    <ul>
        <li>Rest and restore strength</li>
        <li>Replenish water and provisions</li>
        <li>Exchange goods</li>
        <li>Get information about routes</li>
        <li>Find guards for further journey</li>
    </ul>
    
    <blockquote>
    "The Silk Road was not just a trade route — it was a bridge between civilizations, carrying not only goods but also ideas, knowledge, religions and cultures"
    </blockquote>
    
    <h2>Cultural Exchange</h2>
    <p>Trade caravans brought not only material wealth to Mangystau but also contributed to cultural exchange:</p>
    <ul>
        <li><strong>New technologies</strong> — methods of metalworking, weaving, pottery</li>
        <li><strong>Religious ideas</strong> — spread of Islam in the region</li>
        <li><strong>Architectural styles</strong> — influence of Persian and Central Asian architecture</li>
        <li><strong>Scientific knowledge</strong> — mathematics, astronomy, medicine</li>
        <li><strong>Art</strong> — calligraphy, ornaments, music</li>
    </ul>
    
    <h2>Archaeological Findings</h2>
    <p>Modern archaeologists continue to find traces of ancient caravan routes in Mangystau. Among the findings:</p>
    <ul>
        <li>Remains of caravanserais</li>
        <li>Ceramic products from different regions</li>
        <li>Coins from various states</li>
        <li>Fragments of fabrics and jewelry</li>
    </ul>
    
    <h2>Impact on Modernity</h2>
    <p>The legacy of the Great Silk Road lives on today. Many historical monuments of Mangystau that we can visit are connected with this period. Underground mosques, necropolises and ancient settlements keep the memory of times when caravans with treasures passed through these lands.</p>
    
    <h2>Conclusion</h2>
    <p>The Great Silk Road left an indelible mark on the history and culture of Mangystau. This region witnessed the meeting of different civilizations, exchange of ideas and cultures. Today we can see this heritage in architecture, traditions and spiritual culture of the region.</p>',
    
    -- Казахский контент
    '<h2>Кіріспе</h2>
    <p>Ұлы Жібек жолы — адамзат тарихындағы ең маңызды сауда жолдарының бірі, көптеген ғасырлар бойы Шығыс пен Батысты байланыстырған. Маңғыстау осы жолда маңызды стратегиялық орынды иеленіп, Орталық Азия мен Каспий өңірі арасындағы байланыстырушы буын болды.</p>
    
    <h2>Тарихи контекст</h2>
    <p>VIII-XII ғасырлар аралығында қазіргі Маңғыстау аумағы арқылы әртүрлі тауарларды тасымалдайтын керуендер өтті:</p>
    <ul>
        <li><strong>Қытайдан жібек</strong> — бүкіл жолға ат берген ең құнды тауар</li>
        <li><strong>Үндістаннан дәмдеуіштер</strong> — бұрыш, дәрішін, шафран</li>
        <li><strong>Асыл тастар</strong> — лағыл, зұмырат, ляпис-лазурь</li>
        <li><strong>Керамика және әйнек</strong> — Парсы және Орта Азия өнімдері</li>
        <li><strong>Металдар және қару-жарақ</strong> — темір, болат, сауыт</li>
    </ul>
    
    <h2>Маңғыстаудың керуен-сарайлары</h2>
    <p>Сауда жолдары бойында керуен-сарайлар пайда болды — саудагерлер мен саяхатшыларға арналған қонақ үйлер. Бұл құрылыстар тек демалыс орны ғана емес, сонымен қатар сауда орталықтары болды, мұнда мүмкін болды:</p>
    <ul>
        <li>Демалып, күш жинау</li>
        <li>Су мен азық-түлік қорын толықтыру</li>
        <li>Тауар айырбастау</li>
        <li>Жолдар туралы ақпарат алу</li>
        <li>Әрі қарай жолға қорғаушылар табу</li>
    </ul>
    
    <blockquote>
    "Жібек жолы тек сауда жолы ғана емес еді — бұл өркениеттер арасындағы көпір болды, оның бойымен тек тауарлар ғана емес, сонымен қатар идеялар, білім, дін және мәдениет өтті"
    </blockquote>
    
    <h2>Мәдени алмасу</h2>
    <p>Сауда керуендері Маңғыстауға тек материалдық байлық ғана емес, сонымен қатар мәдени алмасуға үлес қосты:</p>
    <ul>
        <li><strong>Жаңа технологиялар</strong> — металл өңдеу әдістері, тоқыма, саз ыдыс өндірісі</li>
        <li><strong>Діни идеялар</strong> — өңірде исламның таралуы</li>
        <li><strong>Сәулет стильдері</strong> — парсы және орталық азиялық сәулеттің әсері</li>
        <li><strong>Ғылыми білім</strong> — математика, астрономия, медицина</li>
        <li><strong>Өнер</strong> — каллиграфия, ою-өрнектер, музыка</li>
    </ul>
    
    <h2>Археологиялық табылымдар</h2>
    <p>Қазіргі археологтар Маңғыстау аумағында ежелгі керуен жолдарының іздерін табуды жалғастыруда. Табылымдар арасында:</p>
    <ul>
        <li>Керуен-сарайлардың қалдықтары</li>
        <li>Әртүрлі өңірлердің керамика өнімдері</li>
        <li>Түрлі мемлекеттердің монеталары</li>
        <li>Маталар мен әшекейлердің фрагменттері</li>
    </ul>
    
    <h2>Қазіргі заманға әсері</h2>
    <p>Ұлы Жібек жолының мұрасы бүгінде де өмір сүреді. Біз баруға болатын Маңғыстаудың көптеген тарихи ескерткіштері дәл осы кезеңмен байланысты. Жерасты мешіттері, некрополдер және ежелгі қоныстар осы жерлерден қазыналы керуендер өткен кездер туралы естелікті сақтайды.</p>
    
    <h2>Қорытынды</h2>
    <p>Ұлы Жібек жолы Маңғыстау тарихы мен мәдениетінде өшпес із қалдырды. Бұл өңір әртүрлі өркениеттердің кездесуіне, идеялар мен мәдениеттер алмасуына куә болды. Бүгін біз бұл мұраны өңірдің сәулетінде, дәстүрлерінде және рухани мәдениетінде көре аламыз.</p>',
    
    'История',
    'History',
    'Тарих',
    
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=600&fit=crop',
    
    'Apex Tourism Team'
);

-- Статья 2: Подземные мечети (короче для примера)
INSERT INTO articles (
    slug,
    title_ru,
    title_en,
    title_kz,
    excerpt_ru,
    excerpt_en,
    excerpt_kz,
    content_ru,
    content_en,
    content_kz,
    category_ru,
    category_en,
    category_kz,
    cover_image,
    author
) VALUES (
    'podzemnye-mecheti-mangystau',
    
    'Подземные мечети Мангистау',
    'Underground Mosques of Mangystau',
    'Маңғыстаудың жерасты мешіттері',
    
    'Уникальные подземные храмы, высеченные в скалах. Бекет-Ата, Шопан-Ата и Шакпак-Ата — архитектурные чудеса региона.',
    'Unique underground temples carved into rocks. Beket-Ata, Shopan-Ata and Shakpak-Ata — architectural wonders of the region.',
    'Жартастарға қашалған бірегей жерасты ғибадатханалары. Бекет-Ата, Шопан-Ата және Шақпақ-Ата — өңірдің сәулет ғажайыптары.',
    
    '<h2>Введение</h2>
    <p>Подземные мечети Мангистау — уникальное явление в исламской архитектуре. Эти святыни были высечены в скалах суфийскими учителями и их последователями.</p>
    
    <h2>Бекет-Ата</h2>
    <p>Самая известная подземная мечеть региона, расположенная на склоне горы Огланды. Состоит из четырех комнат на двух уровнях.</p>
    
    <h2>Духовное значение</h2>
    <p>Эти места были не только храмами, но и центрами обучения, медитации и духовного роста.</p>',
    
    '<h2>Introduction</h2>
    <p>The underground mosques of Mangystau are a unique phenomenon in Islamic architecture. These shrines were carved into rocks by Sufi teachers and their followers.</p>
    
    <h2>Beket-Ata</h2>
    <p>The most famous underground mosque in the region, located on the slope of Mount Oglandy. It consists of four rooms on two levels.</p>
    
    <h2>Spiritual Significance</h2>
    <p>These places were not only temples but also centers of learning, meditation and spiritual growth.</p>',
    
    '<h2>Кіріспе</h2>
    <p>Маңғыстаудың жерасты мешіттері — ислам сәулетіндегі бірегей құбылыс. Бұл қасиетті орындарды сопылық ұстаздар мен олардың ізбасарлары жартастарға қашаған.</p>
    
    <h2>Бекет-Ата</h2>
    <p>Өңірдегі ең танымал жерасты мешіті, Оғланды тауының беткейінде орналасқан. Екі деңгейдегі төрт бөлмеден тұрады.</p>
    
    <h2>Рухани маңыздылығы</h2>
    <p>Бұл орындар тек ғибадатханалар ғана емес, сонымен қатар оқу, медитация және рухани өсу орталықтары болды.</p>',
    
    'История',
    'History',
    'Тарих',
    
    'https://images.unsplash.com/photo-1564769610684-2c3f7a0b904d?w=1200&h=600&fit=crop',
    
    'Apex Tourism Team'
);

-- Статья 3: Бозжыра
INSERT INTO articles (
    slug,
    title_ru,
    title_en,
    title_kz,
    excerpt_ru,
    excerpt_en,
    excerpt_kz,
    content_ru,
    content_en,
    content_kz,
    category_ru,
    category_en,
    category_kz,
    cover_image
) VALUES (
    'bozzhyra-marsianskie-pejzazhi',
    
    'Бозжыра: марсианские пейзажи Земли',
    'Bozzhyra: Martian Landscapes on Earth',
    'Бозжыра: Жердегі марстық пейзаждар',
    
    'Уникальный каньон с геологическими формациями, напоминающими инопланетные ландшафты. Лучшее место для фотографии в Мангистау.',
    'A unique canyon with geological formations resembling alien landscapes. The best place for photography in Mangystau.',
    'Басқа планета пейзаждарын еске салатын геологиялық қалыптасуы бар бірегей шатқал. Маңғыстаудағы фотосурет түсіруге ең жақсы орын.',
    
    '<h2>Геологическое чудо</h2>
    <p>Бозжыра — это древнее дно океана Тетис, которое поднялось на поверхность миллионы лет назад.</p>
    
    <h2>Уникальные формации</h2>
    <p>Ветер и вода создали здесь удивительные скальные образования, напоминающие инопланетные ландшафты.</p>
    
    <h2>Советы для посещения</h2>
    <ul>
        <li>Лучшее время: закат или рассвет</li>
        <li>Возьмите достаточно воды</li>
        <li>Хорошая обувь обязательна</li>
    </ul>',
    
    '<h2>Geological Wonder</h2>
    <p>Bozzhyra is the ancient bottom of the Tethys Ocean that rose to the surface millions of years ago.</p>
    
    <h2>Unique Formations</h2>
    <p>Wind and water have created amazing rock formations here that resemble alien landscapes.</p>
    
    <h2>Visiting Tips</h2>
    <ul>
        <li>Best time: sunset or sunrise</li>
        <li>Take enough water</li>
        <li>Good shoes are essential</li>
    </ul>',
    
    '<h2>Геологиялық ғажайып</h2>
    <p>Бозжыра — миллиондаған жыл бұрын бетке көтерілген Тетис мұхитының ежелгі түбі.</p>
    
    <h2>Бірегей қалыптасулар</h2>
    <p>Жел мен су мұнда басқа планета пейзаждарын еске салатын таңғажайып жартас түзілімдерін жасады.</p>
    
    <h2>Баруға кеңестер</h2>
    <ul>
        <li>Ең жақсы уақыт: күн батқанда немесе атқанда</li>
        <li>Жеткілікті су алыңыз</li>
        <li>Жақсы аяқ киім міндетті</li>
    </ul>',
    
    'Природа',
    'Nature',
    'Табиғат',
    
    'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1200&h=600&fit=crop'
);

-- Проверьте созданные статьи
SELECT id, slug, title_ru, category_ru FROM articles;

