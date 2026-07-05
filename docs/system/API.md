# REST API Contract - Tickify

Dokumen ini mendefinisikan seluruh endpoint REST API yang digunakan oleh aplikasi Tickify.

Seluruh endpoint menggunakan format JSON dan berada di bawah prefix:

```text
/api
```

Base URL (Development)

```text
http://localhost:5000/api
```

---

# Response Standard

## Success Response

```json
{
  "success": true,
  "data": {}
}
```

## Error Response

```json
{
  "success": false,
  "message": "Error message"
}
```

Semua endpoint wajib menggunakan format response yang konsisten.

---

# Authentication

## Register

**POST**

```text
/auth/register
```

Description

Mendaftarkan akun baru.

Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "participant"
}
```

---

## Login

**POST**

```text
/auth/login
```

Description

Login menggunakan email dan password.

Body

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response

```json
{
  "success": true,
  "data": {
    "token": "...",
    "user": {}
  }
}
```

---

## Get Current User

**GET**

```text
/auth/profile
```

Authentication Required

Description

Mengambil informasi akun yang sedang login.

---

# Subscription

## Get Current Subscription

**GET**

```text
/subscription
```

Authentication Required

Role

Organizer

Description

Mengambil informasi subscription organizer yang sedang login.

Response

```json
{
  "success": true,
  "data": {
    "plan": "free",
    "status": "active",
    "endDate": null
  }
}
```

---

## Upgrade Subscription

**PUT**

```text
/subscription/upgrade
```

Authentication Required

Role

Organizer

Description

Mengubah paket subscription organizer dari **Free** menjadi **Pro**.

Response

```json
{
  "success": true,
  "message": "Subscription upgraded successfully"
}
```

---

## Connect Wallet

**PUT**

```text
/auth/wallet
```

Authentication Required

Description

Menyimpan atau memperbarui wallet address pengguna.

Body

```json
{
  "walletAddress": "0x..."
}
```

---

# Events

## Get All Events

**GET**

```text
/events
```

Description

Mengambil seluruh event yang berstatus **published**.

---

## Get Event Detail

**GET**

```text
/events/:id
```

Description

Mengambil detail event berdasarkan ID.

---

## Create Event

**POST**

```text
/events
```

Authentication Required

Role

Organizer

Description

Membuat event baru.

---

## Update Event

**PUT**

```text
/events/:id
```

Authentication Required

Role

Organizer

Description

Mengubah informasi event.

---

## Delete Event

**DELETE**

```text
/events/:id
```

Authentication Required

Role

Organizer

Description

Menghapus event.

---

## Get Organizer Events

**GET**

```text
/organizer/events
```

Authentication Required

Role

Organizer

Description

Mengambil seluruh event milik organizer yang sedang login.

---

# Tickets

## Sync Ticket

**POST**

```text
/tickets/sync
```

Authentication Required

Description

Menyimpan hasil transaksi blockchain ke database setelah transaksi berhasil.

Body

```json
{
  "ticketIdOnChain": 1,
  "eventId": 10,
  "transactionHash": "0x..."
}
```

---

## Get My Tickets

**GET**

```text
/tickets/my
```

Authentication Required

Role

Participant

Description

Mengambil seluruh tiket milik participant yang sedang login.

---

## Get Ticket Detail

**GET**

```text
/tickets/:id
```

Authentication Required

Description

Mengambil detail tiket berdasarkan ID.

---

## Verify Ticket

**PUT**

```text
/tickets/verify
```

Authentication Required

Role

Organizer

Description

Mengubah status tiket menjadi **used** setelah berhasil diverifikasi di blockchain.

Body

```json
{
  "ticketIdOnChain": 1
}
```

---

# Health Check

## Server Status

**GET**

```text
/health
```

Description

Digunakan untuk memastikan backend berjalan dengan baik.

Response

```json
{
  "success": true,
  "message": "Server is running"
}
```

---

# Statistics

## Get Platform Statistics

**GET**

```text
/statistics
```

Description

Mengambil statistik platform untuk landing page.

Response

```json
{
  "success": true,
  "data": {
    "activeEvents": 5,
    "ticketsAvailable": 250,
    "platformStatus": "Active"
  }
}
```

---

# Authentication Rules

Endpoint berikut memerlukan JWT:

* GET /auth/profile
* PUT /auth/wallet
* GET /subscription
* PUT /subscription/upgrade
* POST /events
* PUT /events/:id
* DELETE /events/:id
* GET /organizer/events
* POST /tickets/sync
* GET /tickets/my
* GET /tickets/:id
* PUT /tickets/verify

---

# Role Authorization

## Organizer

Dapat mengakses:

* View Subscription
* Upgrade Subscription
* Create Event
* Update Event
* Delete Event
* Organizer Dashboard
* Verify Ticket

---

## Participant

Dapat mengakses:

* Browse Event
* Buy Ticket
* My Tickets

---

# Validation Rules

## Register

* Semua field wajib diisi.
* Email harus unik.
* Password minimal 8 karakter.
* Role hanya boleh:

  * organizer
  * participant

---

## Create Event

* Judul wajib diisi.
* Lokasi wajib diisi.
* Tanggal event wajib diisi.
* Harga tiket harus lebih dari 0.
* Kuota minimal 1.

---

## Sync Ticket

* Transaction Hash wajib ada.
* Ticket ID Blockchain wajib ada.
* Event harus valid.
* User harus login.

---

## Verify Ticket

Backend hanya boleh mengubah status tiket apabila:

* Smart Contract menyatakan tiket valid.
* Tiket belum pernah digunakan.
* Organizer memiliki hak untuk memverifikasi tiket pada event tersebut.

---

# API Development Notes

* Semua endpoint menggunakan format JSON.
* Seluruh endpoint baru harus ditambahkan ke dokumen ini.
* Hindari breaking changes pada endpoint yang sudah digunakan frontend.
* Gunakan HTTP status code yang sesuai (200, 201, 400, 401, 403, 404, 500).
* Seluruh endpoint privat wajib menggunakan middleware authentication.
