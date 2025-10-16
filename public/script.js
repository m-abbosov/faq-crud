// Global variables
let faqs = [];
let currentFAQ = null;
let isEditMode = false;

// DOM elements
const faqList = document.getElementById('faqList');
const modal = document.getElementById('modal');
const confirmModal = document.getElementById('confirmModal');
const faqForm = document.getElementById('faqForm');
const searchInput = document.getElementById('searchInput');
const loading = document.getElementById('loading');

// Event listeners
document.addEventListener('DOMContentLoaded', function () {
    loadFAQs();
    setupEventListeners();
});

function setupEventListeners() {
    // Add button
    document.getElementById('addBtn').addEventListener('click', () => {
        openModal();
    });

    // Modal close buttons
    document.querySelector('.close').addEventListener('click', closeModal);
    document.getElementById('cancelBtn').addEventListener('click', closeModal);
    document.getElementById('confirmCancel').addEventListener('click', closeConfirmModal);

    // Form submit
    faqForm.addEventListener('submit', handleFormSubmit);

    // Search
    searchInput.addEventListener('input', filterFAQs);

    // Click outside modal to close
    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            closeModal();
        }
        if (event.target === confirmModal) {
            closeConfirmModal();
        }
    });
}

// API functions
async function loadFAQs() {
    try {
        showLoading(true);
        const response = await fetch('/api/faqs');
        if (response.ok) {
            faqs = await response.json();
            displayFAQs(faqs);
        } else {
            showMessage('FAQlarni yuklashda xatolik yuz berdi', 'error');
        }
    } catch (error) {
        console.error('Error loading FAQs:', error);
        showMessage('Server bilan bog\'lanishda xatolik', 'error');
    } finally {
        showLoading(false);
    }
}

async function createFAQ(faqData) {
    try {
        const response = await fetch('/api/faqs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(faqData)
        });

        if (response.ok) {
            const newFAQ = await response.json();
            faqs.push(newFAQ);
            displayFAQs(faqs);
            showMessage('FAQ muvaffaqiyatli qo\'shildi', 'success');
            return true;
        } else {
            const error = await response.json();
            showMessage(error.error || 'FAQ qo\'shishda xatolik', 'error');
            return false;
        }
    } catch (error) {
        console.error('Error creating FAQ:', error);
        showMessage('Server bilan bog\'lanishda xatolik', 'error');
        return false;
    }
}

async function updateFAQ(id, faqData) {
    try {
        const response = await fetch(`/api/faqs/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(faqData)
        });

        if (response.ok) {
            const updatedFAQ = await response.json();
            const index = faqs.findIndex(faq => faq.id === id);
            if (index !== -1) {
                faqs[index] = updatedFAQ;
                displayFAQs(faqs);
                showMessage('FAQ muvaffaqiyatli yangilandi', 'success');
            }
            return true;
        } else {
            const error = await response.json();
            showMessage(error.error || 'FAQ yangilashda xatolik', 'error');
            return false;
        }
    } catch (error) {
        console.error('Error updating FAQ:', error);
        showMessage('Server bilan bog\'lanishda xatolik', 'error');
        return false;
    }
}

async function deleteFAQ(id) {
    try {
        const response = await fetch(`/api/faqs/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            faqs = faqs.filter(faq => faq.id !== id);
            displayFAQs(faqs);
            showMessage('FAQ muvaffaqiyatli o\'chirildi', 'success');
            return true;
        } else {
            const error = await response.json();
            showMessage(error.error || 'FAQ o\'chirishda xatolik', 'error');
            return false;
        }
    } catch (error) {
        console.error('Error deleting FAQ:', error);
        showMessage('Server bilan bog\'lanishda xatolik', 'error');
        return false;
    }
}

// UI functions
function displayFAQs(faqsToShow) {
    if (faqsToShow.length === 0) {
        faqList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-question-circle"></i>
                <h3>FAQ topilmadi</h3>
                <p>Hozircha hech qanday FAQ yo'q. Yangi FAQ qo'shish uchun tugmani bosing.</p>
            </div>
        `;
        return;
    }

    faqList.innerHTML = faqsToShow.map(faq => `
        <div class="faq-item" data-id="${faq.id}">
            <div class="faq-question" onclick="toggleFAQ('${faq.id}')">
                <span>${escapeHtml(faq.question)}</span>
                <i class="fas fa-chevron-down faq-toggle"></i>
            </div>
            <div class="faq-answer" id="answer-${faq.id}">
                <div class="faq-answer-content">${escapeHtml(faq.answer)}</div>
                <div class="faq-meta">
                    <div class="faq-date">
                        Yaratilgan: ${formatDate(faq.createdAt)}
                        ${faq.updatedAt !== faq.createdAt ? `<br>Yangilangan: ${formatDate(faq.updatedAt)}` : ''}
                    </div>
                    <div class="faq-actions">
                        <button class="btn btn-edit" onclick="editFAQ('${faq.id}')">
                            <i class="fas fa-edit"></i> Tahrirlash
                        </button>
                        <button class="btn btn-delete" onclick="confirmDelete('${faq.id}')">
                            <i class="fas fa-trash"></i> O'chirish
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function openModal(faq = null) {
    isEditMode = faq !== null;
    currentFAQ = faq;

    const modalTitle = document.getElementById('modalTitle');
    const questionInput = document.getElementById('question');
    const answerInput = document.getElementById('answer');
    
    if (isEditMode) {
        modalTitle.textContent = 'FAQ tahrirlash';
        questionInput.value = faq.question;
        answerInput.value = faq.answer;
    } else {
        modalTitle.textContent = 'Yangi FAQ qo\'shish';
        faqForm.reset();
    }

    modal.style.display = 'block';
    questionInput.focus();
}

function closeModal() {
    modal.style.display = 'none';
    currentFAQ = null;
    isEditMode = false;
    faqForm.reset();
}

function closeConfirmModal() {
    confirmModal.style.display = 'none';
}

function openConfirmModal(message, callback) {
    document.getElementById('confirmMessage').textContent = message;
    confirmModal.style.display = 'block';

    // Remove existing event listeners
    const confirmBtn = document.getElementById('confirmDelete');
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

    // Add new event listener
    newConfirmBtn.addEventListener('click', callback);
}

// Event handlers
function handleFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(faqForm);
    const faqData = {
        question: formData.get('question').trim(),
        answer: formData.get('answer').trim()
    };

    if (!faqData.question || !faqData.answer) {
        showMessage('Savol va javob kiritilishi shart', 'error');
        return;
    }

    if (isEditMode) {
        updateFAQ(currentFAQ.id, faqData).then(success => {
            if (success) {
                closeModal();
            }
        });
    } else {
        createFAQ(faqData).then(success => {
            if (success) {
                closeModal();
            }
        });
    }
}

function editFAQ(id) {
    const faq = faqs.find(f => f.id === id);
    if (faq) {
        openModal(faq);
    }
}

function confirmDelete(id) {
    const faq = faqs.find(f => f.id === id);
    if (faq) {
        openConfirmModal(`"${faq.question}" savolini o'chirishni xohlaysizmi?`, () => {
            deleteFAQ(id);
            closeConfirmModal();
        });
    }
}

// Accordion funksiyasi
function toggleFAQ(id) {
    const answerElement = document.getElementById(`answer-${id}`);
    const toggleIcon = answerElement.previousElementSibling.querySelector('.faq-toggle');
    const faqItem = answerElement.closest('.faq-item');
    
    if (answerElement.classList.contains('active')) {
        // Yopish
        answerElement.classList.remove('active');
        toggleIcon.classList.remove('fa-chevron-up');
        toggleIcon.classList.add('fa-chevron-down');
        faqItem.classList.remove('expanded');
    } else {
        // Ochish
        answerElement.classList.add('active');
        toggleIcon.classList.remove('fa-chevron-down');
        toggleIcon.classList.add('fa-chevron-up');
        faqItem.classList.add('expanded');
    }
}

function filterFAQs() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    let filteredFAQs = faqs;
    
    // Search filter
    if (searchTerm) {
        filteredFAQs = filteredFAQs.filter(faq => 
            faq.question.toLowerCase().includes(searchTerm) ||
            faq.answer.toLowerCase().includes(searchTerm)
        );
    }
    
    displayFAQs(filteredFAQs);
}

// Utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('uz-UZ', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showLoading(show) {
    loading.classList.toggle('hidden', !show);
}

function showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());

    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;

    // Insert at the top of container
    const container = document.querySelector('.container');
    container.insertBefore(messageDiv, container.firstChild);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// Keyboard shortcuts
document.addEventListener('keydown', function (e) {
    // Escape key to close modals
    if (e.key === 'Escape') {
        if (modal.style.display === 'block') {
            closeModal();
        }
        if (confirmModal.style.display === 'block') {
            closeConfirmModal();
        }
    }

    // Ctrl/Cmd + N to add new FAQ
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        openModal();
    }

    // Ctrl/Cmd + F to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        searchInput.focus();
    }
});
