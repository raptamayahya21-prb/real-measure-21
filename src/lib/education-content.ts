import { EducationTopic } from '@/types/measurement';

export const educationTopics: EducationTopic[] = [
  {
    id: 'real-numbers',
    title: 'Real Numbers (ℝ)',
    titleId: 'Bilangan Real (ℝ)',
    description: 'The complete ordered field containing all rational and irrational numbers',
    descriptionId: 'Field terurut lengkap yang memuat semua bilangan rasional dan irasional',
    content: `Real numbers form a complete ordered field that includes all rational numbers (like 1/2, 3, -7) and all irrational numbers (like π, √2, e).

Key properties:
• Completeness: Every non-empty set bounded above has a supremum
• Order: For any two real numbers, one is greater, equal, or less than the other
• Density: Between any two real numbers, there exists another real number`,
    contentId: `Bilangan real membentuk field terurut lengkap yang mencakup semua bilangan rasional (seperti 1/2, 3, -7) dan semua bilangan irasional (seperti π, √2, e).

Sifat-sifat utama:
• Kelengkapan: Setiap himpunan tak kosong yang terbatas di atas memiliki supremum
• Keterurutan: Untuk dua bilangan real apapun, salah satu lebih besar, sama, atau lebih kecil
• Kepadatan: Di antara dua bilangan real, selalu ada bilangan real lainnya`,
    examples: ['π ≈ 3.14159...', '√2 ≈ 1.41421...', 'e ≈ 2.71828...']
  },
  {
    id: 'intervals',
    title: 'Intervals',
    titleId: 'Interval',
    description: 'Subsets of real numbers between two endpoints',
    descriptionId: 'Himpunan bagian bilangan real di antara dua titik ujung',
    content: `An interval is a subset of real numbers containing all numbers between two endpoints.

Types of intervals:
• Closed [a, b]: includes both endpoints (a ≤ x ≤ b)
• Open (a, b): excludes both endpoints (a < x < b)
• Half-open [a, b) or (a, b]: includes one endpoint
• Infinite intervals: (-∞, a], [a, +∞), (-∞, +∞)`,
    contentId: `Interval adalah himpunan bagian bilangan real yang memuat semua bilangan di antara dua titik ujung.

Jenis-jenis interval:
• Tertutup [a, b]: termasuk kedua titik ujung (a ≤ x ≤ b)
• Terbuka (a, b): tidak termasuk kedua titik ujung (a < x < b)
• Setengah terbuka [a, b) atau (a, b]: termasuk satu titik ujung
• Interval tak hingga: (-∞, a], [a, +∞), (-∞, +∞)`,
    examples: ['[0, 1] = {x ∈ ℝ : 0 ≤ x ≤ 1}', '(0, 1) = {x ∈ ℝ : 0 < x < 1}']
  },
  {
    id: 'supremum-infimum',
    title: 'Supremum & Infimum',
    titleId: 'Supremum & Infimum',
    description: 'Least upper bound and greatest lower bound of a set',
    descriptionId: 'Batas atas terkecil dan batas bawah terbesar dari suatu himpunan',
    content: `Supremum (sup): The least upper bound of a set S is the smallest real number that is greater than or equal to every element in S.

Infimum (inf): The greatest lower bound of a set S is the largest real number that is less than or equal to every element in S.

For interval [a, b]:
• sup([a, b]) = b
• inf([a, b]) = a

Key theorem: Every non-empty set of real numbers that is bounded above has a supremum (Completeness Axiom).`,
    contentId: `Supremum (sup): Batas atas terkecil dari himpunan S adalah bilangan real terkecil yang lebih besar atau sama dengan setiap elemen di S.

Infimum (inf): Batas bawah terbesar dari himpunan S adalah bilangan real terbesar yang lebih kecil atau sama dengan setiap elemen di S.

Untuk interval [a, b]:
• sup([a, b]) = b
• inf([a, b]) = a

Teorema penting: Setiap himpunan bilangan real tak kosong yang terbatas di atas memiliki supremum (Aksioma Kelengkapan).`,
    examples: ['sup((0, 1)) = 1', 'inf([2, 5]) = 2', 'sup({1/n : n ∈ ℕ}) = 1']
  },
  {
    id: 'epsilon',
    title: 'Epsilon (ε) & Measurement Error',
    titleId: 'Epsilon (ε) & Error Pengukuran',
    description: 'Quantifying uncertainty in measurements',
    descriptionId: 'Mengukur ketidakpastian dalam pengukuran',
    content: `In real analysis, ε (epsilon) represents a small positive number used to describe precision and error.

In measurement:
• Every measurement has uncertainty: x ± ε
• True value lies in interval [x - ε, x + ε]
• Smaller ε means more precise measurement

Applications:
• Scientific measurements
• Engineering tolerances
• Limit definitions in calculus`,
    contentId: `Dalam analisis real, ε (epsilon) mewakili bilangan positif kecil yang digunakan untuk menggambarkan presisi dan error.

Dalam pengukuran:
• Setiap pengukuran memiliki ketidakpastian: x ± ε
• Nilai sebenarnya berada dalam interval [x - ε, x + ε]
• ε lebih kecil berarti pengukuran lebih presisi

Aplikasi:
• Pengukuran ilmiah
• Toleransi teknik
• Definisi limit dalam kalkulus`,
    examples: ['5.0 ± 0.1 cm', '|x - L| < ε', 'Error = |measured - actual|']
  },
  {
    id: 'field-properties',
    title: 'Field Properties',
    titleId: 'Sifat-sifat Field',
    description: 'Algebraic properties of real numbers',
    descriptionId: 'Sifat-sifat aljabar bilangan real',
    content: `Real numbers form a field with these properties:

Commutativity:
• a + b = b + a
• a × b = b × a

Associativity:
• (a + b) + c = a + (b + c)
• (a × b) × c = a × (b × c)

Distributivity:
• a × (b + c) = (a × b) + (a × c)

Identity Elements:
• a + 0 = a (additive identity)
• a × 1 = a (multiplicative identity)

Inverse Elements:
• a + (-a) = 0 (additive inverse)
• a × (1/a) = 1 for a ≠ 0 (multiplicative inverse)`,
    contentId: `Bilangan real membentuk field dengan sifat-sifat ini:

Komutatif:
• a + b = b + a
• a × b = b × a

Asosiatif:
• (a + b) + c = a + (b + c)
• (a × b) × c = a × (b × c)

Distributif:
• a × (b + c) = (a × b) + (a × c)

Elemen Identitas:
• a + 0 = a (identitas penjumlahan)
• a × 1 = a (identitas perkalian)

Elemen Invers:
• a + (-a) = 0 (invers penjumlahan)
• a × (1/a) = 1 untuk a ≠ 0 (invers perkalian)`,
    examples: ['3 + 5 = 5 + 3 = 8', '(2 × 3) × 4 = 2 × (3 × 4) = 24']
  },
  {
    id: 'order-properties',
    title: 'Order Properties',
    titleId: 'Sifat Keterurutan',
    description: 'Ordering and comparison of real numbers',
    descriptionId: 'Pengurutan dan perbandingan bilangan real',
    content: `Real numbers are totally ordered with these properties:

Trichotomy: For any a, b ∈ ℝ, exactly one holds:
• a < b
• a = b
• a > b

Transitivity:
• If a < b and b < c, then a < c

Compatibility with operations:
• If a < b, then a + c < b + c
• If a < b and c > 0, then ac < bc
• If a < b and c < 0, then ac > bc

Absolute Value:
• |a| = a if a ≥ 0
• |a| = -a if a < 0
• |a × b| = |a| × |b|
• |a + b| ≤ |a| + |b| (Triangle inequality)`,
    contentId: `Bilangan real terurut total dengan sifat-sifat ini:

Trikotomi: Untuk setiap a, b ∈ ℝ, tepat satu yang berlaku:
• a < b
• a = b
• a > b

Transitivitas:
• Jika a < b dan b < c, maka a < c

Kompatibilitas dengan operasi:
• Jika a < b, maka a + c < b + c
• Jika a < b dan c > 0, maka ac < bc
• Jika a < b dan c < 0, maka ac > bc

Nilai Mutlak:
• |a| = a jika a ≥ 0
• |a| = -a jika a < 0
• |a × b| = |a| × |b|
• |a + b| ≤ |a| + |b| (Ketidaksamaan segitiga)`,
    examples: ['|-5| = 5', '|3 + (-7)| ≤ |3| + |-7| = 10']
  }
];

export const challengeQuestions = [
  {
    id: 'q1',
    question: 'What is sup((0, 1))?',
    questionId: 'Berapa sup((0, 1))?',
    options: ['0', '1', '0.5', 'Does not exist'],
    optionsId: ['0', '1', '0.5', 'Tidak ada'],
    correct: 1,
    explanation: 'The supremum of (0, 1) is 1, even though 1 is not in the interval.',
    explanationId: 'Supremum dari (0, 1) adalah 1, meskipun 1 bukan anggota interval tersebut.'
  },
  {
    id: 'q2',
    question: 'Which property is demonstrated by 3 + 5 = 5 + 3?',
    questionId: 'Sifat apa yang ditunjukkan oleh 3 + 5 = 5 + 3?',
    options: ['Associativity', 'Commutativity', 'Distributivity', 'Identity'],
    optionsId: ['Asosiatif', 'Komutatif', 'Distributif', 'Identitas'],
    correct: 1,
    explanation: 'This demonstrates the commutative property of addition.',
    explanationId: 'Ini menunjukkan sifat komutatif penjumlahan.'
  },
  {
    id: 'q3',
    question: 'If measurement is 5.0 ± 0.2, what is the interval of possible true values?',
    questionId: 'Jika pengukuran adalah 5.0 ± 0.2, berapa interval nilai sebenarnya?',
    options: ['(4.8, 5.2)', '[4.8, 5.2]', '[5.0, 5.2]', '(4.8, 5.0)'],
    optionsId: ['(4.8, 5.2)', '[4.8, 5.2]', '[5.0, 5.2]', '(4.8, 5.0)'],
    correct: 1,
    explanation: 'The true value lies in the closed interval [5.0 - 0.2, 5.0 + 0.2] = [4.8, 5.2].',
    explanationId: 'Nilai sebenarnya berada dalam interval tertutup [5.0 - 0.2, 5.0 + 0.2] = [4.8, 5.2].'
  },
  {
    id: 'q4',
    question: 'What is |−7|?',
    questionId: 'Berapa |−7|?',
    options: ['-7', '7', '0', '49'],
    optionsId: ['-7', '7', '0', '49'],
    correct: 1,
    explanation: 'The absolute value of -7 is 7, since |-7| = -(-7) = 7.',
    explanationId: 'Nilai mutlak dari -7 adalah 7, karena |-7| = -(-7) = 7.'
  },
  {
    id: 'q5',
    question: 'Is √2 a real number?',
    questionId: 'Apakah √2 bilangan real?',
    options: ['No, it\'s irrational', 'Yes, it\'s irrational but real', 'Only if rounded', 'It\'s imaginary'],
    optionsId: ['Tidak, itu irasional', 'Ya, irasional tapi real', 'Hanya jika dibulatkan', 'Itu imajiner'],
    correct: 1,
    explanation: '√2 is an irrational number, and all irrational numbers are real numbers.',
    explanationId: '√2 adalah bilangan irasional, dan semua bilangan irasional adalah bilangan real.'
  }
];
