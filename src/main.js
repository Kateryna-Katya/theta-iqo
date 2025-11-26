// script.js

document.addEventListener('DOMContentLoaded', () => {
    
    // --------------------------------------------------------------------------
    // 0. Инициализация AOS (Animation On Scroll)
    // --------------------------------------------------------------------------
    AOS.init({
        duration: 1000, // Длительность анимации
        once: true,    // Анимация происходит только один раз
        mirror: false, // Не повторять при прокрутке вверх
    });
    
    // --------------------------------------------------------------------------
    // 1. Бургер-меню (простой JS для мобильной навигации)
    // --------------------------------------------------------------------------
    const headerBurger = document.querySelector('.header__burger');
    const headerNav = document.querySelector('.header__nav');

    if (headerBurger && headerNav) {
        headerBurger.addEventListener('click', () => {
            headerNav.classList.toggle('nav--active'); // Класс для отображения меню
            const icon = headerBurger.querySelector('i');
            // Меняем иконку: menu <-> x (close)
            if (headerNav.classList.contains('nav--active')) {
                icon.setAttribute('data-lucide', 'x');
            } else {
                icon.setAttribute('data-lucide', 'menu');
            }
            lucide.createIcons(); // Перерисовать иконку
        });
    }

    // Дополнительная логика для закрытия меню при клике на ссылку (на мобильных)
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (headerNav.classList.contains('nav--active')) {
                headerNav.classList.remove('nav--active');
                headerBurger.querySelector('i').setAttribute('data-lucide', 'menu');
                lucide.createIcons();
            }
            
            // Логика подсветки активной ссылки при клике
            navLinks.forEach(l => l.classList.remove('nav__link--active'));
            link.classList.add('nav__link--active');
        });
    });
    
    // --------------------------------------------------------------------------
    // 2. Логика подсветки активного пункта меню по скроллу (Intersection Observer)
    // --------------------------------------------------------------------------
    const sections = document.querySelectorAll('section[id]');
    
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px 0px -50% 0px', // Срабатывает, когда секция пересекает центр экрана
        threshold: 0 // Срабатывает, как только появляется
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentSectionId = entry.target.id;
                
                // Снимаем активность со всех ссылок
                document.querySelectorAll('.nav__link').forEach(link => {
                    link.classList.remove('nav__link--active');
                });
                
                // Добавляем активность к соответствующей ссылке
                const activeLink = document.querySelector(`.nav__link[href="#${currentSectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('nav__link--active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // --------------------------------------------------------------------------
    // 3. Кастомная JS-анимация для Hero-секции (Поток Кода)
    // --------------------------------------------------------------------------
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = canvas.offsetWidth;
        let height = canvas.height = canvas.offsetHeight;
        let font_size = 18;
        let columns = Math.floor(width / font_size);
        let drops = [];

        // Инициализация капель
        for(let x = 0; x < columns; x++) {
            drops[x] = Math.random() * 50; 
        }

        // Символы для "кода"
        const characters = 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ0123456789!@#$%^&*()_+';
        
        // Получение переменной цвета из CSS для кода
        const style = getComputedStyle(document.body);
        const varColorPrimary = style.getPropertyValue('--color-primary').trim();
        const varColorHeading = style.getPropertyValue('--color-heading').trim();
        
        // Функция для рисования кадра
        function draw() {
            // Фон: слегка прозрачный темный (эффект "следа")
            ctx.fillStyle = `${varColorHeading}09`; // Используем цвет heading с низкой прозрачностью
            ctx.fillRect(0, 0, width, height);
            
            ctx.fillStyle = varColorPrimary; // Яркий синий цвет кода
            ctx.font = font_size + "px monospace";

            for(let i = 0; i < drops.length; i++) {
                // Случайный символ
                const text = characters[Math.floor(Math.random() * characters.length)];
                
                // Рисуем символ
                ctx.fillText(text, i * font_size, drops[i] * font_size);
                
                // Сбрасываем "каплю" при достижении низа
                if(drops[i] * font_size > height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                
                // Увеличиваем координату Y
                drops[i]++;
            }
        }
        
        // Адаптивность: пересчет при изменении размера окна
        window.addEventListener('resize', () => {
            width = canvas.width = canvas.offsetWidth;
            height = canvas.height = canvas.offsetHeight;
            columns = Math.floor(width / font_size);
            drops = [];
            for(let x = 0; x < columns; x++) {
                drops[x] = Math.random() * 50;
            }
        });

        // Запуск анимации
        setInterval(draw, 50); 
    }
});
// script.js (Додайте після логіки Intersection Observer)

// --------------------------------------------------------------------------
// 4. Логика Табов (Секция Технология)
// --------------------------------------------------------------------------
const tabsNav = document.querySelector('.tabs-nav');
if (tabsNav) {
    tabsNav.addEventListener('click', (e) => {
        const button = e.target.closest('.tabs-nav__button');
        if (!button) return;

        const targetTab = button.dataset.tab;
        
        // 1. Убираем класс активности со всех кнопок
        document.querySelectorAll('.tabs-nav__button').forEach(btn => {
            btn.classList.remove('tabs-nav__button--active');
        });

        // 2. Скрываем весь контент
        document.querySelectorAll('.tabs-content__item').forEach(content => {
            content.classList.remove('tabs-content__item--active');
        });

        // 3. Добавляем класс активности к нажатой кнопке
        button.classList.add('tabs-nav__button--active');

        // 4. Показываем соответствующий контент
        const activeContent = document.querySelector(`[data-tab-content="${targetTab}"]`);
        if (activeContent) {
            activeContent.classList.add('tabs-content__item--active');
        }
        
        // Перерисовываем иконки Lucide, если они были скрыты
        lucide.createIcons();
    });
}

// ... (Остальной скрипт)
// script.js (Добавьте после логики Табов)

// --------------------------------------------------------------------------
// 5. Анимация счетчиков (Секция Перспективы)
// --------------------------------------------------------------------------
const counterSection = document.getElementById('perspectives');
const statItems = document.querySelectorAll('.stat-item__number');
let countersAnimated = false; // Флаг, чтобы анимация сработала только один раз

function animateCounters() {
    if (countersAnimated) return; // Останавливаем, если уже анимировано
    countersAnimated = true;

    statItems.forEach(item => {
        const target = parseInt(item.dataset.target);
        const suffix = item.dataset.suffix || '';
        let current = 0;
        const duration = 2000; // 2 секунды
        const step = target / (duration / 50); // Шаг для интервала 50ms

        const updateCounter = () => {
            current += step;
            if (current < target) {
                // Округляем до целого числа
                item.textContent = Math.ceil(current).toLocaleString() + suffix; 
                requestAnimationFrame(updateCounter);
            } else {
                item.textContent = target.toLocaleString() + suffix;
            }
        };

        requestAnimationFrame(updateCounter);
    });
}

// Запуск анимации при видимости секции с помощью Intersection Observer
if (counterSection) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target); // Останавливаем наблюдение
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -20% 0px', // Начинаем анимацию, когда 80% секции уже видно
        threshold: 0.1
    });

    counterObserver.observe(counterSection);
}

// ... (Остальной скрипт)
// script.js (Додайте після логіки Анимации счетчиков)

// --------------------------------------------------------------------------
// 6. Логика Аккордеона (Секция FAQ)
// --------------------------------------------------------------------------
const accordionHeaders = document.querySelectorAll('.accordion-item__header');

accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const item = header.closest('.accordion-item');
        const content = item.querySelector('.accordion-item__content');
        
        // Переключаем класс активности на текущем элементе
        item.classList.toggle('accordion-item--active');
        
        // Устанавливаем высоту для анимации
        if (item.classList.contains('accordion-item--active')) {
            // Открываем: устанавливаем высоту контента
            content.style.maxHeight = content.scrollHeight + 'px';
        } else {
            // Закрываем
            content.style.maxHeight = 0;
        }
        
        // Закрываем другие открытые элементы (опционально, но часто используется)
        document.querySelectorAll('.accordion-item').forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('accordion-item--active')) {
                otherItem.classList.remove('accordion-item--active');
                otherItem.querySelector('.accordion-item__content').style.maxHeight = 0;
            }
        });
        
        // Перерисовываем иконки Lucide, если они были скрыты
        lucide.createIcons();
    });
});

// ... (Остальной скрипт)
// script.js

// --------------------------------------------------------------------------
// 7. Логика Формы Контактов (AJAX-имитация и CAPTCHA)
// --------------------------------------------------------------------------
const contactForm = document.getElementById('contact-form');
const successMessage = document.getElementById('contact-success');
const captchaLabel = document.getElementById('captcha-label');
const captchaInput = document.getElementById('captcha-input');

let correctCaptchaResult = 0; // Глобальная переменная для хранения правильного ответа

// Функция для генерации и отображения новой CAPTCHA
function generateCaptcha() {
    const num1 = Math.floor(Math.random() * 10) + 1; // 1-10
    const num2 = Math.floor(Math.random() * 5) + 1; // 1-5
    correctCaptchaResult = num1 + num2;
    captchaLabel.textContent = `Проверка: ${num1} + ${num2} = ?`;
    captchaInput.value = ''; // Очистка поля ввода
}

// Инициализация CAPTCHA при загрузке страницы
if (contactForm) {
    generateCaptcha(); 
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Предотвращаем стандартную отправку формы и перезагрузку
        
        const submittedResult = parseInt(captchaInput.value);
        
        // 1. Проверка CAPTCHA
        if (submittedResult !== correctCaptchaResult) {
            alert('Ошибка CAPTCHA! Пожалуйста, решите пример правильно.');
            generateCaptcha(); // Генерируем новый пример
            return; // Останавливаем выполнение
        }

        // Проверка, что чекбокс согласия отмечен
        const privacyCheckbox = document.getElementById('privacy-agree');
        if (!privacyCheckbox.checked) {
            alert('Пожалуйста, примите условия использования и политику конфиденциальности.');
            return;
        }

        // 2. Имитация AJAX-отправки (задержка 1.5 секунды)
        const submitBtn = document.getElementById('contact-submit-btn');
        const originalText = submitBtn.innerHTML;
        
        // Блокируем кнопку и показываем статус отправки
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Отправка...'; 

        // Имитация задержки отправки
        setTimeout(() => {
            // --- Начало успешной обработки ---
            
            // 3. Показываем сообщение об успехе
            successMessage.style.display = 'flex';
            
            // 4. Очищаем форму (поля ввода)
            contactForm.reset();
            
            // 5. Генерируем новую CAPTCHA
            generateCaptcha();

            // 6. Восстанавливаем кнопку
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            
            // 7. Скрываем сообщение об успехе через 5 секунд
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 5000); // 5 секунд
            
        }, 1500); // Задержка 1500 мс (1.5 секунды - имитация отправки)
    });
}
// script.js (Додайте в кінець файлу, перед закриваючим тегом });)

// --------------------------------------------------------------------------
// 8. Логика кнопки "Наверх" (Scroll-to-Top)
// --------------------------------------------------------------------------
const scrollToTopBtn = document.getElementById('scrollToTopBtn');

// Показываем/скрываем кнопку
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollToTopBtn.classList.add('scroll-to-top--active');
    } else {
        scrollToTopBtn.classList.remove('scroll-to-top--active');
    }
});

// Плавный скролл при клике
scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});


// --------------------------------------------------------------------------
// 9. Логика Cookie Consent
// --------------------------------------------------------------------------
const cookieConsent = document.getElementById('cookieConsent');
const acceptCookiesBtn = document.getElementById('acceptCookiesBtn');
const storageKey = 'cookieAccepted';

function checkCookieConsent() {
    // Проверяем, есть ли флаг согласия в локальном хранилище
    if (!localStorage.getItem(storageKey)) {
        cookieConsent.style.display = 'block'; // Показываем баннер
    }
}

function acceptCookies() {
    localStorage.setItem(storageKey, 'true');
    cookieConsent.style.display = 'none'; // Скрываем баннер
}

// Обработчик кнопки
if (acceptCookiesBtn) {
    acceptCookiesBtn.addEventListener('click', acceptCookies);
}

// Запускаем проверку при полной загрузке страницы
document.addEventListener('DOMContentLoaded', checkCookieConsent);

// ... (Остальной скрипт)