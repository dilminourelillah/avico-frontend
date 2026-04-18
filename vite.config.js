import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [angular()],
  server: {
    allowedHosts: [
      'brewery-lumping-sermon.ngrok-free.dev'
    ],
    host: true,   // باش يقبل الاتصالات الخارجية
    port: 8100    // نفس البورت اللي يخدم عليه ionic serve
  }
});
