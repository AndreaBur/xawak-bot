# Xawak AI Tourism Platform 🌎

> AI-powered tourism platform integrating WhatsApp chatbot, 
> Supabase and scalable web services for provider onboarding 
> and customer experiences.

![Status](https://img.shields.io/badge/status-active-brightgreen)
![Stack](https://img.shields.io/badge/stack-Node.js%20%7C%20Supabase%20%7C%20WhatsApp%20API-blue)
![Sprint](https://img.shields.io/badge/sprint-1%20completado-orange)

---

## Overview

Xawak is a real tourism agency. This platform automates two 
core processes:

1. **Provider onboarding** — tourism providers register via 
   WhatsApp chatbot (hotels, tours, transport, restaurants)
2. **Customer experience** — travelers receive AI-generated 
   trip proposals built from the provider catalog *(coming soon)*

---

## Architecture
WhatsApp Business API
↓
Node.js Bot (Express)
↓
Supabase (PostgreSQL)
↑
Lovable Web Panel (admin)

---

## Tech Stack

| Layer       | Technology              |
|-------------|-------------------------|
| Chatbot     | Node.js + Express       |
| Messaging   | WhatsApp Business API   |
| Database    | Supabase (PostgreSQL)   |
| Frontend    | Lovable + React         |
| Deployment  | Railway                 |
| AI          | OpenAI (coming soon)    |

---

## Sprint Roadmap

| Sprint | Goal                              | Status        |
|--------|-----------------------------------|---------------|
| 1      | B2B bot + Supabase database       | ✅ Completado  |
| 2      | Railway deploy + Admin panel      | 🔨 En progreso |
| 3      | AI over provider catalog          | ⬜ Pendiente   |
| 4      | B2C customer flow                 | ⬜ Pendiente   |

---

## Local Setup

```bash
git clone https://github.com/AndreaBur/xawak-bot.git
cd xawak-bot
npm install
cp .env.example .env   # fill in your credentials
npm run dev
```

---

## Environment Variables

WHATSAPP_TOKEN=
PHONE_NUMBER_ID=
VERIFY_TOKEN=
SUPABASE_URL=
SUPABASE_KEY=
PORT=3000

---

## Author

**Andrea Burbano**  
Building real software for real businesses.  
[GitHub](https://github.com/AndreaBur)
