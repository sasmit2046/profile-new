/* ============================================================
   converter.js — Preeti ↔ Unicode bi-directional engine
   ============================================================ */
(function () {
    'use strict';

    var converterMode = 'preetiToUni';

    var preetiToUnicodeMap = {
        "3": "ग्‍", "4": "ि", "5": "द्व", "6": "ट्ट", "7": "ष्ठ", "8": "ड्ड", "9": "ढ्ढ", "0": "०",
        "1": "१", "2": "२", "q": "त्र", "w": "ध", "e": "भ", "r": "च", "t": "त", "y": "थ",
        "u": "ग", "i": "ष", "o": "य", "p": "उ", "a": "ब", "s": "क", "d": "म", "f": "ा",
        "g": "न", "h": "ज", "j": "व", "k": "प", "l": "जि", "z": "श", "x": "ह", "c": "अ",
        "v": "ख", "b": "द", "n": "स", "m": "उ", "Q": "त्त", "W": "ध्‍", "E": "भ्‍", "R": "च्‍",
        "T": "त्त्", "Y": "थ्‍", "U": "ग्‍", "I": "क्ष्", "O": "इ", "P": "ए", "A": "ब्‍", "S": "क्",
        "D": "म्‍", "F": "ँ", "G": "न्‍", "H": "ज्‍", "J": "व्‍", "K": "प्‍", "L": "ी", "Z": "श्‍",
        "X": "ह्‍", "C": "ऋ", "V": "ख्‍", "B": "द्ब", "N": "स्‍", "M": "ं", "`": "ञ्", "~": "ऐ",
        "+": "ं", "=": "।",
        /* Extended Typeshala keys — complete Devanagari coverage (shared with typeshala.js) */
        "!": "ट", "@": "ठ", "#": "ड", "$": "ढ", "%": "फ", "^": "ल", "*": "झ", "(": "घ", ")": "छ",
        "-": "ई", "_": "्", "[": "ु", "]": "ू", "{": "ृ", "}": "ः", "|": "ऊ", ";": "े", ":": "ै",
        "'": "ो", "\"": "ौ", ",": "ङ", "<": "ओ", ".": "ञ", ">": "औ", "/": "र", "?": "आ"
    };

    /* Inverted map for Unicode to Preeti */
    var unicodeToPreetiMap = {};
    Object.keys(preetiToUnicodeMap).forEach(function (key) {
        unicodeToPreetiMap[preetiToUnicodeMap[key]] = key;
    });

    window.setConverterDirection = function (mode) {
        converterMode = mode;
        var btnPreeti = document.getElementById('modePreetiToUni');
        var btnUni = document.getElementById('modeUniToPreeti');

        if (mode === 'preetiToUni') {
            btnPreeti.className = "px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm bg-purple-600 text-white";
            btnUni.className = "px-4 py-2 rounded-xl text-xs font-bold transition text-slate-600 dark:text-slate-300 hover:text-purple-600";
            document.getElementById('inputLabel').innerHTML = '<i class="fa-solid fa-keyboard text-purple-500"></i> Source Text (Preeti Font)';
            document.getElementById('outputLabel').innerHTML = '<i class="fa-solid fa-font text-emerald-500"></i> Converted Output (Nepali Unicode)';
        } else {
            btnUni.className = "px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm bg-purple-600 text-white";
            btnPreeti.className = "px-4 py-2 rounded-xl text-xs font-bold transition text-slate-600 dark:text-slate-300 hover:text-purple-600";
            document.getElementById('inputLabel').innerHTML = '<i class="fa-solid fa-font text-purple-500"></i> Source Text (Nepali Unicode)';
            document.getElementById('outputLabel').innerHTML = '<i class="fa-solid fa-keyboard text-emerald-500"></i> Converted Output (Preeti Font)';
        }
        window.clearConverter();
    };

    window.runConverter = function () {
        var inputVal = document.getElementById('converterInput').value;
        var outputVal = '';

        document.getElementById('inputCharCount').innerText = inputVal.length + ' chars';

        var i, ch;
        if (converterMode === 'preetiToUni') {
            for (i = 0; i < inputVal.length; i++) {
                ch = inputVal[i];
                outputVal += preetiToUnicodeMap[ch] || ch;
            }
        } else {
            for (i = 0; i < inputVal.length; i++) {
                ch = inputVal[i];
                outputVal += unicodeToPreetiMap[ch] || ch;
            }
        }

        document.getElementById('converterOutput').value = outputVal;
        document.getElementById('outputCharCount').innerText = outputVal.length + ' chars';
    };

    window.clearConverter = function () {
        document.getElementById('converterInput').value = '';
        document.getElementById('converterOutput').value = '';
        document.getElementById('inputCharCount').innerText = '0 chars';
        document.getElementById('outputCharCount').innerText = '0 chars';
    };

    window.copyConverterOutput = function () {
        var out = document.getElementById('converterOutput');
        if (!out.value) {
            window.showToast('Nothing to copy!');
            return;
        }
        out.select();
        document.execCommand('copy');
        window.showToast('Output text copied to clipboard!');
    };

    window.downloadConvertedTxt = function () {
        var text = document.getElementById('converterOutput').value;
        if (!text) {
            window.showToast('No converted text available to download.');
            return;
        }
        var blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'Converted_Nepali_Text.txt';
        a.click();
        URL.revokeObjectURL(url);
        window.showToast('Downloaded text file!');
    };
})();
