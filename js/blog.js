/* ============================================================
   blog.js — Social-media style feed
   Seed posts + user posts (localStorage), likes, comments, share
   ============================================================ */
(function () {
    'use strict';

    var POSTS_KEY = 'sd-blog-posts';
    var LIKES_KEY = 'sd-blog-likes';     /* {postId: true}  — user's likes */
    var COMMENTS_KEY = 'sd-blog-comments'; /* {postId: [text, ...]} */

    var AVATAR_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='24' fill='%232563eb'/%3E%3Ctext x='50' y='62' font-size='34' font-family='Poppins' font-weight='800' fill='white' text-anchor='middle'%3ESD%3C/text%3E%3C/svg%3E";

    var DAY = 86400000;
    var seedPosts = [
        {
            id: 'seed-5',
            time: Date.now() - 2 * DAY,
            likes: 86,
            image: null,
            en: "New tool alert! I just added a Nepali Date Converter (Bikram Sambat ↔ A.D.) to the Tools hub. It supports every date from 2000 to 2090 BS, shows the weekday and Nepali numerals. Try converting your birthday! #BikramSambat",
            ne: "नयाँ टुल आयो! टुल्स हबमा नेपाली मिति परिवर्तक (वि.सं. ↔ ई.सं.) थपेको छु। वि.सं. २००० देखि २०९० सम्मका सबै मिति समर्थन गर्छ, बार र नेपाली अंकसहित। आफ्नो जन्ममिति परिवर्तन गरेर हेर्नुहोस्! #BikramSambat"
        },
        {
            id: 'seed-4',
            time: Date.now() - 4 * DAY,
            likes: 124,
            image: null,
            en: "Winter is coming — and so are higher electricity bills. I built a free NEA Electricity Bill Calculator using the official slab tariff (5A/15A/30A). Enter your units or meter reading and get energy charge, service charge, VAT and total in seconds. #NEABill",
            ne: "जाडो याम आउँदैछ — बिजुली बिल पनि बढ्दैछ। आधिकारिक गैँती दर (5A/15A/30A) प्रयोग गरेर नि:शुल्क ने.वि.अ. बिजुली बिल क्यालकुलेटर बनाएको छु। युनिट वा मिटर रिडिङ हाल्नुहोस्, ऊर्जा शुल्क, सेवा शुल्क, मू.अ.कर र जम्मा रकम एकैछिनमा पाउनुहोस्। #NEABill"
        },
        {
            id: 'seed-3',
            time: Date.now() - 7 * DAY,
            likes: 203,
            image: null,
            en: "TypeShala got a major upgrade! Practice Preeti keyboard typing with a live on-screen keyboard, character-by-character highlighting (green = correct, red = wrong), WPM/accuracy stats and a fullscreen focus mode. 20 free lessons included. #TypeShala",
            ne: "टाइपशालामा ठूलो सुधार! अन-स्क्रिन किबोर्ड, अक्षर-अक्षर हाइलाइटिङ (हरियो = सही, रातो = गलत), WPM/शुद्धता तथ्याङ्क र फुलस्क्रिन फोकस मोडसहित प्रीति किबोर्ड टाइपिङ अभ्यास गर्नुहोस्। २० वटा निःशुल्क पाठ समावेश। #TypeShala"
        },
        {
            id: 'seed-2',
            time: Date.now() - 10 * DAY,
            likes: 158,
            image: null,
            en: "Planning to take a home loan? Before you sign anything, run the numbers in my new EMI Calculator — monthly instalment, total interest and a full yearly amortisation table. A 20-year loan at 9.5% costs you more than the house itself in interest. Plan wisely! #EMI",
            ne: "घर कर्जा लिन सोच्दै हुनुहुन्छ? कुनै पनि कागजमा हस्ताक्षर गर्नुअघि मेरो नयाँ ईएमआई क्यालकुलेटरमा हिसाब गर्नुहोस् — मासिक किस्ता, कुल ब्याज र पूरै वार्षिक भुक्तानी तालिका। ९.५% दरमा २० वर्षे कर्जाको ब्याज आफैंमा घरको मूल्यभन्दा बढी पर्छ। सोच-विचार गरी योजना बनाउनुहोस्! #EMI"
        },
        {
            id: 'seed-1',
            time: Date.now() - 14 * DAY,
            likes: 97,
            image: null,
            en: "Still typing Nepali in Preeti font and watching it break everywhere? Convert it to Unicode in one click with my free Preeti ↔ Unicode converter — it also supports the reverse direction. No signup, no ads, works offline. #PreetiUnicode",
            ne: "अझै प्रीति फन्टमा नेपाली टाइप गरेर सबै ठाउँमा बिग्रेको देख्दै हुनुहुन्छ? मेरो निःशुल्क प्रीति ↔ युनिकोड कन्भर्टरमा एक क्लिकमा युनिकोडमा बदल्नुहोस् — उल्टो दिशामा पनि चल्छ। साइनअप छैन, विज्ञापन छैन, अफलाइन पनि चल्छ। #PreetiUnicode"
        }
    ];

    function load(key, fallback) {
        try {
            var raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch (e) { return fallback; }
    }

    function save(key, val) {
        try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
    }

    function getUserPosts() { return load(POSTS_KEY, []); }
    function getLikes() { return load(LIKES_KEY, {}); }
    function getComments() { return load(COMMENTS_KEY, {}); }

    function allPosts() {
        /* user posts first (newest first), then seeds (newest first) */
        var user = getUserPosts().slice().sort(function (a, b) { return b.time - a.time; });
        var seeds = seedPosts.slice().sort(function (a, b) { return b.time - a.time; });
        return user.concat(seeds);
    }

    function findPost(id) {
        return allPosts().filter(function (p) { return p.id === id; })[0] || null;
    }

    /* ---------- Time formatting ---------- */
    function timeAgo(ts) {
        var diff = Math.max(0, Date.now() - ts);
        var mins = Math.floor(diff / 60000);
        if (mins < 1) return window.sdT('blog.justNow');
        if (mins < 60) return mins + ' ' + window.sdT('blog.minutesAgo');
        var hrs = Math.floor(mins / 60);
        if (hrs < 24) return hrs + ' ' + window.sdT('blog.hoursAgo');
        var days = Math.floor(hrs / 24);
        return days + ' ' + window.sdT('blog.daysAgo');
    }

    /* ---------- Escape user content ---------- */
    function esc(s) {
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    /* ---------- Render ---------- */
    function renderFeed() {
        var feed = document.getElementById('blogFeed');
        if (!feed) return;
        var lang = window.sdLang || 'en';
        var likes = getLikes();
        var comments = getComments();
        var posts = allPosts();

        feed.innerHTML = '';

        posts.forEach(function (p) {
            var text = lang === 'ne' ? p.ne : p.en;
            var liked = !!likes[p.id];
            var likeCount = p.likes + (liked ? 1 : 0);
            var cmts = comments[p.id] || [];
            var postTime = timeAgo(p.time);

            var commentsHtml = '';
            cmts.forEach(function (c, idx) {
                commentsHtml +=
                    '<div class="flex items-start gap-2.5 px-1">' +
                        '<div class="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-extrabold text-slate-600 dark:text-slate-300 shrink-0"><i class="fa-solid fa-user"></i></div>' +
                        '<div class="bg-slate-100 dark:bg-slate-800 rounded-2xl px-3 py-2 text-xs text-slate-700 dark:text-slate-300 flex-1 break-words">' + esc(c) + '</div>' +
                        '<button onclick="deleteComment(\'' + p.id + '\',' + idx + ')" class="text-slate-300 hover:text-rose-500 transition text-xs mt-1.5" title="Delete comment"><i class="fa-solid fa-xmark"></i></button>' +
                    '</div>';
            });

            var imgHtml = p.image
                ? '<div class="mt-3 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700"><img src="' + esc(p.image) + '" alt="Post image" class="w-full max-h-96 object-cover" onerror="this.parentElement.style.display=\'none\'"></div>'
                : '';

            var html =
                '<article class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">' +
                    '<div class="flex items-center gap-3">' +
                        '<img src="' + AVATAR_IMG + '" alt="Sasmit Dhungana" class="w-11 h-11 rounded-2xl shadow object-cover">' +
                        '<div class="flex-1 min-w-0">' +
                            '<h3 class="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">Sasmit Dhungana <i class="fa-solid fa-circle-check text-blue-500 text-[11px]"></i></h3>' +
                            '<p class="text-[11px] text-slate-400 font-semibold">' + postTime + '</p>' +
                        '</div>' +
                        (p.id.indexOf('seed-') === -1 ? '<button onclick="deleteUserPost(\'' + p.id + '\')" class="text-slate-300 hover:text-rose-500 transition" title="Delete post"><i class="fa-solid fa-trash-can text-xs"></i></button>' : '') +
                    '</div>' +
                    '<p class="mt-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line break-words">' + esc(text) + '</p>' +
                    imgHtml +
                    '<div class="flex items-center gap-1 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">' +
                        '<button onclick="toggleLike(\'' + p.id + '\')" class="flex-1 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ' + (liked ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/30' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800') + '">' +
                            '<i class="' + (liked ? 'fa-solid' : 'fa-regular') + ' fa-heart"></i> <span data-i18n="blog.like">Like</span>' +
                            (likeCount > 0 ? ' <span class="font-mono">(' + likeCount + ')</span>' : '') +
                        '</button>' +
                        '<button onclick="toggleComments(\'' + p.id + '\')" class="flex-1 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">' +
                            '<i class="fa-regular fa-comment"></i> <span data-i18n="blog.comment">Comment</span>' +
                            (cmts.length ? ' <span class="font-mono">(' + cmts.length + ')</span>' : '') +
                        '</button>' +
                        '<button onclick="sharePost(\'' + p.id + '\')" class="flex-1 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">' +
                            '<i class="fa-solid fa-share-nodes"></i> <span data-i18n="blog.share">Share</span>' +
                        '</button>' +
                    '</div>' +
                    '<div id="comments-' + p.id + '" class="hidden mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">' +
                        commentsHtml +
                        '<div class="flex items-center gap-2.5 px-1 pt-1">' +
                            '<div class="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/60 flex items-center justify-center text-[10px] font-extrabold text-blue-600 dark:text-blue-400 shrink-0"><i class="fa-solid fa-user"></i></div>' +
                            '<input type="text" id="cinput-' + p.id + '" placeholder="' + window.sdT('blog.commentPh') + '" onkeydown="if(event.key===\'Enter\'){event.preventDefault();addComment(\'' + p.id + '\');}" class="flex-1 px-3 py-2 text-xs rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition">' +
                            '<button onclick="addComment(\'' + p.id + '\')" class="px-3.5 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold transition" data-i18n="blog.commentBtn">Reply</button>' +
                        '</div>' +
                    '</div>' +
                '</article>';

            feed.innerHTML += html;
        });

        var stat = document.getElementById('statPostCount');
        if (stat) stat.innerText = posts.length;

        /* Re-apply i18n to the fresh feed */
        window.applyI18n();
    }

    /* ---------- Actions ---------- */
    window.toggleLike = function (id) {
        var likes = getLikes();
        var wasLiked = !!likes[id];
        if (wasLiked) delete likes[id];
        else likes[id] = true;
        save(LIKES_KEY, likes);
        window.showToast(window.sdT(wasLiked ? 'blog.unlikedToast' : 'blog.likedToast'));
        renderFeed();
    };

    window.toggleComments = function (id) {
        var el = document.getElementById('comments-' + id);
        if (el) {
            el.classList.toggle('hidden');
            if (!el.classList.contains('hidden')) {
                var input = document.getElementById('cinput-' + id);
                if (input) input.focus();
            }
        }
    };

    window.addComment = function (id) {
        var input = document.getElementById('cinput-' + id);
        if (!input) return;
        var val = input.value.trim();
        if (!val) { window.showToast(window.sdT('blog.commentErr')); return; }
        var comments = getComments();
        if (!comments[id]) comments[id] = [];
        comments[id].push(val);
        save(COMMENTS_KEY, comments);
        renderFeed();
        /* keep the section open after re-render */
        var el = document.getElementById('comments-' + id);
        if (el) el.classList.remove('hidden');
    };

    window.deleteComment = function (id, idx) {
        var comments = getComments();
        if (comments[id] && comments[id][idx] !== undefined) {
            comments[id].splice(idx, 1);
            save(COMMENTS_KEY, comments);
            renderFeed();
            var el = document.getElementById('comments-' + id);
            if (el) el.classList.remove('hidden');
        }
    };

    window.sharePost = function (id) {
        var url = window.location.origin + window.location.pathname + '#post-' + id;
        var shareText = '';
        var p = findPost(id);
        if (p) {
            var lang = window.sdLang || 'en';
            shareText = (lang === 'ne' ? p.ne : p.en).substring(0, 80);
        }
        if (navigator.share) {
            navigator.share({ title: 'Sasmit Dhungana — Blog', text: shareText, url: url }).catch(function () {});
        } else if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url).then(function () {
                window.showToast(window.sdT('blog.sharedToast'));
            });
        } else {
            window.showToast(window.sdT('blog.sharedToast'));
        }
    };

    window.deleteUserPost = function (id) {
        var posts = getUserPosts().filter(function (p) { return p.id !== id; });
        save(POSTS_KEY, posts);
        window.showToast('Post deleted');
        renderFeed();
    };

    window.publishPost = function () {
        var input = document.getElementById('composerInput');
        if (!input) return;
        var val = input.value.trim();
        if (!val) { window.showToast(window.sdT('blog.composer.err')); return; }

        var posts = getUserPosts();
        posts.push({
            id: 'user-' + Date.now(),
            time: Date.now(),
            likes: 0,
            image: null,
            en: val,
            ne: val
        });
        save(POSTS_KEY, posts);
        input.value = '';
        window.showToast(window.sdT('blog.composer.toast'));
        renderFeed();
    };

    /* ---------- Avatar from profile photo (set on Home page) ---------- */
    function syncAvatar() {
        var img = document.getElementById('blogAvatar');
        if (!img) return;
        try {
            var stored = localStorage.getItem('sd-profile-photo');
            if (stored) img.src = stored;
        } catch (e) {}
    }

    /* ---------- Language change ---------- */
    document.addEventListener('sd:langchange', renderFeed);

    /* ---------- Init ---------- */
    document.addEventListener('DOMContentLoaded', function () {
        syncAvatar();
        renderFeed();
    });
})();
