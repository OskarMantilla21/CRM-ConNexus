# Cuentas de acceso

Fecha: 6 de octubre de 2026.

La pantalla de entrada es http://127.0.0.1:5181/login. Pide un usuario y una contraseña. No pide correo.

Estas claves son de esta máquina. Sirven para entrar a la aplicación, no al admin de Django.

## Una cuenta para todas las organizaciones

`todas` es administrador con todos los permisos en cada organización que existe hoy. Después de entrar, la pantalla pide cuál abrir. Dentro de la elegida ve los datos de esa organización. No mezcla los datos de varias en una sola lista: para ver otra hay que volver a elegir.

| Usuario | Contraseña | Organizaciones |
|---|---|---|
| `todas` | `Todas-1708` | Estudio Rio, MicroPyramid, Panaderia Luna, Taller Andes, oskaruxui y tu casa hoy |

## Una cuenta por organización

Estas cuatro sirven para comprobar si un negocio ve los datos de otro. Cada una pertenece solo a su organización. Al entrar no hay nada que elegir: abre esa y ninguna más.

| Usuario | Contraseña | Organización | Lo que debe ver | Lo que no debe ver |
|---|---|---|---|---|
| `micropyramid` | `Pyramid-1708` | MicroPyramid | Los leads de demostración, por ejemplo Expansion Deal. Hay 19 abiertos. | Pedido de 200 panes, Cambio de frenos camion 4, Rediseno de catalogo |
| `ana.luna` | `Luna-1708` | Panaderia Luna | Pedido de 200 panes. Marca `SECRETO-LUNA-200-PANES`. | El camión, el catálogo y los leads de MicroPyramid |
| `carlos.andes` | `Andes-1708` | Taller Andes | Cambio de frenos camion 4. Marca `SECRETO-ANDES-FRENOS-CAMION`. | Los panes, el catálogo y MicroPyramid |
| `lucia.rio` | `Rio-1708` | Estudio Rio | Rediseno de catalogo. Marca `SECRETO-RIO-CATALOGO`. | Los panes, el camión y MicroPyramid |

Para comparar hay que cerrar sesión y entrar con la otra cuenta. Una de estas cuatro no puede cambiar a un negocio donde no tiene perfil.

## Comprobación

Hecha el 6 de octubre contra la API, con la aplicación encendida.

Cada cuenta abre el lead de su negocio y la ficha del lead de los otros responde 404. La lista de leads coincide: Ana, Carlos y Lucia ven un solo lead, el suyo. `micropyramid` ve los 19 de MicroPyramid y no los tres secretos.

`todas`, después de elegir organización, abre el secreto de Panaderia Luna, el de Taller Andes y el de Estudio Rio, ve los 19 leads de MicroPyramid, los 25 de tu casa hoy y entra también a oskaruxui, que hoy no tiene leads.

## Cuentas de roles dentro de MicroPyramid

Están solo en MicroPyramid. Sirven para probar qué puede hacer cada rol, no para comparar negocios.

| Usuario | Contraseña | Qué puede hacer |
|---|---|---|
| `ceo` | `Ceo-1708` | Todo en MicroPyramid |
| `administrador` | `Admin-1708` | Vender, atender y registrar el trabajo del día. El CEO puede cambiarle eso en Equipo y acceso. |
| `empleado1` | `Empleado1-1708` | Registrar el trabajo del día |
| `empleado2` | `Empleado2-1708` | Registrar el trabajo del día |
| `oskarmantilla1708` | `Oskar-1708` | Tu cuenta anterior. Entra a tu casa hoy, oskaruxui y MicroPyramid. No entra a Panaderia Luna, Taller Andes ni Estudio Rio. El correo completo también vale, con esta misma contraseña. |
