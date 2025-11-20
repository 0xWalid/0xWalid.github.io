// Main JavaScript

document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initFiltering();
});

function initScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Fade in up animation for sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        gsap.from(section.children, {
            scrollTrigger: {
                trigger: section,
                start: 'top 90%',
                toggleActions: 'play none none reverse'
            },
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out'
        });
    });

    // Hero Text Animation
    gsap.from('.hero-title', {
        y: 100,
        opacity: 0,
        duration: 1.5,
        ease: 'power4.out',
        delay: 0.5
    });

    gsap.from('.hero-subtitle', {
        y: 50,
        opacity: 0,
        duration: 1.5,
        ease: 'power4.out',
        delay: 0.8
    });

    gsap.from('.hero-buttons', {
        y: 50,
        opacity: 0,
        duration: 1.5,
        ease: 'power4.out',
        delay: 1.1
    });
}

function initFiltering() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const posts = document.querySelectorAll('.post-item');

    if (filterBtns.length === 0) return;

    // Check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');

    if (category) {
        applyFilter(category);
        setActiveBtn(category);
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterValue = btn.getAttribute('data-filter');
            applyFilter(filterValue);

            // Update active class
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update URL without reloading
            const newUrl = new URL(window.location);
            if (filterValue === 'all') {
                newUrl.searchParams.delete('category');
            } else {
                newUrl.searchParams.set('category', filterValue);
            }
            window.history.pushState({}, '', newUrl);
        });
    });

    function setActiveBtn(filterValue) {
        filterBtns.forEach(btn => {
            if (btn.getAttribute('data-filter') === filterValue) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    function applyFilter(filterValue) {
        posts.forEach(post => {
            if (filterValue === 'all') {
                post.style.display = 'block';
                gsap.to(post, { opacity: 1, duration: 0.5 });
            } else {
                const tags = post.getAttribute('data-tags').toLowerCase();
                if (tags.includes(filterValue.toLowerCase())) {
                    post.style.display = 'block';
                    gsap.to(post, { opacity: 1, duration: 0.5 });
                } else {
                    gsap.to(post, {
                        opacity: 0,
                        duration: 0.3,
                        onComplete: () => { post.style.display = 'none'; }
                    });
                }
            }
        });
    }
}
