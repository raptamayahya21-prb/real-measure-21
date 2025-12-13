export interface Question {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number; // Index of the correct option (0-3)
    explanation: string;
}

export const QUESTIONS: Question[] = [
    {
        id: 1,
        question: "Manakah dari berikut ini yang merupakan sifat kelengkapan bilangan real?",
        options: [
            "Setiap himpunan bagian tak kosong dari R yang terbatas ke atas memiliki supremum di R",
            "Setiap bilangan real adalah bilangan rasional",
            "Antara dua bilangan real selalu ada bilangan bulat",
            "Setiap bilangan real positif memiliki akar kuadrat negatif"
        ],
        correctAnswer: 0,
        explanation: "Sifat Kelengkapan (Completeness Property) menyatakan bahwa setiap himpunan bagian tak kosong dari bilangan real yang memiliki batas atas, pasti memiliki batas atas terkecil (supremum) di dalam himpunan bilangan real itu sendiri."
    },
    {
        id: 2,
        question: "Apa yang dimaksud dengan Supremum dari suatu himpunan?",
        options: [
            "Batas bawah terbesar",
            "Batas atas terkecil",
            "Nilai maksimum himpunan",
            "Nilai rata-rata himpunan"
        ],
        correctAnswer: 1,
        explanation: "Supremum adalah batas atas terkecil dari suatu himpunan. Jika himpunan memiliki nilai maksimum, maka supremumnya adalah nilai maksimum tersebut, tetapi supremum tetap ada meskipun maksimum tidak ada (misal interval terbuka)."
    },
    {
        id: 3,
        question: "Jika S = {x ∈ R | 0 < x < 1}, berapakah sup(S)?",
        options: [
            "0",
            "0.5",
            "1",
            "Tidak ada"
        ],
        correctAnswer: 2,
        explanation: "Himpunan S adalah interval terbuka (0, 1). Batas atasnya adalah semua bilangan >= 1. Batas atas terkecilnya (supremum) adalah 1."
    },
    {
        id: 4,
        question: "Manakah pernyataan yang BENAR mengenai himpunan bilangan rasional Q?",
        options: [
            "Q tidak padat di R",
            "Q adalah himpunan semua bilangan yang dapat dinyatakan sebagai pecahan p/q dengan p,q bulat dan q≠0",
            "Akar 2 adalah bilangan rasional",
            "Himpunan Q melingkupi seluruh garis bilangan"
        ],
        correctAnswer: 1,
        explanation: "Definisi bilangan rasional adalah bilangan yang dapat dibentuk sebagai rasio dua bilangan bulat dengan penyebut tidak nol."
    },
    {
        id: 5,
        question: "Nilai mutlak |x| didefinisikan sebagai...",
        options: [
            "x jika x < 0, dan -x jika x >= 0",
            "Jarak x dari titik 0 pada garis bilangan",
            "Selalu bernilai negatif",
            "Kuadrat dari x"
        ],
        correctAnswer: 1,
        explanation: "Secara geometris, nilai mutlak suatu bilangan real adalah jarak bilangan tersebut dari titik asal (0) pada garis bilangan."
    },
    {
        id: 6,
        question: "Sifat Asosiatif pada penjumlahan bilangan real menyatakan bahwa...",
        options: [
            "a + b = b + a",
            "a(b + c) = ab + ac",
            "(a + b) + c = a + (b + c)",
            "a + 0 = a"
        ],
        correctAnswer: 2,
        explanation: "Sifat Asosiatif berkaitan dengan pengelompokan operasi. Untuk penjumlahan: (a + b) + c = a + (b + c)."
    },
    {
        id: 7,
        question: "Berapakah infimum dari himpunan S = {1, 1/2, 1/3, 1/4, ...}?",
        options: [
            "1",
            "0",
            "Tidak ada",
            "Tak hingga"
        ],
        correctAnswer: 1,
        explanation: "Elemen himpunan semakin mengecil mendekati 0, tetapi tidak pernah mencapai 0 atau negatif. 0 adalah batas bawah terbesar."
    },
    {
        id: 8,
        question: "Apa yang dimaksud dengan Sifat Trikotomi?",
        options: [
            "Setiap bilangan real adalah positif atau negatif",
            "Untuk setiap a, b di R, berlaku salah satu: a < b, a = b, atau a > b",
            "Setiap bilangan real memiliki tiga representasi desimal",
            "Akar pangkat tiga selalu ada untuk bilangan real"
        ],
        correctAnswer: 1,
        explanation: "Sifat Trikotomi menyatakan relasi urutan antara dua bilangan real: pasti salah satu dari lebih kecil, sama dengan, atau lebih besar."
    },
    {
        id: 9,
        question: "Jika ε > 0 diberikan, makna ketaksamaan |x - a| < ε adalah...",
        options: [
            "Jarak antara x dan a kurang dari ε",
            "x lebih besar dari a ditambah ε",
            "x sama dengan a",
            "x adalah kelipatan ε dari a"
        ],
        correctAnswer: 0,
        explanation: "|x - a| merepresentasikan jarak antara x dan a. Ketaksamaan |x - a| < ε berarti jarak x ke a lebih kecil dari ε (x berada dalam lingkungan ε dari a)."
    },
    {
        id: 10,
        question: "Manakah yang merupakan bilangan irasional?",
        options: [
            "0.3333...",
            "22/7",
            "√4",
            "π (pi)"
        ],
        correctAnswer: 3,
        explanation: "π (pi) adalah bilangan irasional, desimalnya tak berulang dan tak terbatas. 22/7 hanya pendekatan. 0.333... = 1/3. √4 = 2."
    },
    {
        id: 11,
        question: "Sifat Archimedes menyatakan bahwa...",
        options: [
            "Untuk setiap bilangan real x, terdapat bilangan asli n sehingga n > x",
            "Setiap bilangan real memiliki invers",
            "Bilangan prima tak terhingga banyaknya",
            "Volume benda putar dapat dihitung dengan integral"
        ],
        correctAnswer: 0,
        explanation: "Sifat Archimedes menjamin bahwa himpunan bilangan asli tidak terbatas ke atas dalam sistem bilangan real."
    },
    {
        id: 12,
        question: "Apa syarat agar suatu himpunan memiliki Supremum?",
        options: [
            "Himpunan tersebut tak terbatas",
            "Himpunan tersebut kosong",
            "Himpunan tersebut tak kosong dan terbatas ke atas",
            "Himpunan tersebut berisi bilangan bulat saja"
        ],
        correctAnswer: 2,
        explanation: "Menurut Aksioma Kelengkapan, syarat cukup dan perlu agar himpunan bagian R memiliki supremum di R adalah himpunan itu tak kosong dan terbatas ke atas."
    }
];
