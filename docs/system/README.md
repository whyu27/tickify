# Tickify - Blockchain Ticketing SaaS 🎟️

Tickify adalah platform **Software as a Service (SaaS)** berbasis **Web3** yang memungkinkan organizer membuat dan mengelola event, serta peserta membeli dan memverifikasi tiket menggunakan teknologi blockchain.

Proyek ini dikembangkan sebagai **Tugas UAS Pemrograman Web** dengan tujuan mengimplementasikan konsep SaaS, REST API, React, Express, PostgreSQL, dan Blockchain dalam sebuah aplikasi yang nyata dan terintegrasi.

---

# Project Goals

* Membangun aplikasi ticketing berbasis SaaS.
* Mengimplementasikan teknologi Web3 menggunakan MetaMask dan Smart Contract.
* Mencegah pemalsuan tiket melalui validasi blockchain.
* Menerapkan arsitektur frontend dan backend yang terpisah (Monorepo).
* Menghasilkan aplikasi yang modular, scalable, dan mudah dikembangkan.

---

# Main Features

## Organizer

* Register & Login
* Connect MetaMask Wallet
* Create Event
* Manage Event
* View Participants
* Verify Ticket (QR Code)

## Participant

* Register & Login
* Connect MetaMask Wallet
* Browse Events
* View Event Details
* Purchase Ticket using ETH Testnet
* View My Tickets
* Display QR Code Ticket

## Blockchain

* Wallet Connection
* Smart Contract Integration
* On-chain Ticket Ownership
* Ticket Verification
* Prevent Ticket Reuse

---

# Technology Stack

## Frontend

* React.js
* Vite
* Tailwind CSS
* React Router DOM
* Axios
* Ethers.js v6
* Lucide React

## Backend

* Node.js
* Express.js
* PostgreSQL
* pg
* JWT Authentication
* bcryptjs
* dotenv
* cors

## Blockchain

* Solidity
* Ethers.js
* MetaMask
* Ethereum Sepolia Testnet (atau Polygon Amoy Testnet)

---

# Project Structure

```text
tickify/
│
├── frontend/          # React Application
├── backend/           # Express REST API
├── docs/              # Project Documentation
│
├── .gitignore
└── README.md
```

---

# Documentation

Seluruh dokumentasi proyek disimpan pada folder **docs/**.

| File             | Description                          |
| ---------------- | ------------------------------------ |
| README.md        | Gambaran umum proyek                 |
| PROJECT_RULES.md | Aturan pengembangan proyek           |
| AGENTS.md        | Instruksi dan aturan untuk AI Agent  |
| WORKFLOW.md      | Alur bisnis aplikasi                 |
| DATABASE.md      | Skema database                       |
| API.md           | Dokumentasi REST API                 |
| TASKS.md         | Roadmap dan daftar tugas             |

---

# Architecture Overview

```text
                React Frontend
                      │
                      │ Axios
                      ▼
              Express REST API
                 │          │
                 │          │
                 ▼          ▼
          PostgreSQL     Blockchain
                             │
                             ▼
                     Smart Contract
```

Frontend bertanggung jawab terhadap antarmuka pengguna dan interaksi Web3.

Backend menangani autentikasi, data aplikasi, serta komunikasi dengan database.

Blockchain digunakan sebagai sumber kebenaran (source of truth) untuk kepemilikan dan validasi tiket.

---

# Prerequisites

Pastikan perangkat telah memiliki:

* Node.js (v20 atau lebih baru)
* npm
* PostgreSQL
* Git
* MetaMask Browser Extension

---

# Installation

## 1. Clone Repository

```bash
git clone <repository-url>
cd tickify
```

---

## 2. Backend

```bash
cd backend

npm install

npm run dev
```

---

## 3. Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# Environment Variables

Backend (`backend/.env`)

```env
PORT=
DATABASE_URL=
JWT_SECRET=
RPC_URL=
PRIVATE_KEY=
```

Frontend (`frontend/.env`)

```env
VITE_API_URL=
VITE_CONTRACT_ADDRESS=
```

---

# Development Workflow

Pengembangan proyek mengikuti tahapan berikut:

1. Setup Project
2. Database
3. Authentication
4. CRUD Event
5. Smart Contract
6. Web3 Integration
7. Ticket Purchase
8. Ticket Verification
9. Testing
10. Deployment

Detail roadmap dapat dilihat pada **docs/TASKS.md**.

---

# Current Status

🚧 **Under Development**

Tickify masih dalam tahap pengembangan aktif.

---

# Academic Purpose

Proyek ini dibuat untuk memenuhi tugas **UAS Pemrograman Web** serta sebagai media pembelajaran mengenai:

* Software as a Service (SaaS)
* Web Development
* REST API
* React
* Express
* PostgreSQL
* Blockchain
* Smart Contract
* Web3 Integration

---

# License

This project is developed for educational purposes only.