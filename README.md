# FAQ CRUD Ilovasi

Express.js va JSON fayl database yordamida yaratilgan FAQ (Ko'p so'raladigan savollar) boshqaruv tizimi.

## Xususiyatlar

- ✅ FAQ qo'shish, o'qish, yangilash va o'chirish (CRUD)
- ✅ Qidiruv funksiyasi
- ✅ Kategoriya bo'yicha filtrlash
- ✅ Zamonaviy va responsive dizayn
- ✅ JSON fayl database
- ✅ Real-time yangilanishlar
- ✅ Modal oynalar
- ✅ Tasdiqlash oynalari

## Texnologiyalar

### Backend
- Node.js
- Express.js
- CORS
- Body-parser

### Frontend
- HTML5
- CSS3 (Flexbox, Grid, Animations)
- Vanilla JavaScript (ES6+)
- Font Awesome icons

### Database
- JSON fayl (data/faqs.json)

## O'rnatish

1. Loyihani klonlang yoki yuklab oling:
```bash
git clone <repository-url>
cd faq-crud
```

2. Dependencelarni o'rnating:
```bash
npm install
```

3. Serverni ishga tushiring:
```bash
npm start
```

Yoki development rejimida:
```bash
npm run dev
```

4. Brauzerda oching:
```
http://localhost:3000
```

## API Endpointlar

### GET /api/faqs
Barcha FAQlarni olish

**Response:**
```json
[
  {
    "id": "unique_id",
    "question": "Savol matni",
    "answer": "Javob matni",
    "category": "Kategoriya",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### GET /api/faqs/:id
Bitta FAQ olish

### POST /api/faqs
Yangi FAQ yaratish

**Request Body:**
```json
{
  "question": "Savol matni",
  "answer": "Javob matni",
  "category": "Kategoriya (ixtiyoriy)"
}
```

### PUT /api/faqs/:id
FAQ yangilash

**Request Body:**
```json
{
  "question": "Yangi savol matni",
  "answer": "Yangi javob matni",
  "category": "Yangi kategoriya (ixtiyoriy)"
}
```

### DELETE /api/faqs/:id
FAQ o'chirish

## Foydalanish

### FAQ Qo'shish
1. "Yangi FAQ qo'shish" tugmasini bosing
2. Savol va javobni kiriting
3. Kategoriyani tanlang (ixtiyoriy)
4. "Saqlash" tugmasini bosing

### FAQ Tahrirlash
1. FAQ yonidagi "Tahrirlash" tugmasini bosing
2. Kerakli o'zgarishlarni kiring
3. "Saqlash" tugmasini bosing

### FAQ O'chirish
1. FAQ yonidagi "O'chirish" tugmasini bosing
2. Tasdiqlash oynasida "O'chirish" tugmasini bosing

### Qidiruv va Filtrlash
- Yuqoridagi qidiruv maydonida matn kiriting
- Kategoriya dropdown dan kerakli kategoriyani tanlang

## Klaviatura Qisqartmalari

- `Ctrl/Cmd + N` - Yangi FAQ qo'shish
- `Ctrl/Cmd + F` - Qidiruv maydoniga o'tish
- `Escape` - Modal oynalarni yopish

## Loyiha Tuzilishi

```
faq-crud/
├── data/
│   └── faqs.json          # JSON database
├── public/
│   ├── index.html         # Asosiy HTML sahifa
│   ├── style.css          # CSS stillar
│   └── script.js          # JavaScript kodi
├── server.js              # Express.js server
├── package.json           # Dependencies
└── README.md              # Loyiha hujjati
```

## Rivojlantirish

### Yangi xususiyat qo'shish
1. Backend: `server.js` faylida yangi endpoint qo'shing
2. Frontend: `public/script.js` faylida yangi funksiya qo'shing
3. UI: `public/index.html` va `public/style.css` fayllarini yangilang

### Database o'zgartirish
`data/faqs.json` faylini to'g'ridan-to'g'ri tahrirlash mumkin, lekin server qayta ishga tushirilishi kerak.

## Xatoliklar

Agar xatolik yuz bersa:
1. Console loglarini tekshiring
2. Server loglarini ko'ring
3. Network tabida API so'rovlarini tekshiring
4. `data/faqs.json` fayl mavjudligini tekshiring

## Litsenziya

MIT License

## Muallif

Sizning ismingiz

---

**Eslatma:** Bu loyiha o'quv maqsadida yaratilgan. Production muhitida ishlatishdan oldin xavfsizlik va performance optimizatsiyalarini qo'shing.
