# Database Schema - Tickify

Dokumen ini mendefinisikan struktur database PostgreSQL yang digunakan pada aplikasi **Tickify**.

Database hanya digunakan untuk menyimpan data **Off-Chain**, sedangkan data kepemilikan tiket dan validasi disimpan pada Blockchain melalui Smart Contract.

---

# Database Overview

Database : PostgreSQL

Relasi utama:

```text
Users (Organizer)
        │
        │ 1:N
        ▼
     Events
        │
        │ 1:N
        ▼
 Tickets (Sync)
        ▲
        │
        │ N:1
Users (Participant)
```

---

# Table : users

Menyimpan seluruh akun pengguna.

| Column                | Type         | Constraint            | Description                                             |
| --------------------- | ------------ | --------------------- | ------------------------------------------------------- |
| id                    | SERIAL       | PRIMARY KEY           | User ID                                                 |
| name                  | VARCHAR(255) | NOT NULL              | Nama pengguna                                           |
| email                 | VARCHAR(255) | UNIQUE, NOT NULL      | Email pengguna                                          |
| password              | VARCHAR(255) | NOT NULL              | Password yang telah di-hash                             |
| role                  | VARCHAR(20)  | NOT NULL              | organizer / participant                                 |
| wallet_address        | VARCHAR(255) | UNIQUE                | Alamat MetaMask                                         |
| subscription_plan     | VARCHAR(20)  | DEFAULT 'free'        | Paket langganan (free / pro) untuk organizer            |
| subscription_status   | VARCHAR(20)  | DEFAULT 'active'      | Status langganan (active / expired / cancelled)         |
| subscription_end_date | TIMESTAMP    | NULL                  | Tanggal berakhir langganan (NULL untuk Free Plan)       |
| created_at            | TIMESTAMP    | DEFAULT NOW()         | Waktu dibuat                                            |
| updated_at            | TIMESTAMP    | DEFAULT NOW()         | Waktu diperbarui                                        |

**Catatan**

 - Fitur subscription hanya berlaku untuk **Organizer**.
 - User dengan role **Participant** tidak menggunakan subscription sehingga kolom subscription diabaikan.
 - Organizer baru secara default memiliki `subscription_plan = 'free'`.
 - Free Plan dibatasi maksimal **2 event aktif**, sedangkan Pro Plan tidak memiliki batasan jumlah event.

---

# Table : categories

Menyimpan kategori-kategori event.

| Column | Type         | Constraint        | Description             |
| ------ | ------------ | ----------------- | ----------------------- |
| id     | SERIAL       | PRIMARY KEY       | Category ID             |
| name   | VARCHAR(255) | UNIQUE, NOT NULL  | Nama kategori           |
| slug   | VARCHAR(255) | UNIQUE, NOT NULL  | Slug URL kategori       |

---

# Table : events

Menyimpan seluruh event.

| Column       | Type         | Constraint      | Description                |
| ------------ | ------------ | --------------- | -------------------------- |
| id           | SERIAL       | PRIMARY KEY     | Event ID                   |
| organizer_id | INTEGER      | FK → users(id)  | Pemilik event              |
| title        | VARCHAR(255) | NOT NULL        | Nama event                 |
| description  | TEXT         |                 | Deskripsi event            |
| location     | VARCHAR(255) | NOT NULL        | Lokasi event               |
| event_date   | TIMESTAMP    | NOT NULL        | Jadwal event               |
| banner_url   | TEXT         |                 | URL banner                 |
| price_eth    | VARCHAR(50)  | NOT NULL        | Harga tiket dalam ETH      |
| quota        | INTEGER      | NOT NULL        | Jumlah tiket               |
| tickets_sold | INTEGER      | DEFAULT 0       | Tiket yang telah terjual   |
| status       | VARCHAR(20)  | DEFAULT 'draft' | draft / published / closed |
| category_id  | INTEGER      | FK → categories(id) | Kategori terkait       |
| created_at   | TIMESTAMP    | DEFAULT NOW()   | Waktu dibuat               |
| updated_at   | TIMESTAMP    | DEFAULT NOW()   | Waktu diperbarui           |

---

# Table : tickets

Tabel sinkronisasi data tiket dari blockchain.

Blockchain tetap menjadi sumber utama kepemilikan tiket.

| Column            | Type         | Constraint       | Description                   |
| ----------------- | ------------ | ---------------- | ----------------------------- |
| id                | SERIAL       | PRIMARY KEY      | Internal ID                   |
| ticket_id_onchain | BIGINT       | UNIQUE           | Ticket ID dari Smart Contract |
| event_id          | INTEGER      | FK → events(id)  | Event terkait                 |
| participant_id    | INTEGER      | FK → users(id)   | Pemilik tiket                 |
| owner_wallet      | VARCHAR(255) | NOT NULL         | Wallet pemilik                |
| transaction_hash  | VARCHAR(255) | UNIQUE           | Hash transaksi blockchain     |
| status            | VARCHAR(20)  | DEFAULT 'active' | active / used                 |
| used_at           | TIMESTAMP    | NULL             | Waktu check-in                |
| verified_by       | INTEGER      | FK → users(id)   | Organizer yang memverifikasi  |
| created_at        | TIMESTAMP    | DEFAULT NOW()    | Waktu dibuat                  |

---

# Entity Relationships

## users → events

Satu organizer dapat memiliki banyak event.

```text
User (Organizer)

1 -------- N

Events
```

---

## users → tickets

Satu participant dapat memiliki banyak tiket.

```text
User (Participant)

1 -------- N

Tickets
```

---

## events → tickets

Satu event memiliki banyak tiket.

```text
Events

1 -------- N

Tickets
```

---

# Data Responsibility

## PostgreSQL (Off-Chain)

Menyimpan:

* User
* Event
* Banner
* Lokasi
* Deskripsi
* Jadwal
* Riwayat sinkronisasi tiket
* Transaction Hash

---

## Blockchain (On-Chain)

Menyimpan:

* Ticket ID
* Owner Wallet
* Ticket Status
* Ownership

Blockchain menjadi sumber kebenaran (Source of Truth) terhadap kepemilikan tiket.

---

# Constraints

## users

* Email harus unik.
* Wallet Address harus unik.
* Role hanya boleh:

  * organizer
  * participant

---

## events

* Organizer harus ada pada tabel users.
* Harga tiket tidak boleh negatif.
* Kuota minimal 1.
* Status hanya boleh:

  * draft
  * published
  * closed

---

## tickets

* Ticket ID Blockchain harus unik.
* Transaction Hash harus unik.
* Participant harus terdaftar.
* Event harus tersedia.
* Status hanya boleh:

  * active
  * used

---

# Index Recommendation

Untuk meningkatkan performa query, gunakan index pada kolom berikut.

| Table   | Column            |
| ------- | ----------------- |
| users   | email             |
| users   | wallet_address    |
| events  | organizer_id      |
| events  | event_date        |
| events  | status            |
| tickets | participant_id    |
| tickets | event_id          |
| tickets | ticket_id_onchain |
| tickets | transaction_hash  |

---

# Data Lifecycle

## User

Register

↓

Login

↓

Connect Wallet

↓

Buy Ticket

---

## Event

Draft

↓

Published

↓

Closed

---

## Ticket

Created (Blockchain)

↓

Synced to Database

↓

Active

↓

Verified

↓

Used

---

# Notes

* Database hanya menyimpan data yang dibutuhkan oleh aplikasi.
* Seluruh data kepemilikan tiket tetap mengacu pada Smart Contract.
* Jangan mengubah struktur tabel tanpa memperbarui dokumen ini.
* Semua migration, model, dan query SQL harus mengikuti spesifikasi pada dokumen ini.
