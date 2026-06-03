export const doctorsData = [
  {
    "id": 1,
    "name": "Иванова Алина Ринатовна",
    "specialty": "Терапевт",
    "clinic": "Городская поликлиника № 10",
    "address": "Казань, ул. Чистопольская, 43",
    "district": "Ново-Савиновский",
    "ownership": "Государственная",
    "rating": 4.9,
    "experience": 14,
    "schedule": {
      "sun": "Выходной",
      "mon": "08:00-20:00",
      "tue": "08:00-20:00",
      "wed": "08:00-20:00",
      "thu": "08:00-20:00",
      "fri": "08:00-20:00",
      "sat": "08:00-18:00"
    },
    "hours": "Пн-Пт 08:00-20:00, Сб 08:00-18:00, Вс дежурство в основном корпусе",
    "phone": "+7 (843) 523-88-02",
    "website": "https://poliklinika10.ru",
    "services": [
      "Терапия",
      "Диспансеризация",
      "Справки",
      "Профосмотр"
    ],
    "features": {
      "onlineBooking": true,
      "wheelchair": true,
      "parking": false,
      "children": false,
      "eveningReception": true,
      "weekendReception": false
    },
    "description": "Базовый первичный приём, диспансерное наблюдение и оформление справок.",
    "lat": 55.8197273,
    "lng": 49.1241554,
    "servicePrices": [
      { "service": "Терапия", "minRub": 1000, "maxRub": 1550, "currency": "RUB" },
      { "service": "Диспансеризация", "minRub": 1000, "maxRub": 1550, "currency": "RUB" },
      { "service": "Справки", "minRub": 750, "maxRub": 1150, "currency": "RUB" },
      { "service": "Профосмотр", "minRub": 900, "maxRub": 1450, "currency": "RUB" }
    ]
  },
  {
    "id": 2,
    "name": "Сафина Диана Ильдаровна",
    "specialty": "Кардиолог",
    "clinic": "Здоровье семьи",
    "address": "Казань, ул. Гвардейская, 1/24",
    "district": "Советский",
    "ownership": "Частная",
    "rating": 4.8,
    "experience": 11,
    "schedule": {
      "sun": "09:00-14:00",
      "mon": "07:00-20:00",
      "tue": "07:00-20:00",
      "wed": "07:00-20:00",
      "thu": "07:00-20:00",
      "fri": "07:00-20:00",
      "sat": "08:00-18:00"
    },
    "hours": "Пн-Пт 07:00-20:00, Сб 08:00-18:00, Вс 09:00-14:00",
    "phone": "+7 (843) 204-27-00",
    "website": "",
    "services": [
      "Кардиология",
      "ЭКГ",
      "Терапия",
      "Профосмотр"
    ],
    "features": {
      "onlineBooking": true,
      "wheelchair": true,
      "parking": true,
      "children": false,
      "eveningReception": true,
      "weekendReception": true
    },
    "description": "Кардиологический приём с возможностью записаться в вечерние часы и на выходных.",
    "lat": 55.793153,
    "lng": 49.172136,
    "servicePrices": [
      { "service": "Кардиология", "minRub": 2000, "maxRub": 3100, "currency": "RUB" },
      { "service": "ЭКГ", "minRub": 2050, "maxRub": 3150, "currency": "RUB" },
      { "service": "Терапия", "minRub": 1850, "maxRub": 2850, "currency": "RUB" },
      { "service": "Профосмотр", "minRub": 1650, "maxRub": 2550, "currency": "RUB" }
    ]
  },
  {
    "id": 3,
    "name": "Хайруллина Гузель Фаритовна",
    "specialty": "Невролог",
    "clinic": "Март",
    "address": "Казань, ул. Аделя Кутуя, 16",
    "district": "Советский",
    "ownership": "Частная",
    "rating": 4.7,
    "experience": 16,
    "schedule": {
      "sun": "Выходной",
      "mon": "08:00-20:00",
      "tue": "08:00-20:00",
      "wed": "08:00-20:00",
      "thu": "08:00-20:00",
      "fri": "08:00-20:00",
      "sat": "08:00-14:00"
    },
    "hours": "Пн-Пт 08:00-20:00, Сб 08:00-14:00, Вс выходной",
    "phone": "+7 (843) 295-55-66",
    "website": "https://martmed.ru",
    "services": [
      "Неврология",
      "Терапия",
      "Чекап",
      "УЗИ"
    ],
    "features": {
      "onlineBooking": true,
      "wheelchair": true,
      "parking": true,
      "children": false,
      "eveningReception": true,
      "weekendReception": false
    },
    "description": "Подходит для планового приема, повторных консультаций и комплексной диагностики.",
    "lat": 55.7863863,
    "lng": 49.1704812,
    "servicePrices": [
      { "service": "Неврология", "minRub": 1900, "maxRub": 2950, "currency": "RUB" },
      { "service": "Терапия", "minRub": 1750, "maxRub": 2750, "currency": "RUB" },
      { "service": "Чекап", "minRub": 2450, "maxRub": 3800, "currency": "RUB" },
      { "service": "УЗИ", "minRub": 2200, "maxRub": 3450, "currency": "RUB" }
    ]
  },
  {
    "id": 4,
    "name": "Петров Тимур Русланович",
    "specialty": "Педиатр",
    "clinic": "Городская детская больница № 1",
    "address": "Казань, ул. Восстания, 49",
    "district": "Московский",
    "ownership": "Государственная",
    "rating": 4.8,
    "experience": 12,
    "schedule": {
      "sun": "09:00-15:00",
      "mon": "08:00-19:00",
      "tue": "08:00-19:00",
      "wed": "08:00-19:00",
      "thu": "08:00-19:00",
      "fri": "08:00-19:00",
      "sat": "09:00-17:00"
    },
    "hours": "Пн-Пт 08:00-19:00, Сб 09:00-17:00, Вс 09:00-15:00",
    "phone": "+7 (843) 557-34-76",
    "website": "https://zdrav.tatar.ru/detpol1kaz/section/news",
    "services": [
      "Педиатрия",
      "Вакцинация",
      "Справки",
      "Профосмотр"
    ],
    "features": {
      "onlineBooking": true,
      "wheelchair": true,
      "parking": false,
      "children": true,
      "eveningReception": false,
      "weekendReception": true
    },
    "description": "Детский прием, профилактические осмотры и вакцинация по графику клиники.",
    "lat": 55.8326577,
    "lng": 49.0774881,
    "servicePrices": [
      { "service": "Педиатрия", "minRub": 1150, "maxRub": 1850, "currency": "RUB" },
      { "service": "Вакцинация", "minRub": 1450, "maxRub": 2300, "currency": "RUB" },
      { "service": "Справки", "minRub": 800, "maxRub": 1250, "currency": "RUB" },
      { "service": "Профосмотр", "minRub": 950, "maxRub": 1550, "currency": "RUB" }
    ]
  },
  {
    "id": 5,
    "name": "Ахметова Лилия Рустамовна",
    "specialty": "ЛОР",
    "clinic": "Городская поликлиника № 16",
    "address": "Казань, ул. Восстания, 50",
    "district": "Московский",
    "ownership": "Государственная",
    "rating": 4.6,
    "experience": 18,
    "schedule": {
      "sun": "09:00-15:00",
      "mon": "08:00-20:00",
      "tue": "08:00-20:00",
      "wed": "08:00-20:00",
      "thu": "08:00-20:00",
      "fri": "08:00-20:00",
      "sat": "08:00-18:00"
    },
    "hours": "Пн-Пт 08:00-20:00, Сб 08:00-18:00, Вс 09:00-15:00",
    "phone": "+7 (843) 564-18-81",
    "website": "https://klinika16.ru",
    "services": [
      "ЛОР",
      "Терапия",
      "Профосмотр",
      "Диагностика"
    ],
    "features": {
      "onlineBooking": true,
      "wheelchair": true,
      "parking": false,
      "children": true,
      "eveningReception": true,
      "weekendReception": true
    },
    "description": "Приём ЛОР-врача с вечерними окнами записи и приемом в воскресенье.",
    "lat": 55.8349869,
    "lng": 49.076873,
    "servicePrices": [
      { "service": "ЛОР", "minRub": 1300, "maxRub": 2100, "currency": "RUB" },
      { "service": "Терапия", "minRub": 1200, "maxRub": 1900, "currency": "RUB" },
      { "service": "Профосмотр", "minRub": 1200, "maxRub": 1950, "currency": "RUB" },
      { "service": "Диагностика", "minRub": 1400, "maxRub": 2250, "currency": "RUB" }
    ]
  },
  {
    "id": 6,
    "name": "Галимова Резеда Нурисламовна",
    "specialty": "Стоматолог",
    "clinic": "Городская стоматологическая поликлиника № 9",
    "address": "Казань, ул. Восход, 28",
    "district": "Советский",
    "ownership": "Государственная",
    "rating": 4.7,
    "experience": 19,
    "schedule": {
      "sun": "Выходной",
      "mon": "08:00-19:00",
      "tue": "08:00-19:00",
      "wed": "08:00-19:00",
      "thu": "08:00-19:00",
      "fri": "08:00-19:00",
      "sat": "08:00-15:00"
    },
    "hours": "Пн-Пт 08:00-19:00, Сб 08:00-15:00, Вс выходной",
    "phone": "+7 (843) 272-52-48",
    "website": "",
    "services": [
      "Терапевтическая стоматология",
      "Пломбирование",
      "Лечение каналов",
      "Профгигиена"
    ],
    "features": {
      "onlineBooking": true,
      "wheelchair": true,
      "parking": false,
      "children": false,
      "eveningReception": false,
      "weekendReception": false
    },
    "description": "Стоматолог-терапевт высшей категории, специалист по эндодонтическому лечению.",
    "lat": 55.7844,
    "lng": 49.1808,
    "servicePrices": [
      { "service": "Терапевтическая стоматология", "minRub": 1500, "maxRub": 3500, "currency": "RUB" },
      { "service": "Пломбирование", "minRub": 2000, "maxRub": 4500, "currency": "RUB" },
      { "service": "Лечение каналов", "minRub": 3000, "maxRub": 7000, "currency": "RUB" },
      { "service": "Профгигиена", "minRub": 2500, "maxRub": 4000, "currency": "RUB" }
    ]
  },
  {
    "id": 7,
    "name": "Нуриева Эльмира Рафаэловна",
    "specialty": "Стоматолог-ортопед",
    "clinic": "Дента",
    "address": "Казань, ул. Карла Маркса, 46",
    "district": "Вахитовский",
    "ownership": "Частная",
    "rating": 4.9,
    "experience": 22,
    "schedule": {
      "sun": "Выходной",
      "mon": "09:00-20:00",
      "tue": "09:00-20:00",
      "wed": "09:00-20:00",
      "thu": "09:00-20:00",
      "fri": "09:00-20:00",
      "sat": "09:00-16:00"
    },
    "hours": "Пн-Пт 09:00-20:00, Сб 09:00-16:00, Вс выходной",
    "phone": "+7 (843) 238-00-18",
    "website": "https://dentakazan.ru",
    "services": [
      "Протезирование",
      "Имплантация",
      "Виниры",
      "Коронки"
    ],
    "features": {
      "onlineBooking": true,
      "wheelchair": true,
      "parking": true,
      "children": false,
      "eveningReception": true,
      "weekendReception": false
    },
    "description": "Ведущий стоматолог-ортопед, специалист по эстетическому протезированию и имплантации.",
    "lat": 55.7900,
    "lng": 49.1228,
    "servicePrices": [
      { "service": "Протезирование", "minRub": 8000, "maxRub": 25000, "currency": "RUB" },
      { "service": "Имплантация", "minRub": 25000, "maxRub": 65000, "currency": "RUB" },
      { "service": "Виниры", "minRub": 15000, "maxRub": 35000, "currency": "RUB" },
      { "service": "Коронки", "minRub": 6000, "maxRub": 18000, "currency": "RUB" }
    ]
  },
  {
    "id": 8,
    "name": "Мирзаханова Камила Артуровна",
    "specialty": "Стоматолог-хирург",
    "clinic": "Стоматологическая клиника «Премьера»",
    "address": "Казань, ул. Декабристов, 185",
    "district": "Ново-Савиновский",
    "ownership": "Частная",
    "rating": 4.8,
    "experience": 13,
    "schedule": {
      "sun": "Выходной",
      "mon": "08:00-20:00",
      "tue": "08:00-20:00",
      "wed": "08:00-20:00",
      "thu": "08:00-20:00",
      "fri": "08:00-20:00",
      "sat": "09:00-15:00"
    },
    "hours": "Пн-Пт 08:00-20:00, Сб 09:00-15:00, Вс выходной",
    "phone": "+7 (843) 259-55-50",
    "website": "https://premiera-kazan.ru",
    "services": [
      "Хирургическая стоматология",
      "Удаление зубов",
      "Имплантация",
      "Синус-лифтинг"
    ],
    "features": {
      "onlineBooking": true,
      "wheelchair": false,
      "parking": true,
      "children": false,
      "eveningReception": true,
      "weekendReception": false
    },
    "description": "Хирург-стоматолог, выполняет сложные удаления и костнопластические операции.",
    "lat": 55.8284,
    "lng": 49.1139,
    "servicePrices": [
      { "service": "Хирургическая стоматология", "minRub": 2000, "maxRub": 5000, "currency": "RUB" },
      { "service": "Удаление зубов", "minRub": 1500, "maxRub": 8000, "currency": "RUB" },
      { "service": "Имплантация", "minRub": 28000, "maxRub": 60000, "currency": "RUB" },
      { "service": "Синус-лифтинг", "minRub": 20000, "maxRub": 45000, "currency": "RUB" }
    ]
  },
  {
    "id": 9,
    "name": "Закиров Рамиль Ильдусович",
    "specialty": "Офтальмолог",
    "clinic": "Республиканская клиническая офтальмологическая больница",
    "address": "Казань, ул. Бутлерова, 14",
    "district": "Вахитовский",
    "ownership": "Государственная",
    "rating": 4.8,
    "experience": 21,
    "schedule": {
      "sun": "Выходной",
      "mon": "08:00-17:00",
      "tue": "08:00-17:00",
      "wed": "08:00-17:00",
      "thu": "08:00-17:00",
      "fri": "08:00-17:00",
      "sat": "Выходной"
    },
    "hours": "Пн-Пт 08:00-17:00, Сб-Вс выходной",
    "phone": "+7 (843) 236-59-73",
    "website": "https://rkob.ru",
    "services": [
      "Офтальмология",
      "Диагностика зрения",
      "Лазерная коррекция",
      "Лечение глаукомы"
    ],
    "features": {
      "onlineBooking": true,
      "wheelchair": true,
      "parking": true,
      "children": true,
      "eveningReception": false,
      "weekendReception": false
    },
    "description": "Кандидат медицинских наук, специалист по микрохирургии глаза и лазерной коррекции зрения.",
    "lat": 55.7876,
    "lng": 49.1198,
    "servicePrices": [
      { "service": "Офтальмология", "minRub": 1200, "maxRub": 2500, "currency": "RUB" },
      { "service": "Диагностика зрения", "minRub": 1500, "maxRub": 3000, "currency": "RUB" },
      { "service": "Лазерная коррекция", "minRub": 25000, "maxRub": 55000, "currency": "RUB" },
      { "service": "Лечение глаукомы", "minRub": 3000, "maxRub": 8000, "currency": "RUB" }
    ]
  },
  {
    "id": 10,
    "name": "Шамсутдинова Альфия Маратовна",
    "specialty": "Офтальмолог",
    "clinic": "Клиника «Глазная хирургия Расческов»",
    "address": "Казань, ул. Большая Красная, 67",
    "district": "Вахитовский",
    "ownership": "Частная",
    "rating": 4.9,
    "experience": 17,
    "schedule": {
      "sun": "Выходной",
      "mon": "09:00-18:00",
      "tue": "09:00-18:00",
      "wed": "09:00-18:00",
      "thu": "09:00-18:00",
      "fri": "09:00-18:00",
      "sat": "09:00-14:00"
    },
    "hours": "Пн-Пт 09:00-18:00, Сб 09:00-14:00, Вс выходной",
    "phone": "+7 (843) 236-22-00",
    "website": "https://reschikov.ru",
    "services": [
      "Офтальмология",
      "Коррекция зрения",
      "Обследование сетчатки",
      "Подбор линз"
    ],
    "features": {
      "onlineBooking": true,
      "wheelchair": true,
      "parking": false,
      "children": true,
      "eveningReception": false,
      "weekendReception": false
    },
    "description": "Офтальмолог высшей категории, эксперт по заболеваниям сетчатки и витреоретинальной хирургии.",
    "lat": 55.7920,
    "lng": 49.1275,
    "servicePrices": [
      { "service": "Офтальмология", "minRub": 1800, "maxRub": 3000, "currency": "RUB" },
      { "service": "Коррекция зрения", "minRub": 30000, "maxRub": 60000, "currency": "RUB" },
      { "service": "Обследование сетчатки", "minRub": 2000, "maxRub": 4000, "currency": "RUB" },
      { "service": "Подбор линз", "minRub": 1200, "maxRub": 2500, "currency": "RUB" }
    ]
  },
  {
    "id": 11,
    "name": "Фаттахов Булат Фаридович",
    "specialty": "Офтальмолог",
    "clinic": "МКДЦ",
    "address": "Казань, ул. Карбышева, 12А",
    "district": "Приволжский",
    "ownership": "Государственная",
    "rating": 4.7,
    "experience": 15,
    "schedule": {
      "sun": "Выходной",
      "mon": "08:00-16:00",
      "tue": "08:00-16:00",
      "wed": "08:00-16:00",
      "thu": "08:00-16:00",
      "fri": "08:00-16:00",
      "sat": "Выходной"
    },
    "hours": "Пн-Пт 08:00-16:00, Сб-Вс выходной",
    "phone": "+7 (843) 291-11-23",
    "website": "https://www.icdc.ru",
    "services": [
      "Офтальмология",
      "УЗИ глаза",
      "Диагностика",
      "Лазерная хирургия"
    ],
    "features": {
      "onlineBooking": true,
      "wheelchair": true,
      "parking": true,
      "children": false,
      "eveningReception": false,
      "weekendReception": false
    },
    "description": "Офтальмолог МКДЦ, специализируется на диагностике и лазерной хирургии глаза.",
    "lat": 55.7602,
    "lng": 49.1764,
    "servicePrices": [
      { "service": "Офтальмология", "minRub": 1000, "maxRub": 2000, "currency": "RUB" },
      { "service": "УЗИ глаза", "minRub": 800, "maxRub": 1500, "currency": "RUB" },
      { "service": "Диагностика", "minRub": 1500, "maxRub": 3000, "currency": "RUB" },
      { "service": "Лазерная хирургия", "minRub": 15000, "maxRub": 45000, "currency": "RUB" }
    ]
  },
  {
    "id": 12,
    "name": "Зарипов Марат Наилевич",
    "specialty": "Невролог",
    "clinic": "РКБ",
    "address": "Казань, Оренбургский тракт, 138",
    "district": "Приволжский",
    "ownership": "Государственная",
    "rating": 4.8,
    "experience": 24,
    "schedule": {
      "sun": "Выходной",
      "mon": "08:00-16:00",
      "tue": "08:00-16:00",
      "wed": "08:00-16:00",
      "thu": "08:00-16:00",
      "fri": "08:00-16:00",
      "sat": "Выходной"
    },
    "hours": "Пн-Пт 08:00-16:00, Сб-Вс выходной",
    "phone": "+7 (843) 231-21-66",
    "website": "https://rkb-tatarstan.ru",
    "services": [
      "Неврология",
      "ЭЭГ",
      "МРТ-диагностика",
      "Лечение инсульта"
    ],
    "features": {
      "onlineBooking": true,
      "wheelchair": true,
      "parking": true,
      "children": false,
      "eveningReception": false,
      "weekendReception": false
    },
    "description": "Доктор медицинских наук, невролог высшей категории РКБ со стажем более 24 лет.",
    "lat": 55.7088,
    "lng": 49.1821,
    "servicePrices": [
      { "service": "Неврология", "minRub": 1200, "maxRub": 2500, "currency": "RUB" },
      { "service": "ЭЭГ", "minRub": 1500, "maxRub": 2800, "currency": "RUB" },
      { "service": "МРТ-диагностика", "minRub": 3000, "maxRub": 6000, "currency": "RUB" },
      { "service": "Лечение инсульта", "minRub": 5000, "maxRub": 15000, "currency": "RUB" }
    ]
  },
  {
    "id": 13,
    "name": "Сабирова Гульнара Ильгизовна",
    "specialty": "Терапевт",
    "clinic": "Городская поликлиника № 18",
    "address": "Казань, ул. Карла Маркса, 17А",
    "district": "Вахитовский",
    "ownership": "Государственная",
    "rating": 4.5,
    "experience": 20,
    "schedule": {
      "sun": "Выходной",
      "mon": "08:00-19:00",
      "tue": "08:00-19:00",
      "wed": "08:00-19:00",
      "thu": "08:00-19:00",
      "fri": "08:00-19:00",
      "sat": "09:00-14:00"
    },
    "hours": "Пн-Пт 08:00-19:00, Сб 09:00-14:00, Вс выходной",
    "phone": "+7 (843) 236-36-00",
    "website": "",
    "services": [
      "Терапия",
      "Диспансеризация",
      "Вакцинация",
      "Профосмотр"
    ],
    "features": {
      "onlineBooking": true,
      "wheelchair": true,
      "parking": false,
      "children": false,
      "eveningReception": false,
      "weekendReception": false
    },
    "description": "Терапевт высшей категории с 20-летним опытом, ведёт плановый прием и диспансеризацию.",
    "lat": 55.7895,
    "lng": 49.1238,
    "servicePrices": [
      { "service": "Терапия", "minRub": 800, "maxRub": 1500, "currency": "RUB" },
      { "service": "Диспансеризация", "minRub": 0, "maxRub": 0, "currency": "RUB" },
      { "service": "Вакцинация", "minRub": 500, "maxRub": 3000, "currency": "RUB" },
      { "service": "Профосмотр", "minRub": 900, "maxRub": 1800, "currency": "RUB" }
    ]
  },
  {
    "id": 14,
    "name": "Козлова Ирина Викторовна",
    "specialty": "Терапевт",
    "clinic": "АВА-Казань",
    "address": "Казань, ул. Профсоюзная, 19",
    "district": "Вахитовский",
    "ownership": "Частная",
    "rating": 4.9,
    "experience": 25,
    "schedule": {
      "sun": "Выходной",
      "mon": "08:00-20:00",
      "tue": "08:00-20:00",
      "wed": "08:00-20:00",
      "thu": "08:00-20:00",
      "fri": "08:00-20:00",
      "sat": "09:00-16:00"
    },
    "hours": "Пн-Пт 08:00-20:00, Сб 09:00-16:00, Вс выходной",
    "phone": "+7 (843) 200-05-00",
    "website": "https://ava-kazan.ru",
    "services": [
      "Терапия",
      "Чекап",
      "УЗИ",
      "Лабораторные анализы"
    ],
    "features": {
      "onlineBooking": true,
      "wheelchair": true,
      "parking": true,
      "children": false,
      "eveningReception": true,
      "weekendReception": false
    },
    "description": "Опытный терапевт клиники «АВА-Казань», ведёт комплексные обследования (чекапы).",
    "lat": 55.7948,
    "lng": 49.1113,
    "servicePrices": [
      { "service": "Терапия", "minRub": 2500, "maxRub": 4000, "currency": "RUB" },
      { "service": "Чекап", "minRub": 8000, "maxRub": 25000, "currency": "RUB" },
      { "service": "УЗИ", "minRub": 1500, "maxRub": 3500, "currency": "RUB" },
      { "service": "Лабораторные анализы", "minRub": 500, "maxRub": 5000, "currency": "RUB" }
    ]
  },
  {
    "id": 15,
    "name": "Гильмутдинов Ринат Рафисович",
    "specialty": "Хирург",
    "clinic": "МКДЦ",
    "address": "Казань, ул. Карбышева, 12А",
    "district": "Приволжский",
    "ownership": "Государственная",
    "rating": 4.9,
    "experience": 28,
    "schedule": {
      "sun": "Выходной",
      "mon": "08:00-16:00",
      "tue": "08:00-16:00",
      "wed": "08:00-16:00",
      "thu": "08:00-16:00",
      "fri": "08:00-16:00",
      "sat": "Выходной"
    },
    "hours": "Пн-Пт 08:00-16:00, Сб-Вс выходной",
    "phone": "+7 (843) 291-11-22",
    "website": "https://www.icdc.ru",
    "services": [
      "Хирургия",
      "Сердечно-сосудистая хирургия",
      "Консультация",
      "Диагностика"
    ],
    "features": {
      "onlineBooking": true,
      "wheelchair": true,
      "parking": true,
      "children": false,
      "eveningReception": false,
      "weekendReception": false
    },
    "description": "Доктор медицинских наук, сердечно-сосудистый хирург МКДЦ, один из ведущих специалистов региона.",
    "lat": 55.7602,
    "lng": 49.1764,
    "servicePrices": [
      { "service": "Хирургия", "minRub": 2000, "maxRub": 5000, "currency": "RUB" },
      { "service": "Сердечно-сосудистая хирургия", "minRub": 50000, "maxRub": 200000, "currency": "RUB" },
      { "service": "Консультация", "minRub": 1500, "maxRub": 3000, "currency": "RUB" },
      { "service": "Диагностика", "minRub": 2000, "maxRub": 8000, "currency": "RUB" }
    ]
  },
  {
    "id": 16,
    "name": "Муратова Диляра Ильдаровна",
    "specialty": "Хирург",
    "clinic": "Клиника «Медел»",
    "address": "Казань, ул. Сибирский тракт, 34к3",
    "district": "Советский",
    "ownership": "Частная",
    "rating": 4.6,
    "experience": 14,
    "schedule": {
      "sun": "Выходной",
      "mon": "08:00-20:00",
      "tue": "08:00-20:00",
      "wed": "08:00-20:00",
      "thu": "08:00-20:00",
      "fri": "08:00-20:00",
      "sat": "08:00-16:00"
    },
    "hours": "Пн-Пт 08:00-20:00, Сб 08:00-16:00, Вс выходной",
    "phone": "+7 (843) 520-20-20",
    "website": "https://medel.ru",
    "services": [
      "Общая хирургия",
      "Малая хирургия",
      "УЗИ",
      "Консультация"
    ],
    "features": {
      "onlineBooking": true,
      "wheelchair": true,
      "parking": true,
      "children": false,
      "eveningReception": true,
      "weekendReception": false
    },
    "description": "Хирург клиники «Медел», выполняет амбулаторные хирургические операции.",
    "lat": 55.7905,
    "lng": 49.1856,
    "servicePrices": [
      { "service": "Общая хирургия", "minRub": 3000, "maxRub": 15000, "currency": "RUB" },
      { "service": "Малая хирургия", "minRub": 2000, "maxRub": 8000, "currency": "RUB" },
      { "service": "УЗИ", "minRub": 1200, "maxRub": 2500, "currency": "RUB" },
      { "service": "Консультация", "minRub": 1500, "maxRub": 2500, "currency": "RUB" }
    ]
  },
  {
    "id": 17,
    "name": "Якупов Ильнар Фанисович",
    "specialty": "Хирург",
    "clinic": "РКБ",
    "address": "Казань, Оренбургский тракт, 138",
    "district": "Приволжский",
    "ownership": "Государственная",
    "rating": 4.7,
    "experience": 19,
    "schedule": {
      "sun": "Выходной",
      "mon": "09:00-16:00",
      "tue": "09:00-16:00",
      "wed": "09:00-16:00",
      "thu": "09:00-16:00",
      "fri": "09:00-16:00",
      "sat": "Выходной"
    },
    "hours": "Пн-Пт 09:00-16:00, Сб-Вс выходной",
    "phone": "+7 (843) 231-20-90",
    "website": "https://rkb-tatarstan.ru",
    "services": [
      "Хирургия",
      "Колоноскопия",
      "Абдоминальная хирургия",
      "Консультация"
    ],
    "features": {
      "onlineBooking": true,
      "wheelchair": true,
      "parking": true,
      "children": false,
      "eveningReception": false,
      "weekendReception": false
    },
    "description": "Абдоминальный хирург РКБ, кандидат медицинских наук, высшая категория.",
    "lat": 55.7088,
    "lng": 49.1821,
    "servicePrices": [
      { "service": "Хирургия", "minRub": 1500, "maxRub": 4000, "currency": "RUB" },
      { "service": "Колоноскопия", "minRub": 3000, "maxRub": 6000, "currency": "RUB" },
      { "service": "Абдоминальная хирургия", "minRub": 30000, "maxRub": 120000, "currency": "RUB" },
      { "service": "Консультация", "minRub": 1200, "maxRub": 2500, "currency": "RUB" }
    ]
  },
  {
    "id": 18,
    "name": "Ахмерова Алсу Равилевна",
    "specialty": "Эндокринолог",
    "clinic": "Клиника «Биомед»",
    "address": "Казань, ул. Краснококшайская, 83",
    "district": "Приволжский",
    "ownership": "Частная",
    "rating": 4.8,
    "experience": 16,
    "schedule": {
      "sun": "Выходной",
      "mon": "08:00-18:00",
      "tue": "08:00-18:00",
      "wed": "08:00-18:00",
      "thu": "08:00-18:00",
      "fri": "08:00-18:00",
      "sat": "09:00-14:00"
    },
    "hours": "Пн-Пт 08:00-18:00, Сб 09:00-14:00, Вс выходной",
    "phone": "+7 (843) 272-40-40",
    "website": "https://biomed-kazan.ru",
    "services": [
      "Эндокринология",
      "Диабетология",
      "УЗИ щитовидной железы",
      "Гормональные анализы"
    ],
    "features": {
      "onlineBooking": true,
      "wheelchair": true,
      "parking": true,
      "children": false,
      "eveningReception": false,
      "weekendReception": false
    },
    "description": "Эндокринолог высшей категории, специализация — заболевания щитовидной железы и сахарный диабет.",
    "lat": 55.7660,
    "lng": 49.1870,
    "servicePrices": [
      { "service": "Эндокринология", "minRub": 1500, "maxRub": 3000, "currency": "RUB" },
      { "service": "Диабетология", "minRub": 1500, "maxRub": 3000, "currency": "RUB" },
      { "service": "УЗИ щитовидной железы", "minRub": 800, "maxRub": 1500, "currency": "RUB" },
      { "service": "Гормональные анализы", "minRub": 1000, "maxRub": 5000, "currency": "RUB" }
    ]
  },
  {
    "id": 19,
    "name": "Низамов Айрат Флюрович",
    "specialty": "Эндокринолог",
    "clinic": "МКДЦ",
    "address": "Казань, ул. Карбышева, 12А",
    "district": "Приволжский",
    "ownership": "Государственная",
    "rating": 4.6,
    "experience": 18,
    "schedule": {
      "sun": "Выходной",
      "mon": "08:00-16:00",
      "tue": "08:00-16:00",
      "wed": "08:00-16:00",
      "thu": "08:00-16:00",
      "fri": "08:00-16:00",
      "sat": "Выходной"
    },
    "hours": "Пн-Пт 08:00-16:00, Сб-Вс выходной",
    "phone": "+7 (843) 291-11-23",
    "website": "https://www.icdc.ru",
    "services": [
      "Эндокринология",
      "УЗИ",
      "Лабораторная диагностика",
      "Консультация"
    ],
    "features": {
      "onlineBooking": true,
      "wheelchair": true,
      "parking": true,
      "children": false,
      "eveningReception": false,
      "weekendReception": false
    },
    "description": "Эндокринолог МКДЦ, кандидат медицинских наук, специалист по метаболическим нарушениям.",
    "lat": 55.7602,
    "lng": 49.1764,
    "servicePrices": [
      { "service": "Эндокринология", "minRub": 1200, "maxRub": 2500, "currency": "RUB" },
      { "service": "УЗИ", "minRub": 800, "maxRub": 2000, "currency": "RUB" },
      { "service": "Лабораторная диагностика", "minRub": 500, "maxRub": 4000, "currency": "RUB" },
      { "service": "Консультация", "minRub": 1200, "maxRub": 2000, "currency": "RUB" }
    ]
  },
  {
    "id": 20,
    "name": "Каримова Лейсан Маратовна",
    "specialty": "Ортопед",
    "clinic": "Клиника «Медел»",
    "address": "Казань, ул. Сибирский тракт, 34к3",
    "district": "Советский",
    "ownership": "Частная",
    "rating": 4.7,
    "experience": 15,
    "schedule": {
      "sun": "Выходной",
      "mon": "08:00-18:00",
      "tue": "08:00-18:00",
      "wed": "08:00-18:00",
      "thu": "08:00-18:00",
      "fri": "08:00-18:00",
      "sat": "09:00-14:00"
    },
    "hours": "Пн-Пт 08:00-18:00, Сб 09:00-14:00, Вс выходной",
    "phone": "+7 (843) 520-20-20",
    "website": "https://medel.ru",
    "services": [
      "Ортопедия",
      "Травматология",
      "Рентген",
      "ЛФК"
    ],
    "features": {
      "onlineBooking": true,
      "wheelchair": true,
      "parking": true,
      "children": true,
      "eveningReception": false,
      "weekendReception": false
    },
    "description": "Ортопед-травматолог, специалист по заболеваниям суставов и позвоночника.",
    "lat": 55.7905,
    "lng": 49.1856,
    "servicePrices": [
      { "service": "Ортопедия", "minRub": 1500, "maxRub": 3000, "currency": "RUB" },
      { "service": "Травматология", "minRub": 1500, "maxRub": 3500, "currency": "RUB" },
      { "service": "Рентген", "minRub": 800, "maxRub": 1500, "currency": "RUB" },
      { "service": "ЛФК", "minRub": 1000, "maxRub": 2000, "currency": "RUB" }
    ]
  },
  {
    "id": 21,
    "name": "Валиев Эмиль Ренатович",
    "specialty": "Ортопед",
    "clinic": "РКБ",
    "address": "Казань, Оренбургский тракт, 138",
    "district": "Приволжский",
    "ownership": "Государственная",
    "rating": 4.8,
    "experience": 22,
    "schedule": {
      "sun": "Выходной",
      "mon": "08:00-16:00",
      "tue": "08:00-16:00",
      "wed": "08:00-16:00",
      "thu": "08:00-16:00",
      "fri": "08:00-16:00",
      "sat": "Выходной"
    },
    "hours": "Пн-Пт 08:00-16:00, Сб-Вс выходной",
    "phone": "+7 (843) 231-21-66",
    "website": "https://rkb-tatarstan.ru",
    "services": [
      "Ортопедия",
      "Эндопротезирование",
      "Травматология",
      "МРТ"
    ],
    "features": {
      "onlineBooking": true,
      "wheelchair": true,
      "parking": true,
      "children": false,
      "eveningReception": false,
      "weekendReception": false
    },
    "description": "Доктор медицинских наук, ведущий ортопед-травматолог РКБ, эксперт по эндопротезированию.",
    "lat": 55.7088,
    "lng": 49.1821,
    "servicePrices": [
      { "service": "Ортопедия", "minRub": 1200, "maxRub": 2500, "currency": "RUB" },
      { "service": "Эндопротезирование", "minRub": 100000, "maxRub": 350000, "currency": "RUB" },
      { "service": "Травматология", "minRub": 1500, "maxRub": 3000, "currency": "RUB" },
      { "service": "МРТ", "minRub": 3000, "maxRub": 6000, "currency": "RUB" }
    ]
  },
  {
    "id": 22,
    "name": "Султанова Айгуль Ильясовна",
    "specialty": "Кардиолог",
    "clinic": "МКДЦ",
    "address": "Казань, ул. Карбышева, 12А",
    "district": "Приволжский",
    "ownership": "Государственная",
    "rating": 4.9,
    "experience": 20,
    "schedule": {
      "sun": "Выходной",
      "mon": "08:00-17:00",
      "tue": "08:00-17:00",
      "wed": "08:00-17:00",
      "thu": "08:00-17:00",
      "fri": "08:00-17:00",
      "sat": "Выходной"
    },
    "hours": "Пн-Пт 08:00-17:00, Сб-Вс выходной",
    "phone": "+7 (843) 291-11-22",
    "website": "https://www.icdc.ru",
    "services": [
      "Кардиология",
      "ЭКГ",
      "ЭхоКГ",
      "Холтер-мониторинг"
    ],
    "features": {
      "onlineBooking": true,
      "wheelchair": true,
      "parking": true,
      "children": false,
      "eveningReception": false,
      "weekendReception": false
    },
    "description": "Кардиолог высшей категории МКДЦ, кандидат медицинских наук, специалист по аритмиям и ИБС.",
    "lat": 55.7602,
    "lng": 49.1764,
    "servicePrices": [
      { "service": "Кардиология", "minRub": 1500, "maxRub": 3000, "currency": "RUB" },
      { "service": "ЭКГ", "minRub": 500, "maxRub": 1000, "currency": "RUB" },
      { "service": "ЭхоКГ", "minRub": 1500, "maxRub": 3000, "currency": "RUB" },
      { "service": "Холтер-мониторинг", "minRub": 2000, "maxRub": 4000, "currency": "RUB" }
    ]
  },
  {
    "id": 23,
    "name": "Хуснутдинов Артур Рашидович",
    "specialty": "Кардиолог",
    "clinic": "Клиника «АВА-Казань»",
    "address": "Казань, ул. Профсоюзная, 19",
    "district": "Вахитовский",
    "ownership": "Частная",
    "rating": 4.7,
    "experience": 12,
    "schedule": {
      "sun": "Выходной",
      "mon": "08:00-20:00",
      "tue": "08:00-20:00",
      "wed": "08:00-20:00",
      "thu": "08:00-20:00",
      "fri": "08:00-20:00",
      "sat": "09:00-15:00"
    },
    "hours": "Пн-Пт 08:00-20:00, Сб 09:00-15:00, Вс выходной",
    "phone": "+7 (843) 200-05-00",
    "website": "https://ava-kazan.ru",
    "services": [
      "Кардиология",
      "ЭКГ",
      "УЗИ сердца",
      "Консультация"
    ],
    "features": {
      "onlineBooking": true,
      "wheelchair": true,
      "parking": true,
      "children": false,
      "eveningReception": true,
      "weekendReception": false
    },
    "description": "Кардиолог клиники «АВА-Казань», консультирует по вопросам профилактики и лечения сердечно-сосудистых заболеваний.",
    "lat": 55.7948,
    "lng": 49.1113,
    "servicePrices": [
      { "service": "Кардиология", "minRub": 2500, "maxRub": 4500, "currency": "RUB" },
      { "service": "ЭКГ", "minRub": 800, "maxRub": 1500, "currency": "RUB" },
      { "service": "УЗИ сердца", "minRub": 2500, "maxRub": 4000, "currency": "RUB" },
      { "service": "Консультация", "minRub": 2500, "maxRub": 4000, "currency": "RUB" }
    ]
  },
  {
    "id": 24,
    "name": "Ибрагимова Наиля Рашидовна",
    "specialty": "Дерматолог",
    "clinic": "Клиника «Март»",
    "address": "Казань, ул. Аделя Кутуя, 16",
    "district": "Советский",
    "ownership": "Частная",
    "rating": 4.6,
    "experience": 13,
    "schedule": {
      "sun": "Выходной",
      "mon": "09:00-19:00",
      "tue": "09:00-19:00",
      "wed": "09:00-19:00",
      "thu": "09:00-19:00",
      "fri": "09:00-19:00",
      "sat": "09:00-14:00"
    },
    "hours": "Пн-Пт 09:00-19:00, Сб 09:00-14:00, Вс выходной",
    "phone": "+7 (843) 295-55-66",
    "website": "https://martmed.ru",
    "services": [
      "Дерматология",
      "Косметология",
      "Дерматоскопия",
      "Криодеструкция"
    ],
    "features": {
      "onlineBooking": true,
      "wheelchair": true,
      "parking": true,
      "children": true,
      "eveningReception": false,
      "weekendReception": false
    },
    "description": "Дерматолог-косметолог, специализация — диагностика и лечение новообразований кожи.",
    "lat": 55.7863,
    "lng": 49.1705,
    "servicePrices": [
      { "service": "Дерматология", "minRub": 1500, "maxRub": 2800, "currency": "RUB" },
      { "service": "Косметология", "minRub": 2000, "maxRub": 8000, "currency": "RUB" },
      { "service": "Дерматоскопия", "minRub": 1000, "maxRub": 2000, "currency": "RUB" },
      { "service": "Криодеструкция", "minRub": 1500, "maxRub": 5000, "currency": "RUB" }
    ]
  },
  {
    "id": 25,
    "name": "Мусина Лейла Равилевна",
    "specialty": "Дерматолог",
    "clinic": "Городской кожно-венерологический диспансер",
    "address": "Казань, ул. Большая Красная, 28",
    "district": "Вахитовский",
    "ownership": "Государственная",
    "rating": 4.5,
    "experience": 20,
    "schedule": {
      "sun": "Выходной",
      "mon": "08:00-18:00",
      "tue": "08:00-18:00",
      "wed": "08:00-18:00",
      "thu": "08:00-18:00",
      "fri": "08:00-18:00",
      "sat": "08:00-13:00"
    },
    "hours": "Пн-Пт 08:00-18:00, Сб 08:00-13:00, Вс выходной",
    "phone": "+7 (843) 236-06-76",
    "website": "",
    "services": [
      "Дерматология",
      "Микология",
      "Аллергология",
      "Диагностика"
    ],
    "features": {
      "onlineBooking": true,
      "wheelchair": true,
      "parking": false,
      "children": true,
      "eveningReception": false,
      "weekendReception": false
    },
    "description": "Дерматолог высшей категории ГорКВД, опыт более 20 лет в диагностике кожных заболеваний.",
    "lat": 55.7929,
    "lng": 49.1266,
    "servicePrices": [
      { "service": "Дерматология", "minRub": 800, "maxRub": 1800, "currency": "RUB" },
      { "service": "Микология", "minRub": 1000, "maxRub": 2500, "currency": "RUB" },
      { "service": "Аллергология", "minRub": 1200, "maxRub": 2500, "currency": "RUB" },
      { "service": "Диагностика", "minRub": 500, "maxRub": 2000, "currency": "RUB" }
    ]
  },
  {
    "id": 26,
    "name": "Закирова Лиана Ильгизовна",
    "specialty": "Гинеколог",
    "clinic": "Клиника «9 месяцев»",
    "address": "Казань, ул. Академика Сахарова, 31",
    "district": "Советский",
    "ownership": "Частная",
    "rating": 4.9,
    "experience": 17,
    "schedule": {
      "sun": "09:00-14:00",
      "mon": "07:30-20:00",
      "tue": "07:30-20:00",
      "wed": "07:30-20:00",
      "thu": "07:30-20:00",
      "fri": "07:30-20:00",
      "sat": "09:00-18:00"
    },
    "hours": "Пн-Пт 07:30-20:00, Сб 09:00-18:00, Вс 09:00-14:00",
    "phone": "+7 (843) 207-04-40",
    "website": "https://c9m.ru",
    "services": [
      "Гинекология",
      "УЗИ малого таза",
      "Ведение беременности",
      "Кольпоскопия"
    ],
    "features": {
      "onlineBooking": true,
      "wheelchair": true,
      "parking": true,
      "children": false,
      "eveningReception": true,
      "weekendReception": true
    },
    "description": "Акушер-гинеколог высшей категории, специализация — ведение беременности и эндоскопическая хирургия.",
    "lat": 55.7815,
    "lng": 49.2210,
    "servicePrices": [
      { "service": "Гинекология", "minRub": 1800, "maxRub": 3500, "currency": "RUB" },
      { "service": "УЗИ малого таза", "minRub": 1500, "maxRub": 2800, "currency": "RUB" },
      { "service": "Ведение беременности", "minRub": 40000, "maxRub": 120000, "currency": "RUB" },
      { "service": "Кольпоскопия", "minRub": 1500, "maxRub": 2500, "currency": "RUB" }
    ]
  },
  {
    "id": 27,
    "name": "Фазлутдинова Алина Рафаиловна",
    "specialty": "Гинеколог",
    "clinic": "Городская поликлиника № 7",
    "address": "Казань, ул. Школьная, 7",
    "district": "Приволжский",
    "ownership": "Государственная",
    "rating": 4.5,
    "experience": 14,
    "schedule": {
      "sun": "Выходной",
      "mon": "08:00-18:00",
      "tue": "08:00-18:00",
      "wed": "08:00-18:00",
      "thu": "08:00-18:00",
      "fri": "08:00-18:00",
      "sat": "08:00-13:00"
    },
    "hours": "Пн-Пт 08:00-18:00, Сб 08:00-13:00, Вс выходной",
    "phone": "+7 (843) 275-51-51",
    "website": "",
    "services": [
      "Гинекология",
      "УЗИ",
      "Диспансеризация",
      "Консультация"
    ],
    "features": {
      "onlineBooking": true,
      "wheelchair": true,
      "parking": false,
      "children": false,
      "eveningReception": false,
      "weekendReception": false
    },
    "description": "Акушер-гинеколог, участковый врач, ведет прием по ОМС, плановые осмотры и диспансеризацию.",
    "lat": 55.7730,
    "lng": 49.1570,
    "servicePrices": [
      { "service": "Гинекология", "minRub": 0, "maxRub": 1500, "currency": "RUB" },
      { "service": "УЗИ", "minRub": 800, "maxRub": 1800, "currency": "RUB" },
      { "service": "Диспансеризация", "minRub": 0, "maxRub": 0, "currency": "RUB" },
      { "service": "Консультация", "minRub": 0, "maxRub": 1200, "currency": "RUB" }
    ]
  },
  {
    "id": 28,
    "name": "Нигматуллина Регина Маратовна",
    "specialty": "Педиатр",
    "clinic": "Клиника «АВА-Казань»",
    "address": "Казань, ул. Профсоюзная, 19",
    "district": "Вахитовский",
    "ownership": "Частная",
    "rating": 4.8,
    "experience": 11,
    "schedule": {
      "sun": "Выходной",
      "mon": "08:00-20:00",
      "tue": "08:00-20:00",
      "wed": "08:00-20:00",
      "thu": "08:00-20:00",
      "fri": "08:00-20:00",
      "sat": "09:00-16:00"
    },
    "hours": "Пн-Пт 08:00-20:00, Сб 09:00-16:00, Вс выходной",
    "phone": "+7 (843) 200-05-00",
    "website": "https://ava-kazan.ru",
    "services": [
      "Педиатрия",
      "Вакцинация",
      "Консультация",
      "Профосмотр"
    ],
    "features": {
      "onlineBooking": true,
      "wheelchair": true,
      "parking": true,
      "children": true,
      "eveningReception": true,
      "weekendReception": false
    },
    "description": "Педиатр клиники «АВА-Казань», комплексное наблюдение детей от рождения.",
    "lat": 55.7948,
    "lng": 49.1113,
    "servicePrices": [
      { "service": "Педиатрия", "minRub": 2500, "maxRub": 4000, "currency": "RUB" },
      { "service": "Вакцинация", "minRub": 1000, "maxRub": 5000, "currency": "RUB" },
      { "service": "Консультация", "minRub": 2000, "maxRub": 3500, "currency": "RUB" },
      { "service": "Профосмотр", "minRub": 2000, "maxRub": 3500, "currency": "RUB" }
    ]
  },
  {
    "id": 29,
    "name": "Шайхулов Рафаэль Радикович",
    "specialty": "Педиатр",
    "clinic": "Детская республиканская клиническая больница",
    "address": "Казань, Оренбургский тракт, 140",
    "district": "Приволжский",
    "ownership": "Государственная",
    "rating": 4.7,
    "experience": 16,
    "schedule": {
      "sun": "09:00-14:00",
      "mon": "08:00-17:00",
      "tue": "08:00-17:00",
      "wed": "08:00-17:00",
      "thu": "08:00-17:00",
      "fri": "08:00-17:00",
      "sat": "08:00-14:00"
    },
    "hours": "Пн-Пт 08:00-17:00, Сб 08:00-14:00, Вс 09:00-14:00",
    "phone": "+7 (843) 231-21-00",
    "website": "https://drkb.tatarstan.ru",
    "services": [
      "Педиатрия",
      "Диагностика",
      "Вакцинация",
      "Консультация"
    ],
    "features": {
      "onlineBooking": true,
      "wheelchair": true,
      "parking": true,
      "children": true,
      "eveningReception": false,
      "weekendReception": true
    },
    "description": "Педиатр ДРКБ, кандидат медицинских наук, специализируется на заболеваниях органов дыхания у детей.",
    "lat": 55.7095,
    "lng": 49.1840,
    "servicePrices": [
      { "service": "Педиатрия", "minRub": 1000, "maxRub": 2000, "currency": "RUB" },
      { "service": "Диагностика", "minRub": 1500, "maxRub": 4000, "currency": "RUB" },
      { "service": "Вакцинация", "minRub": 500, "maxRub": 3000, "currency": "RUB" },
      { "service": "Консультация", "minRub": 1000, "maxRub": 2000, "currency": "RUB" }
    ]
  },
  {
    "id": 30,
    "name": "Абдуллина Чулпан Рустемовна",
    "specialty": "ЛОР",
    "clinic": "Медицинский центр КОРЛ",
    "address": "Казань, ул. Даурская, 12",
    "district": "Советский",
    "ownership": "Частная",
    "rating": 4.8,
    "experience": 15,
    "schedule": {
      "sun": "08:00-14:00",
      "mon": "08:00-20:00",
      "tue": "08:00-20:00",
      "wed": "08:00-20:00",
      "thu": "08:00-20:00",
      "fri": "08:00-20:00",
      "sat": "08:00-16:00"
    },
    "hours": "Пн-Пт 08:00-20:00, Сб 08:00-16:00, Вс 08:00-14:00",
    "phone": "+7 (843) 277-88-55",
    "website": "https://korl.ru",
    "services": [
      "ЛОР",
      "Эндоскопия ЛОР-органов",
      "Аудиометрия",
      "Лечение храпа"
    ],
    "features": {
      "onlineBooking": true,
      "wheelchair": true,
      "parking": true,
      "children": true,
      "eveningReception": true,
      "weekendReception": true
    },
    "description": "Оториноларинголог медцентра КОРЛ, владеет современными эндоскопическими методами диагностики.",
    "lat": 55.7681,
    "lng": 49.1822,
    "servicePrices": [
      { "service": "ЛОР", "minRub": 1800, "maxRub": 3000, "currency": "RUB" },
      { "service": "Эндоскопия ЛОР-органов", "minRub": 2000, "maxRub": 4000, "currency": "RUB" },
      { "service": "Аудиометрия", "minRub": 1000, "maxRub": 2000, "currency": "RUB" },
      { "service": "Лечение храпа", "minRub": 5000, "maxRub": 30000, "currency": "RUB" }
    ]
  }
];
