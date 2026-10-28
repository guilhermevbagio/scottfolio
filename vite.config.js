import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// Project site: https://guilhermevbagio.github.io/scottfolio/
const pagesBase = '/scottfolio/'

export default defineConfig(({ command, mode }) => {
  // `vite` stays at /. `vite build` and `vite preview` use the Pages path.
  const base = command === 'serve' && mode === 'development' ? '/' : pagesBase

  return {
    base,
    plugins: [vue(), tailwindcss(), prefixPublicFontUrls(base)],
  }
})

// Fonts live in public/ and are referenced as root paths (/Fonts/...).
// Vite leaves those URLs untouched, so prefix them with the Pages base at build time.
function prefixPublicFontUrls(base) {
  return {
    name: 'prefix-public-font-urls',
    apply: 'build',
    generateBundle(_, bundle) {
      for (const item of Object.values(bundle)) {
        if (item.type !== 'asset' || !item.fileName.endsWith('.css')) continue

        const text =
          typeof item.source === 'string'
            ? item.source
            : new TextDecoder().decode(item.source)
        const next = text.replace(
          /url\(\s*(['"]?)\/Fonts\//g,
          `url($1${base}Fonts/`,
        )

        if (next !== text) item.source = next
      }
    },
  }
}
