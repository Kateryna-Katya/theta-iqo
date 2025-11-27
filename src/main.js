
    document.addEventListener('DOMContentLoaded', () => {

        // --------------------------------------------------------------------------
        // [НОВИЙ ШАГ] 0. Ініціалізація Lucide (для всіх статичних іконок)
        // --------------------------------------------------------------------------
        // Перетворює теги <i data-lucide="..."> в SVG
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
             lucide.createIcons();
        }

        // --------------------------------------------------------------------------
        // 1. Ініціалізація AOS (Animation On Scroll) — ОПТИМІЗАЦІЯ
        // --------------------------------------------------------------------------
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 1000,
                once: true,
                mirror: false,
                // Анімація спрацьовує на 100px раніше
                offset: 100 
            });
        }

        // --------------------------------------------------------------------------
        // 2. Мобільне меню з Lucide та блокуванням прокрутки
        // --------------------------------------------------------------------------
        const burgerBtn = document.querySelector('.header__burger');
        const navMenu = document.querySelector('.header__nav');

        if (burgerBtn && navMenu) {
            const toggleMenu = () => {
                // Використовуємо 'nav-open' як в CSS
                const isOpen = navMenu.classList.toggle('nav-open'); 
                burgerBtn.classList.toggle('active');
                document.body.classList.toggle('no-scroll', isOpen);

                const icon = burgerBtn.querySelector('i');
                if (icon) {
                    icon.setAttribute('data-lucide', isOpen ? 'x' : 'menu');
                    // ПОВТОРНА ІНІЦІАЛІЗАЦІЯ Lucide після зміни іконки
                    if (typeof lucide !== 'undefined' && lucide.createIcons) {
                        lucide.createIcons();
                    }
                }
            };

            burgerBtn.addEventListener('click', toggleMenu);

            navMenu.querySelectorAll('.nav__link').forEach(link => {
                link.addEventListener('click', () => {
                    if (navMenu.classList.contains('nav-open')) {
                        toggleMenu();
                    }
                });
            });
        }

        // --------------------------------------------------------------------------
        // 3. Підсвітка активного пункту меню по скроллу
        // --------------------------------------------------------------------------
        const sections = document.querySelectorAll('section[id]');
        if (sections.length > 0) {
            const observerOptions = {
                root: null,
                rootMargin: '0px 0px -50% 0px',
                threshold: 0
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const currentSectionId = entry.target.id;
                        document.querySelectorAll('.nav__link').forEach(link => {
                            link.classList.remove('nav__link--active');
                        });
                        const activeLink = document.querySelector(`.nav__link[href*="#${currentSectionId}"]`);
                        if (activeLink) activeLink.classList.add('nav__link--active');
                    }
                });
            }, observerOptions);

            sections.forEach(section => observer.observe(section));
        }

        // --------------------------------------------------------------------------
        // 4. Hero-анімація "потік коду" (без змін)
        // --------------------------------------------------------------------------
        const canvas = document.getElementById('hero-canvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            let width = canvas.width = canvas.offsetWidth;
            let height = canvas.height = canvas.offsetHeight;
            const font_size = 18;
            let columns = Math.floor(width / font_size);
            let drops = [];

            for(let x = 0; x < columns; x++) drops[x] = Math.random() * 50;

            const characters = 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ0123456789!@#$%^&*()_+';
            const style = getComputedStyle(document.body);
            const varColorPrimary = style.getPropertyValue('--color-primary').trim();
            const varColorHeading = style.getPropertyValue('--color-heading').trim();

            function draw() {
                ctx.fillStyle = `${varColorHeading}09`;
                ctx.fillRect(0, 0, width, height);
                ctx.fillStyle = varColorPrimary;
                ctx.font = font_size + "px monospace";

                for(let i = 0; i < drops.length; i++) {
                    const text = characters[Math.floor(Math.random() * characters.length)];
                    ctx.fillText(text, i * font_size, drops[i] * font_size);
                    if(drops[i] * font_size > height && Math.random() > 0.975) drops[i] = 0;
                    drops[i]++;
                }
            }

            window.addEventListener('resize', () => {
                width = canvas.width = canvas.offsetWidth;
                height = canvas.height = canvas.offsetHeight;
                columns = Math.floor(width / font_size);
                drops = [];
                for(let x = 0; x < columns; x++) drops[x] = Math.random() * 50;
            });

            setInterval(draw, 50);
        }

        // --------------------------------------------------------------------------
        // 5. Таби (секция Технология)
        // --------------------------------------------------------------------------
        const tabsNav = document.querySelector('.tabs-nav');
        if (tabsNav) {
            tabsNav.addEventListener('click', (e) => {
                const button = e.target.closest('.tabs-nav__button');
                if (!button) return;
                const targetTab = button.dataset.tab;

                document.querySelectorAll('.tabs-nav__button').forEach(btn => btn.classList.remove('tabs-nav__button--active'));
                document.querySelectorAll('.tabs-content__item').forEach(content => content.classList.remove('tabs-content__item--active'));

                button.classList.add('tabs-nav__button--active');
                const activeContent = document.querySelector(`[data-tab-content="${targetTab}"]`);
                if (activeContent) activeContent.classList.add('tabs-content__item--active');

                if (typeof lucide !== 'undefined') lucide.createIcons();
            });
        }

        // --------------------------------------------------------------------------
        // 6. Анімація лічильників (секция Перспективы) — ОПТИМІЗАЦІЯ
        // --------------------------------------------------------------------------
        const counterSection = document.getElementById('perspectives');
        const statItems = document.querySelectorAll('.stat-item__number');
        let countersAnimated = false;

        function animateCounters() {
            if (countersAnimated) return;
            countersAnimated = true;

            statItems.forEach(item => {
                const target = parseInt(item.dataset.target);
                const suffix = item.dataset.suffix || '';
                let current = 0;
                const duration = 2000;
                const step = target / (duration / 50);

                const updateCounter = () => {
                    current += step;
                    if (current < target) {
                        item.textContent = Math.ceil(current).toLocaleString() + suffix;
                        requestAnimationFrame(updateCounter);
                    } else {
                        item.textContent = target.toLocaleString() + suffix;
                    }
                };

                requestAnimationFrame(updateCounter);
            });
        }

        if (counterSection) {
            const counterObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounters();
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                root: null,
                // Спрацьовує раніше
                rootMargin: '0px 0px -100px 0px', 
                threshold: 0.1
            });
            counterObserver.observe(counterSection);
        }

        // --------------------------------------------------------------------------
        // 7. Аккордеон FAQ
        // --------------------------------------------------------------------------
        const accordionHeaders = document.querySelectorAll('.accordion-item__header');
        accordionHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const item = header.closest('.accordion-item');
                const content = item.querySelector('.accordion-item__content');

                item.classList.toggle('accordion-item--active');
                content.style.maxHeight = item.classList.contains('accordion-item--active') ? content.scrollHeight + 'px' : 0;

                document.querySelectorAll('.accordion-item').forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('accordion-item--active')) {
                        otherItem.classList.remove('accordion-item--active');
                        otherItem.querySelector('.accordion-item__content').style.maxHeight = 0;
                    }
                });

                if (typeof lucide !== 'undefined') lucide.createIcons();
            });
        });

        // --------------------------------------------------------------------------
        // 8. Форма контактов с CAPTCHA (без змін)
        // --------------------------------------------------------------------------
        const contactForm = document.getElementById('contact-form');
        const successMessage = document.getElementById('contact-success');
        const captchaLabel = document.getElementById('captcha-label');
        const captchaInput = document.getElementById('captcha-input');
        let correctCaptchaResult = 0;

        function generateCaptcha() {
            const num1 = Math.floor(Math.random() * 10) + 1;
            const num2 = Math.floor(Math.random() * 5) + 1;
            correctCaptchaResult = num1 + num2;
            captchaLabel.textContent = `Проверка: ${num1} + ${num2} = ?`;
            captchaInput.value = '';
        }

        if (contactForm) {
            generateCaptcha();
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const submittedResult = parseInt(captchaInput.value);
                if (submittedResult !== correctCaptchaResult) {
                    alert('Ошибка CAPTCHA! Пожалуйста, решите пример правильно.');
                    generateCaptcha();
                    return;
                }

                const privacyCheckbox = document.getElementById('privacy-agree');
                if (!privacyCheckbox.checked) {
                    alert('Пожалуйста, примите условия использования и политику конфиденциальности.');
                    return;
                }

                const submitBtn = document.getElementById('contact-submit-btn');
                const originalText = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = 'Отправка...';

                setTimeout(() => {
                    successMessage.style.display = 'flex';
                    contactForm.reset();
                    generateCaptcha();
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                    setTimeout(() => successMessage.style.display = 'none', 5000);
                }, 1500);
            });
        }

        // --------------------------------------------------------------------------
        // 9. Кнопка "Наверх" (Scroll to Top)
        // --------------------------------------------------------------------------
        const scrollToTopBtn = document.getElementById('scrollToTopBtn');
        if (scrollToTopBtn) {
            window.addEventListener('scroll', () => {
                // Используем класс 'scroll-to-top--active' из CSS
                scrollToTopBtn.classList.toggle('scroll-to-top--active', window.scrollY > 300);
            });

            scrollToTopBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        // --------------------------------------------------------------------------
        // 10. Cookie Consent (без змін)
        // --------------------------------------------------------------------------
        const cookieConsent = document.getElementById('cookieConsent');
        const acceptCookiesBtn = document.getElementById('acceptCookiesBtn');
        const storageKey = 'cookieAccepted';

        function checkCookieConsent() {
            if (!localStorage.getItem(storageKey) && cookieConsent) cookieConsent.style.display = 'block';
        }

        function acceptCookies() {
            localStorage.setItem(storageKey, 'true');
            if (cookieConsent) cookieConsent.style.display = 'none';
        }

        if (acceptCookiesBtn) acceptCookiesBtn.addEventListener('click', acceptCookies);
        checkCookieConsent();
    });
