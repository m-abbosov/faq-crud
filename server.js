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
  try {
    const faqs = readFAQs();
    res.status(200).json({
      success: true,
      statusCode: 200,
      data: faqs,
      message: 'FAQlar muvaffaqiyatli yuklandi',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      error: 'FAQlarni yuklashda xatolik',
      message: 'Server xatoligi',
    });
  }
});

// Bitta FAQ olish
app.get('/api/faqs/:id', (req, res) => {
  try {
    const faqs = readFAQs();
    const faq = faqs.find((f) => f.id === req.params.id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        error: 'FAQ topilmadi',
        message: 'Berilgan ID bilan FAQ topilmadi',
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: faq,
      message: 'FAQ muvaffaqiyatli topildi',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      error: 'FAQ olishda xatolik',
      message: 'Server xatoligi',
    });
  }
});

// Yangi FAQ yaratish
app.post('/api/faqs', (req, res) => {
  try {
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        error: 'Savol va javob kiritilishi shart',
        message: "Barcha maydonlar to'ldirilishi kerak",
      });
    }

    const faqs = readFAQs();
    const newFAQ = {
      id: generateId(),
      question,
      answer,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    faqs.push(newFAQ);

    if (writeFAQs(faqs)) {
      res.status(201).json({
        success: true,
        statusCode: 201,
        data: newFAQ,
        message: "FAQ muvaffaqiyatli qo'shildi",
      });
    } else {
      res.status(500).json({
        success: false,
        statusCode: 500,
        error: 'FAQ saqlanmadi',
        message: "Ma'lumotlar saqlanmadi",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      error: 'FAQ yaratishda xatolik',
      message: 'Server xatoligi',
    });
  }
});

// FAQ yangilash
app.put('/api/faqs/:id', (req, res) => {
  try {
    const { question, answer } = req.body;
    const faqs = readFAQs();
    const faqIndex = faqs.findIndex((f) => f.id === req.params.id);

    if (faqIndex === -1) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        error: 'FAQ topilmadi',
        message: 'Berilgan ID bilan FAQ topilmadi',
      });
    }

    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        error: 'Savol va javob kiritilishi shart',
        message: "Barcha maydonlar to'ldirilishi kerak",
      });
    }

    faqs[faqIndex] = {
      ...faqs[faqIndex],
      question,
      answer,
      updatedAt: new Date().toISOString(),
    };

    if (writeFAQs(faqs)) {
      res.status(200).json({
        success: true,
        statusCode: 200,
        data: faqs[faqIndex],
        message: 'FAQ muvaffaqiyatli yangilandi',
      });
    } else {
      res.status(500).json({
        success: false,
        statusCode: 500,
        error: 'FAQ yangilanmadi',
        message: "Ma'lumotlar saqlanmadi",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      error: 'FAQ yangilashda xatolik',
      message: 'Server xatoligi',
    });
  }
});

// FAQ o'chirish
app.delete('/api/faqs/:id', (req, res) => {
  try {
    const faqs = readFAQs();
    const faqIndex = faqs.findIndex((f) => f.id === req.params.id);

    if (faqIndex === -1) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        error: 'FAQ topilmadi',
        message: 'Berilgan ID bilan FAQ topilmadi',
      });
    }

    const deletedFAQ = faqs.splice(faqIndex, 1)[0];

    if (writeFAQs(faqs)) {
      res.status(200).json({
        success: true,
        statusCode: 200,
        data: deletedFAQ,
        message: "FAQ muvaffaqiyatli o'chirildi",
      });
    } else {
      res.status(500).json({
        success: false,
        statusCode: 500,
        error: "FAQ o'chirilmadi",
        message: "Ma'lumotlar saqlanmadi",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      error: "FAQ o'chirishda xatolik",
      message: 'Server xatoligi',
    });
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
