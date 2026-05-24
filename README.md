# Xawak Bot — WhatsApp Business Bot

Bot conversacional para registro de proveedores turísticos vía WhatsApp Business API.

## ¿Qué hace?
- Recibe proveedores por WhatsApp y guarda su información automáticamente
- Flujo conversacional de 8 pasos (tipo de servicio, ubicación, tarifas, etc.)
- Guarda los datos en Supabase (PostgreSQL)
- Preparado para escalar a flujo B2C (clientes viajeros)

## Stack tecnológico
- **Node.js** + Express — servidor del bot
- **WhatsApp Business API** (Meta Cloud API) — canal de mensajería
- **Supabase** (PostgreSQL) — base de datos
- **Railway** — despliegue en producción *(próximamente)*

## Estructura del proyecto
src/
├── index.js              — servidor principal
├── handlers/
│   ├── mensajes.js       — lógica de conversación
│   └── whatsapp.js       — funciones de envío
├── flujos/
│   └── b2b.js            — flujo para proveedores
└── lib/
└── supabase.js       — conexión a base de datos
## Variables de entorno necesarias
Crea un archivo `.env` con estas variables:
WHATSAPP_TOKEN=
PHONE_NUMBER_ID=
VERIFY_TOKEN=
SUPABASE_URL=
SUPABASE_KEY=
PORT=3000
## Cómo correr localmente
```bash
npm install
npm run dev
```