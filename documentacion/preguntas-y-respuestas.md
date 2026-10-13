# Preguntas y respuestas

Fecha: 7 de octubre de 2026.

Este documento junta las preguntas hechas sobre ConNexus-CRM en esta conversación y la respuesta que se dio a cada una. Cuando una respuesta posterior cambió un detalle, el cambio queda dicho en esa pregunta más nueva.

## 1. Crear administradores desde el CEO y empleados desde el administrador

**Pregunta.** Desde el perfil de CEO se tienen que poder crear los perfiles de administrador, y ahí el CEO da los permisos que considere necesarios. Desde el perfil de administrador se hace lo mismo para los empleados, y ese perfil queda restringido a pocas funciones.

**Respuesta.** Desde el perfil de CEO ya se pueden crear administradores y elegir qué puede abrir cada uno. Desde el perfil de administrador se crean empleados, y esos empleados quedan limitados a unas pocas funciones.

En Equipo y acceso el botón cambia según quién entra:

- El CEO ve **Crear administrador**. Ahí pone nombre, correo y contraseña, elige el rol y marca los permisos: ventas, tickets y tareas, cobros, trabajo del día, ajustes y equipo. También puede crear un empleado, un miembro u otro CEO.
- El administrador ve **Crear empleado**, aunque el CEO no le haya dado el permiso de equipo. Solo puede crear empleados y solo puede marcarles tres funciones: el trabajo del día, tickets y tareas, y ventas. No puede darles cobros, ajustes ni equipo, ni crear o modificar CEOs, otros administradores o miembros. Sí puede cambiar las funciones de un empleado y activarlo o desactivarlo.

Para entrar se usa el correo, o la parte de antes de la @, y la contraseña que se definió al crear el perfil. Tiene que tener al menos 8 caracteres y no parecerse al nombre ni al correo. Si ese correo ya tenía cuenta en otra empresa, se reutiliza la cuenta: el nombre y la contraseña anteriores se quedan como estaban.

Se comprobó en la aplicación en marcha, en la organización oskaruxui. La pantalla del CEO muestra **Crear administrador**, la del administrador muestra **Crear empleado**, y un empleado que abre Equipo sale de esa página hacia sus tickets. Por la API, ese administrador no abre cobros ni puede crear otro administrador, y el empleado que crea entra solo a tickets y al trabajo del día. No se recorrieron los cuadros de permisos con el ratón.

La aplicación del teléfono no cambió. Si desde ahí se invita a un administrador sin lista de permisos, queda como administrador con acceso completo.

La pregunta 5 movió esa creación a **Personas** y dejó de ofrecer miembro y otro CEO en el formulario. La pregunta 6 cerró la cuenta del CEO para cualquier administrador.

## 2. Mensajes en una organización recién creada

**Pregunta.** Se están viendo mensajes en una organización recién creada como CEO, y no tendría que verse nada.

**Respuesta.** En **tu carro.com** se veían mensajes porque, al elegir el tipo de negocio, el sistema cargó tickets de ejemplo de una consultora: preguntas de clientes, una nómina que no cuadraba, una auditoría. Una organización recién creada no tiene esas conversaciones.

Esos mensajes se quitaron, junto con los clientes, contactos, negocios y tareas de ejemplo. Quedan en cero. Lo que sigue son los embudos y la lista de precios del tipo de negocio elegido, ocho productos.

A partir de ahora, crear una organización y elegir un tipo de negocio solo prepara embudos, etiquetas y campos. No agrega clientes ni mensajes de ejemplo. Si más adelante se quieren datos de prueba, se agregan desde Ajustes, donde también se pueden borrar.

## 3. La fecha en Nueva tarea

**Pregunta.** En Nueva tarea hay que poner cuándo se tiene que realizar, no «vence».

**Respuesta.** En **Nueva tarea** el campo de la fecha ya no dice «Vence». Ahora dice **Cuándo se tiene que realizar**.

Debajo queda la aclaración: es el día en que se tiene que realizar, y si se deja vacío no cuenta como tarde ni aparece entre las de esta semana. Al editar una tarea, el mismo campo usa esa etiqueta.

## 4. Crear una organización como empleado

**Pregunta.** Cuando se crea una organización en estado de empleado no se debe dejar seleccionar «¿Qué tipo de negocio es?». En el rol no debe salir CEO, porque es empleado, y hay que eliminar la opción de miembro.

**Respuesta.** Al crear una organización y elegir **Empleado**, ya no aparece **¿Qué tipo de negocio es?** y el rol que se guarda es **Empleado**. La opción **Miembro** salió de esa lista.

En **Tu rol en esta organización** quedan tres opciones:

- **CEO**
- **Administrador**
- **Empleado**

Con **Empleado** el espacio queda en blanco: no se elige un tipo de negocio y, si alguien envía uno igual, no se aplica. Con **CEO** o **Administrador** la pregunta sigue ahí y solo prepara el embudo, las etiquetas y los campos, sin clientes ni mensajes de ejemplo.

Se comprobó en la página de crear organización, ya con la sesión iniciada: la lista muestra CEO, Administrador y Empleado, el texto ya no habla de un miembro, y la pregunta del negocio solo se muestra cuando el rol no es empleado. También pasó la prueba del formulario: un envío como empleado guarda ese rol y no aplica un tipo de negocio. No se movió el selector con el ratón.

## 5. Crear las cuentas donde se ve a la gente de la empresa

**Pregunta.** Hay que facilitar la creación de cuentas, con estas reglas:

1. El CEO crea cuentas de empleado y de administrador después de entrar a su organización, en el lugar donde se ven todos los empleados y administradores.
2. El administrador solo crea cuentas de empleados, del mismo modo, y puede ver a todos los empleados de la empresa.
3. El empleado no crea cuentas. Entra con el usuario y la contraseña que le da quien sí puede crearlas.
4. El CEO ve si todos están activos o inactivos. El administrador ve el estado de actividad de todos menos el del CEO.

**Respuesta.** Las cuentas se crean en **Personas**, dentro de la organización. Ahí está la lista de quienes trabajan en ella.

- El **CEO** ve a todos, con el estado **Activo** o **Inactivo**. Desde esa misma pantalla crea un **administrador** o un **empleado**: nombre, usuario y contraseña. Con el usuario basta, por ejemplo `ana`. Esa persona entra con ese usuario y la contraseña.
- El **administrador** ve a todos y el estado de cada uno, menos el del CEO. La fila del CEO sigue en la lista y el estado queda en blanco. Solo puede crear **empleados**, del mismo modo.
- El **empleado** no crea cuentas. Entra con el usuario y la contraseña que le dio el CEO o el administrador. En la sesión de `empleado1` esa pantalla no abre: queda en el registro de horas.

Al crear la cuenta se siguen eligiendo los permisos: el CEO marca qué abre el administrador, y el administrador marca las pocas funciones del empleado. Se comprobó con las tres sesiones y con la prueba de la lista. No se pulsó el botón de crear con el ratón.

La pregunta 6 afinó el punto del CEO: un administrador con todos los permisos tampoco ve ni edita esa cuenta.

## 6. El administrador y la cuenta del CEO

**Pregunta.** El administrador aún puede ver el estado del CEO y puede editar las funciones y los ajustes de la cuenta del CEO.

**Respuesta.** El administrador que tiene todos los permisos ya no puede ver el estado del CEO ni cambiar esa cuenta.

En **Personas**, la fila del CEO queda sin estado, sin último acceso y sin controles. Antes esa cuenta podía cambiar el rol, las funciones y pulsar **Reactivar**, y con eso se veía si el CEO estaba activo. Eso queda solo para otro CEO.

Se comprobó con la cuenta de administrador que tiene acceso total: las dos filas de CEO muestran un guion en el estado, en el último acceso y en gestionar. La prueba del servidor también rechaza cambiar el rol, las funciones o la actividad del CEO.

## 7. Conflictos al juntar la rama con main

**Pregunta.** Hay conflictos en estos archivos y hay que resolverlos antes de continuar:

- `backend/common/serializer.py`
- `backend/common/views/auth_views.py`
- `documentacion/funcionalidades-del-crm.md`
- `documentacion/pruebas/aislamiento-entre-negocios.md`
- `documentacion/pruebas/inicio-del-crm.md`
- `frontend/src/lib/i18n/pages/public.js`
- `frontend/src/lib/server/relay-callers.test.js`
- `frontend/src/routes/(no-layout)/login/+page.server.js`
- `frontend/src/routes/(no-layout)/login/+page.svelte`

**Respuesta.** Los nueve conflictos quedaron resueltos y el merge de `origin/main` en `actualizacion-de-ui` quedó cerrado en el commit local `26d271b8`. La rama queda 5 commits por delante de `origin/actualizacion-de-ui`. No se subió.

La pantalla de acceso sigue siendo la de ConNexus-CRM: usuario y contraseña, sin el nombre BottleCRM y sin el enlace por correo. Si la contraseña falla, los campos no se borran. Un intento de más responde como demasiados intentos, una cuenta desactivada se dice aparte, y un fallo de red no deja la contraseña en el registro.

En la documentación, el acceso apunta a `documentacion/pruebas/cuentas-de-acceso.md` y se conserva la revisión de aislamiento de los 20 perfiles. El título de la página de elegir organización sigue diciendo ConNexus-CRM.

Se comprobó la página en http://127.0.0.1:5181/login: responde 200 y muestra «Entra a tu espacio», «Usuario», «Contraseña» e «Iniciar sesión». Los 15 tests del inicio de sesión en el contenedor del frontend pasaron. No se pulsaron los botones con el ratón.

## 8. Incorporar una IA para facilitar el uso

**Pregunta.** Con el contexto del CRM, ¿se puede incorporar una IA para facilitar el uso?

**Respuesta.** Sí. El CRM ya decide qué puede ver cada persona, así que una IA puede ayudar dentro de esas mismas pantallas sin convertirse en otra base de datos.

La clave se queda en el servidor de Django (`XAI_API_KEY`, API de xAI en `https://api.x.ai/v1`). El navegador solo habla con el CRM. Cada pregunta usa la empresa de la sesión y los registros que esa persona ya puede abrir: un empleado no recibe facturas, ajustes ni el equipo, y un administrador no recibe el estado de la cuenta del CEO. Lo de una empresa no se mezcla con lo de otra.

Lo que más facilita el uso, en este orden:

1. **Un resumen en Hoy y en la búsqueda.** La persona pregunta «qué tengo pendiente» y recibe la misma cola que ya arma la pantalla de inicio: tickets vencidos, facturas vencidas, negocios parados, tareas de hoy y leads con seguimiento. Cada línea abre la ficha. No inventa registros.
2. **Borradores que la persona revisa antes de guardar.** Respuesta de un ticket a partir de los artículos de la base de conocimiento, nota de seguimiento de un lead, o recordatorio de una factura. El texto queda en el formulario; no se envía solo.
3. **Crear desde una frase.** «Tarea para llamar el viernes por el pedido de panes» rellena Nueva tarea, incluida la fecha «Cuándo se tiene que realizar». La persona confirma. Lo mismo puede preparar un lead o un contacto, sin borrar ni fusionar nada por su cuenta.

No se empezaría por un chat que cree usuarios, cambie roles o registre pagos. Esas acciones se quedan en Personas y en Cobrar, con la misma confirmación de ahora.

Esta respuesta es una propuesta. La IA todavía no está incorporada. El primer corte recomendado es el resumen de Hoy.

## Cómo quedó el CRM después de estas respuestas

- Las cuentas de la empresa se crean en **Personas**. El CEO crea administradores y empleados y ve quién está activo. El administrador crea solo empleados. El empleado no crea cuentas.
- Solo otro CEO ve el estado del CEO y puede cambiar esa cuenta.
- El empleado solo puede recibir trabajo del día, tickets y tareas, y ventas.
- Una organización nueva no trae clientes ni mensajes de ejemplo.
- En Nueva tarea la fecha se llama **Cuándo se tiene que realizar**.
- Al crear una organización como empleado no se pregunta el tipo de negocio, el rol guardado es Empleado y la lista no ofrece Miembro.
- El acceso es usuario y contraseña, con el nombre ConNexus-CRM.
- La IA quedó descrita y no está construida.
