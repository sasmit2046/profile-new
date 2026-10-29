/* ============================================================
   typeshala.js — Live Practice Trainer (Typeshala / merokalam-style)
   • Character-by-character typing with live highlight
   • On-screen keyboard with next-key hints (Preeti layout)
   • Net/Gross WPM, accuracy, errors and time tracking
   • Fullscreen / large-view practice mode
   • Password-protected Typeshala setup download (kept)
   ============================================================ */
(function () {
    'use strict';

    /* ------------------------------------------------------------
       1. Typeshala (Preeti-style) layout
       Base keys mirror js/converter.js — extended keys complete
       the full Devanagari alphabet on a standard 101-key board.
       ------------------------------------------------------------ */
    var PREETI = {
        "`": "ञ्", "1": "१", "2": "२", "3": "ग्‍", "4": "ि", "5": "द्व", "6": "ट्ट", "7": "ष्ठ", "8": "ड्ड", "9": "ढ्ढ", "0": "०",
        "q": "त्र", "w": "ध", "e": "भ", "r": "च", "t": "त", "y": "थ", "u": "ग", "i": "ष", "o": "य", "p": "उ",
        "a": "ब", "s": "क", "d": "म", "f": "ा", "g": "न", "h": "ज", "j": "व", "k": "प", "l": "जि",
        "z": "श", "x": "ह", "c": "अ", "v": "ख", "b": "द", "n": "स", "m": "उ",
        "[": "ु", "]": "ू", "\\": "ण", ";": "े", "'": "ो", ",": "ङ", ".": "ञ", "/": "र", "-": "ई", "=": "।",
        "~": "ऐ", "!": "ट", "@": "ठ", "#": "ड", "$": "ढ", "%": "फ", "^": "ल", "*": "झ", "(": "घ", ")": "छ",
        "_": "्", "+": "ं", "{": "ृ", "}": "ः", "|": "ऊ", ":": "ै", "\"": "ौ", "<": "ओ", ">": "औ", "?": "आ",
        "Q": "त्त", "W": "ध्‍", "E": "भ्‍", "R": "च्‍", "T": "त्त्", "Y": "थ्‍", "U": "ग्‍", "I": "क्ष्", "O": "इ", "P": "ए",
        "A": "ब्‍", "S": "क्", "D": "म्‍", "F": "ँ", "G": "न्‍", "H": "ज्‍", "J": "व्‍", "K": "प्‍", "L": "ी",
        "Z": "श्‍", "X": "ह्‍", "C": "ऋ", "V": "ख्‍", "B": "द्ब", "N": "स्‍", "M": "ं"
    };

    /* ------------------------------------------------------------
       2. Lessons (Nepali + English)
       ------------------------------------------------------------ */
    var LESSONS = [
        { id: 'np-vowels',    lang: 'ne', title: '१. स्वर वर्ण — Vowels',        text: 'अ आ इ ई उ ऊ ऋ ए ऐ ओ औ अं अः' },
        { id: 'np-consonants', lang: 'ne', title: '२. व्यञ्जन — Consonants',       text: 'क ख ग घ च छ ज झ ट ठ ड ढ ण त थ द ध न प फ ब भ म य र ल व श ष स ह' },
        { id: 'np-barakhari', lang: 'ne', title: '३. बराखरी — Barakhari',        text: 'का कि की कु कू कृ के कै को कौ कं कः' },
        { id: 'np-words',     lang: 'ne', title: '४. शब्दहरू — Words',            text: 'नेपाल काठमाडौं सस्मित धुंगाना पात्रो सफ्टवेयर कम्प्युटर शिक्षा प्रविधि नमस्ते' },
        { id: 'np-sentences', lang: 'ne', title: '५. वाक्यहरू — Sentences',        text: 'नमस्ते। मेरो नाम सस्मित हो। म नेपाली हुँ। मलाई कम्प्युटर र प्रविधि मन पर्छ।' },
        { id: 'np-paragraph', lang: 'ne', title: '६. अनुच्छेद — Paragraph',       text: 'नेपाल एउटा सुन्दर देश हो। यहाँका मानिसहरू मेहनती हुन्छन्। काठमाडौं नेपालको राजधानी हो। म आफ्नो देशलाई माया गर्छु।' },
        { id: 'en-homerow',   lang: 'en', title: '1. English — Home Row',        text: 'asdf jkl; dad sad fall; flask salad glass; asdf jkl; lad asks a lass' },
        { id: 'en-pangram',   lang: 'en', title: '2. English — Pangram',         text: 'the quick brown fox jumps over the lazy dog while five experts swap gifts' },
        { id: 'en-caps',      lang: 'en', title: '3. English — Capital Letters', text: 'The Quick Brown Fox Jumps Over The Lazy Dog Near The River Bank Every Morning' },
        { id: 'en-paragraph', lang: 'en', title: '4. English — Paragraph',       text: 'practice every day and your fingers will learn the keyboard without looking. accuracy comes first, speed will follow naturally.' }
    ];

    /* ------------------------------------------------------------
       3. Keyboard geometry  [unshifted, shifted, width]
       ------------------------------------------------------------ */
    var KB_ROWS = [
        [['`', '~'], ['1', '!'], ['2', '@'], ['3', '#'], ['4', '$'], ['5', '%'], ['6', '^'], ['7', '&'], ['8', '*'], ['9', '('], ['0', ')'], ['-', '_'], ['=', '+'], ['BACK', null, 1.9]],
        [['q', 'Q'], ['w', 'W'], ['e', 'E'], ['r', 'R'], ['t', 'T'], ['y', 'Y'], ['u', 'U'], ['i', 'I'], ['o', 'O'], ['p', 'P'], ['[', '{'], [']', '}'], ['\\', '|']],
        [['a', 'A'], ['s', 'S'], ['d', 'D'], ['f', 'F'], ['g', 'G'], ['h', 'H'], ['j', 'J'], ['k', 'K'], ['l', 'L'], [';', ':'], ["'", '"'], ['ENTER', null, 1.9]],
        [['SHIFT', null, 2.3], ['z', 'Z'], ['x', 'X'], ['c', 'C'], ['v', 'V'], ['b', 'B'], ['n', 'N'], ['m', 'M'], [',', '<'], ['.', '>'], ['/', '?'], ['SHIFT', null, 2.3]],
        [['SPACE', null, 9]]
    ];
    var WCLS = { 1: '', 1.9: 'kb-w2', 2.3: 'kb-w22', 9: 'kb-wsp' };

    var BEST_KEY = 'sd-ts-best-v1';
    var PREFS_KEY = 'sd-ts-prefs-v1';

    var S = {
        lessonIdx: 0,
        mode: 'preeti',            /* 'preeti' | 'english' */
        text: '',
        clusters: [],
        spans: [],
        typed: [],                 /* flat UTF-16 units typed so far */
        errors: 0,
        strokes: 0,
        running: false,
        active: false,
        startTs: 0,
        elapsed: 0,
        tickInt: null,
        stickyShift: false,
        sizeIdx: 1,
        kbVisible: true
    };

    var kbKeys = [];               /* {el, uni, shift, special} */
    var specialEls = { SHIFT: [], BACK: null, ENTER: null, SPACE: null };
    var charMap = {};              /* latin char -> [key elements] */
    var lastHints = [];

    /* ---------------- helpers ---------------- */
    function $(id) { return document.getElementById(id); }
    function esc(s) {
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
    function fmtTime(ms) {
        var t = Math.max(0, Math.floor(ms / 1000));
        return Math.floor(t / 60) + ':' + ('0' + (t % 60)).slice(-2);
    }
    var COMBINING = /[\u0900-\u0903\u093A-\u094D\u0951-\u0957\u0962\u0963\u200C\u200D]/;
    function clusterText(text) {
        var out = [];
        for (var i = 0; i < text.length; i++) {
            var ch = text[i];
            if (out.length && COMBINING.test(ch)) {
                out[out.length - 1].s += ch;
                out[out.length - 1].end = i + 1;
            } else {
                out.push({ s: ch, start: i, end: i + 1 });
            }
        }
        return out;
    }
    function getStore(json, fallback) {
        try { var v = localStorage.getItem(json); return v ? JSON.parse(v) : fallback; }
        catch (e) { return fallback; }
    }
    function setStore(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }

    /* ---------------- on-screen keyboard ---------------- */
    function buildKeyboard() {
        var host = $('onKeyboard');
        if (!host) return;
        host.innerHTML = '';
        kbKeys = []; specialEls = { SHIFT: [], BACK: null, ENTER: null, SPACE: null };
        charMap = {};

        KB_ROWS.forEach(function (row) {
            var rEl = document.createElement('div');
            rEl.className = 'kb-row';
            row.forEach(function (def) {
                var uni = def[0];
                var shift = (def[1] === undefined) ? uni : def[1];
                var w = def[2] || 1;
                var el = document.createElement('div');
                el.className = 'kb-key' + (WCLS[w] ? ' ' + WCLS[w] : '');

                var key = { el: el, uni: uni, shift: shift, special: null };
                if (uni === 'BACK') {
                    key.special = 'BACK';
                    el.innerHTML = '<span class="kb-fn"><i class="fa-solid fa-delete-left"></i> Backspace</span>';
                    specialEls.BACK = el;
                } else if (uni === 'ENTER') {
                    key.special = 'ENTER';
                    el.classList.add('kb-inert');
                    el.innerHTML = '<span class="kb-fn"><i class="fa-solid fa-arrow-turn-down-left"></i> Enter</span>';
                    specialEls.ENTER = el;
                } else if (uni === 'SHIFT') {
                    key.special = 'SHIFT';
                    el.innerHTML = '<span class="kb-fn"><i class="fa-solid fa-arrow-up-long"></i> Shift</span>';
                    specialEls.SHIFT.push(el);
                } else if (uni === 'SPACE') {
                    key.special = 'SPACE';
                    el.innerHTML = '<span class="kb-fn">Space &nbsp;•&nbsp; स्पेस</span>';
                    specialEls.SPACE = el;
                } else {
                    var uo = PREETI.hasOwnProperty(uni) ? PREETI[uni] : uni;
                    var so = PREETI.hasOwnProperty(shift) ? PREETI[shift] : shift;
                    el.innerHTML =
                        '<span class="kb-sub kb-dev">' + esc(so) + '</span>' +
                        '<span class="kb-main kb-dev">' + esc(uo) + '</span>' +
                        '<span class="kb-sub kb-eng">' + esc(shift) + '</span>' +
                        '<span class="kb-main kb-eng">' + esc(uni) + '</span>' +
                        '<span class="kb-latin">' + esc(uni) + '</span>';
                    if (!charMap[uni]) charMap[uni] = [];
                    if (!charMap[shift]) charMap[shift] = [];
                    charMap[uni].push(el);
                    if (shift !== uni) charMap[shift].push(el);
                }

                el.addEventListener('click', function () { handleKeyClick(key); });
                kbKeys.push(key);
                rEl.appendChild(el);
            });
            host.appendChild(rEl);
        });
    }

    function keyOutputs(k) {
        if (k.special === 'SPACE') return { uni: ' ', shift: ' ' };
        if (S.mode === 'preeti') {
            return {
                uni: PREETI.hasOwnProperty(k.uni) ? PREETI[k.uni] : k.uni,
                shift: PREETI.hasOwnProperty(k.shift) ? PREETI[k.shift] : k.shift
            };
        }
        return { uni: k.uni, shift: k.shift };
    }

    function handleKeyClick(k) {
        if (k.special === 'BACK') {
            if (!S.active) return;
            flashKey(k.el, null);
            tsBackspace();
            return;
        }
        if (k.special === 'SHIFT') {
            S.stickyShift = !S.stickyShift;
            paintShift();
            return;
        }
        if (k.special === 'ENTER') return;
        if (!S.active) reset();               /* tap a key = quick start */
        var ch = S.stickyShift ? k.shift : k.uni;
        if (S.stickyShift) { S.stickyShift = false; paintShift(); }
        var out = S.mode === 'preeti' ? (PREETI.hasOwnProperty(ch) ? PREETI[ch] : ch) : ch;
        flashKey(k.el, S.text.substr(S.typed.length, out.length) === out);
        tsType(out);
    }

    function flashKey(el, ok) {
        if (!el) return;
        el.classList.add('key-pressed');
        if (ok === true) el.classList.add('key-ok');
        if (ok === false) el.classList.add('key-bad');
        setTimeout(function () {
            el.classList.remove('key-pressed', 'key-ok', 'key-bad');
        }, 170);
    }

    function flashChar(raw, ok) {
        (charMap[raw] || []).forEach(function (el) { flashKey(el, ok); });
    }

    function flashSpecial(kind) {
        if (kind === 'BACK' && specialEls.BACK) flashKey(specialEls.BACK, null);
    }

    function paintShift() {
        specialEls.SHIFT.forEach(function (el) {
            el.classList.toggle('key-shift-active', S.stickyShift);
        });
    }

    /* ---------------- typing engine ---------------- */
    function buildText() {
        S.text = LESSONS[S.lessonIdx].text;
        S.clusters = clusterText(S.text);
        var host = $('typeText');
        if (!host) return;
        host.innerHTML = '';
        S.spans = S.clusters.map(function (c) {
            var sp = document.createElement('span');
            sp.className = 'ts-ch ts-pending';
            sp.textContent = c.s;
            host.appendChild(sp);
            if (c.s === ' ') sp.classList.add('space');
            return sp;
        });
    }

    function render() {
        var pos = Math.min(S.typed.length, S.text.length);
        var curIdx = -1;
        for (var i = 0; i < S.clusters.length; i++) {
            var c = S.clusters[i];
            var st;
            if (pos >= c.end) {
                st = 'ok';
                for (var j = c.start; j < c.end; j++) {
                    if (S.typed[j] !== S.text[j]) { st = 'bad'; break; }
                }
            } else if (pos > c.start) {
                st = 'current';
                for (var j2 = c.start; j2 < pos; j2++) {
                    if (S.typed[j2] !== S.text[j2]) { st = 'bad'; break; }
                }
                curIdx = i;
            } else if (pos === c.start) {
                st = 'current';
                curIdx = i;
            } else {
                st = 'pending';
            }
            S.spans[i].className = 'ts-ch ts-' + st + (c.s === ' ' ? ' space' : '');
        }
        var pct = S.text.length ? Math.min(100, Math.round(S.typed.length / S.text.length * 100)) : 0;
        var bar = $('tsProgress');
        if (bar) bar.style.width = pct + '%';
        if (curIdx >= 0 && S.active && S.spans[curIdx]) {
            S.spans[curIdx].scrollIntoView({ block: 'nearest' });
        }
        paintHints();
    }

    function paintHints() {
        lastHints.forEach(function (el) { el.classList.remove('key-hint'); });
        specialEls.SHIFT.forEach(function (el) { el.classList.remove('key-shift-hint'); });
        lastHints = [];
        if (!S.active) return;
        var pos = Math.min(S.typed.length, S.text.length);
        if (pos >= S.text.length) return;
        var upcoming = S.text.substr(pos, 6);
        var shiftNeeded = false;
        kbKeys.forEach(function (k) {
            if (k.special === 'BACK' || k.special === 'ENTER' || k.special === 'SHIFT') return;
            var outs = keyOutputs(k);
            var hit = false;
            if (outs.uni && upcoming.indexOf(outs.uni) === 0) hit = true;
            else if (outs.shift && upcoming.indexOf(outs.shift) === 0) { hit = true; shiftNeeded = true; }
            if (hit) {
                k.el.classList.add('key-hint');
                lastHints.push(k.el);
            }
        });
        if (shiftNeeded) {
            specialEls.SHIFT.forEach(function (el) { el.classList.add('key-shift-hint'); });
        }
    }

    function tsType(out) {
        if (!S.text || !out) return;
        if (!S.running) startTimer();
        var pos = S.typed.length;
        var ok = S.text.substr(pos, out.length) === out;
        for (var i = 0; i < out.length; i++) S.typed.push(out[i]);
        S.strokes++;
        if (!ok) S.errors++;
        render();
        updateStats();
        if (S.typed.length >= S.text.length) finish();
    }

    function tsBackspace() {
        if (!S.active || !S.typed.length) return;
        S.typed.pop();
        render();
        updateStats();
    }

    /* ---------------- stats & timer ---------------- */
    function computeStats() {
        var elapsedMs = S.running ? (Date.now() - S.startTs) : S.elapsed;
        var min = elapsedMs / 60000;
        var correct = 0;
        for (var i = 0; i < S.typed.length; i++) {
            if (S.typed[i] === S.text[i]) correct++;
        }
        var gross = min > 0 ? Math.round((S.typed.length / 5) / min) : 0;
        var net = min > 0 ? Math.max(0, Math.round((correct / 5) / min)) : 0;
        var acc = S.strokes ? Math.max(0, Math.round((S.strokes - S.errors) / S.strokes * 100)) : 100;
        return { ms: elapsedMs, gross: gross, net: net, acc: acc, errors: S.errors };
    }

    function updateStats() {
        var st = computeStats();
        setText('tsTime', fmtTime(st.ms));
        setText('tsNet', st.net);
        setText('tsGross', st.gross);
        setText('tsAcc', st.acc + '%');
        setText('tsErrs', st.errors);
    }
    function setText(id, v) { var el = $(id); if (el) el.textContent = v; }

    function startTimer() {
        S.running = true;
        S.startTs = Date.now();
        if (S.tickInt) clearInterval(S.tickInt);
        S.tickInt = setInterval(updateStats, 250);
    }
    function stopTimer() {
        S.running = false;
        S.elapsed = S.startTs ? Date.now() - S.startTs : 0;
        if (S.tickInt) { clearInterval(S.tickInt); S.tickInt = null; }
    }

    /* ---------------- flow control ---------------- */
    function reset() {
        S.typed = [];
        S.errors = 0;
        S.strokes = 0;
        S.running = false;
        S.active = true;
        S.elapsed = 0;
        S.stickyShift = false;
        paintShift();
        stopTimer();
        S.elapsed = 0;
        var ov = $('resultOverlay');
        if (ov) ov.classList.add('hidden');
        var btn = $('tsStartBtn');
        if (btn) btn.innerHTML = '<i class="fa-solid fa-rotate-right"></i> Restart';
        setHint('Type the glowing character — the timer starts with your first keystroke.');
        render();
        updateStats();
        updateBestChip();
    }
    function setHint(msg) { var el = $('tsHint'); if (el) el.innerHTML = msg; }

    function finish() {
        S.active = false;
        stopTimer();
        updateStats();
        var st = computeStats();

        /* best score per lesson+mode */
        var best = getStore(BEST_KEY, {});
        var bkey = LESSONS[S.lessonIdx].id + ':' + S.mode;
        var prev = best[bkey];
        var isRecord = false;
        if (st.net > 0 && (!prev || st.net > prev.wpm)) {
            best[bkey] = { wpm: st.net, acc: st.acc };
            setStore(BEST_KEY, best);
            isRecord = true;
        }
        updateBestChip();

        setText('rNet', st.net);
        setText('rGross', st.gross);
        setText('rAcc', st.acc + '%');
        setText('rErrs', st.errors);
        setText('rTime', fmtTime(st.ms));
        var bEl = $('rBest');
        if (bEl) bEl.textContent = best[bkey] ? best[bkey].wpm + ' WPM' : '—';
        var rec = $('rNewRecord');
        if (rec) rec.classList.toggle('hidden', !isRecord);
        var ov = $('resultOverlay');
        if (ov) ov.classList.remove('hidden');
        setHint('Lesson complete! Press Restart to try again or pick another lesson.');
    }

    function updateBestChip() {
        var best = getStore(BEST_KEY, {});
        var bkey = LESSONS[S.lessonIdx].id + ':' + S.mode;
        var entry = best[bkey];
        var chip = $('bestChip');
        if (chip) chip.textContent = entry ? entry.wpm + ' WPM' : '—';
    }

    /* ---------------- controls (exported) ---------------- */
    window.tsStart = function () { reset(); };

    window.tsActivate = function () {
        if (!S.active) reset();
    };

    window.tsNextLesson = function () {
        S.lessonIdx = (S.lessonIdx + 1) % LESSONS.length;
        syncLessonSelect();
        savePrefs();
        buildText();
        reset();
    };

    window.tsCloseOverlay = function () {
        var ov = $('resultOverlay');
        if (ov) ov.classList.add('hidden');
    };

    window.tsSetMode = function (mode) {
        if (S.mode === mode) return;
        S.mode = mode;
        /* jump to the first lesson of the chosen language */
        var wantLang = mode === 'preeti' ? 'ne' : 'en';
        for (var i = 0; i < LESSONS.length; i++) {
            if (LESSONS[i].lang === wantLang) { S.lessonIdx = i; break; }
        }
        applyMode();
        syncLessonSelect();
        savePrefs();
        buildText();
        reset();
        window.showToast(mode === 'preeti'
            ? 'Nepali Preeti layout — type using the on-screen guide!'
            : 'English QWERTY mode — go for speed!');
    };

    window.tsToggleKeyboard = function () {
        var wrap = $('keyboardWrap');
        if (!wrap) return;
        S.kbVisible = wrap.classList.toggle('kb-hidden') === false;
        var btn = $('kbToggle');
        if (btn) btn.classList.toggle('opacity-50', !S.kbVisible);
        savePrefs();
    };

    window.tsCycleSize = function () {
        S.sizeIdx = (S.sizeIdx + 1) % 3;
        applySize();
        savePrefs();
    };

    window.tsToggleFullscreen = function () {
        var card = $('trainerCard');
        if (!card) return;
        var fsEl = document.fullscreenElement || document.webkitFullscreenElement;
        if (fsEl) {
            (document.exitFullscreen || document.webkitExitFullscreen).call(document);
            return;
        }
        var req = card.requestFullscreen || card.webkitRequestFullscreen;
        if (req) {
            try {
                var p = req.call(card);
                if (p && p.catch) p.catch(toggleFallback);
            } catch (e) { toggleFallback(); }
        } else {
            toggleFallback();
        }
        function toggleFallback() {
            card.classList.toggle('fs-fallback');
            syncFs();
        }
    };

    function syncFs() {
        var card = $('trainerCard');
        if (!card) return;
        var fsEl = document.fullscreenElement || document.webkitFullscreenElement;
        var on = fsEl === card || card.classList.contains('fs-fallback');
        card.classList.toggle('fs-on', on);
        var icon = $('fsIcon');
        if (icon) icon.className = 'fa-solid ' + (on ? 'fa-compress' : 'fa-expand');
    }

    function applyMode() {
        var card = $('trainerCard');
        if (card) {
            card.classList.toggle('mode-english', S.mode === 'english');
            card.classList.toggle('mode-preeti', S.mode === 'preeti');
        }
        var p = $('modePreeti'), e = $('modeEnglish');
        if (p) p.className = 'px-3.5 py-1.5 rounded-lg text-xs font-bold transition ' +
            (S.mode === 'preeti' ? 'bg-cyan-600 text-white shadow' : 'text-slate-600 dark:text-slate-300 hover:text-cyan-600');
        if (e) e.className = 'px-3.5 py-1.5 rounded-lg text-xs font-bold transition ' +
            (S.mode === 'english' ? 'bg-cyan-600 text-white shadow' : 'text-slate-600 dark:text-slate-300 hover:text-cyan-600');
    }

    function applySize() {
        var host = $('typeText');
        if (!host) return;
        host.classList.remove('ts-size-1', 'ts-size-2', 'ts-size-3');
        host.classList.add('ts-size-' + (S.sizeIdx + 1));
    }

    function syncLessonSelect() {
        var sel = $('lessonSelect');
        if (sel) sel.value = String(S.lessonIdx);
    }

    function populateLessons() {
        var sel = $('lessonSelect');
        if (!sel) return;
        var ne = document.createElement('optgroup');
        ne.label = 'नेपाली — Preeti Layout';
        var en = document.createElement('optgroup');
        en.label = 'English — QWERTY';
        LESSONS.forEach(function (l, i) {
            var opt = document.createElement('option');
            opt.value = String(i);
            opt.textContent = l.title;
            (l.lang === 'ne' ? ne : en).appendChild(opt);
        });
        sel.appendChild(ne);
        sel.appendChild(en);
        sel.addEventListener('change', function () {
            var idx = parseInt(sel.value, 10) || 0;
            S.lessonIdx = idx;
            /* auto-switch mode to match the lesson language */
            var wantMode = LESSONS[idx].lang === 'ne' ? 'preeti' : 'english';
            if (S.mode !== wantMode) {
                S.mode = wantMode;
                applyMode();
                window.showToast(wantMode === 'preeti'
                    ? 'Switched to Nepali Preeti layout.'
                    : 'Switched to English QWERTY mode.');
            }
            savePrefs();
            buildText();
            reset();
        });
    }

    function savePrefs() {
        setStore(PREFS_KEY, {
            lessonIdx: S.lessonIdx, mode: S.mode,
            kbVisible: S.kbVisible, sizeIdx: S.sizeIdx
        });
    }

    /* ---------------- global key capture ---------------- */
    function modalOpen() {
        var m = $('tsModal');
        return m && !m.classList.contains('hidden');
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Shift') { paintShiftLive(true); return; }
        if (!S.active || modalOpen()) return;
        var t = e.target;
        if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' ||
                  t.tagName === 'SELECT' || t.isContentEditable)) return;
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        if (e.key === 'Backspace') {
            e.preventDefault();
            flashSpecial('BACK');
            tsBackspace();
            return;
        }
        if (e.key.length !== 1) return;
        e.preventDefault();
        var raw = e.key;
        var out = S.mode === 'preeti' ? (PREETI.hasOwnProperty(raw) ? PREETI[raw] : raw) : raw;
        flashChar(raw, S.text.substr(S.typed.length, out.length) === out);
        tsType(out);
    });

    document.addEventListener('keyup', function (e) {
        if (e.key === 'Shift') paintShiftLive(false);
    });

    function paintShiftLive(down) {
        specialEls.SHIFT.forEach(function (el) {
            el.classList.toggle('key-shift-active', down || S.stickyShift);
        });
    }

    document.addEventListener('fullscreenchange', syncFs);
    document.addEventListener('webkitfullscreenchange', syncFs);

    /* ---------------- init ---------------- */
    document.addEventListener('DOMContentLoaded', function () {
        buildKeyboard();
        populateLessons();

        var prefs = getStore(PREFS_KEY, null);
        if (prefs) {
            if (typeof prefs.lessonIdx === 'number' && LESSONS[prefs.lessonIdx]) S.lessonIdx = prefs.lessonIdx;
            if (prefs.mode === 'english' || prefs.mode === 'preeti') S.mode = prefs.mode;
            if (typeof prefs.sizeIdx === 'number' && prefs.sizeIdx >= 0 && prefs.sizeIdx < 3) S.sizeIdx = prefs.sizeIdx;
            if (typeof prefs.kbVisible === 'boolean') S.kbVisible = prefs.kbVisible;
        }

        applyMode();
        applySize();
        var wrap = $('keyboardWrap');
        if (wrap && !S.kbVisible) {
            wrap.classList.add('kb-hidden');
            var btn = $('kbToggle');
            if (btn) btn.classList.add('opacity-50');
        }
        syncLessonSelect();
        buildText();

        S.active = false;
        S.elapsed = 0;
        render();
        updateStats();
        updateBestChip();
        setHint('Press <b>Start</b> (or click the text) and type the glowing character — Backspace fixes mistakes.');
    });

    /* ============================================================
       Password-protected Typeshala setup download (unchanged)
       ============================================================ */
    window.openTsModal = function () {
        var gate = document.getElementById('tsPasswordGate');
        var input = document.getElementById('tsPasswordInput');
        var err = document.getElementById('tsPasswordError');

        if (gate) gate.classList.remove('hidden');
        if (input) { input.value = ''; input.classList.remove('border-rose-500'); }
        if (err) { err.classList.add('hidden'); err.innerText = ''; }
        document.getElementById('tsProgressContainer').classList.add('hidden');
        document.getElementById('tsProgressBar').style.width = '0%';
        document.getElementById('tsProgressPercent').innerText = '0%';
        document.getElementById('tsDownloadBtn').disabled = false;

        document.getElementById('tsModal').classList.remove('hidden');
    };

    window.closeTsModal = function () {
        document.getElementById('tsModal').classList.add('hidden');
    };

    window.attemptTypeshalaDownload = function () {
        if (!window.checkDownloadPassword('tsPasswordInput', 'tsPasswordError')) return;
        document.getElementById('tsPasswordGate').classList.add('hidden');

        var progressContainer = document.getElementById('tsProgressContainer');
        var progressBar = document.getElementById('tsProgressBar');
        var progressPercent = document.getElementById('tsProgressPercent');
        var btn = document.getElementById('tsDownloadBtn');

        progressContainer.classList.remove('hidden');
        btn.disabled = true;

        var progress = 0;
        var interval = setInterval(function () {
            progress += 20;
            progressBar.style.width = progress + '%';
            progressPercent.innerText = progress + '%';

            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(function () {
                    window.closeTsModal();
                    window.showToast('Downloaded "Typeshala_Setup.exe"!');
                }, 500);
            }
        }, 250);
    };
})();
