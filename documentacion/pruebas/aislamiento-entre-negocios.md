# Aislamiento entre negocios

Fecha de la prueba: 5 de octubre de 2026.

Objetivo: comprobar que varias personas pueden tener su negocio en el mismo CRM y que ninguna ve la información de las otras. En BottleCRM cada negocio es una organización. Un usuario solo entra a las organizaciones donde tiene un perfil.

## Negocios creados

Cada dueño tiene perfil de administrador únicamente en su organización. Los tres correos son de prueba y no existen fuera de esta máquina.

| Negocio | Dueño | Correo | Lo que solo ese negocio debe ver |
|---|---|---|---|
| Panaderia Luna | Ana Luna | ana.luna@aislamiento.test | Cuenta Cliente Harina Norte, contacto Rosa Molina, lead Pedido de 200 panes. Marca `SECRETO-LUNA-200-PANES`. |
| Taller Andes | Carlos Andes | carlos.andes@aislamiento.test | Cuenta Flota Sur Transportes, contacto Diego Paredes, lead Cambio de frenos camion 4. Marca `SECRETO-ANDES-FRENOS-CAMION`. |
| Estudio Rio | Lucia Rio | lucia.rio@aislamiento.test | Cuenta Editorial Costa, contacto Marta Vidal, lead Rediseno de catalogo. Marca `SECRETO-RIO-CATALOGO`. |

El usuario `oskarmantilla1708@gmail.com` sigue solo en `oskaruxui` y `MicroPyramid`. No se le dio perfil en estos tres negocios.

## Cómo se comprobó

Con la aplicación encendida se pidió, con el token de cada persona, las listas de leads, cuentas y contactos (`/api/leads/`, `/api/accounts/`, `/api/contacts/`) y el detalle del lead de los otros dos negocios.

## Resultado

La separación se cumple.

| Quién entra | Organizaciones que tiene | Qué secreto ve |
|---|---|---|
| ana.luna@aislamiento.test | Panaderia Luna | Solo `SECRETO-LUNA-200-PANES` |
| carlos.andes@aislamiento.test | Taller Andes | Solo `SECRETO-ANDES-FRENOS-CAMION` |
| lucia.rio@aislamiento.test | Estudio Rio | Solo `SECRETO-RIO-CATALOGO` |
| oskarmantilla1708@gmail.com | oskaruxui y MicroPyramid | Ninguno de los tres |

Pedir el lead de otro negocio responde `404`. La lista no lo incluye.

## Cómo verlo en el navegador

1. Abre http://127.0.0.1:5181/login
2. Escribe uno de los tres correos y pulsa **Continue with email**.
3. El enlace sale en `docker compose logs celery-worker --since 2m`, dentro de `C:\ConNexus-Gen\CRM`.
4. Ábrelo, pulsa **Continue to BottleCRM** y entra a la única organización que aparece.

Ana debe ver el pedido de panes y no el camión ni el catálogo. Carlos y Lucia, al revés. Para comparar hay que cerrar sesión y entrar con el otro correo. Un mismo usuario no puede cambiar a un negocio donde no tiene perfil.
