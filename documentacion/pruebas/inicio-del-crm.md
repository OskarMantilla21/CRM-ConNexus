# Cómo iniciar el CRM para trabajar

El CRM de este proyecto es **BottleCRM** (Django + SvelteKit). El código está en `C:\ConNexus-Gen\CRM` y el repositorio propio es [OskarMantilla21/CRM-ConNexus](https://github.com/OskarMantilla21/CRM-ConNexus).

No hace falta XAMPP ni SuiteCRM para este proyecto. Esos sirven para otra instalación. Aquí todo corre con Docker.

## Qué tiene que estar encendido

Antes de abrir el navegador tienen que estar corriendo estas seis piezas. `docker compose up -d` las levanta juntas:

| Servicio | Qué es | Dirección en esta máquina |
|---|---|---|
| `db` | PostgreSQL 16 | `localhost:5432` |
| `redis` | Cola de tareas | `localhost:6379` |
| `backend` | API Django | http://127.0.0.1:8000 |
| `celery-worker` | Tareas en segundo plano y el correo de acceso | solo dentro de Docker |
| `celery-beat` | Tareas programadas | solo dentro de Docker |
| `frontend` | Aplicación web | http://127.0.0.1:5181 |

Docker Desktop tiene que estar abierto y el motor en marcha. Si el icono de Docker no dice que está corriendo, ábrelo y espera a que termine de arrancar. En esta máquina el servicio `com.docker.service` a veces queda detenido; si `docker version` responde que no encuentra el motor, hay que iniciar ese servicio (pide permiso de administrador) y después ejecutar `docker desktop start`.

## Cómo iniciarlo

Abre PowerShell en la carpeta del proyecto y ejecuta:

```powershell
cd C:\ConNexus-Gen\CRM
docker compose up -d
docker compose ps
```

`docker compose ps` debe mostrar los seis contenedores en estado `Up`. La base de datos y Redis aparecen además como `healthy`. La primera vez después de apagar Docker el backend tarda cerca de un minuto en aceptar peticiones.

Comprueba que responde:

```powershell
curl.exe -sS -o NUL -w "app %{http_code}`n" http://127.0.0.1:5181/login
curl.exe -sS -o NUL -w "api %{http_code}`n" http://127.0.0.1:8000/admin/login/
```

Los dos tienen que devolver `200`. Entonces abre el navegador en:

http://127.0.0.1:5181

Usa el puerto **5181**. Si entras solo a `http://localhost`, sin puerto, el navegador muestra `ERR_CONNECTION_REFUSED` porque en el puerto 80 no hay nada escuchando.

Para apagarlo:

```powershell
cd C:\ConNexus-Gen\CRM
docker compose down
```

`docker compose down` apaga los contenedores y conserva la base de datos. Los datos de prueba siguen ahí la próxima vez que se encienda.

## Direcciones de trabajo

| Qué | Dirección |
|---|---|
| Aplicación del CRM | http://127.0.0.1:5181 |
| Pantalla de acceso | http://127.0.0.1:5181/login |
| API y documentación Swagger | http://127.0.0.1:8000/swagger-ui/ |
| Admin de Django | http://127.0.0.1:8000/admin/ |

## Cómo entrar

La aplicación no tiene usuario y contraseña. El acceso es un enlace de un solo uso que caduca a los 10 minutos. En este entorno el correo no sale a internet: se imprime en el log del worker.

1. Abre http://127.0.0.1:5181/login
2. En el campo de correo escribe `oskarmantilla1708@gmail.com`
3. Pulsa **Continue with email**
4. En PowerShell, dentro de `C:\ConNexus-Gen\CRM`, lee el enlace:

```powershell
docker compose logs celery-worker --since 2m
```

5. Copia la URL que empieza por `http://localhost:5181/login/verify?token=` y ábrela en el navegador.
6. Pulsa **Continue to BottleCRM**.
7. Elige la organización **MicroPyramid**.

Esa organización ya tiene datos de prueba: 20 leads, 10 cuentas, 15 contactos, 10 oportunidades, 5 tickets y 50 facturas. El correo `oskarmantilla1708@gmail.com` es el administrador de esa organización.

El botón **Continue with Google** no funciona aquí. Google OAuth está vacío en `.env.docker`.

### Admin de Django

El admin de http://127.0.0.1:8000/admin/ es otra pantalla. Sirve para la base de datos de Django, no para trabajar el día a día en el CRM.

| Campo | Valor |
|---|---|
| Usuario | `admin@localhost` |
| Contraseña | `admin` |

Ese usuario no entra a la aplicación de http://127.0.0.1:5181.

## Datos que usa el entorno

Salen de `.env.docker`. No hace falta copiar ni editar ese archivo para arrancar.

| Dato | Valor |
|---|---|
| Base de datos | `crm_db` |
| Usuario de la aplicación | `crm_user` / `crm_password` |
| Superusuario de Postgres | `postgres` / `postgres_password` |
| Redis | `redis://redis:6379/0` |
| Correo de desarrollo | se imprime en la consola del contenedor, no se envía |

Dentro de Docker la base se llama `db` y la API se llama `backend`. Desde la máquina Windows se usan `localhost` y los puertos de la tabla de arriba.

## Repositorio

| Remoto | Dirección | Uso |
|---|---|---|
| `origin` | https://github.com/OskarMantilla21/CRM-ConNexus.git | Repositorio propio. La rama de trabajo es `main`. |
| `upstream` | https://github.com/Django-CRM/Django-CRM.git | Proyecto original. Sirve para traer actualizaciones. |

Para publicar un cambio ya confirmado:

```powershell
git push
```

## Si el navegador dice que localhost rechazó la conexión

Eso es `ERR_CONNECTION_REFUSED`. Casi siempre significa que los contenedores no están encendidos.

1. Abre Docker Desktop y espera a que el motor esté listo.
2. En `C:\ConNexus-Gen\CRM` ejecuta `docker compose up -d`.
3. Espera a que `docker compose ps` muestre el frontend y el backend en `Up`.
4. Entra a http://127.0.0.1:5181 y no a `http://localhost` sin puerto.
5. Si el enlace de acceso es de un intento anterior, pide otro. Caducan a los 10 minutos.

Si el backend queda en `Exited` y el log dice `set: -` o `$'\r': command not found`, el archivo `docker/backend/entrypoint.sh` se guardó con finales de línea de Windows. Hay que volver a guardarlo con finales LF y ejecutar otra vez `docker compose up -d backend`.
