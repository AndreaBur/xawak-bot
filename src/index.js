//Archivo para dar el flujo de respueta del negocio (XAWAK) como tal
//Toma en cuenta el archivo mensajes.js para dar respuesta

import express from 'express'
import 'dotenv/config'
import { procesarMensaje } from './handlers/mensajes.js'

const app = express()
app.use(express.json())

app.get('/webhook', (req, res) => {
  const mode      = req.query['hub.mode']
  const token     = req.query['hub.verify_token']
  const challenge = req.query['hub.challenge']

  if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
    console.log('✅ Webhook verificado')
    res.status(200).send(challenge)
  } else {
    res.sendStatus(403)
  }
})

app.post('/webhook', async (req, res) => {
  res.sendStatus(200)

  const mensajes = req.body?.entry?.[0]
    ?.changes?.[0]?.value?.messages

  if (!mensajes || mensajes.length === 0) return

  for (const mensaje of mensajes) {
    await procesarMensaje(mensaje)
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`🤖 Bot corriendo en puerto ${PORT}`)
})



// archivo para responder manualmente los mensajes sin bot 
//no tiene en cuenta el archivo whatsapp.js
/**import express from 'express'
import 'dotenv/config'

const app = express()
app.use(express.json())

// Meta verifica que la URL es tuya (ocurre una sola vez)
app.get('/webhook', (req, res) => {
  const mode      = req.query['hub.mode']
  const token     = req.query['hub.verify_token']
  const challenge = req.query['hub.challenge']

  if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
    console.log('✅ Webhook verificado')
    res.status(200).send(challenge)
  } else {
    res.sendStatus(403)
  }
})

// Recibe los mensajes entrantes de WhatsApp
app.post('/webhook', async (req, res) => {
  res.sendStatus(200) // responde inmediato a Meta

  const mensajes = req.body?.entry?.[0]
    ?.changes?.[0]?.value?.messages

  if (!mensajes || mensajes.length === 0) return

  for (const mensaje of mensajes) {
    const texto    = mensaje.text?.body
    const telefono = mensaje.from
    console.log(`📱 Mensaje de ${telefono}: ${texto}`)
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`🤖 Bot corriendo en puerto ${PORT}`)
})**/

// archivo para que el bot responda los mensajes 
// toma en cuenta el archivo whatsapp.js para responder los mnsjs
/**
import express from 'express'
import 'dotenv/config'
import { enviarTexto } from './handlers/whatsapp.js'

const app = express()
app.use(express.json())

app.get('/webhook', (req, res) => {
  const mode      = req.query['hub.mode']
  const token     = req.query['hub.verify_token']
  const challenge = req.query['hub.challenge']

  if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
    console.log('✅ Webhook verificado')
    res.status(200).send(challenge)
  } else {
    res.sendStatus(403)
  }
})

app.post('/webhook', async (req, res) => {
  res.sendStatus(200)

  const mensajes = req.body?.entry?.[0]
    ?.changes?.[0]?.value?.messages

  if (!mensajes || mensajes.length === 0) return

  for (const mensaje of mensajes) {
    const texto    = mensaje.text?.body
    const telefono = mensaje.from
    console.log(`📱 Mensaje de ${telefono}: ${texto}`)

    await enviarTexto(telefono, `Recibí tu mensaje: "${texto}" ✅`)
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`🤖 Bot corriendo en puerto ${PORT}`)
}) **/
