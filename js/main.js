/* ============================================================
   main.js — Shared logic for every page
   Theme persistence | Mobile menu | Toast | Footer year
   Back-to-top | Stat counters | Profile photo (index)
   ============================================================ */
(function () {
    'use strict';

    var THEME_KEY = 'sd-theme';
    var PHOTO_KEY = 'sd-profile-photo';

    /* ---- Theme: restore saved preference on load ---- */
    try {
        var savedTheme = localStorage.getItem(THEME_KEY);
        if (savedTheme === 'dark' ||
            (!savedTheme && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
        }
    } catch (e) { /* storage unavailable */ }

    /* ---- Theme toggle ---- */
    window.toggleTheme = function () {
        var isDark = document.documentElement.classList.toggle('dark');
        try { localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light'); } catch (e) {}
    };

    /* ---- Mobile drawer menu ---- */
    window.toggleMobileMenu = function () {
        var menu = document.getElementById('mobileMenu');
        if (menu) menu.classList.toggle('hidden');
    };

    /* ---- Protected Downloads: shared password gate ----
       >>> CHANGE THE PASSWORD HERE (used by downloads.html & typeshala.html) <<< */
    window.SITE_DOWNLOAD_PASSWORD = 'sasmit2083';

    window.checkDownloadPassword = function (inputId, errorId) {
        var input = document.getElementById(inputId);
        var err = document.getElementById(errorId);
        var val = input ? input.value.trim() : '';

        if (val === '') {
            if (err) { err.innerText = 'Please enter the download password.'; err.classList.remove('hidden'); }
            if (input) input.classList.add('border-rose-500');
            return false;
        }
        if (val !== window.SITE_DOWNLOAD_PASSWORD) {
            if (err) { err.innerText = 'Incorrect password. Please try again.'; err.classList.remove('hidden'); }
            if (input) input.classList.add('border-rose-500');
            return false;
        }
        if (err) { err.classList.add('hidden'); err.innerText = ''; }
        if (input) input.classList.remove('border-rose-500');
        return true;
    };

    window.clearPasswordFeedback = function (inputId, errorId) {
        var input = document.getElementById(inputId);
        var err = document.getElementById(errorId);
        if (input) input.classList.remove('border-rose-500');
        if (err) { err.classList.add('hidden'); err.innerText = ''; }
    };

    /* ---- Toast notifications ---- */
    var toastTimer = null;
    window.showToast = function (msg) {
        var toast = document.getElementById('toastNotification');
        if (!toast) return;
        var msgEl = document.getElementById('toastMsg');
        if (msgEl) msgEl.innerText = msg;
        toast.classList.remove('hidden');
        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(function () {
            toast.classList.add('hidden');
        }, 3000);
    };

    /* ---- Animated stat counters (index page) ---- */
    function initCountUp() {
        var els = document.querySelectorAll('[data-countup]');
        if (!els.length) return;

        function animate(el) {
            var target = parseFloat(el.getAttribute('data-countup')) || 0;
            var suffix = el.getAttribute('data-suffix') || '';
            var duration = 1200;
            var start = null;
            function step(now) {
                if (!start) start = now;
                var p = Math.min((now - start) / duration, 1);
                var eased = 1 - Math.pow(1 - p, 3); /* ease-out cubic */
                el.textContent = Math.round(target * eased) + suffix;
                if (p < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
        }

        if ('IntersectionObserver' in window) {
            var io = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        animate(entry.target);
                        io.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.4 });
            els.forEach(function (el) { io.observe(el); });
        } else {
            els.forEach(animate);
        }
    }

    /* ---- Profile photo handlers (index page only) ---- */
    function initProfilePhoto() {
        var img = document.getElementById('userProfileImg');
        if (!img) return;

        /* Restore previously saved photo */
        try {
            var stored = localStorage.getItem(PHOTO_KEY);
            if (stored) img.src = stored;
        } catch (e) {}

        var fileInput = document.getElementById('photoFileInput');
        if (fileInput) {
            fileInput.addEventListener('change', function (e) {
                var file = e.target.files && e.target.files[0];
                if (!file) return;
                var reader = new FileReader();
                reader.onload = function (evt) {
                    img.src = evt.target.result;
                    try { localStorage.setItem(PHOTO_KEY, evt.target.result); } catch (err) {}
                    window.showToast('Profile photo updated successfully!');
                };
                reader.readAsDataURL(file);
            });
        }
    }

    window.promptPhotoUrl = function () {
        var url = prompt('Enter Image URL for profile photo:');
        if (url && url.trim() !== '') {
            var img = document.getElementById('userProfileImg');
            if (img) img.src = url.trim();
            try { localStorage.setItem(PHOTO_KEY, url.trim()); } catch (e) {}
            window.showToast('Profile photo URL set!');
        }
    };

    /* ---- DOM ready initializations ---- */
    document.addEventListener('DOMContentLoaded', function () {

        /* Footer year */
        var yearEl = document.getElementById('currentYear');
        if (yearEl) yearEl.innerText = new Date().getFullYear();

        /* Back-to-top button */
        var topBtn = document.getElementById('backToTop');
        if (topBtn) {
            var onScroll = function () {
                if (window.scrollY > 400) topBtn.classList.remove('hidden');
                else topBtn.classList.add('hidden');
            };
            window.addEventListener('scroll', onScroll, { passive: true });
            onScroll();
            topBtn.addEventListener('click', function () {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        initCountUp();
        initProfilePhoto();
    });
})();
