// Utility: format date/time
function formatDate(ts) {
    const d = new Date(ts);
    const opts = { year: 'numeric', month: 'short', day: 'numeric' };
    const date = d.toLocaleDateString(undefined, opts);
    let h = d.getHours(), ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    let m = String(d.getMinutes()).padStart(2, '0');
    return { date, time: `${h}:${m} ${ampm}` };
}

// Auto year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// POSTS DATA
const postsData = [
    {
        id: 1,
        title: 'Navratri at Home – A Journey of 10 Sacred Evenings',
        description: 'Navratri for me is not just a festival it is a sacred journey of the soul, where every morning begins with puja, mantras, and aarti, and every evening glows brighter with diyas, incense, and sacred chants, filling our home with divine energy. For ten days, I worship the ten forms of Maa Durga Shailputri, Brahmacharini, Chandraghanta, Kushmanda, Skandamata, Katyayani, Kalratri, Mahagauri, Siddhidatri, and finally Maa Durga in her complete form—and through every prayer, hawan, and offering, I feel her presence touching my heart and our family with strength, peace, and devotion. The fragrance of incense, the warmth of the sacred fire, the ringing of bells, and the unity of family transform every ritual into a deeply emotional moment, where faith, love, and gratitude flow together. On the last day, Kanya Pujan and the concluding hawan fill me with overwhelming reverence and joy, as I offer gratitude for the blessings of all ten days. Navratri at home is not just tradition it is living devotion, where every prayer becomes a promise, every flame a blessing, and every heartbeat a reminder that the Goddess resides within us and around us, in every sacred moment we share.',
        quote: 'Navratri is not celebrated it is lived, in every prayer we chant, every diya we light, and every heart we fill with devotion.',
        images: [
            './assets/navratri/pic1.jpeg',
            './assets/navratri/pic2.jpeg',
            './assets/navratri/pic3.jpeg',
            './assets/navratri/pic4.jpeg',
            './assets/navratri/pic5.jpeg',
            './assets/navratri/pic6.jpeg',
            './assets/navratri/pic7.jpeg',
            './assets/navratri/video1.mp4'
        ],
        ts: Date.now(),
        isNew: true
    }
];

// container
const postsEl = document.getElementById('posts');

// helper: set attributes for accessibility + security for images
function finalizeImage(img) {
    img.setAttribute('draggable', 'false');
    img.setAttribute('loading', 'lazy');
    img.style.userSelect = 'none';
    img.alt = img.alt || 'Blog image';
}

// Render posts with improved carousel and lazy-loading
function renderPosts() {
    postsEl.innerHTML = '';
    postsData.forEach((p) => {
        const card = document.createElement('article');
        card.className = 'post';

        if (p.isNew) {
            const badge = document.createElement('div');
            badge.className = 'badge';
            badge.textContent = '🆕 New Blog';
            card.appendChild(badge);
        }

        if (p.images && p.images.length) {
            const carousel = document.createElement('div');
            carousel.className = 'carousel';
            carousel.setAttribute('role', 'region');
            carousel.setAttribute('aria-label', p.title + ' media');

            const slides = document.createElement('div');
            slides.className = 'slides';

            p.images.forEach((src, idx) => {
                const slide = document.createElement('div');
                slide.className = 'slide';

                if (src.endsWith('.mp4')) {
                    // Video element
                    const video = document.createElement('video');
                    video.src = src;
                    video.controls = true;
                    video.width = 400; // optional size
                    video.setAttribute('preload', 'metadata');
                    slide.appendChild(video);
                } else {
                    // Image element
                    const img = document.createElement('img');
                    img.dataset.src = src;
                    img.alt = p.title + (idx ? ` image ${idx + 1}` : '');
                    img.loading = 'lazy';
                    slide.appendChild(img);
                }

                slides.appendChild(slide);
            });

            carousel.appendChild(slides);

            if (p.images.length > 1) {
                const left = document.createElement('button');
                left.className = 'ctrl left';
                left.type = 'button';
                left.textContent = '◀';
                left.setAttribute('aria-hidden', 'true');

                const right = document.createElement('button');
                right.className = 'ctrl right';
                right.type = 'button';
                right.textContent = '▶';
                right.setAttribute('aria-hidden', 'true');

                carousel.appendChild(left);
                carousel.appendChild(right);

                let pos = 0;
                function updateControls() {
                    left.setAttribute('aria-hidden', pos === 0 ? 'true' : 'false');
                    right.setAttribute('aria-hidden', pos === p.images.length - 1 ? 'true' : 'false');
                }
                updateControls();

                left.addEventListener('click', () => {
                    if (pos > 0) pos--;
                    slides.style.transform = `translateX(-${pos * 100}%)`;
                    updateControls();
                });

                right.addEventListener('click', () => {
                    if (pos < p.images.length - 1) pos++;
                    slides.style.transform = `translateX(-${pos * 100}%)`;
                    updateControls();
                });

                // keyboard support
                carousel.tabIndex = 0;
                carousel.addEventListener('keydown', (e) => {
                    if (e.key === 'ArrowLeft') left.click();
                    if (e.key === 'ArrowRight') right.click();
                });

                // touch swipe support
                let startX = 0, endX = 0;
                carousel.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
                carousel.addEventListener('touchmove', (e) => { endX = e.touches[0].clientX; }, { passive: true });
                carousel.addEventListener('touchend', () => {
                    const dx = endX - startX;
                    if (Math.abs(dx) > 40) { if (dx < 0) right.click(); else left.click(); }
                    startX = endX = 0;
                });
            }

            card.appendChild(carousel);
        }

        const h2 = document.createElement('h2');
        h2.textContent = p.title;
        card.appendChild(h2);

        if (p.description) {
            const pdesc = document.createElement('p');
            pdesc.textContent = p.description;
            card.appendChild(pdesc);
        }

        if (p.quote) {
            const q = document.createElement('div');
            q.className = 'quote';
            q.textContent = '“' + p.quote + '”';
            card.appendChild(q);
        }

        const meta = document.createElement('div');
        meta.className = 'time';
        const { date, time } = formatDate(p.ts);
        meta.innerHTML = `<span>📅 ${date}</span> <span>⏰ ${time}</span>`;
        card.appendChild(meta);

        postsEl.appendChild(card);
    });

    // after DOM created — finalize images and setup lazy-loading
    document.querySelectorAll('.slide img').forEach(img => {
        finalizeImage(img);
    });

    setupLazyLoading();
}
renderPosts();

// LAZY LOADING using IntersectionObserver
function setupLazyLoading() {
    const imgs = Array.from(document.querySelectorAll('.slide img'));
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.dataset.src || img.src;
                    if (src && img.src !== src) img.src = src;
                    observer.unobserve(img);
                }
            });
        }, { root: null, rootMargin: '200px', threshold: 0.01 });

        imgs.forEach(i => {
            if (i.dataset.src) io.observe(i);
            else if (i.src) finalizeImage(i);
        });
    } else {
        // fallback
        imgs.forEach(i => {
            if (i.dataset.src) i.src = i.dataset.src;
        });
    }
}

// ===================== Security / Content Protection ===================== //
document.addEventListener('contextmenu', e => { e.preventDefault(); });
document.addEventListener('keydown', e => {
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I', 'J'].includes(e.key.toUpperCase())) || (e.ctrlKey && e.key.toUpperCase() === 'U')) {
        e.preventDefault(); alert("Inspect / View Source is disabled on this page.");
    }
});
document.addEventListener('keyup', function (e) {
    if (e.key === "PrintScreen") {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText('Screenshot blocked').then(() => {
                alert("Screenshot blocked for security reasons.");
            }).catch(() => {/* ignore */ });
        }
    }
});
const observer = new MutationObserver(muts => {
    muts.forEach(m => {
        m.addedNodes.forEach(n => {
            if (n.nodeType === 1) {
                n.querySelectorAll && n.querySelectorAll('img').forEach(img => finalizeImage(img));
            }
        });
    });
});
observer.observe(document.body, { childList: true, subtree: true });
function debounce(fn, wait = 120) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn.apply(this, args), wait); };
}
