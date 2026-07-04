# Task Management - Tickify

Dokumen ini berisi seluruh roadmap pengembangan proyek Tickify.

AI Agent hanya diperbolehkan mengerjakan task yang terdapat pada dokumen ini. Setiap task yang selesai harus diperbarui statusnya.

---

# Legend

* [ ] Belum dikerjakan
* [x] Selesai
* [~] Sedang dikerjakan
* [-] Ditunda

---

# Phase 1 — Project Foundation

## Project Setup

* [x] Inisialisasi React + Vite
* [x] Inisialisasi Express.js
* [x] Konfigurasi Tailwind CSS
* [x] Instalasi dependency frontend
* [x] Instalasi dependency backend
* [x] Setup Axios
* [x] Setup React Router
* [x] Setup Ethers.js
* [x] Setup Environment Variables
* [x] Konfigurasi Web3 Context
* [x] Membuat struktur folder frontend
* [x] Membuat struktur folder backend

---

## Documentation

* [x] README.md
* [x] PROJECT_RULES.md
* [x] AGENTS.md
* [x] WORKFLOW.md
* [x] DATABASE.md
* [x] API.md
* [x] TASKS.md

---

# Phase 2 — Database

## Database Setup

* [x] Membuat database PostgreSQL
* [x] Membuat koneksi database
* [x] Konfigurasi environment database

---

## Migration

* [x] Membuat tabel users
* [x] Membuat tabel events
* [x] Membuat tabel tickets

---

## Database Testing

* [x] Uji koneksi database
* [ ] Uji relasi tabel
* [ ] Uji operasi CRUD database

---

# Phase 3 — Authentication

## Backend

* [x] Register
* [x] Login
* [x] JWT Authentication
* [x] Middleware Authentication
* [x] Middleware Authorization
* [x] Update Wallet Address
* [x] Get Current User

---

## Frontend

* [ ] Register Page
* [ ] Login Page
* [ ] Protected Route
* [ ] Logout
* [ ] Connect Wallet
* [ ] Persist Login

---

# Phase 4 — Organizer Features

## Event Management

* [ ] Create Event
* [ ] Get Organizer Events
* [ ] Update Event
* [ ] Delete Event

---

## Dashboard

* [ ] Dashboard Organizer
* [ ] Event Statistics
* [ ] Participant List

---

## Verification

* [ ] Verify Ticket Page
* [ ] QR Scanner
* [ ] Sync Verification Result

---

# Phase 5 — Participant Features

## Event

* [ ] Landing Page
* [ ] Event List
* [ ] Event Detail

---

## Ticket Purchase

* [ ] Buy Ticket
* [ ] Transaction Confirmation
* [ ] Sync Transaction

---

## My Tickets

* [ ] Ticket List
* [ ] Ticket Detail
* [ ] QR Code Generator

---

## Profile

* [ ] Profile Page
* [ ] Edit Profile
* [ ] Wallet Information

---

# Phase 6 — Smart Contract

## Development

* [ ] Membuat Smart Contract Ticketing.sol
* [ ] Implementasi createTicket()
* [ ] Implementasi verifyTicket()
* [ ] Implementasi getTicket()

---

## Deployment

* [ ] Deploy ke Sepolia / Polygon Amoy
* [ ] Menyimpan Contract Address
* [ ] Export ABI

---

## Integration

* [ ] Integrasi Smart Contract ke Frontend
* [ ] Integrasi Smart Contract ke Backend
* [ ] Pengujian transaksi blockchain

---

# Phase 7 — REST API

## Authentication API

* [x] Register
* [x] Login
* [ ] Profile
* [ ] Update Wallet

---

## Event API

* [ ] Get Events
* [ ] Get Event Detail
* [ ] Create Event
* [ ] Update Event
* [ ] Delete Event
* [ ] Organizer Events

---

## Ticket API

* [ ] Sync Ticket
* [ ] Get My Tickets
* [ ] Get Ticket Detail

---

## Utility API

* [ ] Health Check

---

# Phase 8 — UI & UX

## Components

* [ ] Navbar
* [ ] Footer
* [ ] Sidebar
* [ ] Button
* [ ] Modal
* [ ] Loading Spinner
* [ ] Toast Notification

---

## Responsive Design

* [ ] Mobile
* [ ] Tablet
* [ ] Desktop

---

## User Experience

* [ ] Loading State
* [ ] Empty State
* [ ] Error State
* [ ] Success State

---

# Phase 9 — Testing

## Backend

* [ ] Authentication Testing
* [ ] API Testing
* [ ] Database Testing

---

## Frontend

* [ ] Navigation Testing
* [ ] Form Validation
* [ ] Wallet Connection
* [ ] Smart Contract Integration

---

## End-to-End

* [ ] Register → Login
* [ ] Create Event
* [ ] Buy Ticket
* [ ] View Ticket
* [ ] Verify Ticket

---

# Phase 10 — Finalization

## Performance

* [ ] Code Cleanup
* [ ] Remove Unused Code
* [ ] Optimize Components

---

## Documentation

* [ ] Perbarui seluruh dokumentasi
* [ ] Sinkronisasi API.md
* [ ] Sinkronisasi DATABASE.md
* [ ] Sinkronisasi WORKFLOW.md

---

## Deployment

* [ ] Deploy Frontend
* [ ] Deploy Backend
* [ ] Deploy Smart Contract

---

## Final Review

* [ ] Tidak ada error
* [ ] Tidak ada warning penting
* [ ] Build frontend berhasil
* [ ] Backend berjalan normal
* [ ] Seluruh fitur utama berfungsi

---

# Project Completion Checklist

Aplikasi dianggap selesai apabila seluruh fitur berikut telah berhasil diimplementasikan.

## Authentication

* [ ] Register
* [ ] Login
* [ ] JWT Authentication

---

## Organizer

* [ ] CRUD Event
* [ ] Dashboard
* [ ] Verify Ticket

---

## Participant

* [ ] Browse Event
* [ ] Buy Ticket
* [ ] My Tickets

---

## Blockchain

* [ ] Connect Wallet
* [ ] Smart Contract
* [ ] Ticket Ownership
* [ ] Ticket Verification

---

## Database

* [ ] Users
* [ ] Events
* [ ] Tickets

---

## REST API

* [ ] Authentication API
* [ ] Event API
* [ ] Ticket API

---

## Documentation

* [ ] Semua dokumentasi telah diperbarui
* [ ] TASKS.md telah diperbarui
* [ ] Seluruh fitur sesuai WORKFLOW.md
