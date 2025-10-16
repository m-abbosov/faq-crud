const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'faqs.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Data directory yaratish
if (!fs.existsSync(path.dirname(DATA_FILE))) {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
}

// JSON faylni o'qish funksiyasi
function readFAQs() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            return JSON.parse(data);
        }
        return [];
    } catch (error) {
        console.error('Error reading FAQs:', error);
        return [];
    }
}

// JSON faylga yozish funksiyasi
function writeFAQs(faqs) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(faqs, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing FAQs:', error);
        return false;
    }
}

// ID generator
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Routes

// Barcha FAQlarni olish
app.get('/api/faqs', (req, res) => {
    const faqs = readFAQs();
    res.json(faqs);
});

// Bitta FAQ olish
app.get('/api/faqs/:id', (req, res) => {
    const faqs = readFAQs();
    const faq = faqs.find(f => f.id === req.params.id);
    
    if (!faq) {
        return res.status(404).json({ error: 'FAQ topilmadi' });
    }
    
    res.json(faq);
});

// Yangi FAQ yaratish
app.post('/api/faqs', (req, res) => {
    const { question, answer } = req.body;
    
    if (!question || !answer) {
        return res.status(400).json({ error: 'Savol va javob kiritilishi shart' });
    }
    
    const faqs = readFAQs();
    const newFAQ = {
        id: generateId(),
        question,
        answer,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    faqs.push(newFAQ);
    
    if (writeFAQs(faqs)) {
        res.status(201).json(newFAQ);
    } else {
        res.status(500).json({ error: 'FAQ saqlanmadi' });
    }
});

// FAQ yangilash
app.put('/api/faqs/:id', (req, res) => {
    const { question, answer } = req.body;
    const faqs = readFAQs();
    const faqIndex = faqs.findIndex(f => f.id === req.params.id);
    
    if (faqIndex === -1) {
        return res.status(404).json({ error: 'FAQ topilmadi' });
    }
    
    if (!question || !answer) {
        return res.status(400).json({ error: 'Savol va javob kiritilishi shart' });
    }
    
    faqs[faqIndex] = {
        ...faqs[faqIndex],
        question,
        answer,
        updatedAt: new Date().toISOString()
    };
    
    if (writeFAQs(faqs)) {
        res.json(faqs[faqIndex]);
    } else {
        res.status(500).json({ error: 'FAQ yangilanmadi' });
    }
});

// FAQ o'chirish
app.delete('/api/faqs/:id', (req, res) => {
    const faqs = readFAQs();
    const faqIndex = faqs.findIndex(f => f.id === req.params.id);
    
    if (faqIndex === -1) {
        return res.status(404).json({ error: 'FAQ topilmadi' });
    }
    
    const deletedFAQ = faqs.splice(faqIndex, 1)[0];
    
    if (writeFAQs(faqs)) {
        res.json({ message: 'FAQ muvaffaqiyatli o\'chirildi', faq: deletedFAQ });
    } else {
        res.status(500).json({ error: 'FAQ o\'chirilmadi' });
    }
});

// Frontend uchun asosiy sahifa
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Server ishga tushirish
app.listen(PORT, () => {
    console.log(`Server ${PORT} portda ishlamoqda`);
    console.log(`http://localhost:${PORT} da oching`);
});
