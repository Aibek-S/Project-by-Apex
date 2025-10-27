-- Демонстрационные данные: 6 композиций кюй Мангистау
-- Вставка примеров композиций с информацией на трех языках

INSERT INTO music_tracks (title_ru, title_kz, title_en, description_ru, description_kz, description_en, composer_ru, composer_kz, composer_en, audio_url, duration, order_position)
VALUES
-- 1. Сарыарка
(
    'Сарыарка',
    'Сарыарқа',
    'Saryarka',
    'Легендарный кюй, воспевающий красоту казахских степей. Композиция передает бескрайние просторы и дух свободы.',
    'Қазақ даласының сұлулығын жырлайтын аты аңызға айналған күй. Шексіз кеңістік пен бостандық рухын жеткізеді.',
    'A legendary kuy that celebrates the beauty of the Kazakh steppes. The composition conveys endless expanses and the spirit of freedom.',
    'Курмангазы Сагырбайулы',
    'Құрманғазы Сағырбайұлы',
    'Kurmangazy Sagyrbayuly',
    'https://example.com/audio/saryarka.mp3',
    245,
    0
),

-- 2. Адай
(
    'Адай',
    'Адай',
    'Aday',
    'Героический кюй, посвященный племени Адай. Энергичная мелодия отражает силу и мужество степных воинов.',
    'Адай тайпасына арналған батырлық күй. Энергиялы әуен далалық жауынгерлердің күші мен батылдығын бейнелейді.',
    'A heroic kuy dedicated to the Aday tribe. The energetic melody reflects the strength and courage of steppe warriors.',
    'Курмангазы Сагырбайулы',
    'Құрманғазы Сағырбайұлы',
    'Kurmangazy Sagyrbayuly',
    'https://example.com/audio/aday.mp3',
    198,
    1
),

-- 3. Балбырауын
(
    'Балбырауын',
    'Балбырауын',
    'Balbyraun',
    'Лирический кюй, передающий нежность степных цветов. Мягкая мелодия создает атмосферу весеннего пробуждения природы.',
    'Дала гүлдерінің нәзіктігін жеткізетін лирикалық күй. Жұмсақ әуен табиғаттың көктемгі оянуының атмосферасын жасайды.',
    'A lyrical kuy conveying the tenderness of steppe flowers. The soft melody creates an atmosphere of spring awakening.',
    'Даулеткерей Шигайулы',
    'Дәулеткерей Шығайұлы',
    'Daulkerey Shigayuly',
    'https://example.com/audio/balbyraun.mp3',
    312,
    2
),

-- 4. Акку (Белый лебедь)
(
    'Акку (Белый лебедь)',
    'Аққу',
    'Akku (White Swan)',
    'Поэтичный кюй о белом лебеде, символе красоты и грации. Плавная мелодия имитирует движение лебедя по водной глади.',
    'Сұлулық пен сымбаттылық белгісі аққу туралы поэзиялық күй. Ағымды әуен аққудың су бетіндегі қозғалысын еліктейді.',
    'A poetic kuy about the white swan, a symbol of beauty and grace. The flowing melody imitates the movement of a swan on water.',
    'Таттимбет Казангапулы',
    'Таттімбет Қазанғапұлы',
    'Tattimbet Kazangapuly',
    'https://example.com/audio/akku.mp3',
    267,
    3
),

-- 5. Шалкыма (Волны)
(
    'Шалкыма (Волны)',
    'Шалқыма (Толқындар)',
    'Shalkyma (Waves)',
    'Кюй передает игру волн Каспийского моря. Ритмичная композиция напоминает движение воды у берегов Мангистау.',
    'Каспий теңізінің толқындарының ойнын жеткізетін күй. Ырғақты композиция Маңғыстау жағалауындағы судың қозғалысын еске салады.',
    'A kuy that conveys the play of Caspian Sea waves. The rhythmic composition resembles water movement off the Mangystau coast.',
    'Дина Нурпеисова',
    'Дина Нүрпейісова',
    'Dina Nurpeisova',
    'https://example.com/audio/shalkyma.mp3',
    189,
    4
),

-- 6. Акжелен (Белая степь)
(
    'Акжелен (Белая степь)',
    'Ақжелең (Ақ дала)',
    'Akzhelen (White Steppe)',
    'Зимний кюй, описывающий заснеженную степь Мангистау. Спокойная мелодия создает образ безмятежной зимней природы.',
    'Маңғыстаудың қарлы даласын суреттейтін қыстық күй. Тыныш әуен сабырлы қыстық табиғаттың бейнесін жасайды.',
    'A winter kuy describing the snow-covered Mangystau steppe. The calm melody creates an image of serene winter nature.',
    'Коркыт Ата',
    'Қорқыт Ата',
    'Korkyt Ata',
    'https://example.com/audio/akzhelen.mp3',
    223,
    5
);

-- Проверка вставленных данных
SELECT title_ru, composer_ru, duration FROM music_tracks ORDER BY order_position;

