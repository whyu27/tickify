# Project Rules - Tickify

Dokumen ini berisi aturan pengembangan yang wajib dipatuhi selama proses pembangunan aplikasi **Tickify**.

Seluruh developer maupun AI Agent harus mengikuti aturan pada dokumen ini untuk menjaga konsistensi arsitektur, kualitas kode, dan maintainability proyek.

---

# 1. Technology Stack

Project ini menggunakan teknologi berikut dan **tidak boleh diganti tanpa persetujuan**.

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
* PostgreSQL (pg)
* JWT
* bcryptjs
* dotenv
* cors

## Blockchain

* Solidity
* MetaMask
* Ethereum Sepolia Testnet atau Polygon Amoy Testnet

---

# 2. Project Structure

Project menggunakan arsitektur terpisah antara frontend dan backend.

```text
tickify/
│
├── frontend/
├── backend/
└── docs/
```

Aturan:

* Semua kode React berada di folder `frontend`.
* Semua kode Express berada di folder `backend`.
* Dokumentasi proyek berada di folder `docs`.
* Jangan membuat folder baru di root tanpa alasan yang jelas.

---

# 3. Coding Standards

## JavaScript

* Gunakan JavaScript ES6+.
* Gunakan `const` secara default.
* Gunakan `let` hanya jika nilai akan berubah.
* Hindari penggunaan `var`.

---

## React

* Gunakan Functional Component.
* Gunakan React Hooks.
* Jangan menggunakan Class Component.
* Gunakan React Context untuk global state.
* Hindari prop drilling jika dapat menggunakan Context.

---

## Styling

* Gunakan Tailwind CSS.
* Jangan menggunakan inline CSS kecuali benar-benar diperlukan.
* Jangan menggunakan CSS Framework lain seperti Bootstrap, Material UI, atau Chakra UI.

---

## Backend

* Gunakan Express Router.
* Pisahkan Route, Controller, dan Service.
* Jangan menulis query database langsung di file route.
* Gunakan middleware untuk Authentication dan Authorization.

---

# 4. Naming Convention

## Folder

Gunakan:

```text
kebab-case
```

Contoh:

```text
event-detail
```

---

## React Component

Gunakan:

```text
PascalCase
```

Contoh:

```text
LandingPage.jsx

Navbar.jsx

EventCard.jsx
```

---

## JavaScript File

Gunakan:

```text
camelCase
```

Contoh:

```text
authController.js

eventService.js

ticketRoutes.js
```

---

## Variable

Gunakan:

```javascript
camelCase
```

Contoh:

```javascript
const ticketPrice
const organizerId
const walletAddress
```

---

# 5. API Rules

* Semua endpoint menggunakan prefix:

```text
/api
```

Contoh:

```text
/api/auth/login
```

* Response API harus konsisten.

Response sukses

```json
{
  "success": true,
  "data": {}
}
```

Response gagal

```json
{
  "success": false,
  "message": "Error message"
}
```

* Seluruh endpoint baru wajib didokumentasikan pada `docs/API.md`.

---

# 6. Database Rules

* PostgreSQL sebagai database utama.
* Jangan mengubah struktur tabel tanpa memperbarui `docs/DATABASE.md`.
* Gunakan Foreign Key untuk menjaga integritas data.
* Hindari penyimpanan data yang redundan.

---

# 7. Blockchain Rules

* Gunakan Ethers.js v6.
* Gunakan MetaMask sebagai wallet.
* Gunakan Smart Contract Solidity.
* Jangan menyimpan Private Key di repository.
* Gunakan Environment Variable untuk seluruh konfigurasi blockchain.
* Jangan melakukan hardcode Contract Address atau RPC URL.

---

# 8. State Management

Seluruh state Web3 harus dikelola menggunakan:

```text
Web3Context.jsx
```

Meliputi:

* provider
* signer
* wallet
* account
* chainId
* connection status

Jangan membuat state wallet baru di komponen lain.

---

# 9. Error Handling

Frontend maupun backend wajib menggunakan:

```javascript
try {
   ...
} catch (error) {
   ...
}
```

Aturan:

* Berikan pesan error yang jelas.
* Jangan menampilkan stack trace kepada pengguna.
* Seluruh error harus ditangani dengan baik.

---

# 10. Security Rules

* Password wajib di-hash menggunakan bcrypt.
* Authentication menggunakan JWT.
* Endpoint privat wajib menggunakan middleware authentication.
* Role Organizer dan Participant harus divalidasi sebelum mengakses endpoint tertentu.
* Jangan menyimpan data sensitif di frontend.

---

# 11. Documentation Rules

Setiap perubahan harus memperbarui dokumentasi yang relevan.

| Perubahan        | Dokumen yang Harus Diperbarui |
| ---------------- | ----------------------------- |
| API baru         | API.md                        |
| Database berubah | DATABASE.md                   |
| Workflow berubah | WORKFLOW.md                   |
| Aturan baru      | PROJECT_RULES.md              |
| Task selesai     | TASKS.md                      |

---

# 12. Development Principles

Selama pengembangan:

* Fokus pada fitur inti terlebih dahulu.
* Hindari overengineering.
* Gunakan reusable component.
* Tulis kode yang mudah dibaca.
* Utamakan maintainability dibanding kompleksitas.

---

# 13. Prohibited Actions

Hal-hal berikut **tidak diperbolehkan** tanpa persetujuan:

* Mengubah struktur folder utama.
* Mengganti stack teknologi.
* Menghapus dokumentasi proyek.
* Menambahkan dependency besar yang tidak diperlukan.
* Hardcode API URL, RPC URL, Contract Address, atau Private Key.
* Membuat fitur di luar ruang lingkup proyek tanpa persetujuan.

---

# 14. Definition of Done

Sebuah task dianggap selesai apabila:

* Kode berhasil dijalankan tanpa error.
* Tidak terdapat error pada console.
* Build frontend berhasil.
* Backend dapat dijalankan.
* Endpoint dapat diuji.
* Dokumentasi terkait telah diperbarui.
* TASKS.md telah diperbarui apabila task selesai.
* Kode mengikuti seluruh aturan pada dokumen ini.

---

# 15. Project Philosophy

Tickify dikembangkan dengan prinsip:

* Clean Code
* Modular Architecture
* Reusability
* Maintainability
* Security
* Simplicity First

Fokus utama proyek adalah menghasilkan aplikasi SaaS berbasis Web3 yang stabil, mudah dipahami, dan realistis untuk dikembangkan sebagai proyek UAS.
