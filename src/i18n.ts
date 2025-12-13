
// Basic dictionary for static text
export const dictionary: Record<string, Record<string, string>> = {
    id: {
        "app.title": "RealSense Measure",
        "nav.home": "Beranda",
        "nav.measure": "Ukur",
        "nav.learning": "Pembelajaran",
        "nav.history": "Riwayat",
        "nav.settings": "Pengaturan",

        // Home Page
        "home.welcome": "Selamat Datang di RealSense",
        "home.subtitle": "Platform pengukuran dan  bilangan real modern.",
        "home.start_measure": "Mulai Mengukur",
        "home.start_learning": "Mulai Belajar",
        "home.features.ar": "Pengukuran AR",
        "home.features.ar.desc": "Ukur objek nyata menggunakan kamera dan teknologi Augmented Reality.",
        "home.features.learn": "Modul ",
        "home.features.learn.desc": "Pahami konsep matematika di balik pengukuran, seperti Epsilon dan Interval.",
        "home.history.title": "Statistik Pengukuran",
        "home.history.desc": "Lacak progress akurasi pengukuran Anda dari waktu ke waktu.",

        // Measure Page
        "measure.title": "Pengukuran AR",
        "measure.start": "Mulai Sesi AR",
        "measure.disclaimer": "DISCLAIMER: Pengukuran ini menggunakan Augmented Reality (WebAR) dan mungkin memiliki error. Harap selalu periksa kembali hasil pengukuran dengan alat fisik.",
        "measure.step1": "1. Berikan Izin Kamera",
        "measure.step2": "2. Kalibrasi Referensi",
        "measure.step3": "3. Mulai Ukur",
        "measure.result": "Hasil Pengukuran",
        "measure.verify": "Verifikasi Manual",

        // Settings Page
        "settings.title": "Pengaturan",
        "settings.subtitle": "Kelola preferensi aplikasi dan akun Anda.",
        "settings.lang.title": "Bahasa & Wilayah",
        "settings.lang.desc": "Atur preferensi bahasa antarmuka.",
        "settings.lang.label": "Bahasa Aplikasi",
        "settings.lang.help": "Pilih bahasa yang ingin digunakan.",
        "settings.offline.title": "Offline AI Translator (New)",
        "settings.offline.desc": "Terjemahkan teks ID ke EN tanpa internet (Model: Helsinki-NLP).",

        // Common
        "btn.back": "Kembali",
        "btn.open": "Buka",
        "history.empty": "Belum ada riwayat pengukuran.",
    },
    en: {
        "app.title": "RealSense Measure",
        "nav.home": "Home",
        "nav.measure": "Measure",
        "nav.learning": "Learning",
        "nav.history": "History",
        "nav.settings": "Settings",

        // Home Page
        "home.welcome": "Welcome to RealSense",
        "home.subtitle": "Modern platform for real number measurement and learning.",
        "home.start_measure": "Start Measuring",
        "home.start_learning": "Start Learning",
        "home.features.ar": "AR Measurement",
        "home.features.ar.desc": "Measure real objects using camera and Augmented Reality technology.",
        "home.features.learn": "Learning Modules",
        "home.features.learn.desc": "Understand math concepts behind measurement, like Epsilon and Intervals.",
        "home.history.title": "Measurement Stats",
        "home.history.desc": "Track your measurement accuracy progress over time.",

        // Measure Page
        "measure.title": "AR Measurement",
        "measure.start": "Start AR Session",
        "measure.disclaimer": "DISCLAIMER: This measurement uses Augmented Reality (WebAR) and may have errors. Always double-check results with physical tools.",
        "measure.step1": "1. Grant Camera Permission",
        "measure.step2": "2. Reference Calibration",
        "measure.step3": "3. Start Measuring",
        "measure.result": "Measurement Result",
        "measure.verify": "Manual Verification",

        // Settings Page
        "settings.title": "Settings",
        "settings.subtitle": "Manage application preferences and account.",
        "settings.lang.title": "Language & Region",
        "settings.lang.desc": "Set interface language preferences.",
        "settings.lang.label": "App Language",
        "settings.lang.help": "Select the language you want to use.",
        "settings.offline.title": "Offline AI Translator (New)",
        "settings.offline.desc": "Translate ID to EN text without internet (Model: Helsinki-NLP).",

        // Common
        "btn.back": "Back",
        "btn.open": "Open",
        "history.empty": "No measurement history yet.",
    }
};

export type Language = 'id' | 'en';
