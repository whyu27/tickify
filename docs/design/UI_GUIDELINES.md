# UI Guidelines - Tickify

Dokumen ini merupakan acuan utama pengembangan antarmuka (UI) Tickify.

Seluruh halaman frontend wajib mengikuti design system ini agar memiliki tampilan yang konsisten, modern, dan profesional.

---

# 1. Design Philosophy

Tickify merupakan Blockchain Ticketing SaaS yang berfokus pada pengalaman pengguna yang sederhana, modern, dan premium.

Design harus memberikan kesan:

- Professional
- Modern
- Minimalist
- Premium
- High Contrast
- Spacious
- Content Focused

Dark Mode merupakan satu-satunya tema yang digunakan.

Seluruh halaman harus memiliki konsistensi visual.

---

# 2. Global Theme

Theme

Dark Mode Only

Visual Style

- Minimalist
- Modern SaaS
- Web3
- Premium
- High Readability

Fokus utama antarmuka adalah:

- Event
- Ticket
- Dashboard
- Blockchain Interaction

UI tidak boleh terlihat ramai.

Gunakan whitespace secara konsisten.

---

# 3. Color Palette

## Background

Primary Background

#0A0A0A

Secondary Background

#111111

Card Background

#161616

Section Background

#0D0D0D

---

## Text

Primary

#FFFFFF

Secondary

#A0A0A0

Muted

#777777

Disabled

#555555

---

## Border

Default Border

rgba(255,255,255,0.08)

Hover Border

rgba(255,255,255,0.15)

Divider

rgba(255,255,255,0.06)

---

## Interactive

Primary Button

Background

White

Text

Black

Hover

#EAEAEA

Secondary Button

Transparent

Border

rgba(255,255,255,0.12)

Hover Border

rgba(255,255,255,0.25)

Ghost Button

Transparent

Hover Background

rgba(255,255,255,0.05)

---

## Status

Live

#22C55E

Success

#22C55E

Warning

#FACC15

Danger

#EF4444

---

# 4. Typography

Font Family

Inter

Fallback

sans-serif

---

Hero Title

56–64px

Bold

White

---

Section Title

32px

Bold

White

---

Card Title

20–24px

Bold

White

---

Subtitle

18px

Medium

Secondary Text

---

Body

16px

Regular

Secondary Text

---

Caption

14px

Regular

Muted

---

Meta Text

12px

Regular

Muted

---

# 5. Border Radius

Button

12px

Input

12px

Card

16px

Modal

20px

Badge

9999px

---

# 6. Shadows

Gunakan shadow yang sangat halus.

Default

shadow-sm

Hover

shadow-md

Tidak menggunakan shadow yang berat.

---

# 7. Layout

Container Width

1280px

Alignment

Center

Grid

Desktop

3 Columns

Tablet

2 Columns

Mobile

1 Column

Gap

24px

Section Spacing

80–120px

Card Padding

24px

---

# 8. Responsive

Desktop

>1024px

Tablet

768–1024px

Mobile

<768px

Semua halaman wajib Mobile First.

---

# 9. Components

## Navbar

Height

72px

Position

Sticky

Background

Transparent + Blur

Border Bottom

Tipis

Container

1280px

Landing Page hanya menampilkan:

- Logo
- Navigation
- Login
- Register

Connect Wallet hanya muncul setelah login.

---

## Buttons

Primary

- Background putih
- Text hitam

Secondary

- Outline

Ghost

- Transparan

Danger

- Merah

Success

- Hijau

Semua button menggunakan transition.

---

## Cards

Background

Card Background

Border

1px solid Border

Radius

16px

Padding

24px

Hover

- Border lebih terang
- Shadow bertambah sedikit

---

## Event Card

Seluruh Event Card wajib memiliki struktur yang sama.

Isi:

- Banner
- Category Badge
- Event Name
- Organizer
- Location
- Date
- Availability
- Ticket Price
- CTA

Landing Page hanya menampilkan tombol:

View Details

---

## Statistic Card

Digunakan pada:

- Landing Page
- Dashboard

Berisi:

- Icon
- Value
- Label

---

## Subscription Card

Digunakan pada halaman Pricing.

Berisi:

- Plan Name
- Price
- Feature List
- CTA

---

## Input

Height

48px

Radius

12px

Background

Transparent

Border

1px solid Border

Focus

Border lebih terang

---

## Badge

Radius

9999px

Digunakan untuk:

- Category
- Network
- Live
- Verified
- Subscription

---

## Modal

Background Blur

Radius

20px

Padding

32px

---

# 10. Icons

Library

lucide-react

Style

Outline

Stroke

1.5

Ukuran

18–22px

---

# 11. Animation

Transition

200–300ms

Hover

Scale 1.02

Card

Border lebih terang

Button

Brightness meningkat sedikit

Modal

Fade + Scale

Page

Fade In

Hindari animasi yang berlebihan.

---

# 12. Visual Principles

Prioritaskan

- Whitespace
- Simplicity
- Readability
- Consistency
- Visual Hierarchy

Hindari

- Gradient berlebihan
- Shadow berat
- Warna terlalu banyak
- Layout padat
- Animasi mengganggu

Poster event harus menjadi elemen visual utama.

UI hanya menjadi pendukung.

---

# 13. Reusable Components

Komponen berikut wajib reusable.

- Navbar
- Footer
- Sidebar
- Button
- Card
- Badge
- Input
- Modal
- Dialog
- Event Card
- Ticket Card
- Subscription Card
- Statistic Card
- Empty State
- Loading State

---

# 14. Page Consistency

Landing Page menjadi acuan visual seluruh aplikasi.

Organizer Dashboard

- Menggunakan Card yang sama
- Menggunakan Typography yang sama
- Menggunakan Button yang sama

Participant Dashboard

- Menggunakan Event Card yang sama
- Menggunakan Ticket Card yang sama

Profile

- Menggunakan Form Component yang sama

Seluruh halaman harus terlihat berasal dari satu design system.

---

# 15. AI Implementation Rules

Saat AI mengimplementasikan halaman baru:

- Selalu mengikuti UI Guidelines ini.
- Jangan membuat variasi komponen baru tanpa alasan.
- Gunakan reusable component.
- Jangan menggunakan warna di luar Color Palette.
- Jangan mengubah typography.
- Jangan mengubah border radius.
- Jangan mengubah spacing.
- Gunakan struktur layout yang konsisten.

Landing Page merupakan acuan utama visual Tickify.