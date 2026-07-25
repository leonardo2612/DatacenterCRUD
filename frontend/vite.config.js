import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({

    plugins: [
        react()
    ],

    server: {

        proxy: {

            "/api": {

                target: "http://143.244.175.21",

                changeOrigin: true

            }

        }

    }

})