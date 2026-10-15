import { sentrySvelteKit } from '@sentry/sveltekit/vite';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

/**
 * Tailwind's serve transform treats `?svelte&type=style&lang.css` as CSS.
 * For a dependency such as bits-ui, that module is sometimes requested before
 * vite-plugin-svelte has stored the compiled style, so Vite hands Tailwind the
 * raw Svelte file and it dies on the script (`boxWith, mergeProps`). Pull the
 * style block out first. App components are left alone: their compiled CSS
 * does not contain a script tag.
 *
 * @param {string} css
 */
function unwrapGlobal(css) {
  let out = '';
  let i = 0;
  const token = ':global(';
  while (i < css.length) {
    const start = css.indexOf(token, i);
    if (start === -1) {
      out += css.slice(i);
      break;
    }
    out += css.slice(i, start);
    let depth = 1;
    let j = start + token.length;
    while (j < css.length && depth > 0) {
      if (css[j] === '(') depth += 1;
      else if (css[j] === ')') depth -= 1;
      if (depth > 0) j += 1;
    }
    out += css.slice(start + token.length, j);
    i = j + 1;
  }
  return out;
}

function guardDependencyStyle() {
  return {
    name: 'guard-dependency-style',
    enforce: 'pre',
    /**
     * @param {string} code
     * @param {string} id
     */
    transform(code, id) {
      if (!id.includes('node_modules') || !id.includes('svelte&type=style&lang.css')) return;
      if (!code.includes('<script')) return;
      const blocks = [...code.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((match) => match[1]);
      return { code: unwrapGlobal(blocks.join('\n')) || '/* empty */', map: null };
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      sentrySvelteKit({
        org: 'micropyramid-fa',
        project: 'bottlecrm-app',
        authToken: env.SENTRY_AUTH_TOKEN,
        autoUploadSourceMaps: !!env.PUBLIC_SENTRY_DSN
      }),
      guardDependencyStyle(),
      tailwindcss(),
      sveltekit()
    ],
    server: {
      port: 5181,
      strictPort: true
    }
  };
});
