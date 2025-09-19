// Format date/time
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




// Blog posts
const postsData = [
    {
        id: 1,
        title: 'Exploring the Wonders of the Night Sky',
        description: 'Discover the beauty of constellations, galaxies, and shooting stars as we take a journey through the cosmic wonders above us. Perfect for stargazers and dreamers alike.',
        quote: 'The cosmos is within us. We are made of star-stuff." – Carl Sagan.',
        images: [
            'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
        ],
        ts: Date.now(),
        isNew: true
    },
    //  {
    //    id: 2,
    //    title: 'Dusra Post',
    //    description: 'Isme ek aur image example diya gaya hai.',
    //    quote: 'Sapne wahi sach hote hain jo jag kar dekhe jate hain.',
    //    images: [
    //    'assets/pic-1.jpg',
    //  'assets/pic-2.jpg',
    //'assets/pic-3.png'
    //    ],
    //    ts: Date.now(),
    //    isNew: false
    // }   
];

const postsEl = document.getElementById('posts');




// Render posts
function renderPosts() {
    postsEl.innerHTML = '';
    postsData.forEach((p, pIndex) => {
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
            const slides = document.createElement('div');
            slides.className = 'slides';

            p.images.forEach(src => {
                const slide = document.createElement('div');
                slide.className = 'slide';
                const img = document.createElement('img');
                img.src = src;
                img.alt = p.title;
                slide.appendChild(img);
                slides.appendChild(slide);
            });
            carousel.appendChild(slides);

            if (p.images.length > 1) {
                const left = document.createElement('div');
                left.className = 'ctrl left';
                left.textContent = '◀';
                const right = document.createElement('div');
                right.className = 'ctrl right';
                right.textContent = '▶';
                carousel.appendChild(left);
                carousel.appendChild(right);

                let pos = 0;

                // control update function: show/hide controls based on pos
                function updateControls() {
                    // hide left on first, hide right on last
                    left.style.display = (pos === 0) ? 'none' : 'block';
                    right.style.display = (pos === p.images.length - 1) ? 'none' : 'block';
                }

                // initialize
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

                // Optional: keyboard arrow support when focused
                carousel.tabIndex = 0;
                carousel.addEventListener('keydown', (e) => {
                    if (e.key === 'ArrowLeft') left.click();
                    if (e.key === 'ArrowRight') right.click();
                });

                // Optional: simple touch swipe support (mobile)
                let startX = 0, endX = 0;
                carousel.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
                carousel.addEventListener('touchmove', (e) => { endX = e.touches[0].clientX; }, { passive: true });
                carousel.addEventListener('touchend', () => {
                    const dx = endX - startX;
                    if (Math.abs(dx) > 40) {
                        if (dx < 0) right.click(); else left.click();
                    }
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
}
renderPosts();

// ===================== Security / Content Protection ===================== //

// 1️⃣ Right click disable
document.addEventListener('contextmenu', e => e.preventDefault());

// 2️⃣ Keyboard shortcuts disable (F12, Ctrl+Shift+I/J, Ctrl+U)
document.addEventListener('keydown', e => {
    if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['I', 'J'].includes(e.key.toUpperCase())) ||
        (e.ctrlKey && e.key.toUpperCase() === 'U')
    ) {
        e.preventDefault();
        alert("Inspect / View Source is disabled on this page.");
    }
});

// 3️⃣ PrintScreen alert (partial prevention)
document.addEventListener('keyup', function (e) {
    if (e.key === "PrintScreen") {
        navigator.clipboard.writeText('Screenshot blocked').then(() => {
            alert("Screenshot blocked for security reasons.");
        });
    }
});

// 4️⃣ Disable image dragging / selection
document.querySelectorAll('img').forEach(img => {
    img.setAttribute('draggable', 'false');
    img.style.userSelect = 'none';
});
