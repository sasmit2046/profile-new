/* ============================================================
   gallery.js — Photo gallery: password lock, render, filter,
   lightbox. Bilingual captions (EN/NE) via i18n.js.
   NOTE: gallery password = window.SITE_DOWNLOAD_PASSWORD
   (set in js/main.js — change it there).
   ============================================================ */
(function () {
    'use strict';

    var FALLBACK = 'https://placehold.co/600x400/1e293b/94a3b8?text=Photo';
    var UNLOCK_KEY = 'sd-gallery-unlocked';

    var galleryData = [
        { src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=80', en: 'Himalayan Night Sky', ne: 'हिमालयन रात्री आकाश', cat: 'nepal', tall: true },
        { src: 'https://images.unsplash.com/photo-1517697471339-4aa32003c11a?auto=format&fit=crop&w=900&q=80', en: 'Creative Art Workspace', ne: 'सिर्जनात्मक कला कार्यक्षेत्र', cat: 'class', tall: true },
        { src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80', en: 'Group Study Session', ne: 'समूह अध्ययन सत्र', cat: 'class', tall: false },
        { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80', en: 'Majestic Mountain Peak', ne: 'भव्य हिमशिखर', cat: 'nepal', tall: false },
        { src: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=900&q=80', en: 'Writing Clean Code', ne: 'सफा कोड लेख्दै', cat: 'tech', tall: false },
        { src: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=80', en: 'Library Study Corner', ne: 'पुस्तकालय अध्ययन कुनो', cat: 'class', tall: true },
        { src: 'https://images.unsplash.com/photo-1508264165352-258db2ebd59b?auto=format&fit=crop&w=900&q=80', en: 'Autumn Forest Hills', ne: 'शरद वन पहाडहरू', cat: 'nepal', tall: false },
        { src: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=80', en: 'Late Night Debugging', ne: 'मध्यरातको डिबगिङ', cat: 'tech', tall: false },
        { src: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=900&q=80', en: 'Love to Learn Wall', ne: 'सिक्न माया भित्तो', cat: 'class', tall: false },
        { src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80', en: 'Rolling Green Hills', ne: 'हरिया लहरदार पहाडहरू', cat: 'nepal', tall: true },
        { src: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80', en: 'Focused Development', ne: 'केन्द्रित विकास', cat: 'tech', tall: false },
        { src: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=80', en: 'Workshop & Training', ne: 'कार्यशाला र तालिम', cat: 'class', tall: false },
        { src: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=900&q=80', en: 'Valley Landscapes', ne: 'उपत्यका दृश्यावली', cat: 'nepal', tall: false },
        { src: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80', en: 'Team Collaboration', ne: 'टिम सहकार्य', cat: 'class', tall: false },
        { src: 'https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&w=900&q=80', en: 'Himalaya & Stupa Views', ne: 'हिमाल र स्तूप दृश्य', cat: 'nepal', tall: false }
    ];

    var activeCat = 'all';
    var visibleIndexes = [];
    var lightboxIndex = 0;

    function captionOf(item) {
        return (window.sdLang === 'ne') ? item.ne : item.en;
    }

    function catLabel(cat) {
        if (cat === 'nepal') return window.sdT('gallery.filter.nepal');
        if (cat === 'tech') return window.sdT('gallery.filter.tech');
        return window.sdT('gallery.filter.class');
    }

    /* ---------------- Password lock ---------------- */
    window.unlockGallery = function () {
        var ok = window.checkDownloadPassword('galleryPasswordInput', 'galleryPasswordError');
        if (!ok) return;
        try { sessionStorage.setItem(UNLOCK_KEY, '1'); } catch (e) {}
        var lock = document.getElementById('galleryLock');
        if (lock) lock.classList.add('hidden');
        document.body.style.overflow = '';
        window.showToast(window.sdT('gallery.toast.unlocked'));
    };

    function isUnlocked() {
        try { return sessionStorage.getItem(UNLOCK_KEY) === '1'; } catch (e) { return false; }
    }

    function applyLockState() {
        var lock = document.getElementById('galleryLock');
        if (!lock) return;
        if (isUnlocked()) {
            lock.classList.add('hidden');
            document.body.style.overflow = '';
        } else {
            lock.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            var input = document.getElementById('galleryPasswordInput');
            if (input) setTimeout(function () { input.focus(); }, 100);
        }
    }

    /* ---------------- Grid ---------------- */
    function renderGallery() {
        var grid = document.getElementById('galleryGrid');
        if (!grid) return;
        grid.innerHTML = '';
        visibleIndexes = [];

        galleryData.forEach(function (item, idx) {
            if (activeCat !== 'all' && item.cat !== activeCat) return;
            visibleIndexes.push(idx);

            var spanClass = item.tall ? 'row-span-2' : '';
            var cap = captionOf(item);
            grid.innerHTML += '' +
                '<figure class="relative group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition ' + spanClass + '" onclick="openLightbox(' + idx + ')">' +
                    '<img src="' + item.src + '" alt="' + cap + '" loading="lazy" onerror="this.onerror=null;this.src=\'' + FALLBACK + '\';" class="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-500">' +
                    '<figcaption class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent p-3 pt-8">' +
                        '<span class="block text-xs font-bold text-white truncate">' + cap + '</span>' +
                        '<span class="block text-[10px] text-slate-300 font-medium">' + catLabel(item.cat) + '</span>' +
                    '</figcaption>' +
                    '<span class="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-slate-950/50 backdrop-blur text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition">' +
                        '<i class="fa-solid fa-expand"></i>' +
                    '</span>' +
                '</figure>';
        });

        if (visibleIndexes.length === 0) {
            grid.innerHTML = '<div class="col-span-full text-center text-slate-400 py-12">' + window.sdT('gallery.empty') + '</div>';
        }

        /* Photo counter */
        var count = document.getElementById('galleryCount');
        if (count) count.innerText = galleryData.length + ' ' + window.sdT('gallery.count');
    }

    window.filterGallery = function (cat) {
        activeCat = cat;
        document.querySelectorAll('.gal-pill').forEach(function (btn) {
            btn.className = 'gal-pill px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition';
        });
        var activeBtn = document.getElementById('gal-' + cat);
        if (activeBtn) activeBtn.className = 'gal-pill px-4 py-2 rounded-xl text-xs font-bold bg-pink-600 text-white transition';
        renderGallery();
        window.applyI18n();
    };

    /* ---------------- Lightbox ---------------- */
    window.openLightbox = function (dataIdx) {
        var pos = visibleIndexes.indexOf(Number(dataIdx));
        if (pos === -1) return;
        lightboxIndex = pos;
        updateLightbox();
        document.getElementById('lightbox').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    };

    function updateLightbox() {
        var item = galleryData[visibleIndexes[lightboxIndex]];
        if (!item) return;
        var cap = captionOf(item);
        var img = document.getElementById('lightboxImg');
        img.onerror = function () { img.onerror = null; img.src = FALLBACK; };
        img.src = item.src;
        img.alt = cap;
        document.getElementById('lightboxCaption').innerText = cap;
        document.getElementById('lightboxCounter').innerText = (lightboxIndex + 1) + ' / ' + visibleIndexes.length;
    }

    window.closeLightbox = function () {
        document.getElementById('lightbox').classList.add('hidden');
        document.body.style.overflow = '';
    };

    window.prevLightbox = function (e) {
        if (e) e.stopPropagation();
        lightboxIndex = (lightboxIndex - 1 + visibleIndexes.length) % visibleIndexes.length;
        updateLightbox();
    };

    window.nextLightbox = function (e) {
        if (e) e.stopPropagation();
        lightboxIndex = (lightboxIndex + 1) % visibleIndexes.length;
        updateLightbox();
    };

    /* Keyboard navigation */
    document.addEventListener('keydown', function (e) {
        var lb = document.getElementById('lightbox');
        if (!lb || lb.classList.contains('hidden')) return;
        if (e.key === 'Escape') window.closeLightbox();
        if (e.key === 'ArrowLeft') window.prevLightbox();
        if (e.key === 'ArrowRight') window.nextLightbox();
    });

    /* ---------------- Language change ---------------- */
    document.addEventListener('sd:langchange', renderGallery);

    /* ---------------- Init ---------------- */
    document.addEventListener('DOMContentLoaded', function () {
        applyLockState();
        renderGallery();
    });
})();
