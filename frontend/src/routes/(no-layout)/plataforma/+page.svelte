<script>
  import { resolve } from '$app/paths';
  import '../../../app.css';
  import '$lib/v2/styles/v2.css';
  import imgLogo from '$lib/assets/images/logo.png';

  let { data = { users: [], error: '' } } = $props();
  let users = $derived(data?.users ?? []);
</script>

<svelte:head>
  <title>Directorio de usuarios · BottleCRM</title>
</svelte:head>

<div class="v2-root v2-auth">
  <div class="v2-auth-box" style="max-width: 46rem;">
    <a href={resolve('/plataforma')} class="v2-auth-brand">
      <img src={imgLogo} alt="" />
      <b>BottleCRM</b>
    </a>

    <div class="v2-auth-card">
      <div class="v2-auth-head">
        <h1>Directorio de usuarios</h1>
        <p>
          Este rol ve quién tiene cuenta y en qué empresa está. No abre clientes, facturas ni
          pagos.
        </p>
      </div>

      {#if data.error}
        <p>{data.error}</p>
      {:else if users.length === 0}
        <p>No hay usuarios.</p>
      {:else}
        <ul style="list-style: none; margin: 0; padding: 0; display: grid; gap: 0.75rem;">
          {#each users as user (user.id)}
            <li style="border-top: 1px solid var(--v2-line, #e6e6e6); padding-top: 0.75rem;">
              <strong>{user.name || user.email}</strong>
              <div>{user.email}</div>
              <div>
                {user.is_active ? 'Activo' : 'Inactivo'}
                {#if user.is_platform_admin}
                  · super rol
                {/if}
              </div>
              {#if user.organizations.length === 0}
                <div>Sin empresa</div>
              {:else}
                {#each user.organizations as org}
                  <div>{org.name} · {org.role}{org.is_active ? '' : ' · inactivo'}</div>
                {/each}
              {/if}
            </li>
          {/each}
        </ul>
      {/if}

      <p style="margin-top: 1.25rem;">
        <a href={resolve('/logout')}>Cerrar sesión</a>
      </p>
    </div>
  </div>
</div>
