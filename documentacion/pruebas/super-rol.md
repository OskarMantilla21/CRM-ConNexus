# Super rol

Fecha: 5 de octubre de 2026.

El super rol lista a las personas que tienen cuenta en el CRM y la empresa a la que pertenecen. No abre clientes, leads, tickets, facturas ni pagos. El CRM no guarda el número completo de una tarjeta: un pago solo registra el medio (efectivo, tarjeta, transferencia), la fecha, el monto y una referencia. Ese registro también queda cerrado para este rol.

No es el administrador de una empresa. El administrador de Panadería Luna sigue viendo los datos de su negocio. El super rol no entra a ninguno.

## Cuenta de esta máquina

| Campo | Valor |
|---|---|
| Correo | `super@connexus.local` |
| Pantalla | http://127.0.0.1:5181/plataforma |

El acceso es el enlace de un solo uso, igual que el resto. El correo no sale de la máquina: aparece en `docker compose logs celery-worker --since 2m`.

Para marcar otra cuenta:

```powershell
docker compose exec backend python manage.py grant_platform_admin correo@ejemplo.test
```

Esa persona deja de poder abrir el CRM de una empresa, aunque antes tuviera una. El bloqueo está en la API, no solo en la pantalla.
