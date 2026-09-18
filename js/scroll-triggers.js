/**
 * GSAP ScrollTriggers for section animations
 */

gsap.registerPlugin(ScrollTrigger);

// Update scroll progress bar
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.querySelector('.progress-bar').style.width = scrolled + '%';
});

// Hero section entrance
gsap.from('.hero-title', {
    duration: 1.5,
    y: 100,
    opacity: 0,
    ease: 'power4.out',
    delay: 0.2
});

gsap.from('.hero-subtitle', {
    duration: 1.5,
    y: 50,
    opacity: 0,
    ease: 'power4.out',
    delay: 0.4
});

gsap.from('.status-badge', {
    duration: 1,
    scale: 0.8,
    opacity: 0,
    ease: 'back.out(1.7)',
    delay: 0.6
});

// Section titles stagger
const sectionTitles = gsap.utils.toArray('.section-title');
sectionTitles.forEach(title => {
    gsap.from(title, {
        scrollTrigger: {
            trigger: title,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        duration: 0.8,
        y: 30,
        opacity: 0,
        ease: 'power3.out'
    });
});

// Competency cards stagger
gsap.from('.competency-card', {
    scrollTrigger: {
        trigger: '.competencies-grid',
        start: 'top 75%'
    },
    duration: 0.6,
    y: 50,
    opacity: 0,
    stagger: 0.1,
    ease: 'power3.out'
});

// Job entries
const jobEntries = gsap.utils.toArray('.job-entry');
jobEntries.forEach((entry, i) => {
    gsap.from(entry, {
        scrollTrigger: {
            trigger: entry,
            start: 'top 85%'
        },
        duration: 0.8,
        x: -50,
        opacity: 0,
        ease: 'power3.out',
        delay: i * 0.1
    });
});

// Skill categories
gsap.from('.skill-category', {
    scrollTrigger: {
        trigger: '.skills-grid',
        start: 'top 75%'
    },
    duration: 0.6,
    y: 30,
    opacity: 0,
    stagger: 0.1,
    ease: 'power3.out'
});

// Interest cards
gsap.from('.interest-card', {
    scrollTrigger: {
        trigger: '.interests-grid',
        start: 'top 75%'
    },
    duration: 0.7,
    y: 50,
    opacity: 0,
    stagger: 0.15,
    ease: 'power3.out'
});

// Contact cards
gsap.from('.contact-card', {
    scrollTrigger: {
        trigger: '.contact-grid',
        start: 'top 75%'
    },
    duration: 0.6,
    y: 30,
    opacity: 0,
    stagger: 0.1,
    ease: 'power3.out'
});

// Initialize AOS
AOS.init({
    duration: 800,
    once: true,
    offset: 100,
    easing: 'ease-out-cubic'
});

// Smooth scroll for nav links
document.querySelectorAll('.nav-links a, .nav-logo').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 100;
            gsap.to(window, {
                duration: 1,
                scrollTo: { y: offsetTop, offsetY: 100 },
                ease: 'power3.inOut'
            });
        }
    });
});

// Active nav link highlighting
const sections = gsap.utils.toArray('.section');
sections.forEach(section => {
    ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setActiveNav(section.id),
        onEnterBack: () => setActiveNav(section.id)
    });
});

function setActiveNav(id) {
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.section === id) {
            link.classList.add('active');
        }
    });
}