/* ============================================================
   i18n.js — English / Nepali (EN ⇄ NE) language switcher
   Usage:
     - Static text : <span data-i18n="key">Default</span>
     - Rich text   : <span data-i18n-html="key">Default</span>
     - Placeholder : <input data-i18n-ph="key">
     - Title attr  : <button data-i18n-title="key">
     - JS strings  : window.sdT('key')
     - Re-render   : document.addEventListener('sd:langchange', fn)
   ============================================================ */
(function () {
    'use strict';

    var LANG_KEY = 'sd-lang';

    var DICT = {
        /* ---------- English ---------- */
        en: {
            'nav.home': 'Home',
            'nav.calendar': 'Calendar',
            'nav.preeti': 'Preeti',
            'nav.tools': 'Tools',
            'nav.gallery': 'Gallery',
            'nav.blog': 'Blog',
            'nav.downloads': 'Downloads',
            'nav.contact': 'Contact',

            'nav.tools.all': 'All Tools Hub',
            'nav.tools.preeti': 'Preeti ↔ Unicode',
            'nav.tools.ntw': 'Number to Words',
            'nav.tools.typeshala': 'TypeShala Typing',
            'nav.tools.dateconv': 'Date Converter (BS ↔ AD)',
            'nav.tools.elec': 'Electricity Bill',
            'nav.tools.emi': 'EMI Calculator',

            'mm.home': 'Home & Profile',
            'mm.calendar': 'Nepali Calendar',
            'mm.preeti': 'Preeti ↔ Unicode Converter',
            'mm.tools': 'All Tools Hub',
            'mm.ntw': 'Number to Words Converter',
            'mm.typeshala': 'TypeShala Typing Practice',
            'mm.dateconv': 'Date Converter (BS ↔ AD)',
            'mm.elec': 'Electricity Bill Calculator',
            'mm.emi': 'EMI Calculator',
            'mm.gallery': 'Photo Gallery',
            'mm.blog': 'Blog & Feed',
            'mm.downloads': 'Notes & Download Hub',
            'mm.contact': 'Get in Touch',

            'footer.credit': 'Crafted with <i class="fa-solid fa-heart text-rose-500"></i> for digital Nepal.',

            'common.copy': 'Copy',
            'common.reset': 'Reset',

            /* ---------- Gallery ---------- */
            'gallery.title': 'Photo Gallery',
            'gallery.subtitle': 'Classroom moments, tech workspace and beautiful Nepal scenery. Click any photo for fullscreen view.',
            'gallery.count': 'photos',
            'gallery.filter.all': 'All Photos',
            'gallery.filter.nepal': 'Nepal & Culture',
            'gallery.filter.tech': 'Tech & Coding',
            'gallery.filter.class': 'Classroom & Events',
            'gallery.empty': 'No photos in this album yet.',
            'gallery.lock.title': 'Protected Gallery',
            'gallery.lock.desc': 'This photo album is private. Enter the password to view the gallery.',
            'gallery.lock.ph': 'Enter gallery password',
            'gallery.lock.btn': 'Unlock Gallery',
            'gallery.lock.err.empty': 'Please enter the gallery password.',
            'gallery.lock.err.wrong': 'Incorrect password. Please try again.',
            'gallery.lock.hint': 'Hint: same password as the Downloads hub.',
            'gallery.toast.unlocked': 'Gallery unlocked. Enjoy the photos!',

            /* ---------- Date Converter ---------- */
            'dc.title': 'Nepali Date Converter',
            'dc.subtitle': 'Convert Bikram Sambat (वि.सं.) ↔ Gregorian A.D. dates instantly — years 2000 to 2090 BS.',
            'dc.toAd': 'BS ➝ AD',
            'dc.toBs': 'AD ➝ BS',
            'dc.bsLabel': 'Bikram Sambat (Nepali Date)',
            'dc.adLabel': 'Gregorian (A.D. Date)',
            'dc.year': 'Year',
            'dc.month': 'Month',
            'dc.day': 'Day',
            'dc.convert': 'Convert Date',
            'dc.today': 'Use Today',
            'dc.swap': 'Swap Direction',
            'dc.resultAd': 'A.D. Equivalent',
            'dc.resultBs': 'B.S. Equivalent',
            'dc.weekday': 'Weekday',
            'dc.nepaliDigits': 'In Nepali Numerals',
            'dc.err.range': 'Date out of supported range (BS 2000-01-01 to BS 2090-12-30).',
            'dc.err.invalid': 'Invalid date. Please check the day for the selected month/year.',
            'dc.note': 'Based on official Bikram Sambat calendar data (2000–2090 BS).',

            /* ---------- Electricity ---------- */
            'elec.title': 'Electricity Bill Calculator',
            'elec.subtitle': 'Estimate your monthly NEA electricity bill (domestic, single-phase) using the official slab tariff.',
            'elec.mode.units': 'Enter Units',
            'elec.mode.reading': 'Meter Reading',
            'elec.units': 'Units Consumed (kWh)',
            'elec.unitsPh': 'e.g. 157',
            'elec.prev': 'Previous Reading',
            'elec.curr': 'Current Reading',
            'elec.meter': 'Meter Capacity',
            'elec.meter5': '5 Ampere — Basic',
            'elec.meter15': '15 Ampere — Standard',
            'elec.meter30': '30 Ampere — Large',
            'elec.calc': 'Calculate Bill',
            'elec.reset': 'Reset',
            'elec.energy': 'Energy Charge',
            'elec.service': 'Service Charge',
            'elec.vat': 'VAT (5%)',
            'elec.vatFree': 'VAT not applicable (≤ 50 units)',
            'elec.total': 'Total Payable',
            'elec.breakdown': 'Slab-wise Breakdown',
            'elec.th.slab': 'Slab (units)',
            'elec.th.unitsUsed': 'Units',
            'elec.th.rate': 'Rate / unit',
            'elec.th.amount': 'Amount',
            'elec.err.units': 'Please enter a valid number of units (0 – 5000).',
            'elec.err.reading': 'Current reading must be greater than or equal to previous reading.',
            'elec.note': 'Tariff: NEA domestic single-phase, FY 2082/83 slab rates. Actual bill may include meter rent, penalties or local adjustments.',
            'elec.freeSlab': 'First 20 units free (5A meter)',

            /* ---------- EMI ---------- */
            'emi.title': 'EMI Calculator',
            'emi.subtitle': 'Plan your loan — Equated Monthly Instalment for home, car, education or personal loans.',
            'emi.amount': 'Loan Amount (Rs)',
            'emi.rate': 'Interest Rate (% per year)',
            'emi.tenure': 'Loan Tenure',
            'emi.years': 'Years',
            'emi.months': 'Months',
            'emi.calc': 'Calculate EMI',
            'emi.reset': 'Reset',
            'emi.monthly': 'Monthly EMI',
            'emi.principal': 'Principal Amount',
            'emi.interest': 'Total Interest',
            'emi.totalPay': 'Total Payment',
            'emi.chartTitle': 'Principal vs Interest',
            'emi.schedule': 'Yearly Amortisation Schedule',
            'emi.th.year': 'Year',
            'emi.th.principal': 'Principal Paid',
            'emi.th.interest': 'Interest Paid',
            'emi.th.balance': 'Outstanding Balance',
            'emi.err.amount': 'Please enter a valid loan amount (Rs 1,000 – Rs 100,000,000).',
            'emi.err.rate': 'Please enter a valid interest rate (0.1% – 40%).',
            'emi.err.tenure': 'Please enter a valid tenure (1 month – 30 years).',
            'emi.legend.principal': 'Principal',
            'emi.legend.interest': 'Interest',

            /* ---------- Blog ---------- */
            'blog.title': 'Blog & Feed',
            'blog.subtitle': 'Thoughts, tutorials and updates — join the conversation, like and comment.',
            'blog.composer.ph': "What's on your mind, Sasmit?",
            'blog.composer.btn': 'Post',
            'blog.composer.err': 'Please write something before posting.',
            'blog.composer.toast': 'Your post is live!',
            'blog.followers': 'Followers',
            'blog.following': 'Following',
            'blog.posts': 'Posts',
            'blog.profileCard': 'Digital Utilities',
            'blog.profileDesc': 'Free tools for Nepal — converters, calculators and typing practice.',
            'blog.trending': 'Trending Topics',
            'blog.quickLinks': 'Quick Links',
            'blog.like': 'Like',
            'blog.comment': 'Comment',
            'blog.share': 'Share',
            'blog.commentPh': 'Write a comment…',
            'blog.commentBtn': 'Reply',
            'blog.commentErr': 'Comment cannot be empty.',
            'blog.sharedToast': 'Post link copied to clipboard!',
            'blog.justNow': 'Just now',
            'blog.minutesAgo': 'min ago',
            'blog.hoursAgo': 'hrs ago',
            'blog.daysAgo': 'days ago',
            'blog.likedToast': 'You liked this post',
            'blog.unlikedToast': 'Like removed',

            /* ---------- Downloads ---------- */
            'dl.title': 'Notes & Download Hub',
            'dl.subtitle': 'Free study notes, cheatsheets and utilities. Password-protected downloads.',
            'dl.searchPh': 'Search resources…',
            'dl.pw.label': 'Download Password',
            'dl.pw.ph': 'Enter password',
            'dl.pw.note': 'Files are protected. Ask Sasmit for the current password.',

            /* ---------- Contact ---------- */
            'ct.title': 'Get in Touch',
            'ct.subtitle': 'Questions, collaboration ideas or feedback — send a message and it will reach my inbox.',
            'ct.name': 'Full Name',
            'ct.namePh': 'Your name',
            'ct.email': 'Email Address',
            'ct.emailPh': 'you@example.com',
            'ct.subject': 'Subject',
            'ct.subjectPh': 'What is this about?',
            'ct.message': 'Message',
            'ct.messagePh': 'Write your message…',
            'ct.send': 'Send Message',

            /* ---------- Converter ---------- */
            'cv.title': 'Preeti ↔ Unicode Converter',
            'cv.subtitle': 'Convert legacy Preeti-font Nepali text to modern Unicode — and back — in real time.',

            /* ---------- Calendar ---------- */
            'cal.title': 'Nepali Calendar',
            'cal.subtitle': 'Bikram Sambat monthly calendar with festivals, holidays and today highlight.',

            /* ---------- Tools ---------- */
            'tl.title': 'Digital Tools Hub',
            'tl.subtitle': 'A growing collection of free utilities for Nepal — typing, conversion, calculation and more.',

            /* ---------- TypeShala ---------- */
            'ts.title': 'TypeShala — Nepali Typing Practice',
            'ts.subtitle': 'Master Preeti keyboard typing with live character highlighting, on-screen keyboard and fullscreen focus mode.',

            /* ---------- Index ---------- */
            'ix.heroSub': 'Full-stack web developer and educator from Nepal — building digital utilities that make Nepali computing easier for everyone.',
            'ix.cta.explore': 'Explore Utilities',
            'ix.cta.contact': 'Contact Me'
        },

        /* ---------- नेपाली ---------- */
        ne: {
            'nav.home': 'गृहपृष्ठ',
            'nav.calendar': 'पात्रो',
            'nav.preeti': 'प्रीति',
            'nav.tools': 'टुल्स',
            'nav.gallery': 'ग्यालरी',
            'nav.blog': 'ब्लग',
            'nav.downloads': 'डाउनलोड',
            'nav.contact': 'सम्पर्क',

            'nav.tools.all': 'सबै टुल्स',
            'nav.tools.preeti': 'प्रीति ↔ युनिकोड',
            'nav.tools.ntw': 'अंकबाट शब्द',
            'nav.tools.typeshala': 'टाइपशाला अभ्यास',
            'nav.tools.dateconv': 'मिति परिवर्तक (वि.सं. ↔ ई.सं.)',
            'nav.tools.elec': 'बिजुली बिल',
            'nav.tools.emi': 'ईएमआई क्यालकुलेटर',

            'mm.home': 'गृहपृष्ठ र प्रोफाइल',
            'mm.calendar': 'नेपाली पात्रो',
            'mm.preeti': 'प्रीति ↔ युनिकोड कन्भर्टर',
            'mm.tools': 'सबै टुल्स हब',
            'mm.ntw': 'अंकबाट शब्द कन्भर्टर',
            'mm.typeshala': 'टाइपशाला टाइपिङ अभ्यास',
            'mm.dateconv': 'मिति परिवर्तक (वि.सं. ↔ ई.सं.)',
            'mm.elec': 'बिजुली बिल क्यालकुलेटर',
            'mm.emi': 'ईएमआई क्यालकुलेटर',
            'mm.gallery': 'फोटो ग्यालरी',
            'mm.blog': 'ब्लग र फिड',
            'mm.downloads': 'नोट र डाउनलोड हब',
            'mm.contact': 'सम्पर्क गर्नुहोस्',

            'footer.credit': 'डिजिटल नेपालका लागि <i class="fa-solid fa-heart text-rose-500"></i> सहर बनाइएको।',

            'common.copy': 'प्रतिलिपि',
            'common.reset': 'रिसेट',

            /* ---------- ग्यालरी ---------- */
            'gallery.title': 'फोटो ग्यालरी',
            'gallery.subtitle': 'कक्षाका क्षणहरू, टेक कार्यक्षेत्र र नेपालका सुन्दर दृश्यहरू। फुलस्क्रिन हेर्न कुनै पनि फोटोमा क्लिक गर्नुहोस्।',
            'gallery.count': 'वटा फोटो',
            'gallery.filter.all': 'सबै फोटो',
            'gallery.filter.nepal': 'नेपाल र संस्कृति',
            'gallery.filter.tech': 'टेक र कोडिङ',
            'gallery.filter.class': 'कक्षा र कार्यक्रम',
            'gallery.empty': 'यो एल्बममा अझै फोटो छैन।',
            'gallery.lock.title': 'सुरक्षित ग्यालरी',
            'gallery.lock.desc': 'यो फोटो एल्बम निजी छ। ग्यालरी हेर्न पासवर्ड प्रविष्ट गर्नुहोस्।',
            'gallery.lock.ph': 'ग्यालरी पासवर्ड प्रविष्ट गर्नुहोस्',
            'gallery.lock.btn': 'ग्यालरी खोल्नुहोस्',
            'gallery.lock.err.empty': 'कृपया ग्यालरी पासवर्ड प्रविष्ट गर्नुहोस्।',
            'gallery.lock.err.wrong': 'पासवर्ड मिलेन। फेरि प्रयास गर्नुहोस्।',
            'gallery.lock.hint': 'सङ्केत: डाउनलोड हब जस्तै पासवर्ड।',
            'gallery.toast.unlocked': 'ग्यालरी खुल्यो। फोटोहरू रमाइलो गरी हेर्नुहोस्!',

            /* ---------- मिति परिवर्तक ---------- */
            'dc.title': 'नेपाली मिति परिवर्तक',
            'dc.subtitle': 'विक्रम सम्वत् (वि.सं.) ↔ ईस्वी सन् मिति तुरुन्तै परिवर्तन गर्नुहोस् — वि.सं. २००० देखि २०९० सम्म।',
            'dc.toAd': 'वि.सं. ➝ ई.सं.',
            'dc.toBs': 'ई.सं. ➝ वि.सं.',
            'dc.bsLabel': 'विक्रम सम्वत् (नेपाली मिति)',
            'dc.adLabel': 'ईस्वी सन् (A.D. मिति)',
            'dc.year': 'वर्ष',
            'dc.month': 'महिना',
            'dc.day': 'गते',
            'dc.convert': 'मिति परिवर्तन गर्नुहोस्',
            'dc.today': 'आजको मिति',
            'dc.swap': 'दिशा साट्नुहोस्',
            'dc.resultAd': 'ई.सं. समकक्ष मिति',
            'dc.resultBs': 'वि.सं. समकक्ष मिति',
            'dc.weekday': 'बार',
            'dc.nepaliDigits': 'नेपाली अंकमा',
            'dc.err.range': 'मिति समर्थित दायरा बाहिर छ (वि.सं. २०००-०१-०१ देखि २०९०-१२-३०)।',
            'dc.err.invalid': 'अमान्य मिति। कृपया छानिएको महिना/वर्षको गते जाँच गर्नुहोस्।',
            'dc.note': 'आधिकारिक विक्रम सम्वत् पात्रो तथ्याङ्कमा आधारित (वि.सं. २०००–२०९०)।',

            /* ---------- बिजुली ---------- */
            'elec.title': 'बिजुली बिल क्यालकुलेटर',
            'elec.subtitle': 'आधिकारिक गैँती दर अनुसार मासिक ने.वि.अ. (घरायसी, सिङ्गल-फेज) बिजुली बिल अनुमान गर्नुहोस्।',
            'elec.mode.units': 'युनिट प्रविष्ट',
            'elec.mode.reading': 'मिटर रिडिङ',
            'elec.units': 'खपत भएका युनिट (kWh)',
            'elec.unitsPh': 'जस्तै: १५७',
            'elec.prev': 'अघिल्लो रिडिङ',
            'elec.curr': 'चालु रिडिङ',
            'elec.meter': 'मिटर क्षमता',
            'elec.meter5': '५ एम्पियर — आधारभूत',
            'elec.meter15': '१५ एम्पियर — सामान्य',
            'elec.meter30': '३० एम्पियर — ठूलो',
            'elec.calc': 'बिल गणना गर्नुहोस्',
            'elec.reset': 'रिसेट',
            'elec.energy': 'ऊर्जा शुल्क',
            'elec.service': 'सेवा शुल्क',
            'elec.vat': 'मू.अ.कर (५%)',
            'elec.vatFree': 'मू.अ.कर लागू हुँदैन (≤ ५० युनिट)',
            'elec.total': 'तिर्नुपर्ने जम्मा',
            'elec.breakdown': 'गैँती अनुसार विवरण',
            'elec.th.slab': 'गैँती (युनिट)',
            'elec.th.unitsUsed': 'युनिट',
            'elec.th.rate': 'प्रति युनिट दर',
            'elec.th.amount': 'रकम',
            'elec.err.units': 'कृपया मान्य युनिट सङ्ख्या प्रविष्ट गर्नुहोस् (० – ५०००)।',
            'elec.err.reading': 'चालु रिडिङ अघिल्लो रिडिङभन्दा ठूलो वा बराबर हुनुपर्छ।',
            'elec.note': 'दर: ने.वि.अ. घरायसी सिङ्गल-फेज, आ.व. २०८२/८३ का गैँती दर। वास्तविक बिलमा मिटर भाडा, जरिवाना वा स्थानीय समायोजन थप हुन सक्छ।',
            'elec.freeSlab': 'पहिलो २० युनिट नि:शुल्क (५A मिटर)',

            /* ---------- ईएमआई ---------- */
            'emi.title': 'ईएमआई क्यालकुलेटर',
            'emi.subtitle': 'आफ्नो ऋण योजना बनाउनुहोस् — घर, गाडी, शिक्षा वा व्यक्तिगत ऋणको मासिक किस्ता (ईएमआई)।',
            'emi.amount': 'ऋण रकम (रु)',
            'emi.rate': 'ब्याजदर (वार्षिक %)',
            'emi.tenure': 'अवधि',
            'emi.years': 'वर्ष',
            'emi.months': 'महिना',
            'emi.calc': 'ईएमआई गणना गर्नुहोस्',
            'emi.reset': 'रिसेट',
            'emi.monthly': 'मासिक किस्ता',
            'emi.principal': 'मूलधन',
            'emi.interest': 'कुल ब्याज',
            'emi.totalPay': 'कुल भुक्तानी',
            'emi.chartTitle': 'मूलधन vs ब्याज',
            'emi.schedule': 'वार्षिक भुक्तानी तालिका',
            'emi.th.year': 'वर्ष',
            'emi.th.principal': 'तिरेको मूलधन',
            'emi.th.interest': 'तिरेको ब्याज',
            'emi.th.balance': 'बाँकी रकम',
            'emi.err.amount': 'कृपया मान्य ऋण रकम प्रविष्ट गर्नुहोस् (रु १,००० – रु १०,०००,००,०००)।',
            'emi.err.rate': 'कृपया मान्य ब्याजदर प्रविष्ट गर्नुहोस् (०.१% – ४०%)।',
            'emi.err.tenure': 'कृपया मान्य अवधि प्रविष्ट गर्नुहोस् (१ महिना – ३० वर्ष)।',
            'emi.legend.principal': 'मूलधन',
            'emi.legend.interest': 'ब्याज',

            /* ---------- ब्लग ---------- */
            'blog.title': 'ब्लग र फिड',
            'blog.subtitle': 'विचार, ट्युटोरियल र अपडेट — कुराकानीमा सामेल हुनुहोस्, लाइक र कमेन्ट गर्नुहोस्।',
            'blog.composer.ph': 'सस्मित, के सोच्दै हुनुहुन्छ?',
            'blog.composer.btn': 'पोस्ट गर्नुहोस्',
            'blog.composer.err': 'पोस्ट गर्नुअघि केही लेख्नुहोस्।',
            'blog.composer.toast': 'तपाईंको पोस्ट प्रकाशित भयो!',
            'blog.followers': 'फलोअर्स',
            'blog.following': 'फलोइङ',
            'blog.posts': 'पोस्टहरू',
            'blog.profileCard': 'डिजिटल युटिलिटिज',
            'blog.profileDesc': 'नेपालका लागि निःशुल्क टुल्स — कन्भर्टर, क्यालकुलेटर र टाइपिङ अभ्यास।',
            'blog.trending': 'चर्चित विषयहरू',
            'blog.quickLinks': 'द्रुत लिङ्कहरू',
            'blog.like': 'लाइक',
            'blog.comment': 'कमेन्ट',
            'blog.share': 'सेयर',
            'blog.commentPh': 'कमेन्ट लेख्नुहोस्…',
            'blog.commentBtn': 'जवाफ',
            'blog.commentErr': 'कमेन्ट खाली हुन सक्दैन।',
            'blog.sharedToast': 'पोस्ट लिङ्क क्लिपबोर्डमा प्रतिलिपि भयो!',
            'blog.justNow': 'भर्खरै',
            'blog.minutesAgo': 'मिनेट पहिले',
            'blog.hoursAgo': 'घण्टा पहिले',
            'blog.daysAgo': 'दिन पहिले',
            'blog.likedToast': 'तपाईंले लाइक गर्नुभयो',
            'blog.unlikedToast': 'लाइक हटाइयो',

            /* ---------- डाउनलोड ---------- */
            'dl.title': 'नोट र डाउनलोड हब',
            'dl.subtitle': 'निःशुल्क अध्ययन नोट, चिटसिट र युटिलिटिज। पासवर्ड-सुरक्षित डाउनलोड।',
            'dl.searchPh': 'स्रोत खोज्नुहोस्…',
            'dl.pw.label': 'डाउनलोड पासवर्ड',
            'dl.pw.ph': 'पासवर्ड प्रविष्ट गर्नुहोस्',
            'dl.pw.note': 'फाइलहरू सुरक्षित छन्। हालको पासवर्डका लागि सस्मितलाई सोध्नुहोस्।',

            /* ---------- सम्पर्क ---------- */
            'ct.title': 'सम्पर्क गर्नुहोस्',
            'ct.subtitle': 'प्रश्न, सहकार्यका विचार वा प्रतिक्रिया — सन्देश पठाउनुहोस्, मेरो इनबक्समा पुग्छ।',
            'ct.name': 'पूरा नाम',
            'ct.namePh': 'तपाईंको नाम',
            'ct.email': 'इमेल ठेगाना',
            'ct.emailPh': 'you@example.com',
            'ct.subject': 'विषय',
            'ct.subjectPh': 'यो केबारे हो?',
            'ct.message': 'सन्देश',
            'ct.messagePh': 'आफ्नो सन्देश लेख्नुहोस्…',
            'ct.send': 'सन्देश पठाउनुहोस्',

            /* ---------- कन्भर्टर ---------- */
            'cv.title': 'प्रीति ↔ युनिकोड कन्भर्टर',
            'cv.subtitle': 'पुरानो प्रीति-फन्टको नेपाली पाठलाई आधुनिक युनिकोडमा — र फेरि फर्काउन — समयमै परिवर्तन गर्नुहोस्।',

            /* ---------- पात्रो ---------- */
            'cal.title': 'नेपाली पात्रो',
            'cal.subtitle': 'चाडपर्व, बिदा र आजको मिति हाइलाइटसहित विक्रम सम्वत् मासिक पात्रो।',

            /* ---------- टुल्स ---------- */
            'tl.title': 'डिजिटल टुल्स हब',
            'tl.subtitle': 'नेपालका लागि निःशुल्क युटिलिटिजको बढ्दो सङ्ग्रह — टाइपिङ, रूपान्तरण, गणना र अझै धेरै।',

            /* ---------- टाइपशाला ---------- */
            'ts.title': 'टाइपशाला — नेपाली टाइपिङ अभ्यास',
            'ts.subtitle': 'प्रत्यक्ष अक्षर हाइलाइट, अन-स्क्रिन किबोर्ड र फुलस्क्रिन फोकस मोडसहित प्रीति किबोर्ड टाइपिङमा निपुण बन्नुहोस्।',

            /* ---------- गृहपृष्ठ ---------- */
            'ix.heroSub': 'नेपालबाट फुल-स्ट्याक वेब डेभलपर र शिक्षक — नेपाली कम्प्युटिङ सबैका लागि सजिलो बनाउने डिजिटल युटिलिटिज निर्माण गर्दै।',
            'ix.cta.explore': 'युटिलिटिज हेर्नुहोस्',
            'ix.cta.contact': 'सम्पर्क गर्नुहोस्'
        }
    };

    /* ---------- State ---------- */
    window.sdLang = 'en';
    try {
        var saved = localStorage.getItem(LANG_KEY);
        if (saved === 'ne' || saved === 'en') window.sdLang = saved;
    } catch (e) { /* storage unavailable */ }

    /* ---------- Translator ---------- */
    window.sdT = function (key) {
        var d = DICT[window.sdLang] || DICT.en;
        return (d[key] !== undefined) ? d[key] : (DICT.en[key] !== undefined ? DICT.en[key] : key);
    };

    /* ---------- Apply to DOM ---------- */
    window.applyI18n = function () {
        var lang = window.sdLang;
        var nodes = document.querySelectorAll('[data-i18n]');
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].textContent = window.sdT(nodes[i].getAttribute('data-i18n'));
        }
        var htmlNodes = document.querySelectorAll('[data-i18n-html]');
        for (var j = 0; j < htmlNodes.length; j++) {
            htmlNodes[j].innerHTML = window.sdT(htmlNodes[j].getAttribute('data-i18n-html'));
        }
        var phNodes = document.querySelectorAll('[data-i18n-ph]');
        for (var k = 0; k < phNodes.length; k++) {
            phNodes[k].setAttribute('placeholder', window.sdT(phNodes[k].getAttribute('data-i18n-ph')));
        }
        var titleNodes = document.querySelectorAll('[data-i18n-title]');
        for (var l = 0; l < titleNodes.length; l++) {
            titleNodes[l].setAttribute('title', window.sdT(titleNodes[l].getAttribute('data-i18n-title')));
        }

        /* Toggle button active state */
        var btnEn = document.getElementById('langBtn-en');
        var btnNe = document.getElementById('langBtn-ne');
        var activeCls = ['bg-blue-600', 'text-white', 'shadow'];
        var idleCls = ['text-slate-500', 'dark:text-slate-400', 'hover:text-blue-600'];
        [btnEn, btnNe].forEach(function (btn, idx) {
            if (!btn) return;
            var isActive = (idx === 0 && lang === 'en') || (idx === 1 && lang === 'ne');
            if (isActive) { btn.classList.add.apply(btn.classList, activeCls); btn.classList.remove.apply(btn.classList, idleCls); }
            else { btn.classList.remove.apply(btn.classList, activeCls); btn.classList.add.apply(btn.classList, idleCls); }
        });
    };

    /* ---------- Set language ---------- */
    window.setLanguage = function (lang) {
        if (lang !== 'en' && lang !== 'ne') return;
        window.sdLang = lang;
        try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
        document.documentElement.setAttribute('lang', lang === 'ne' ? 'ne' : 'en');
        window.applyI18n();
        document.dispatchEvent(new CustomEvent('sd:langchange', { detail: { lang: lang } }));
    };

    window.toggleLanguage = function () {
        window.setLanguage(window.sdLang === 'en' ? 'ne' : 'en');
    };

    /* ---------- Init ---------- */
    document.addEventListener('DOMContentLoaded', function () {
        document.documentElement.setAttribute('lang', window.sdLang === 'ne' ? 'ne' : 'en');
        window.applyI18n();
    });
})();
