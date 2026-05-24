import { supabase } from '../lib/supabase.js'
import { enviarTexto, enviarBotones, enviarLista } from './whatsapp.js'

export async function procesarMensaje(mensaje) {

  const telefono = mensaje.from
  const texto    = mensaje.text?.body?.toLowerCase().trim() || ''
  const btnId    = mensaje.interactive?.button_reply?.id    || ''
  const listaId  = mensaje.interactive?.list_reply?.id      || ''
  const respuesta = texto || btnId || listaId

  console.log('📨 Datos recibidos:', { telefono, texto, btnId, listaId, respuesta }) // ← agrega esta línea
 

  // Buscar sesión existente
  let { data: sesion } = await supabase
    .from('sesiones_bot')
    .select('*')
    .eq('telefono', telefono)
    .single()

  // Primera vez que escribe
  if (!sesion) {
    await supabase
      .from('sesiones_bot')
      .insert({ telefono, paso_actual: 'inicio' })

    return enviarBotones(
      telefono,
      '👋 Bienvenido a Xawak',
      '¿Cómo puedo ayudarte hoy?',
      ['🤝 Quiero ser proveedor', '✈️ Quiero un viaje']
    )
  }

  // Si escribe "reiniciar" vuelve al inicio
  if (texto === 'reiniciar') {
    await supabase
      .from('sesiones_bot')
      .update({ paso_actual: 'inicio', datos: {} })
      .eq('telefono', telefono)

    return enviarBotones(
      telefono,
      '👋 Bienvenido a Xawak',
      '¿Cómo puedo ayudarte hoy?',
      ['🤝 Soy proveedor', '✈️ Quiero viajes']
    )
  }

  // Enrutar según el paso actual
  if (sesion.paso_actual === 'inicio') {
    return manejarInicio(telefono, respuesta, sesion)
  }

  if (sesion.paso_actual.startsWith('b2b_')) {
    return manejarB2B(telefono, respuesta, sesion)
  }

  // Respuesta por defecto
  await enviarTexto(telefono, 'No entendí eso. Escribe *reiniciar* para volver al inicio.')
}

async function manejarInicio(telefono, respuesta, sesion) {
  const esProveedor = respuesta.includes('btn_0') || respuesta.includes('proveedor')
  const esViajero   = respuesta.includes('btn_1') || respuesta.includes('viaje')

  if (esProveedor) {
    await actualizarSesion(telefono, 'b2b_tipo', {})
    return enviarLista(
      telefono,
      '¡Genial! ¿Qué tipo de servicio ofreces?',
      'Ver opciones',
      [
        { titulo: 'Hospedaje',    desc: 'Hotel, hostal, cabaña, glamping' },
        { titulo: 'Transporte',   desc: 'Van, bus, lancha, moto' },
        { titulo: 'Tour',         desc: 'Caminata, avistamiento, cultural' },
        { titulo: 'Restaurante',  desc: 'Comida típica, fine dining, café' },
        { titulo: 'Guía',         desc: 'Guía certificado o local' },
        { titulo: 'Otro',         desc: 'Otro tipo de servicio' }
      ]
    )
  }

  if (esViajero) {
    return enviarTexto(telefono,
      '✈️ El servicio para viajeros estará disponible muy pronto. Por ahora escríbenos a nuestro correo: viajes@xawak.com'
    )
  }

  await enviarTexto(telefono, 'Por favor elige una de las opciones 👆')
}

async function manejarB2B(telefono, respuesta, sesion) {
  const paso  = sesion.paso_actual
  const datos = sesion.datos || {}

  switch (paso) {

    case 'b2b_tipo':
      datos.tipo_servicio = respuesta.replace('op_', '') === '0' ? 'hospedaje'
        : respuesta.replace('op_', '') === '1' ? 'transporte'
        : respuesta.replace('op_', '') === '2' ? 'tour'
        : respuesta.replace('op_', '') === '3' ? 'restaurante'
        : respuesta.replace('op_', '') === '4' ? 'guia'
        : respuesta.includes('op_') ? 'otro' : respuesta

      await actualizarSesion(telefono, 'b2b_nombre', datos)
      return enviarTexto(telefono,
        '¿Cuál es el nombre de tu negocio?'
      )

    case 'b2b_nombre':
      datos.nombre_negocio = respuesta
      await actualizarSesion(telefono, 'b2b_ubicacion', datos)
      return enviarTexto(telefono,
        '¿En qué ciudad o municipio estás?'
      )

    case 'b2b_ubicacion':
      datos.ubicacion = respuesta
      await actualizarSesion(telefono, 'b2b_descripcion', datos)
      return enviarTexto(telefono,
        'Cuéntame brevemente qué ofreces 🙂'
      )

    case 'b2b_descripcion':
      datos.descripcion = respuesta
      await actualizarSesion(telefono, 'b2b_capacidad', datos)
      return enviarTexto(telefono,
        '¿Cuántas personas puedes atender a la vez?'
      )

    case 'b2b_capacidad':
      datos.capacidad = respuesta
      await actualizarSesion(telefono, 'b2b_tarifa', datos)
      return enviarLista(
        telefono,
        '¿Cómo cobras tu servicio?',
        'Ver opciones',
        [
          { titulo: 'Por persona',  desc: 'Ej: $80.000 por persona' },
          { titulo: 'Por noche',    desc: 'Ej: $150.000 por noche'  },
          { titulo: 'Por grupo',    desc: 'Ej: $400.000 el grupo'   },
          { titulo: 'Por servicio', desc: 'Ej: $200.000 por traslado' }
        ]
      )

    case 'b2b_tarifa':
      datos.unidad_tarifa = respuesta.includes('op_0') ? 'por_persona'
        : respuesta.includes('op_1') ? 'por_noche'
        : respuesta.includes('op_2') ? 'por_grupo'
        : 'por_servicio'

      await actualizarSesion(telefono, 'b2b_precio', datos)
      return enviarTexto(telefono,
        '¿Cuál es tu precio base en pesos colombianos? (solo el número, ej: 80000)'
      )

    case 'b2b_precio':
      datos.tarifa_base = parseInt(respuesta.replace(/\D/g, '')) || 0
      await actualizarSesion(telefono, 'b2b_contacto', datos)
      return enviarTexto(telefono,
        '¿Cuál es tu nombre para coordinar reservas?'
      )

    case 'b2b_contacto':
      datos.nombre_contacto = respuesta
      await actualizarSesion(telefono, 'b2b_confirmar', datos)
      return enviarBotones(
        telefono,
        '📋 Resumen de tu registro',
        `Negocio: ${datos.nombre_negocio}\n` +
        `Tipo: ${datos.tipo_servicio}\n` +
        `Ciudad: ${datos.ubicacion}\n` +
        `Tarifa: $${datos.tarifa_base?.toLocaleString()} ${datos.unidad_tarifa}\n` +
        `Contacto: ${datos.nombre_contacto}\n\n` +
        `¿Todo correcto?`,
        ['✅ Confirmar', '✏️ Corregir']
      )

    case 'b2b_confirmar':
      if (respuesta.includes('btn_0') || respuesta.includes('confirmar')) {
        await guardarProveedor(telefono, datos)
        await actualizarSesion(telefono, 'b2b_listo', datos)
        return enviarTexto(telefono,
          '🎉 ¡Registro completo!\n\nYa quedaste en nuestra base de proveedores. Un ejecutivo de Xawak te contactará en las próximas 48 horas para formalizar la alianza.\n\n¡Gracias por unirte a Xawak! 🙌'
        )
      }
      if (respuesta.includes('btn_1') || respuesta.includes('corregir')) {
        await actualizarSesion(telefono, 'b2b_nombre', {})
        return enviarTexto(telefono,
          'Sin problema, empecemos de nuevo. ¿Cuál es el nombre de tu negocio?'
        )
      }
      break

    default:
      await enviarTexto(telefono, 'Escribe *reiniciar* para volver al inicio.')
  }
}

async function actualizarSesion(telefono, nuevoPaso, datos) {
  await supabase
    .from('sesiones_bot')
    .update({ paso_actual: nuevoPaso, datos })
    .eq('telefono', telefono)
}

async function guardarProveedor(telefono, datos) {
  const { error } = await supabase
    .from('proveedores')
    .upsert({
      telefono,
      ...datos,
      estado:       'pendiente_revision',
      datos_crudos: datos
    }, { onConflict: 'telefono' })

  if (error) console.error('Error guardando proveedor:', error.message)
  else console.log(`✅ Proveedor guardado: ${datos.nombre_negocio}`)
}