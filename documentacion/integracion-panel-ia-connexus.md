# El panel de preguntas y la IA de ConNexus

Esta página explica un trabajo que **todavía no está hecho**. Sirve para entenderlo antes de programarlo.

Hoy, si escribes en la columna de la derecha del CRM, la respuesta la da la clave de IA que el CEO pegó en Ajustes (Groq, Gemini u otra). El objetivo es que esa respuesta la dé ConNexus, el sistema de IA que ya tiene los agentes y que ya usa Groq.

Si solo puedes recordar cinco cosas, recuerda estas:

1. La persona escribe en el CRM. El navegador no llama a ConNexus.
2. ConNexus ofrece el API, porque la IA vive en su sistema. El CRM envía la pregunta a ese API y pinta la frase que vuelve.
3. ConNexus ya sabe hablar con Groq. Falta crear esa puerta para que el CRM le pregunte.
4. ConNexus entiende y devuelve una frase o unos datos ya ordenados. Si hay que crear un empleado, lo guarda el CRM, y solo después de que la persona confirme.
5. Cada empresa del CRM necesita su propia llave para esa puerta. Esa llave no se muestra en la pantalla. Cada llamada puede gastar cupo de esa empresa en ConNexus.

## Quién envía el API

La pantalla del asistente está en el CRM. La inteligencia está en ConNexus. Por eso el trabajo se reparte así:

| Quién | Qué hace |
| --- | --- |
| La pantalla del CRM | Recibe lo que escribe la persona y se lo manda a su propio servidor, a `/ask`. |
| El servidor del CRM | Envía la pregunta. Es el cliente del API. |
| ConNexus | Ofrece el API. Crea la dirección `POST /api/v1/crm/ask`, recibe la pregunta, se la pasa a su IA y devuelve la frase. |

ConNexus es quien publica el API porque la IA y los agentes ya están en su sistema. El CRM no copia a Groq ni a los agentes: les pregunta a través de esa puerta.

El CRM es quien envía cada pregunta, porque la pantalla, la empresa y los datos que se están viendo viven en el CRM. ConNexus no abre el CRM para buscar la respuesta. Espera a que el CRM llame.

```text
Pantalla del asistente  --pregunta-->  servidor del CRM  --API-->  ConNexus (aquí está la IA)
Pantalla del asistente  <--frase----  servidor del CRM  <--frase--  ConNexus
```

La pantalla no envía el API a ConNexus. ConNexus no envía respuestas al CRM por su cuenta. El único envío hacia la IA lo hace el servidor del CRM, cada vez que alguien escribe o pulsa un botón del asistente.

La IA de ConNexus no aparece sola dentro del CRM. No hay una ventana de ConNexus metida en la página. El CRM pone el cuadro, el botón y el texto. ConNexus solo trabaja cuando el CRM lo llama.

```text
La persona escribe o hace clic en el CRM
  → el CRM arma el pedido
  → llama al API de ConNexus
  → ConNexus entiende lo que pidió (su IA más el contexto)
  → devuelve una frase, o datos listos para una acción
  → el CRM muestra el resultado
  → si hay que guardar algo, lo guarda el CRM en su propia base
```

El reparto queda así:

| Parte | De qué se encarga |
| --- | --- |
| El CRM | El cuadro y los botones. Arma el pedido. Llama a ConNexus. Muestra la respuesta. Si la persona confirma, crea el empleado en la base del CRM. |
| ConNexus | Entiende el lenguaje normal. Saca nombre, correo y rol. Aplica sus reglas, el cupo y el permiso de la llamada. Devuelve los datos limpios. |
| El API | Lo publica ConNexus para que el CRM lo llame. El camino no es al revés: ConNexus no entra al CRM a pintar la pantalla. |

Hay tres formas de usarlo. La primera versión del panel es la primera. Las otras dos se pueden sumar después.

1. **Chat.** La persona pregunta lo que quiera. Ejemplo: «¿cómo se crea un nuevo empleado?». ConNexus devuelve una frase. Sirve para dudas abiertas. En el código de ConNexus la idea ya existe en el orquestador de WhatsApp; para el CRM hace falta una puerta nueva, no el teléfono de WhatsApp.
2. **Una acción concreta.** Ejemplo: crear un empleado, resumir un negocio, sugerir una respuesta. ConNexus devuelve campos ordenados. Es más fácil de controlar y de cobrar por uso.
3. **Las dos juntas.** El chat es libre. Si la IA ve una intención clara, como crear un empleado, devuelve la acción para que el CRM pida confirmación.

Cada llamada del CRM a ConNexus puede descontar cupo del monedero de esa empresa en ConNexus. El precio que el CRM le cobre a sus clientes, por encima de ese costo, lo decide el CRM.

Fecha en que se leyó el código: 2026-10-21.

## Un ejemplo, de principio a fin

Ana abre el CRM. Está en Hoy. A la derecha está el asistente. Escribe: «¿cómo se crea un nuevo empleado?» y pulsa Enter.

Esto es lo que tiene que pasar cuando el trabajo esté hecho:

1. La pantalla del CRM junta tres cosas: la pregunta de Ana, la página donde está (`/`) y un resumen de lo que Hoy ya muestra.
2. El navegador de Ana se lo manda **al CRM**, a la dirección `/ask`.
3. El servidor del CRM quita de ese resumen todo lo secreto (contraseñas, claves, cookies).
4. El servidor del CRM llama a ConNexus y le dice: «Ana es CEO, puede crear empleados, y pregunta cómo se crea uno».
5. ConNexus le pide la frase a Groq. Si Groq no contesta, prueba Gemini y después OpenAI. La frase sale de la guía del CRM: un empleado se crea en Empleados (`/team`).
6. ConNexus devuelve la frase. El CRM se la muestra a Ana en la misma columna.

Ana no ve direcciones de ConNexus ni claves. Solo ve la pregunta y la respuesta.

Esa pregunta es de chat: pide que le expliquen el camino. ConNexus no crea al empleado. Le dice a Ana que entre a Empleados (`/team`).

### Si Ana pide crear a alguien, no solo el camino

Ana escribe en el mismo panel: «Crear empleado Juan Pérez, correo juan@empresa.com, rol administrador».

El CRM le manda a ConNexus un pedido así. El `org_id` es el de la empresa **en ConNexus**, el mismo de la llave. En el CRM, un empleado es una persona del equipo. Un administrador lo crea el CEO en Ajustes. Este ejemplo pide un administrador, así que Ana tiene que ser CEO.

```json
{
  "org_id": "uuid-de-la-empresa-en-connexus",
  "intent": "create_user",
  "message": "Crear empleado Juan Pérez, correo juan@empresa.com, rol administrador",
  "context": { "current_screen": "team" }
}
```

Esa forma de pedido es la que se acordó para una acción. En el código leído el 2026-10-21 (commit `d91fe43c`) esa ruta todavía no existe. Hay que crearla en ConNexus.

ConNexus entiende la frase con su IA (el gateway, y el contexto de la empresa). Si hay un flujo de agente configurado, saca los datos y los devuelve ordenados. No los guarda en el CRM.

```json
{
  "action": "create_user",
  "fields": {
    "name": "Juan Pérez",
    "email": "juan@empresa.com",
    "role": "ADMIN"
  },
  "confirmation_needed": true
}
```

El CRM muestra esos datos y le pide a Ana que confirme. Si ella confirma, el CRM crea a Juan en su propia base, por el mismo camino que ya usa Empleados. Si ella cancela, no se crea a nadie.

`confirmation_needed: true` significa que ConNexus no dio la orden de guardar. Solo preparó los campos. Guardar es trabajo del CRM, y solo con el sí de Ana.

Si cierra la página o la recarga, la conversación desaparece. Hoy no se guarda en la base de datos. La primera versión del chat tampoco guarda el hilo. La ficha de Juan sí se guarda, y solo si Ana confirmó.

## Dos programas distintos

Hay dos proyectos. No son la misma carpeta.

**El CRM** es esta aplicación. La parte que ves en el navegador está hecha con Svelte. La parte que guarda datos y responde está hecha con Django. Cada cliente del CRM es una empresa: tiene sus propias personas, leads y facturas. Una empresa no ve los datos de otra.

**ConNexus** (en el código también se llama Nexus Hub) es el otro proyecto. La carpeta es `C:\ConNexus-Gen\nexus-hub-monorepo`. Es el sistema de inteligencia artificial. Ahí están los agentes y la conexión con Groq. Su código está escrito con FastAPI.

Un **agente** es una forma de contestar. El general se llama `CONNEXUS_CORE_ORCHESTRATOR`. También hay uno de ventas, uno de soporte, uno de operaciones y uno de citas. Cada uno es un archivo dentro de `provisioning/archetypes/`. Al empezar, el panel usa el general.

Un **modelo** es el programa que redacta la frase. Para una conversación normal, ConNexus prueba en este orden:

| Intento | Servicio | Nombre del modelo |
| --- | --- | --- |
| 1 | Groq | `openai/gpt-oss-20b` |
| 2 | Gemini | `gemini-3.1-flash-lite` |
| 3 | OpenAI | `gpt-4o-mini` |

Esas claves (`GROQ_API_KEY` y las otras) viven en el servidor de ConNexus. El CRM no tiene que pegar otra vez la clave de Groq para esta columna.

## Palabras que vas a ver en el código

| Cuando leas… | Entiéndelo así |
| --- | --- |
| Panel, columna derecha, `AskScreen` | El cuadro donde Ana escribe. |
| `POST` | «Te mando estos datos y espero una respuesta.» |
| `GET` | «Dame información.» No cambia nada. |
| JSON | Texto con campos, como `{"question": "hola"}`. Es el sobre de la pregunta y de la respuesta. |
| Ruta o endpoint | La dirección, por ejemplo `/ask` o `/api/v1/crm/ask`. |
| Token o llave de servicio | Una credencial larga. El CRM la pone en la cabecera `Authorization: Bearer ...`. Quien la tiene puede llamar a esa puerta. No se pinta en la página. |
| `org_id` | El número de una empresa. El CRM tiene el suyo. ConNexus tiene otro. Hay que guardar los dos, juntos. No supongas que son iguales. |
| 200 | Salió bien. |
| 400 | La pregunta iba mal (por ejemplo, vacía). |
| 401 | Faltaba la llave o era falsa. |
| 403 | La llave es real, pero no tiene permiso para eso. |
| 429 | Demasiadas preguntas en poco tiempo. |
| 502 | El otro lado no pudo contestar. |

Hay un documento en inglés, `docs/integrations/ai-agents.md`. Ese explica otra cosa: un programa de fuera entra **al CRM** con una llave que empieza por `bcrm_pat_`. Esta guía es lo contrario: el CRM sale a pedirle una frase a ConNexus.

## Qué pasa hoy, paso a paso

Hoy el paso 4 de Ana no existe. El CRM le pregunta directo a Groq o a Gemini con la clave que el CEO guardó.

1. `AskScreen.svelte` junta la pregunta y hace `POST /ask`.
2. `ask/+server.js` recorta la pregunta a 400 letras y la ruta a 200. Si alguien manda un nombre de modelo con una barra (`openai/gpt-oss-20b`), lo tira. Por eso el CRM no debe elegir el modelo: lo elige ConNexus.
3. `screen-brief.js` arma el resumen de la página y saca secretos, comentarios, archivos y campos personalizados. El paquete pesa menos de 6000 caracteres. Si no cabe, se quitan filas enteras.
4. Django, en `screen_assistant.py`, función `ask`, mira si hay clave. Si hay, redacta la respuesta con la guía de pantallas (`_SYSTEM` y `_GUIDE`). La frase va en el idioma de la pregunta y en menos de 150 palabras. Solo puede usar nombres e importes que vengan en el resumen.
5. La columna muestra la frase. Si no hay clave, dice que hay que conectar una IA. Si el servicio falla, dice que no contestó.

Cualquier persona que haya entrado puede preguntar. Pegar o quitar la clave solo lo hace el CEO, en **Ajustes → Integraciones de IA** o en **Ajustes de cuenta**.

Deja estos límites como están: 30 preguntas por hora por persona, y 120 por hora por empresa.

El CRM espera como máximo 40 segundos. Ese número está en `_TIMEOUT`, dentro de `backend/common/assistants.py`. Si ConNexus tarda más, el CRM corta y muestra el error.

## Dónde abrir el código la primera vez

En el CRM, en este orden:

1. `frontend/src/lib/v2/components/AskScreen.svelte` — el cuadro y el envío.
2. `frontend/src/routes/(app)/ask/+server.js` — los recortes.
3. `frontend/src/lib/screen-brief.js` — qué datos no viajan.
4. `backend/common/screen_assistant.py` — la función `ask`. Aquí entrarás cuando toque llamar a ConNexus.
5. `backend/common/assistants.py` — las claves de hoy y los 40 segundos.

En ConNexus, cuando la carpeta tenga código (mira la tarea 1):

1. `app/main.py` — las direcciones empiezan por `/api/v1`.
2. `provisioning/llm_routing.json` — el orden Groq, Gemini, OpenAI. La versión leída es `2026.07.1`.
3. `app/services/llm_gateway/gateway.py` — las funciones `generate_response` y `execute_structured_turn`. Son las que hablan con Groq.
4. `provisioning/archetypes/` — un archivo por agente.
5. `app/services/whatsapp_chat_orchestrator.py` — la función `process_incoming_message`. Hoy es la única que devuelve una frase, y está hecha para WhatsApp (recibe un teléfono y un catálogo). Sirve para ver la idea. No la uses tal cual para el panel.
6. `app/services/agent_os/nodes/gateways.py` — la clase `CRMGateway`. Crea contactos y notas en HubSpot. La primera versión del panel no la llama.

`IntelligenceEngine` convierte preguntas en consultas de base de datos para informes. Es otro trabajo. No lo uses para esta columna.

`MosheEngine` ejecuta un agente paso a paso. Incluye la puerta de HubSpot. Para la primera versión no hace falta encenderlo.

## Qué ya existe y qué hay que crear

| Necesidad | Estado |
| --- | --- |
| Un cuadro para escribir la pregunta | Ya está en el CRM. |
| Limpiar secretos antes de enviar | Ya está. |
| Saber quién es Ana y qué menús puede abrir | Ya está, en la función `_for_person`. |
| Groq como primer modelo de una charla | Ya está dentro de ConNexus. |
| Una dirección HTTP en ConNexus que reciba la pregunta y devuelva la frase | **Hay que crearla.** |
| Una llave para que solo el servidor del CRM entre por esa dirección | **Hay que crearla**, una por empresa. |
| Guardar en el CRM la dirección de ConNexus, el id de esa empresa y la llave | **Hay que crearlo.** La llave se guarda. No se devuelve al navegador. |

La función de WhatsApp demuestra que ConNexus ya puede redactar. Le falta una puerta pensada para esta columna: sin teléfono, sin catálogo de WhatsApp y sin escribir en HubSpot.

## La puerta nueva

Nombre: `POST /api/v1/crm/ask`

Esta dirección la crea ConNexus, en su servidor. La llama solo el servidor del CRM. En la misma llamada ConNexus recibe la pregunta y devuelve la frase. La primera versión solo contesta con texto.

### La llave

ConNexus firma la llave. Es un JWT: un texto largo con datos dentro. Esos datos se llaman claims.

- `amr` incluye `svc`. Significa «soy un programa, no una persona».
- `aud` vale exactamente `nexus:crm:ask`. Esa frase dice «esta llave solo abre esta puerta». Con ella no se listan agentes ni se cambian planes.
- `org_id` es la empresa **en ConNexus** que corresponde a la empresa del CRM.

El archivo `scripts/generate_svc_token.py` crea otra llave, la interna de ConNexus. Esa no representa a la empresa de Ana. No la uses aquí.

En cada llamada el CRM manda:

```text
Authorization: Bearer <la llave de esa empresa>
```

El CRM guarda tres datos en el servidor:

1. La dirección de ConNexus. Tiene que empezar por `https://`. Una dirección `http://`, una IP o un nombre tipo `localhost` se rechaza. Esa regla ya existe para la tarjeta «Otra IA», en la función `clean_base_url`.
2. El `org_id` de ConNexus.
3. La llave. Un `GET /api/assistants/` no la incluye. El HTML de Ajustes tampoco.

### Lo que el CRM envía

```json
{
  "question": "¿cómo se crea un nuevo empleado?",
  "path": "/",
  "screen": {},
  "actor": {
    "profile_id": "el-id-de-ana-en-el-crm",
    "role": "CEO",
    "menu_open": ["Vender", "Atender", "Personas", "Ajustes"],
    "menu_closed": []
  },
  "locale": "es",
  "conversation_id": ""
}
```

- `question` es obligatoria y tiene como máximo 400 caracteres. Si va vacía, responde 400.
- `path` es la página abierta. Ana está en Hoy, así que vale `/`. Máximo 200 caracteres.
- `screen` es el resumen que ya arma `screen-brief.js`. En este ejemplo Hoy no aporta nombres de empleados, y no hace falta: la pregunta es de uso, y la respuesta sale de la guía.
- `actor` dice que Ana es CEO y que abre Personas. Con eso la IA puede indicarle Empleados. Si fuera una empleada sin ese permiso, la respuesta diría que no crea cuentas.
- `locale` es `es` o `pt`. La frase sale en el idioma de la pregunta.
- `conversation_id` va vacío. El hilo todavía no se guarda.

No envíes la página HTML completa. No envíes contraseñas, claves, cookies ni el campo `assistant_keys`. No envíes el nombre del modelo: lo elige la tabla de ConNexus.

El texto de instrucciones que ConNexus le pasa a Groq es el mismo del panel: `_SYSTEM`, `_GUIDE` y el menú de `actor`. El agente inicial es `CONNEXUS_CORE_ORCHESTRATOR`. Si más adelante una empresa elige otro agente, su personalidad se suma después de esas reglas.

Por dentro, la ruta llama a `execute_structured_turn` o a `generate_response` con el tipo de trabajo `INTERACTIVE_CHAT`.

### Lo que ConNexus devuelve si sale bien

Código 200:

```json
{
  "answer": "Entra a Empleados (/team). Ahí se invita o se crea un empleado, y también se edita, se suspende o se elimina. Tú puedes crear empleados y administradores. Un administrador se crea en Ajustes, pestaña Seguridad y accesos.",
  "agent": "CONNEXUS_CORE_ORCHESTRATOR",
  "provider": "groq",
  "model": "openai/gpt-oss-20b",
  "trace_id": "un-id-para-buscar-esta-llamada-en-los-logs"
}
```

`answer` es la frase que ve Ana. Si viene vacía, es un fallo: muestra el error de «no contestó». La respuesta no trae la clave ni las instrucciones internas.

### Si algo sale mal

| Código | Qué pasó | Qué ve Ana |
| --- | --- | --- |
| 400 | La pregunta iba vacía o el JSON no se entiende. | El CRM no llama al modelo. |
| 401 o 403 | La llave falta, es falsa, no dice `nexus:crm:ask`, o la empresa no coincide. | Que hay que conectar la IA. Esa misma pregunta se queda ahí. No la reenvíes a la clave suelta de Groq del CRM. |
| 402 | A esa empresa se le acabó el cupo en ConNexus. | Que no hay cupo. La frase no se inventa. |
| 429 | Hay demasiadas preguntas. | «Demasiadas preguntas.» El panel ya tiene ese texto. |
| 502, o más de 40 segundos | Ningún modelo contestó. | «El asistente no contestó.» |

## Qué cambias en el CRM

Ana sigue escribiendo en la misma columna. `AskScreen` sigue llamando a `/ask`. La dirección de ConNexus no entra en ese archivo.

El cambio va en la función `ask` de `backend/common/screen_assistant.py`:

1. Si esa empresa tiene guardada la conexión con ConNexus, arma el JSON de arriba.
2. Llama a `POST /api/v1/crm/ask`.
3. Le devuelve a la columna la frase y el nombre `connexus`.
4. El título de la columna puede mostrar el nombre del agente. Ese nombre llega sin la llave.

Si la empresa no tiene la conexión, todo sigue como hoy: la clave de Groq, Gemini u otra.

En Integraciones de IA se puede añadir una tarjeta «ConNexus» con los tres datos (dirección, id y llave). Las tarjetas que ya existen pueden quedarse. Cuando ConNexus está conectado, la pregunta de la derecha va a ConNexus.

El chat del centro de ayuda, el de los visitantes (`/api/public/help/<slug>/chat/`), es otra pantalla. Esta guía no lo toca.

## Tu lista de trabajo

Haz una tarea y comprueba la señal antes de pasar a la siguiente.

### 1. Mira el código nuevo de ConNexus

Lo que está escrito aquí se leyó del commit `d91fe43c`, rama `main`. Esa copia iba 269 commits por detrás de `origin/main`. En el disco la carpeta estaba vacía: los archivos se leyeron con `git show`, sin descargarlos a la carpeta.

Antes de programar, actualiza el repositorio y busca otra vez:

- `execute_structured_turn` o `generate_response`;
- en la tabla de chat, Groq con `openai/gpt-oss-20b` en el primer puesto;
- que siga sin existir una ruta `POST` para que el CRM pregunte.

Señal de terminado: anotaste los nombres que tiene el código de hoy. Si un nombre cambió, usa el nuevo.

### 2. Crea la puerta en ConNexus

Añade `POST /api/v1/crm/ask` como en la sección anterior. Usa las instrucciones del panel. Llama al gateway con `INTERACTIVE_CHAT`. Esta ruta no recibe un teléfono y no llama a `CRMGateway`.

Señal de terminado: con una llave de prueba, una pregunta devuelve `answer` con texto. Sin llave, 401. Con una llave de otra puerta, 403.

### 3. Crea la llave de una empresa

Firma un JWT con el `org_id` de esa empresa en ConNexus y con `aud` igual a `nexus:crm:ask`.

Señal de terminado: esa llave abre `/api/v1/crm/ask`. No puede cambiar planes ni listar los archivos de agentes.

### 4. Guarda la conexión en el CRM

Guarda la dirección `https`, el `org_id` de ConNexus y la llave, en los datos de la empresa.

Señal de terminado: al pedir la lista de asistentes, la llave no aparece. Una dirección `http://` o una IP se rechaza.

### 5. Conecta la columna

En `ask`, si la conexión existe, llama a ConNexus y devuelve `provider` con el valor `connexus`.

Señal de terminado: Ana pregunta en la columna y la frase es la que devolvió ConNexus.

### 6. Pasa las pruebas de abajo

Señal de terminado: los casos pasan. Hasta entonces la columna sigue usando la clave que el CEO tenga pegada hoy.

## Cómo probar

En ConNexus:

1. Llamar sin `Authorization` devuelve 401.
2. Una llave cuyo `aud` no sea `nexus:crm:ask` devuelve 403.
3. La llave de la empresa A, usada como si fuera la empresa B, devuelve 403 y no lee datos de B.
4. Una pregunta vacía devuelve 400.
5. Una pregunta normal, con Groq simulado, devuelve 200 y un `answer` con texto. Ese JSON no contiene `GROQ_API_KEY` ni la palabra `assistant_keys`.
6. El primer intento es Groq. Si en la prueba Groq falla, se prueba el siguiente de la tabla.
7. La respuesta no trae `upsert_contact` ni `create_note`. Esas dos acciones escriben en HubSpot.

En el CRM:

1. Con la conexión guardada, `POST /api/assistants/screen/` devuelve la frase de ConNexus y `"provider": "connexus"`.
2. El JSON que sale hacia ConNexus no contiene `password`, `api_key`, `jwt` ni `assistant_keys`.
3. Sin conexión, la respuesta es `not_connected` y no hay llamada a ConNexus.
4. La empresa B no usa la llave ni el id de la empresa A.
5. Si ConNexus responde 502, Ana ve que no contestó.
6. El test `test_the_guide_covers_the_product_and_this_persons_menu` sigue pasando. Cambiar quién redacta no borra la lista de pantallas del CRM.

## Si te atascas, revisa esto

- La columna solo conoce `/ask`. La dirección de ConNexus vive en el servidor.
- `process_incoming_message` es de WhatsApp. El id de Ana no se manda en el campo del teléfono.
- `CRMGateway` escribe en HubSpot. Esta primera puerta no la enciende.
- `generate_svc_token.py` no es la llave de la empresa del cliente.
- El id de la empresa en el CRM y el id en ConNexus se guardan como pareja.
- El nombre `openai/gpt-oss-20b` lo elige ConNexus. El CRM no lo envía: el filtro de `/ask` tira los nombres que llevan una barra.
- Si ConNexus falla, Ana ve el error. Esa misma pregunta no se manda después a la clave suelta de Groq.
- La llave no sale en el HTML ni en el JSON de Ajustes.
