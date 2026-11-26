<div align="center">

# 💬 Chat-YO
### Ephemeral Real-Time WebSocket Communication Platform

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge" alt="License" /></a>
  <img src="https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/WebSockets-ws-blue?style=for-the-badge&logo=websocket&logoColor=white" alt="WebSockets" />
  <img src="https://img.shields.io/badge/React-Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
</p>

```
  Anonymous, zero-persistence messaging channels featuring real-time
  bidirectional WebSocket transmission and automated Time-To-Clear (TTC) deletion.
```

---

</div>

## 📑 Table of Contents

- [Overview](#-overview)
- [Protocol & Lifecycle](#-protocol--lifecycle)
- [Key Features](#-key-features)
- [Quick Start](#-quick-start)
- [Security & Privacy Audit](#-security--privacy-audit)
- [License](#-license)

---

## 🌟 Overview

**Chat-YO** is designed for privacy-centric, instantaneous group communications. Operating strictly in memory, messages are transmitted over secure WebSocket connections and purged automatically upon room expiration or timer-triggered Time-To-Clear (TTC) thresholds.

---

## 🔄 Protocol & Lifecycle

```
Client A                            Server (Memory Buffer)                     Client B
   │                                           │                                   │
   ├────────── WS Connect (Handshake) ────────►│                                   │
   │                                           │◄──────── WS Connect (Handshake) ──┤
   │                                           │                                   │
   ├────────── Send Message Payload ──────────►│                                   │
   │                                           ├──────── Broadcast Payload ───────►│
   │                                           │                                   │
   │                                  [ TTC Timer Fires ]                          │
   │                                           │                                   │
   │                                   (Purge Buffer)                              │
   │                                           │                                   │
```

---

## ⚡ Key Features

* **Zero Persistent Storage:** No databases or disk logs. Messages reside exclusively in volatile server RAM until delivered or cleared.
* **Automated TTC Eviction:** Rooms and message history automatically dissolve after designated periods of inactivity.
* **Full-Stack TypeScript:** End-to-end type safety across client payloads, server handlers, and socket schemas.

---

## 💻 Quick Start

### 1. Server Setup
```bash
cd server
npm install
npm run dev
```

### 2. Client Setup
```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173` to join a room.

---

## 🛡️ Security & Privacy Audit

1. **Origin Verification on Handshake:** Validate the `Origin` header during WebSocket upgrade requests to stop Cross-Site WebSocket Hijacking (CSWSH).
2. **Input Sanitization & DOMPurify:** Sanitize all incoming chat messages on the client side before DOM insertion to prevent Stored / DOM-based XSS attacks.
3. **Connection Rate Limiting:** Enforce per-IP connection limits to mitigate socket exhaustion attacks.

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.
