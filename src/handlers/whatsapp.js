import axios from 'axios'
import 'dotenv/config'

const URL = `https://graph.facebook.com/v20.0/${process.env.PHONE_NUMBER_ID}/messages`
const HEADERS = { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}` }


export async function enviarTexto(telefono, texto) {
  try {
    await axios.post(URL, {
      messaging_product: 'whatsapp',
      to: telefono,
      type: 'text',
      text: { body: texto }
    }, { headers: HEADERS })
  } catch (error) {
    console.error('Error detallado:', JSON.stringify(error.response?.data, null, 2))
  }
}


export async function enviarBotones(telefono, titulo, cuerpo, botones) {
  try {
    await axios.post(URL, {
      messaging_product: 'whatsapp',
      to: telefono,
      type: 'interactive',
      interactive: {
        type: 'button',
        header: { type: 'text', text: titulo },
        body:   { text: cuerpo },
        action: {
          buttons: botones.map((b, i) => ({
            type: 'reply',
            reply: { id: `btn_${i}`, title: b }
          }))
        }
      }
    }, { headers: HEADERS })
  } catch (error) {
    console.error('Error botones:', JSON.stringify(error.response?.data, null, 2))
  }
}

export async function enviarLista(telefono, cuerpo, btnTexto, opciones) {
  try {
    await axios.post(URL, {
      messaging_product: 'whatsapp',
      to: telefono,
      type: 'interactive',
      interactive: {
        type: 'list',
        body: { text: cuerpo },
        action: {
          button: btnTexto,
          sections: [{
            title: 'Opciones',
            rows: opciones.map((o, i) => ({
              id: `op_${i}`,
              title: o.titulo,
              description: o.desc || ''
            }))
          }]
        }
      }
    }, { headers: HEADERS })
  } catch (error) {
    console.error('Error lista:', JSON.stringify(error.response?.data, null, 2))
  }
}