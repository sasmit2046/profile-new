/* ============================================================
   num2words.js — Nepali Number → Words converter (Tools page)
   • Nepali system grouping: करोड — लाख — हजार — सय
   • Output in नेपाली शब्द, English words and Devanagari digits
   • Currency mode: "रुपैयाँ … मात्र" / "Rupees … Only"
   ============================================================ */
(function () {
    'use strict';

    /* ---- Nepali words 0–99 ---- */
    var NEP = ['शून्य', 'एक', 'दुई', 'तीन', 'चार', 'पाँच', 'छ', 'सात', 'आठ', 'नौ',
        'दश', 'एघार', 'बाह्र', 'तेह्र', 'चौध', 'पन्ध्र', 'सोह्र', 'सत्र', 'अठार', 'उन्नाइस',
        'बीस', 'एक्काइस', 'बाइस', 'तेइस', 'चौबीस', 'पच्चीस', 'छब्बीस', 'सत्ताइस', 'अट्ठाइस', 'उनन्तीस',
        'तीस', 'एकत्तीस', 'बत्तीस', 'तेत्तीस', 'चौंतीस', 'पैंतीस', 'छत्तीस', 'सैंतीस', 'अड्तीस', 'उनन्चालीस',
        'चालीस', 'एकचालीस', 'बियालीस', 'त्रिचालीस', 'चवालीस', 'पैंतालीस', 'छयालीस', 'सच्चालीस', 'अड्चालीस', 'उनन्चास',
        'पचास', 'एकाउन्न', 'बाउन्न', 'त्रिपन्न', 'चौवन्न', 'पचपन्न', 'छप्पन्न', 'सताउन्न', 'अन्ठाउन्न', 'उनसन्ठी',
        'साठी', 'एकसठ्ठी', 'बासठ्ठी', 'त्रिसठ्ठी', 'चौंसठ्ठी', 'पैंसठ्ठी', 'छयासठ्ठी', 'सड्सठ्ठी', 'अड्सठ्ठी', 'उनन्सत्तरी',
        'सत्तरी', 'एकहत्तर', 'बहत्तर', 'त्रिहत्तर', 'चौहत्तर', 'पचहत्तर', 'छहत्तर', 'सतहत्तर', 'अठहत्तर', 'उनासी',
        'असी', 'एकासी', 'बयासी', 'त्रियासी', 'चौरासी', 'पचासी', 'छयासी', 'सतासी', 'अठासी', 'उनन्नब्बे',
        'नब्बे', 'एक्यान्नब्बे', 'बयान्नब्बे', 'त्रियान्नब्बे', 'चौरान्नब्बे', 'पंचान्नब्बे', 'छयान्नब्बे', 'सत्तान्नब्बे', 'अठ्ठान्नब्बे', 'उनान्सय'];

    /* ---- English words ---- */
    var ENG_ONES = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
        'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    var ENG_TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    var ENG99 = (function () {
        var a = [];
        for (var i = 0; i < 100; i++) {
            if (i < 20) { a[i] = ENG_ONES[i]; continue; }
            var t = ENG_TENS[Math.floor(i / 10)], o = i % 10;
            a[i] = o ? t + '-' + ENG_ONES[o] : t;
        }
        return a;
    })();

    var DEV_DIGITS = { '0': '०', '1': '१', '2': '२', '3': '३', '4': '४', '5': '५', '6': '६', '7': '७', '8': '८', '9': '९' };

    var NP_SCALES = ['हजार', 'लाख', 'करोड', 'अर्ब', 'खर्ब'];
    var EN_SCALES = ['Thousand', 'Lakh', 'Crore', 'Arab', 'Kharab'];

    /* ---- core: last 3 digits + pairs of 2 (Nepali grouping) ---- */
    function lastThree(intStr, words, hundredWord) {
        var v = parseInt(intStr, 10);
        if (!v) return '';
        var parts = [];
        var h = Math.floor(v / 100), r = v % 100;
        if (h) parts.push(words[h] + ' ' + hundredWord);
        if (r) parts.push(words[r]);
        return parts.join(' ');
    }

    function groupWords(intStr, words, hundredWord, scales) {
        var parts = [];
        var rest = intStr.slice(0, -3);
        var idx = 0;
        while (rest.length) {
            var pair = parseInt(rest.slice(-2), 10);
            if (pair) parts.unshift(words[pair] + (scales[idx] ? ' ' + scales[idx] : ''));
            rest = rest.slice(0, -2);
            idx++;
        }
        var tail = lastThree(intStr.slice(-3), words, hundredWord);
        if (tail) parts.push(tail);
        return parts.join(' ');
    }

    function nepWords(intStr) {
        if (intStr === '0') return 'शून्य';
        return groupWords(intStr, NEP, 'सय', NP_SCALES);
    }
    function enWords(intStr) {
        if (intStr === '0') return 'Zero';
        return groupWords(intStr, ENG99, 'Hundred', EN_SCALES);
    }

    function digitWordsNep(dec) {
        return dec.split('').map(function (d) { return NEP[+d]; }).join(' ');
    }
    function digitWordsEng(dec) {
        return dec.split('').map(function (d) { return ENG_ONES[+d]; }).join(' ');
    }

    /* ---- display: Devanagari digits with Indian grouping ---- */
    function groupLatin(intStr) {
        if (intStr.length <= 3) return intStr;
        var last3 = intStr.slice(-3);
        var rest = intStr.slice(0, -3);
        var groups = [];
        while (rest.length > 2) { groups.unshift(rest.slice(-2)); rest = rest.slice(0, -2); }
        if (rest) groups.unshift(rest);
        return groups.join(',') + ',' + last3;
    }
    function formatDigits(intStr, decPart, hasDot) {
        var g = groupLatin(intStr);
        if (hasDot && decPart !== '') g += '.' + decPart;
        return g.replace(/[0-9]/g, function (d) { return DEV_DIGITS[d]; });
    }

    /* ---- main converter ---- */
    function convert(raw, currency) {
        var out = { digits: '', nep: '', eng: '', note: '' };
        var s = String(raw || '').trim().replace(/[,\s]/g, '');
        if (s === '') return out;

        var neg = s.charAt(0) === '-';
        if (neg) s = s.slice(1);
        if (!/^\d*(\.\d*)?$/.test(s) || s === '' || s === '.') { out.note = 'invalid'; return out; }

        var dot = s.indexOf('.');
        var intPart = dot === -1 ? s : s.slice(0, dot);
        var decPart = dot === -1 ? '' : s.slice(dot + 1).replace(/\D/g, '');
        if (intPart === '') intPart = '0';
        intPart = intPart.replace(/^0+(?=\d)/, '');
        if (intPart.length > 13) { out.note = 'too-large'; return out; }

        out.digits = (neg ? '-' : '') + formatDigits(intPart, decPart, dot !== -1);

        var npInt = nepWords(intPart);
        var enInt = enWords(intPart);
        var npDec = '', enDec = '';

        if (dot !== -1 && decPart !== '' && decPart !== '00') {
            if (currency && decPart.length === 2) {
                npDec = ' ' + nepWords(decPart) + ' पैसा';
                enDec = ' and ' + enWords(decPart) + ' Paisa';
            } else {
                npDec = ' दशमलव ' + digitWordsNep(decPart);
                enDec = ' point ' + digitWordsEng(decPart);
            }
        }

        var negNp = neg ? 'माइनस ' : '';
        var negEn = neg ? 'Minus ' : '';

        if (currency) {
            out.nep = negNp + npInt + ' रुपैयाँ' + npDec + ' मात्र';
            out.eng = negEn + enInt + ' Rupees' + enDec + ' Only';
        } else {
            out.nep = negNp + npInt + npDec;
            out.eng = negEn + enInt + enDec;
        }
        return out;
    }

    /* ---------------- UI wiring ---------------- */
    function copyText(txt) {
        function fallback() {
            var ta = document.createElement('textarea');
            ta.value = txt;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            try {
                document.execCommand('copy');
                window.showToast('Copied to clipboard!');
            } catch (e) {
                window.showToast('Copy failed — please copy manually.');
            }
            document.body.removeChild(ta);
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(txt).then(function () {
                window.showToast('Copied to clipboard!');
            }, fallback);
        } else {
            fallback();
        }
    }

    function set(id, text) {
        var el = document.getElementById(id);
        if (el) el.textContent = text;
    }

    window.n2wRender = function () {
        var input = document.getElementById('n2wInput');
        var currency = document.getElementById('n2wCurrency');
        var note = document.getElementById('n2wNote');
        if (!input) return;

        var r = convert(input.value, currency ? currency.checked : false);

        if (r.note === 'too-large') {
            set('n2wDigits', '—'); set('n2wNepali', '—'); set('n2wEnglish', '—');
            if (note) {
                note.textContent = 'Please enter a number up to 13 digits (up to ९९ खर्ब). / कृपया १३ अंकभन्दा सानो संख्या लेख्नुहोस्।';
                note.classList.remove('hidden');
            }
            return;
        }
        if (r.note === 'invalid') {
            set('n2wDigits', '—'); set('n2wNepali', '—'); set('n2wEnglish', '—');
            if (note) {
                note.textContent = 'Digits only, please — e.g. 12500 or 99.99 / अंकहरू मात्र लेख्नुहोस्।';
                note.classList.remove('hidden');
            }
            return;
        }
        if (note) note.classList.add('hidden');

        var empty = input.value.trim() === '';
        set('n2wDigits', empty ? '—' : (r.digits || '—'));
        set('n2wNepali', empty ? '—' : (r.nep || '—'));
        set('n2wEnglish', empty ? '—' : (r.eng || '—'));
    };

    window.n2wExample = function (val) {
        var input = document.getElementById('n2wInput');
        if (!input) return;
        input.value = val;
        window.n2wRender();
    };

    window.n2wCopy = function (kind) {
        var map = { digits: 'n2wDigits', nep: 'n2wNepali', eng: 'n2wEnglish' };
        var el = document.getElementById(map[kind]);
        if (!el) return;
        var txt = el.textContent;
        if (!txt || txt === '—') {
            window.showToast('Nothing to copy yet — type a number first!');
            return;
        }
        copyText(txt);
    };

    /* ---- init: live listeners ---- */
    (function init() {
        var ready = function () {
            var input = document.getElementById('n2wInput');
            var currency = document.getElementById('n2wCurrency');
            if (input) input.addEventListener('input', window.n2wRender);
            if (currency) currency.addEventListener('change', window.n2wRender);
            window.n2wRender();
        };
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', ready);
        } else {
            ready();
        }
    })();
})();
