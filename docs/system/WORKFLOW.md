# Workflow & Business Logic - Tickify

Dokumen ini menjelaskan alur bisnis (business workflow) aplikasi Tickify, mulai dari autentikasi pengguna hingga proses pembelian dan verifikasi tiket berbasis blockchain.

---

# 1. System Overview

Tickify merupakan aplikasi **Blockchain Ticketing SaaS** yang memungkinkan banyak organizer membuat event dan banyak peserta membeli tiket melalui satu platform.

Sistem menggunakan dua jenis penyimpanan data:

* **Off-Chain (PostgreSQL)** untuk data aplikasi.
* **On-Chain (Blockchain)** untuk data kepemilikan tiket dan validasi.

---

# 2. User Roles

Aplikasi memiliki dua role utama.

## Organizer

Organizer bertanggung jawab untuk:

* Membuat event
* Mengelola event
* Melihat daftar peserta
* Memverifikasi tiket saat check-in

---

## Participant

Participant bertanggung jawab untuk:

* Membeli tiket
* Menghubungkan wallet
* Melihat tiket yang dimiliki
* Menunjukkan QR Code saat check-in

---

# 3. Authentication Flow

Seluruh pengguna melakukan autentikasi menggunakan akun konvensional terlebih dahulu.

```text id="lbtkzh"
Landing Page
      │
      ▼
Register
      │
      ▼
Login
      │
      ▼
JWT Authentication
      │
      ▼
Dashboard
      │
      ▼
Connect MetaMask Wallet
```

JWT digunakan untuk autentikasi aplikasi.

MetaMask digunakan untuk autentikasi Web3.

Keduanya saling melengkapi dan memiliki fungsi yang berbeda.

---

# 4. Subscription Workflow

Hanya **Organizer** yang menggunakan sistem subscription.

Organizer baru akan mendapatkan **Free Plan** secara otomatis.

Participant tidak menggunakan subscription.

```text
Register Organizer
        │
        ▼
Free Plan
        │
        ▼
Dashboard Organizer
        │
        ▼
Create Event
        │
        ▼
Check Subscription
        │
   ┌────┴────┐
   ▼         ▼
 Free       Pro
   │         │
Check Limit  Unlimited
   │
 ┌─┴──────────────┐
 ▼                ▼
Limit Belum     Limit Tercapai
Tercapai             │
   │                 ▼
Create Event    Upgrade Plan
                      │
                      ▼
                 Subscription Pro
                      │
                      ▼
                Unlimited Event
```

### Business Logic

* Subscription hanya berlaku untuk Organizer.
* Organizer baru menggunakan **Free Plan** secara default.
* Free Plan dibatasi maksimal **2 event aktif**.
* Pro Plan tidak memiliki batasan jumlah event.
* Sistem akan memeriksa subscription sebelum organizer membuat event.
* Jika batas Free Plan telah tercapai, organizer harus melakukan upgrade ke Pro untuk membuat event baru.

---

# 5. Organizer Workflow

```text id="0jvmoq"
Login
   │
   ▼
Connect Wallet
   │
   ▼
Dashboard Organizer
   │
   ▼
Create Event
   │
   ▼
Save Event to PostgreSQL
   │
   ▼
Publish Event
```

Business Logic

* Data event disimpan di PostgreSQL.
* Informasi event ditampilkan pada Landing Page.
* Event dapat dibeli oleh participant setelah dipublikasikan.

---

# 6. Participant Workflow

```text id="zlcjlwm"
Login
   │
   ▼
Connect Wallet
   │
   ▼
Browse Events
   │
   ▼
Event Detail
   │
   ▼
Buy Ticket
   │
   ▼
MetaMask Confirmation
   │
   ▼
Blockchain Transaction
   │
   ▼
Sync to Backend
   │
   ▼
My Tickets
```

Business Logic

* Pembayaran dilakukan menggunakan ETH Testnet.
* Smart Contract mencatat kepemilikan tiket.
* Backend menyimpan hash transaksi dan data sinkronisasi.
* Tiket akan muncul pada halaman My Tickets.

---

# 7. Ticket Purchase Workflow

```text id="04tg22"
Participant
      │
      ▼
Click Buy Ticket
      │
      ▼
Frontend memanggil Smart Contract
      │
      ▼
MetaMask meminta konfirmasi
      │
      ▼
Transaction Success
      │
      ▼
Ticket Created On-Chain
      │
      ▼
Transaction Hash
      │
      ▼
Backend Sync
      │
      ▼
Database Updated
```

Business Logic

On-Chain:

* Ticket ID
* Owner Address
* Ticket Status

Off-Chain:

* Event
* Participant
* Transaction Hash
* Purchase History

---

# 8. My Tickets Workflow

```text id="c71kij"
Dashboard
    │
    ▼
My Tickets
    │
    ▼
Backend Request
    │
    ▼
PostgreSQL
    │
    ▼
Generate QR Code
    │
    ▼
Display Ticket
```

QR Code digunakan sebagai identitas tiket saat proses check-in.

---

# 9. Ticket Verification Workflow

```text id="zv8mqq"
Organizer
     │
     ▼
Open Verify Page
     │
     ▼
Scan QR Code
     │
     ▼
Extract Ticket ID
     │
     ▼
Call Smart Contract
     │
     ▼
Check Ticket Owner
     │
     ▼
Check Ticket Status
     │
     ▼
Valid ?
 ┌──────┴──────┐
 │             │
 ▼             ▼
Success      Rejected
 │
 ▼
Set isUsed = true
 │
 ▼
Backend Sync
 │
 ▼
Update Database
```

Business Logic

Tiket hanya dapat digunakan satu kali.

Apabila status tiket telah digunakan (`isUsed = true`), sistem harus menolak proses check-in berikutnya.

---

# 10. Data Responsibility

## PostgreSQL (Off-Chain)

Menyimpan:

* User
* Event
* Banner
* Deskripsi
* Lokasi
* Jadwal
* Riwayat transaksi
* Sinkronisasi tiket

---

## Blockchain (On-Chain)

Menyimpan:

* Ticket ID
* Wallet Owner
* Ticket Status
* Transaction Record

Blockchain menjadi sumber kebenaran (source of truth) untuk kepemilikan tiket.

---

# 11. Communication Flow

```text id="i1s1gt"
                 User
                  │
                  ▼
          React Frontend
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
 Express REST API     Smart Contract
        │                   │
        ▼                   ▼
 PostgreSQL          Blockchain Network
```

Frontend berkomunikasi dengan:

* Backend melalui REST API.
* Blockchain melalui Ethers.js dan MetaMask.

Backend tidak menangani transaksi blockchain secara langsung, tetapi menerima data hasil transaksi untuk kebutuhan sinkronisasi dan pelaporan.

---

# 12. Business Rules

* Setiap akun hanya memiliki satu role.
* Wallet hanya dapat dikaitkan dengan satu akun.
* Organizer baru secara default menggunakan Free Plan.
* Organizer dengan Free Plan hanya dapat memiliki maksimal 2 event aktif.
* Participant harus login sebelum membeli tiket.
* Wallet harus terhubung sebelum melakukan transaksi blockchain.
* Event harus dipublikasikan sebelum dapat dibeli.
* Tiket hanya dapat digunakan satu kali.
* Organizer hanya dapat mengelola event miliknya sendiri.
* Participant hanya dapat melihat tiket miliknya sendiri.

---

# 13. Error Scenarios

## Wallet belum terhubung

Aksi:

Tampilkan permintaan untuk menghubungkan MetaMask sebelum melanjutkan.

---

## Pembayaran dibatalkan

Aksi:

Tidak ada data yang disimpan.

---

## Transaksi gagal

Aksi:

Tampilkan pesan gagal.

Jangan menyimpan data sinkronisasi ke database.

---

## QR Code tidak valid

Aksi:

Tolak proses check-in.

---

## Tiket sudah digunakan

Aksi:

Tampilkan status "Ticket Already Used" dan tolak proses verifikasi.

---

# 14. Workflow Principles

Seluruh proses pada Tickify mengikuti prinsip berikut.

* Blockchain digunakan untuk memastikan kepemilikan dan validasi tiket.
* PostgreSQL digunakan untuk menyimpan data aplikasi.
* Frontend bertanggung jawab terhadap antarmuka pengguna dan interaksi Web3.
* Backend bertanggung jawab terhadap autentikasi, data aplikasi, dan sinkronisasi transaksi.
* Setiap perubahan status tiket harus selalu divalidasi melalui Smart Contract.
