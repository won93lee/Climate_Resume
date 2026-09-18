/**
 * Main initialization and helper functions
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio initialized successfully');
    
    // Mobile menu toggle (if needed later)
    initMobileMenu();
    
    // Hash navigation fix
    handleHashNavigation();
    
    // Cursor effect (optional enhancement)
    initCursorEffect();
});

function initMobileMenu() {
    // Placeholder for future mobile menu implementation
    // Can add hamburger menu toggle here
}

function handleHashNavigation() {
    if (window.location.hash) {
        const hash = window.location.hash;
        const targetElement = document.querySelector(hash);
        
        if (targetElement) {
            setTimeout(() => {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }, 500);
        }
    }
}

function initCursorEffect() {
    // Optional: Add custom cursor trail effect
    // Can be enabled if desired for additional interactivity
    
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        width: 20px;
        height: 20px;
        border: 2px solid #10b981;
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
        display: none;
    `;
    document.body.appendChild(cursor);
    
    // Enable only on desktop
    if (window.matchMedia('(min-width: 768px)').matches) {
        cursor.style.display = 'block';
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX - 10 + 'px';
            cursor.style.top = e.clientY - 10 + 'px';
        });
    }
}

// Performance optimization: lazy load heavy elements
const observerOptions = {
    root: null,
    rootMargin: '100px',
    threshold: 0.1
};

const lazyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('lazy-loaded');
            lazyObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for lazy loading
document.querySelectorAll('.job-entry, .interest-card').forEach(el => {
    el.classList.add('lazy-load');
    lazyObserver.observe(el);
});