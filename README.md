<div align="center">

# 🎟️ Tickify

### Blockchain-Based Event Ticketing Platform

Secure • Transparent • Decentralized • NFT Powered

A modern SaaS event ticketing platform that leverages **Blockchain**, **NFT**, and **Smart Contracts** to provide secure digital tickets with transparent ownership verification.

[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-blue?logo=postgresql)](https://supabase.com/)
[![Solidity](https://img.shields.io/badge/Solidity-Blockchain-363636?logo=solidity)](https://soliditylang.org/)
[![Ethereum](https://img.shields.io/badge/Ethereum-Sepolia-627EEA?logo=ethereum)](https://ethereum.org/)
[![License](https://img.shields.io/badge/License-MIT-success)]()

</div>

---

# 🌐 Live Demo

| Service | URL |
|---------|-----|
| 🎨 Frontend | https://tickify-pi.vercel.app |
| ⚙️ Backend API | https://tickify-backend-6i23.onrender.com |

---

# 📖 About

Tickify is a **Software-as-a-Service (SaaS)** blockchain event ticketing platform that enables organizers to create and manage events while allowing participants to purchase **NFT-based tickets** securely through MetaMask.

Instead of traditional QR-code-only tickets, every purchased ticket is minted as an NFT on the **Ethereum Sepolia Testnet**, making ticket ownership transparent, verifiable, and difficult to counterfeit.

---

# ✨ Key Features

## 👨‍💼 Organizer

- Secure Authentication
- Connect MetaMask Wallet
- Dashboard & Analytics
- Create Event
- Edit Event
- Delete Event
- Upload Banner via Cloudinary
- QR Code Ticket Validation
- Subscription Management
- Free & Pro Plan

---

## 🎫 Participant

- Register & Login
- Connect MetaMask Wallet
- Browse Events
- View Event Details
- Purchase NFT Ticket
- View Owned Tickets
- QR Ticket
- Blockchain Ownership Verification

---

## ⛓ Blockchain Features

- Smart Contract (Solidity)
- NFT Ticket Minting
- Ethereum Sepolia Network
- MetaMask Integration
- On-chain Ownership Verification

---

# 💎 SaaS Subscription

Tickify also implements a simple SaaS subscription model.

| Plan | Features |
|------|----------|
| Free | Maximum 2 Events |
| Pro | Unlimited Events |

---

# 🚀 Tech Stack

## Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios
- Ethers.js

---

## Backend

- Node.js
- Express.js
- JWT Authentication
- bcrypt

---

## Database

- PostgreSQL
- Supabase

---

## Blockchain

- Solidity
- Hardhat
- OpenZeppelin
- Ethereum Sepolia

---

## Cloud Storage

- Cloudinary

---

## Deployment

- Vercel
- Render

---

# 🏗 System Architecture

```text
                    ┌──────────────┐
                    │  Organizer   │
                    └──────┬───────┘
                           │
                    Create Event
                           │
                           ▼
                 Upload Event Banner
                    (Cloudinary)
                           │
                           ▼
                 PostgreSQL Database
                     (Supabase)
                           │
────────────────────────────────────────────────
                           │
                           ▼
                    Participant
                           │
                 Connect MetaMask
                           │
                           ▼
                    Purchase Ticket
                           │
                           ▼
                 Smart Contract (Solidity)
                           │
                           ▼
                 NFT Minted (Ethereum)
                           │
                           ▼
                      My Tickets
                           │
                           ▼
                   QR Code Validation
```

---

# 📂 Project Structure

```text
tickify
│
├── frontend/
│   ├── src/
│   └── public/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── middleware/
│   └── config/
│
├── blockchain/
│   ├── contracts/
│   ├── scripts/
│   └── artifacts/
│
└── docs/
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/whyu27/tickify.git
cd tickify
```

---

## Backend

```bash
cd backend
npm install
```

Create `.env`

```env
DATABASE_URL=

JWT_SECRET=

RPC_URL=

PRIVATE_KEY=

CONTRACT_ADDRESS=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=
```

Run backend

```bash
npm run dev
```

---

## Frontend

```bash
cd frontend
npm install
```

Create `.env`

```env
VITE_API_URL=http://localhost:5000/api
```

Run frontend

```bash
npm run dev
```

---

## Smart Contract

Compile

```bash
npx hardhat compile
```

Deploy

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

# 🔄 Workflow

```text
Organizer
      │
      ▼
Create Event
      │
      ▼
Cloudinary Upload
      │
      ▼
Supabase Database
      │
      ▼
Participant
      │
      ▼
Connect MetaMask
      │
      ▼
Buy Ticket
      │
      ▼
Mint NFT
      │
      ▼
Ethereum Sepolia
      │
      ▼
My Tickets
      │
      ▼
QR Validation
```

---

# 🌟 Future Improvements

- Email Notification
- NFT Transfer
- Event Analytics Dashboard
- Multi-chain Support
- Crypto Payment Gateway
- Mobile Application
- Admin Dashboard

---

# 👨‍💻 Developer

**Khilmi Wahyu Saputra**

Informatics Student  
Universitas Mercu Buana Yogyakarta

GitHub

https://github.com/whyu27

---

<div align="center">

### ⭐ If you like this project, don't forget to give it a star!

Made with ❤️ using React, Express, PostgreSQL, Solidity, and Ethereum.

</div>
