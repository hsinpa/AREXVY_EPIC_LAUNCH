import { defineConfig} from 'vite';
import mkcert from 'vite-plugin-mkcert';

export default defineConfig({
  base: '',
  root: './',
  build: {
    outDir: './docs'
  },
  server: {
    https: true,
    open: './index.html',
  },
  plugins : [mkcert()]
});
