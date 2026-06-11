/* ============================================
   BAG OF CAKES — Interactive Script
   Features: scroll progress, navbar, mobile menu,
   open/closed status, scroll animations, back-to-top,
   form validation, smooth scroll, mobile CTA bar
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ---- Scroll Progress Bar ---- */
    const scrollProgress = document.getElementById('scrollProgress');
    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgress.style.width = percent + '%';
    }

    /* ---- Navbar Scroll State ---- */
    const navbar = document.getElementById('navbar');
    function updateNavbar() {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    }

    /* ---- Open/Closed Status Indicator ---- */
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');
    function updateOpenClosed() {
        const now = new Date();
        const day = now.getDay(); // 0=Sun, 1=Mon, 2=Tue...6=Sat
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const time = hours + minutes / 60;

        // Business hours: Tue-Sat 8AM-7PM, Sun 9AM-5PM, Mon Closed
        let isOpen = false;
        if (day === 1) {
            // Monday - Closed
            isOpen = false;
        } else if (day === 0) {
            // Sunday - 9AM to 5PM
            isOpen = time >= 9 && time < 17;
        } else {
            // Tue-Sat - 8AM to 7PM
            isOpen = time >= 8 && time < 19;
        }

        if (statusDot && statusText) {
            statusDot.className = isOpen ? 'status-dot' : 'status-dot closed';
            statusText.textContent = isOpen ? 'Open Now' : 'Closed';
        }
    }

    /* ---- Mobile Menu Toggle ---- */
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    function openMobileMenu() {
        mobileToggle.classList.add('active');
        mobileMenu.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        mobileToggle.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
    }

    mobileToggle.addEventListener('click', () => {
        if (mobileMenu.classList.contains('open')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    // Close mobile menu on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Close mobile menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
            closeMobileMenu();
        }
    });

    /* ---- Scroll Animations (Intersection Observer) ---- */
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Unobserve after revealing to save performance
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
    });
    revealElements.forEach(el => revealObserver.observe(el));

    /* ---- Mobile CTA Bar ---- */
    const mobileCtaBar = document.getElementById('mobileCtaBar');
    function updateMobileCta() {
        if (mobileCtaBar && window.innerWidth < 1024) {
            mobileCtaBar.classList.toggle('visible', window.scrollY > 500);
        }
    }

    /* ---- Back to Top Button ---- */
    const backToTop = document.getElementById('backToTop');
    function updateBackToTop() {
        backToTop.classList.toggle('visible', window.scrollY > 600);
    }
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ---- Consolidated Scroll Handler ---- */
    let scrollTicking = false;
    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            requestAnimationFrame(() => {
                updateScrollProgress();
                updateNavbar();
                updateMobileCta();
                updateBackToTop();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    });

    /* ---- Form Validation ---- */
    const form = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    const formErrorBanner = document.getElementById('formError');

    if (form) {
        // Real-time validation: remove error on input
        form.querySelectorAll('input, textarea, select').forEach(field => {
            field.addEventListener('input', () => {
                field.classList.remove('error');
                const errorEl = document.getElementById(field.id + 'Error');
                if (errorEl) errorEl.textContent = '';
            });
            field.addEventListener('focus', () => {
                field.classList.remove('error');
            });
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Clear previous errors
            form.querySelectorAll('input, textarea, select').forEach(el => el.classList.remove('error'));
            form.querySelectorAll('.form-error-msg').forEach(el => el.textContent = '');
            formErrorBanner.classList.remove('show');

            let hasError = false;

            // Validate Name
            const nameField = form.querySelector('#name');
            const nameVal = nameField.value.trim();
            const nameError = document.getElementById('nameError');
            if (!nameVal) {
                nameField.classList.add('error');
                if (nameError) nameError.textContent = 'Name is required';
                hasError = true;
            } else if (nameVal.length < 2) {
                nameField.classList.add('error');
                if (nameError) nameError.textContent = 'Name must be at least 2 characters';
                hasError = true;
            }

            // Validate Phone
            const phoneField = form.querySelector('#phone');
            const phoneVal = phoneField.value.trim();
            const phoneError = document.getElementById('phoneError');
            const phoneDigits = phoneVal.replace(/\D/g, '');
            if (!phoneVal) {
                phoneField.classList.add('error');
                if (phoneError) phoneError.textContent = 'Phone is required';
                hasError = true;
            } else if (phoneDigits.length < 7) {
                phoneField.classList.add('error');
                if (phoneError) phoneError.textContent = 'Enter a valid phone number';
                hasError = true;
            }

            // Validate Email (if provided)
            const emailField = form.querySelector('#email');
            const emailVal = emailField.value.trim();
            const emailError = document.getElementById('emailError');
            if (emailVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
                emailField.classList.add('error');
                if (emailError) emailError.textContent = 'Enter a valid email address';
                hasError = true;
            }

            if (hasError) {
                formErrorBanner.classList.add('show');
                formSuccess.classList.remove('show');
                // Scroll to first error
                const firstError = form.querySelector('.error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstError.focus();
                }
                // Auto-hide error banner
                setTimeout(() => formErrorBanner.classList.remove('show'), 5000);
                return;
            }

            // Success
            formSuccess.classList.add('show');
            formErrorBanner.classList.remove('show');
            form.reset();

            // Auto-hide success message
            setTimeout(() => formSuccess.classList.remove('show'), 6000);
        });
    }

    /* ---- Smooth Scroll for Anchor Links ---- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navHeight = navbar.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    /* ---- Active Nav Link Highlighting ---- */
    const sections = document.querySelectorAll('section[id]');
    const navLinksAll = document.querySelectorAll('.nav-links a[href^="#"]');

    function updateActiveNav() {
        const scrollY = window.scrollY + 120;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollY >= top && scrollY < top + height) {
                navLinksAll.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Add active nav link styles dynamically
    const activeStyle = document.createElement('style');
    activeStyle.textContent = `
        .nav-links a.active {
            color: var(--fuchsia) !important;
            background: var(--gray-100);
        }
    `;
    document.head.appendChild(activeStyle);

    // Throttled scroll for active nav
    let navTicking = false;
    window.addEventListener('scroll', () => {
        if (!navTicking) {
            requestAnimationFrame(() => {
                updateActiveNav();
                navTicking = false;
            });
            navTicking = true;
        }
    });

    /* ---- Initialize ---- */
    updateScrollProgress();
    updateNavbar();
    updateOpenClosed();
    updateActiveNav();

    // Update open/closed every minute
    setInterval(updateOpenClosed, 60000);

    // Handle window resize for mobile CTA bar
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024 && mobileCtaBar) {
            mobileCtaBar.classList.remove('visible');
        }
    });

});
