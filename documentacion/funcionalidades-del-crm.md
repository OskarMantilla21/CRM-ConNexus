# Funcionalidades del CRM

Fecha: 5 de octubre de 2026.

Este documento lista lo que el CRM hace hoy, pantalla por pantalla, para diseñar el UI nuevo. Las rutas son las de la aplicación web actual (`http://127.0.0.1:5181`). El teléfono y cualquier integración hablan con la misma API: una regla que solo se oculte en la pantalla no protege el dato.

Cómo se enciende la máquina está en [pruebas/inicio-del-crm.md](pruebas/inicio-del-crm.md).

## Quién usa el producto

Cada empresa es una organización. Una persona puede pertenecer a varias. El rol vive en esa pertenencia, no en la cuenta: alguien puede ser administrador en una empresa y miembro en otra.

| Quién | Qué ve | Qué no ve |
|---|---|---|
| Administrador de la empresa | Todos los registros comerciales de su empresa: leads, cuentas, contactos, negocios, tickets, tareas, facturas. | Los datos de otra empresa. |
| Miembro | Lo que creó, lo que tiene asignado y, en contactos, las personas de las cuentas que tiene asignadas. En un ticket también lee los que observa. | El trabajo privado de un compañero. El equipo y varias pantallas de ajuste. |
| Super rol (`super@connexus.local`) | El directorio de usuarios: nombre, correo, si está activo y en qué empresa está, con su rol. Pantalla: `/plataforma`. | Clientes, leads, tickets, facturas, pagos y cualquier dato de una empresa. |
| Cliente del portal | Sus propios tickets y los artículos publicados, después de un código por correo. | El CRM interno, otras empresas y otros clientes. |
| Visitante con un enlace | Una factura, un presupuesto o una encuesta, y solo ese registro. | El resto del CRM. |
| Visitante del centro de ayuda | Los artículos que la empresa publicó. | Todo lo demás. |

El administrador de Django (`admin@localhost`) entra a `http://127.0.0.1:8000/admin/` y no es una cuenta del CRM.

Un paquete de industria puede cambiar las palabras de la interfaz (por ejemplo, llamar «consulta» a un lead). El UI nuevo tiene que leer esas palabras de la empresa, no grabarlas en el diseño.

## Reglas que el UI nuevo tiene que respetar

- Al entrar, la persona elige empresa. A partir de ahí cada lista, ficha, búsqueda y descarga pertenece a esa empresa.
- Ocultar un menú no basta. La API responde 403 o 404 si la persona no puede ver el registro.
- Dentro de una empresa, el miembro no ve el lead privado de un compañero. El administrador sí.
- Los artículos de la base de conocimiento los lee cualquier miembro de esa empresa.
- Un pago guarda medio, fecha, monto, referencia y notas. El CRM no guarda el número completo de la tarjeta ni el código de seguridad. El super rol tampoco abre esa ficha.
- El super rol no es el administrador de una empresa y no es el superusuario de Django. Si se marca esa bandera en una cuenta que ya trabaja en una empresa, esa cuenta deja de abrir los datos de la empresa.
- Hay dos portales distintos. Uno es un enlace de un solo registro (factura, presupuesto o encuesta). El otro es un inicio de sesión del cliente, con código de seis dígitos, y llega a sus tickets.

## Entrar y salir

| Pantalla | Ruta | Qué hace la persona |
|---|---|---|
| Entrar | `/login` | Escribe su usuario y su contraseña. Las cuentas de esta máquina están en [pruebas/cuentas-de-acceso.md](pruebas/cuentas-de-acceso.md). |
| Confirmar enlace | `/login/verify?token=…` | La página solo muestra Continuar. El enlace se gasta al pulsar, no al abrir. Caduca en unos 10 minutos. En esta máquina el mensaje sale en `docker compose logs celery-worker`, no en el buzón. |
| Elegir empresa | `/org` | Lista las empresas de esa cuenta, con su rol. Puede crear una empresa nueva en `/org/new`. |
| Directorio | `/plataforma` | Solo el super rol. Si entra otra persona, vuelve a `/org`. |
| Salir | `/logout` | Borra la sesión y vuelve a `/login`. |

Un correo que el CRM no conoce crea una cuenta vacía, sin empresas. `oskarmantilla1708@gmail.com` es la cuenta de esta máquina (oskaruxui y MicroPyramid). `oskar.mantilla@pyneartech.com` es otra cuenta y no tiene empresas.

Después de entrar, la persona puede cambiar de empresa desde su perfil. Eso pide un token nuevo. No es un campo que se edite.

## Cascarón de la aplicación

Estas piezas están en todas las pantallas de trabajo:

- Nombre de la empresa arriba.
- Menú en cuatro grupos: Vender, Atender, Cobrar, Administrar.
- Contadores en pipeline, leads, tareas, tickets, facturas y notificaciones.
- Búsqueda global con `Ctrl+K` o `Cmd+K`. Sin texto ofrece acciones (nuevo negocio, ir a Hoy, Tareas, Facturas). Con texto busca negocios, cuentas, contactos, leads, tickets, facturas y artículos. Cada resultado abre su ficha. Un miembro solo encuentra lo que ya puede ver.
- Notificaciones propias en `/notifications`: lista, no leídas, marcar una, marcar todas, borrar.
- Perfil, ayuda y salir, al pie del menú.
- Vistas guardadas en las listas: la persona nombra los filtros actuales y los vuelve a abrir. Son suyas, no de toda la empresa.
- Filtros en la URL, para poder compartir o recargar la misma lista.
- En las fichas: comentarios, archivos adjuntos, actividad e etiquetas, donde el módulo los tiene.
- Campos que la empresa agregó. Aparecen en la ficha y, si el módulo lo permite, en los formularios públicos.
- Importar CSV (vista previa y confirmar) y exportar CSV en leads, contactos, cuentas, tickets y facturas.
- Detectar duplicados y fusionar en cuentas, contactos, leads y tickets.
- El teléfono es otra aplicación sobre la misma API. El menú actual enlaza la ficha de Google Play. El UI nuevo de la web no tiene que copiar esa tienda.

El menú de Equipo solo se muestra al administrador. Ajustes lo ve cualquier miembro, pero varias filas de ese índice solo las abre el administrador.

## Vender

### Hoy — `/`

La cola de lo que pide atención hoy: tickets vencidos, facturas vencidas, negocios que se quedaron quietos, tareas de hoy y atrasadas, leads calientes o con seguimiento hoy. Muestra como máximo ocho. El resto se resume con un enlace a cada lista. Abajo van los objetivos de ventas, con el ritmo (al día, en riesgo, atrasado, cumplido) y no solo el porcentaje. Si no hay nada urgente, la pantalla lo dice.

### Pipeline — `/pipeline`

Los negocios (oportunidades) de la empresa.

- Tablero por etapa, con arrastrar y soltar, y lista.
- Varios embudos por empresa. Un cambiador elige cuál se está viendo.
- Totales de dinero por moneda. Una empresa puede mezclar monedas, así que el UI no debe sumarlas en una sola cifra.
- Filtros, vista guardada, exportar y crear en `/pipeline/new`.
- Cada tarjeta muestra nombre, cuenta, monto, responsable, etapa y si el negocio va al día, pasado de tiempo o parado.
- La ficha `/pipeline/[id]` edita el negocio, sus líneas, comentarios y archivos. Desde un negocio ganado se puede crear una factura.
- Etapas: las define la empresa. Dos tipos cierran el negocio, ganado y perdido, se llamen como se llamen. El envejecimiento (días esperados por etapa) se configura en Ajustes, embudos de negocios.
- Tipos de negocio: nuevo, existente, renovación, ampliación, venta cruzada.

### Leads — `/leads`

Una persona o empresa que todavía no es cliente.

- Lista y tablero `/leads/board`. El tablero mueve la etapa.
- Crear, editar, borrar, asignar responsable, notas y archivos.
- Estados guardados: asignado, en proceso, convertido, reciclado, cerrado. La lista no muestra los convertidos ni trata el cerrado como un filtro normal. La ficha sí muestra el estado completo.
- Convertir: pasa a cuenta, contacto y negocio. Un lead convertido no se vuelve a convertir. La ficha señala los registros que nacieron de él.
- Orígenes guardados: llamada, correo, cliente existente, socio, relaciones públicas, campaña y otro. El valor de campaña en la base sigue escrito `compaign`. La pantalla lo muestra como campaña.
- Formularios públicos crean leads. Eso se configura en Ajustes, no en esta lista.
- Embudo y etapas: Ajustes → embudos de leads.

### Cuentas — `/accounts`

La empresa cliente.

- Lista, alta, ficha, edición, borrado si la API lo permite para esa persona.
- Ficha: industria, empleados, responsable, cliente desde (fecha del primer negocio ganado), ingresos ganados, pipeline abierto, facturas vencidas y tickets abiertos.
- Debajo, los contactos, negocios, facturas y tickets de esa cuenta.
- Duplicados y fusión.

### Contactos — `/contacts`

La persona dentro de una cuenta.

- Lista, alta, ficha, edición, fusión.
- Un miembro ve los contactos de las cuentas que tiene asignadas, además de los que creó.
- El portal del cliente usa el correo de este contacto. No es un usuario del CRM.

### Objetivos — `/goals`

Metas de ventas del periodo.

- Tipos: ingresos (solo los negocios ganados en la moneda del objetivo), negocios cerrados o actividades.
- Periodo: mes, trimestre, año o un rango a medida.
- Cada objetivo muestra avance, ritmo y a quién está asignado.
- Un administrador crea y edita. Un miembro ve lo que tiene asignado.
- Historial en `/goals/history`.
- Hoy resume los mismos objetivos.

## Atender

### Tareas — `/tasks`

- Lista, tableros `/tasks/board` y calendario `/tasks/calendar`.
- Alta, ficha, edición, estado, responsable y fecha.
- Un tablero tiene columnas y las tareas se mueven entre columnas.
- Puede colgar de un ticket o vivir sola.
- Hoy enlaza las de hoy y las atrasadas.

### Tickets — `/tickets`

El caso de soporte.

Pestañas:

| Pestaña | Ruta | Qué hace |
|---|---|---|
| Cola | `/tickets` | Lista de abiertos. Filtros por prioridad, responsable, SLA vencido y «los míos». |
| Tablero | `/tickets/board` | Columnas por etapa, con arrastrar. |
| Aprobaciones | `/tickets/approvals` | Las que esperan la firma de esta persona. |
| Analítica | `/tickets/analytics` | Solo administrador: tiempos de respuesta, SLA, carga, agentes. Se puede exportar. |

Ficha `/tickets/[id]`:

- Responder al cliente o dejar una nota interna. La nota interna no sale al cliente.
- Adjuntar un archivo.
- Aplicar una macro (respuesta preparada, con datos del ticket rellenados).
- Observar o dejar de observar. Quien observa lee el ticket y no lo edita.
- Cerrar. Si tiene hijos, se puede cerrar la rama. Si hay una regla de aprobación, Cerrar pide esa aprobación antes.
- Aprobar o rechazar.
- Fusionar en otro ticket y deshacer la fusión.
- Enlazar tickets en un árbol.
- Sugerir artículos de la base de conocimiento.
- Tiempo: iniciar un contador, cargar horas, marcar si se factura o no, borrar un apunte. Esas horas alimentan el parte de horas y pueden convertirse en factura.
- Prioridad, tipo, estado, responsable, cuenta y contacto.

Estados fijos del ticket, además de la etapa del embudo que la empresa defina. La prioridad incluye Urgente.

Quién puede:

| Acción | Administrador | Quien lo creó | Responsable | Observador |
|---|---|---|---|---|
| Leer | sí | sí | sí | sí |
| Escribir | sí | sí | sí | no |
| Borrar | sí | sí | no | no |

### Base de conocimiento — `/solutions`

Artículos del equipo.

- Lista, alta, edición.
- Publicar y retirar. Publicado puede salir al centro de ayuda y al portal del cliente.
- Cualquier miembro de la empresa los lee.
- Un ticket puede enlazar uno o varios artículos.

### Documentos — `/documents`

Archivos de la empresa, aparte de los adjuntos de una ficha.

- Lista, alta, ficha, edición, descarga y borrado.
- El permiso de lectura sigue la regla del documento, dentro de la empresa.

### Parte de horas — `/timesheet`

Horas cargadas en los tickets.

- Informe en `/timesheet/report`, con enlace al ticket.
- Esas horas se pueden pasar a una factura (`facturar horas`).

## Cobrar

### Facturas — `/invoices`

Pestañas:

| Pestaña | Ruta | Qué hace |
|---|---|---|
| Facturas | `/invoices` | Lista, estados, vencimiento, alta. |
| Presupuestos | `/invoices/estimates` | Crear, enviar, PDF y convertir en factura. |
| Recurrentes | `/invoices/recurring` | Plantilla que se repite. Activar y pausar. |
| Productos | `/invoices/products` | Catálogo: nombre, precio, moneda. |
| Informes | `/invoices/reports` | Solo administrador: antigüedad de cobro e ingresos. |
| Plantillas | `/invoices/templates` | Cómo se ve la factura que recibe el cliente. |

Ficha de factura:

- Líneas, impuestos, totales y moneda de esa factura.
- Estados: borrador, enviada, vista, pagada, pago parcial, vencida, pendiente, cancelada.
- Enviar, recordar, descargar PDF, duplicar, cancelar.
- Registrar un pago: medio (efectivo, cheque, tarjeta, transferencia, PayPal, Stripe u otro), fecha, monto, referencia y notas. Sin número de tarjeta.
- Marcar pagada, según el saldo.
- Comentarios y archivos.
- El cliente abre la suya por un enlace, sin cuenta del CRM: `/portal/invoice/[token]`. El presupuesto público es `/portal/estimate/[token]`.

Los datos de la empresa que salen impresos (nombre, dirección, moneda) se editan en Ajustes → Organización.

## Administrar

### Equipo y acceso — `/team`

Solo administrador.

- Personas de esta empresa, su rol (administrador o miembro) y si están activas.
- Invitar. Si el correo ya existe en el CRM, se reutiliza la cuenta y se muestra el nombre. No se traen los clientes de sus otras empresas.
- Desactivar a alguien corta su acceso y deja inválidos sus tokens de API.
- Un miembro que abre esta ruta recibe que es solo para administradores.

### Ajustes — `/settings`

Índice. Cada fila dice el valor actual y avisa si algo necesita atención.

Personas y acceso:

| Ajuste | Ruta | Qué configura | Quién lo cambia |
|---|---|---|---|
| Equipo | `/team` | Quién entra y con qué rol. | Administrador |
| Tokens de API | `/settings/api-tokens` | Tokens personales para scripts e integraciones. Avisan si quedaron en una cuenta desactivada o sin uso. | El dueño ve los suyos. El índice marca los problemas al administrador. |
| Webhooks | `/settings/webhooks` | Avisar a Zapier, n8n, Slack o un servidor propio cuando cambia un registro. | Administrador |
| Auditoría | `/settings/audit-log` | Entradas, tokens, fusiones, peticiones rechazadas y webhooks en pausa. | Administrador, y solo las filas de su empresa |
| Formularios web | `/settings/web-forms` | Formularios para incrustar en un sitio. Lo que la gente envía se vuelve un lead. Leer los ve cualquier miembro. Publicar, solo el administrador. | Administrador para publicar |
| Centro de ayuda | `/settings/help-center` | Encender la web pública de artículos y su dirección (`/help-center/[nombre]`). | Administrador para encender |
| Organización | `/settings/organization` | Datos que se imprimen en facturas y presupuestos, moneda, país, zona horaria. | Administrador |

Cómo se tratan los tickets:

| Ajuste | Ruta | Qué configura |
|---|---|---|
| Enrutado | `/settings/routing` | Reglas, en orden, de a quién cae un ticket nuevo. Se puede probar una regla. |
| Escalado | `/settings/escalation` | Qué pasa si se vence el tiempo de respuesta, por prioridad. |
| Horario | `/settings/business-hours` | Días, horas y festivos. El reloj del SLA usa este calendario, no las 24 horas. |
| Aprobaciones | `/settings/ticket-approvals` | Qué cierre necesita un visto bueno y quién lo da. |
| Reapertura | `/settings/reopen` | Si una respuesta del cliente reabre un ticket cerrado y durante cuántos días. |
| Correo entrante | `/settings/inbound-email` | Direcciones que convierten un correo en ticket. |

Palabras y campos compartidos:

| Ajuste | Ruta | Qué configura |
|---|---|---|
| Macros | `/settings/macros` | Respuestas preparadas y los huecos que se rellenan con datos del ticket. |
| Etiquetas | `/settings/tags` | Etiquetas compartidas por cuentas, leads, negocios y tickets. Crear es de administrador. |
| Embudos de leads | `/settings/lead-pipelines` | Etapas del tablero de leads y su orden. |
| Embudos de negocios | `/settings/deal-pipelines` | Etapas de los negocios y a partir de cuántos días una etapa se considera parada. |
| Campos a medida | `/settings/custom-fields` | Campos extra en los registros. Avisa si uno obligatorio tiene huecos. |
| Plantillas de factura | `/invoices/templates` | El mismo destino que la pestaña de Facturas. |

### Perfil — `/profile`

De la persona, no de la empresa.

- Ve su nombre, rol, empresa y fecha de alta. El rol no se cambia aquí.
- Edita su nombre y su teléfono.
- Cambia de empresa si pertenece a más de una.
- Tokens propios en `/profile/tokens`: crear, ver el secreto una sola vez, revocar.
- Feed de calendario en `/profile/calendar-feed`: un enlace privado para suscribir tareas o vencimientos en un calendario externo.

### Ayuda — `/help`

Ayuda para quien usa el CRM, no el centro de ayuda de sus clientes.

- Atajos a la base de conocimiento, a la cola de tickets y a Ajustes.
- Si el servicio de soporte de BottleCRM responde, lista los tickets abiertos con ese equipo y deja crear uno. En esta instalación local esa cola no está, y la página explica cómo pedir ayuda por fuera.

### Notificaciones — `/notifications`

Solo las de esta persona: asignaciones, menciones y avisos del trabajo. No son una cola compartida.

## Lo que ve el cliente, sin cuenta del CRM

| Superficie | Ruta | Qué puede hacer |
|---|---|---|
| Factura por enlace | `/portal/invoice/[token]` | Ver esa factura y su PDF. El enlace es la credencial. |
| Presupuesto por enlace | `/portal/estimate/[token]` | Ver ese presupuesto. |
| Encuesta | `/csat/[token]` | Puntuar la atención de un ticket cerrado. |
| Portal con código | `/portal/login/[empresa]` | Pide un código al correo del contacto. Después ve sus tickets (`/portal/cases`) y los artículos (`/portal/articles`). No elige empresa: el enlace ya trae la empresa. |
| Centro de ayuda | `/help-center/[nombre]` | Artículos publicados. Lo puede indexar un buscador. |
| Formulario en un sitio | lo sirve la API pública | Una persona sin cuenta envía el formulario y nace un lead, con el responsable y las etiquetas que configuró el administrador. |

El cliente no ve leads de otras personas, facturas ajenas, el equipo ni los ajustes.

## Super rol

Pantalla única: `/plataforma`.

Lista cada cuenta del CRM con nombre, correo, activa o no, si es el super rol, y las empresas con su rol. No hay ficha de cliente, no hay botón para entrar a una empresa y no hay pagos.

Cómo se concede y cómo se prueba está en [pruebas/super-rol.md](pruebas/super-rol.md).

## Lo que existe en datos y no tiene pantalla

Los pedidos (`Order`) están en la base: borrador, activado, completado, cancelado, ligados a cuenta, contacto y negocio. No hay ruta ni API para trabajarlos. El UI nuevo no debe ofrecer una pantalla de pedidos hasta que esa API exista.

Tampoco hay una bandeja de correo dentro del CRM. El correo entrante se configura como buzón que abre tickets. El correo de acceso, en esta máquina, se imprime en el registro del worker.

## Mapa corto de rutas

```
/login
/login/verify
/org
/org/new
/plataforma
/logout

/                          Hoy
/pipeline                  Negocios
/leads                     Leads
/leads/board
/accounts                  Cuentas
/contacts                  Contactos
/goals                     Objetivos

/tasks                     Tareas
/tasks/board
/tasks/calendar
/tickets                   Tickets
/tickets/board
/tickets/approvals
/tickets/analytics
/solutions                 Base de conocimiento
/documents                 Documentos
/timesheet                 Parte de horas

/invoices                  Facturas
/invoices/estimates
/invoices/recurring
/invoices/products
/invoices/reports
/invoices/templates

/team
/settings                  y las rutas de la tabla de Ajustes
/profile
/notifications
/help

/portal/login/[empresa]
/portal/cases
/portal/articles
/portal/invoice/[token]
/portal/estimate/[token]
/csat/[token]
/help-center/[nombre]
```

Cada lista tiene, cuando el módulo lo permite, alta en `/nueva` o `/new`, ficha en `/[id]` y edición en `/[id]/edit`.
